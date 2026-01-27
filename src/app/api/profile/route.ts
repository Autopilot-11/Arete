import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Profile } from "@/lib/database.types";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data as Profile | null });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { goals_10, goals_5, top_3, day_end_time } = body as {
      goals_10?: string[];
      goals_5?: string[];
      top_3?: string[];
      day_end_time?: string;
    };

    const supabase = createServerSupabaseClient();

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    let result;

    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from("profiles")
        .update({
          goals_10,
          goals_5,
          top_3,
          ...(day_end_time && { day_end_time }),
        })
        .eq("user_id", userId)
        .select()
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          goals_10,
          goals_5,
          top_3,
          day_end_time: day_end_time || "22:00",
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Supabase error:", result.error);
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: result.data as Profile });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { top_3 } = body as { top_3?: string[] };

    if (!top_3 || top_3.length !== 3) {
      return NextResponse.json(
        { error: "Three pillars are required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from("profiles")
      .update({ top_3 })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data as Profile });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
