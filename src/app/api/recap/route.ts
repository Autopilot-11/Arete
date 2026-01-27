import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";
import { Profile, Task } from "@/lib/database.types";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date } = body as { date?: string };

    const supabase = createServerSupabaseClient();

    // Get user's profile with top 3 pillars
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("top_3")
      .eq("user_id", userId)
      .single();

    const profile = profileData as Pick<Profile, 'top_3'> | null;

    if (profileError || !profile?.top_3) {
      return NextResponse.json(
        { error: "Profile not found or pillars not set" },
        { status: 400 }
      );
    }

    // Get today's tasks - parse date as YYYY-MM-DD local date string
    // to avoid timezone mismatches between client and server
    let dateStr = date;
    if (!dateStr) {
      const now = new Date();
      dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    // Parse as local date by appending time components
    const startOfDay = new Date(`${dateStr}T00:00:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999`);

    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .gte("start_time", startOfDay.toISOString())
      .lte("start_time", endOfDay.toISOString())
      .order("start_time", { ascending: true });

    const tasks = tasksData as Task[] | null;

    if (tasksError) {
      console.error("Tasks fetch error:", tasksError);
      return NextResponse.json({ error: tasksError.message }, { status: 500 });
    }

    // Get recent productivity history (last 7 days) to determine tone
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentTasksData } = await supabase
      .from("tasks")
      .select("start_time, end_time")
      .eq("user_id", userId)
      .gte("start_time", sevenDaysAgo.toISOString())
      .order("start_time", { ascending: true });

    const recentTasks = recentTasksData as Pick<Task, 'start_time' | 'end_time'>[] | null;

    // Calculate productivity trend
    const dayMap = new Map<string, number>();
    recentTasks?.forEach((task) => {
      const day = new Date(task.start_time).toDateString();
      dayMap.set(day, (dayMap.get(day) || 0) + 1);
    });

    const recentDays = Array.from(dayMap.entries())
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 3);

    const lowProductivity =
      recentDays.length >= 3 && recentDays.every(([, count]) => count <= 2);

    // Determine tone
    const tone = lowProductivity
      ? "strict_stoic"
      : tasks && tasks.length >= 5
      ? "encouraging"
      : "neutral";

    // Format tasks for the prompt
    const tasksSummary = tasks?.length
      ? tasks
          .map((t) => {
            const duration = t.end_time
              ? Math.round(
                  (new Date(t.end_time).getTime() -
                    new Date(t.start_time).getTime()) /
                    60000
                )
              : "ongoing";
            return `- ${t.task_name}${t.tag ? ` (${t.tag})` : ""}: ${
              typeof duration === "number" ? `${duration} min` : duration
            }`;
          })
          .join("\n")
      : "No tasks logged today.";

    // Build the system prompt based on tone
    let systemPrompt = `You are Aretē, a wise guide helping users pursue excellence. `;

    if (tone === "strict_stoic") {
      systemPrompt += `The user has had low productivity for several days. Channel the spirit of Marcus Aurelius and Epictetus - be direct, firm, and challenging. Use Stoic wisdom to push them toward action. Do not be harsh or cruel, but be serious and unyielding in your expectations. Remind them that time is precious and discipline is freedom.`;
    } else if (tone === "encouraging") {
      systemPrompt += `The user has been productive today. Be warm, encouraging, and celebratory. Acknowledge their hard work while gently guiding them to stay aligned with their highest priorities. Use positive reinforcement and Stoic wisdom about the value of consistent effort.`;
    } else {
      systemPrompt += `Be balanced and thoughtful. Offer constructive observations about how well the user's day aligned with their top priorities. Use Stoic wisdom to provide perspective without being too harsh or too effusive.`;
    }

    systemPrompt += `\n\nKeep your response concise (2-4 paragraphs). End with one actionable suggestion for tomorrow.`;

    const userPrompt = `The user's Top 3 Life Pillars are:
1. ${profile.top_3[0]}
2. ${profile.top_3[1]}
3. ${profile.top_3[2]}

Today's tasks:
${tasksSummary}

Please provide an end-of-day recap that:
1. Analyzes how today's activities aligned (or didn't) with their top 3 pillars
2. Offers Stoic wisdom relevant to their day
3. Ends with one specific, actionable suggestion for tomorrow`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
      system: systemPrompt,
    });

    const recapText =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({
      recap: recapText,
      tone,
      tasksCount: tasks?.length || 0,
      pillars: profile.top_3,
    });
  } catch (error) {
    console.error("Recap error:", error);

    // Handle specific Anthropic API errors
    if (error instanceof Anthropic.APIError) {
      const errorMessage = error.message || "";

      // Check for credit balance issues
      if (errorMessage.includes("credit balance is too low")) {
        return NextResponse.json(
          { error: "API credit balance is low. Please check your Anthropic billing settings." },
          { status: 402 }
        );
      }

      if (error.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please wait a moment and try again." },
          { status: 429 }
        );
      }
      if (error.status === 401) {
        return NextResponse.json(
          { error: "API authentication error. Please contact support." },
          { status: 500 }
        );
      }
      if (error.status === 400) {
        return NextResponse.json(
          { error: "Invalid request to AI service. Please try again." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
