"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Step = "goals10" | "goals5" | "goals3";

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [step, setStep] = useState<Step>("goals10");
  const [goals10, setGoals10] = useState<string[]>(Array(10).fill(""));
  const [goals5, setGoals5] = useState<string[]>([]);
  const [goals3, setGoals3] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    // Check if user already has pillars set
    const checkExistingProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (data.profile && data.profile.top_3 && data.profile.top_3.length === 3) {
          // User already has pillars, redirect to dashboard
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Failed to check profile:", error);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    if (user) {
      checkExistingProfile();
    }
  }, [isLoaded, user, router]);

  const handleGoal10Change = (index: number, value: string) => {
    const newGoals = [...goals10];
    newGoals[index] = value;
    setGoals10(newGoals);
  };

  const isGoals10Valid = goals10.filter((g) => g.trim()).length === 10;

  const handleGoals5Toggle = (goal: string) => {
    if (goals5.includes(goal)) {
      setGoals5(goals5.filter((g) => g !== goal));
    } else if (goals5.length < 5) {
      setGoals5([...goals5, goal]);
    }
  };

  const handleGoals3Toggle = (goal: string) => {
    if (goals3.includes(goal)) {
      setGoals3(goals3.filter((g) => g !== goal));
    } else if (goals3.length < 3) {
      setGoals3([...goals3, goal]);
    }
  };

  const handleSubmit = async () => {
    if (goals3.length !== 3) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goals_10: goals10.filter((g) => g.trim()),
          goals_5: goals5,
          top_3: goals3,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {["goals10", "goals5", "goals3"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === s
                      ? "bg-[#D4A574] text-white"
                      : i < ["goals10", "goals5", "goals3"].indexOf(step)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-16 h-1 ml-2 ${
                      i < ["goals10", "goals5", "goals3"].indexOf(step)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pillar-container p-8">
          {/* Step 1: Enter 10 Goals */}
          {step === "goals10" && (
            <div>
              <h1
                className="text-3xl font-bold text-center mb-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Define Your Aspirations
              </h1>
              <p className="text-gray-600 text-center mb-8">
                What are the 10 most important goals or values in your life?
                Think broadly: career, relationships, health, growth, creativity...
              </p>

              <div className="space-y-4">
                {goals10.map((goal, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-[#D4A574] font-bold w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => handleGoal10Change(index, e.target.value)}
                      placeholder={`Goal ${index + 1}`}
                      className="input-gold flex-1"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep("goals5")}
                  disabled={!isGoals10Valid}
                  className="btn-gold"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select 5 from 10 */}
          {step === "goals5" && (
            <div>
              <h1
                className="text-3xl font-bold text-center mb-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Narrow Your Focus
              </h1>
              <p className="text-gray-600 text-center mb-8">
                If you could only pursue 5 of these, which would you choose?
                Select 5 goals that resonate most deeply.
              </p>

              <div className="space-y-3">
                {goals10.filter((g) => g.trim()).map((goal, index) => (
                  <button
                    key={index}
                    onClick={() => handleGoals5Toggle(goal)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition ${
                      goals5.includes(goal)
                        ? "border-[#D4A574] bg-[#D4A574]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{goal}</span>
                      {goals5.includes(goal) && (
                        <span className="text-[#D4A574] font-bold">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center mt-4 text-gray-500">
                Selected: {goals5.length}/5
              </p>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep("goals10")}
                  className="px-6 py-2 border-2 border-gray-300 rounded-md hover:border-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep("goals3")}
                  disabled={goals5.length !== 5}
                  className="btn-gold"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select 3 from 5 */}
          {step === "goals3" && (
            <div>
              <h1
                className="text-3xl font-bold text-center mb-2"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Your Three Pillars
              </h1>
              <p className="text-gray-600 text-center mb-8">
                These final 3 will become your guiding pillars.
                What truly matters most to you?
              </p>

              <div className="space-y-3">
                {goals5.map((goal, index) => (
                  <button
                    key={index}
                    onClick={() => handleGoals3Toggle(goal)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition ${
                      goals3.includes(goal)
                        ? "border-[#D4A574] bg-[#D4A574]/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{goal}</span>
                      {goals3.includes(goal) && (
                        <span className="text-[#D4A574] font-bold">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-center mt-4 text-gray-500">
                Selected: {goals3.length}/3
              </p>

              {error && (
                <p className="text-center mt-4 text-red-500">{error}</p>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep("goals5")}
                  className="px-6 py-2 border-2 border-gray-300 rounded-md hover:border-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={goals3.length !== 3 || isSubmitting}
                  className="btn-gold"
                >
                  {isSubmitting ? "Saving..." : "Complete Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
