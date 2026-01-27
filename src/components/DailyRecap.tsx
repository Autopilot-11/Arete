"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GreekPillar from "@/components/ui/GreekPillar";

interface DailyRecapProps {
  pillars: string[];
  tasksCount: number;
  animationDelay?: number;
}

export default function DailyRecap({ pillars, tasksCount, animationDelay = 0 }: DailyRecapProps) {
  const [recap, setRecap] = useState<string | null>(null);
  const [tone, setTone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRecap = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recap");
      }
      setRecap(data.recap);
      setTone(data.tone);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getToneLabel = (t: string) => {
    switch (t) {
      case "strict_stoic":
        return "Strict Stoic Mode";
      case "encouraging":
        return "Encouraging";
      default:
        return "Balanced";
    }
  };

  const getToneColor = (t: string) => {
    switch (t) {
      case "strict_stoic":
        return "bg-red-100 text-red-800";
      case "encouraging":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <GreekPillar title="Daily Oracle" delay={animationDelay}>
      <AnimatePresence mode="wait">
        {tone && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-end mb-4"
          >
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getToneColor(tone)}`}>
              {getToneLabel(tone)}
            </span>
          </motion.div>
        )}

        {!recap && !isLoading && !error && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E8C99B]/20 to-[#D4A574]/30 flex items-center justify-center"
            >
              <span className="text-2xl">🏛️</span>
            </motion.div>
            <p className="text-gray-600 mb-4">
              Get your personalized end-of-day reflection based on how well you
              aligned with your Three Pillars.
            </p>
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {pillars.map((pillar, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-1.5 bg-gradient-to-r from-[#D4A574]/20 to-[#E8C99B]/20 text-[#B8864E] rounded-full text-sm font-medium border border-[#D4A574]/30"
                >
                  {pillar}
                </motion.span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {tasksCount} task{tasksCount !== 1 ? "s" : ""} logged today
            </p>
            <motion.button
              onClick={generateRecap}
              className="btn-bubbly"
              disabled={tasksCount === 0}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate Daily Recap
            </motion.button>
            {tasksCount === 0 && (
              <p className="text-sm text-gray-400 mt-3">
                Log at least one task to generate your recap
              </p>
            )}
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block rounded-full h-10 w-10 border-4 border-[#D4A574] border-t-transparent mb-4"
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-600"
            >
              The Oracle is contemplating your day...
            </motion.p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-6"
          >
            {error.includes("credit balance") ? (
              <>
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">API Credits Required</h3>
                <p className="text-gray-600 text-sm mb-4 max-w-xs mx-auto">
                  The AI-powered daily recap requires Anthropic API credits. Please add credits to your account to use this feature.
                </p>
                <div className="flex flex-col gap-2 items-center">
                  <a
                    href="https://console.anthropic.com/settings/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-bubbly text-sm"
                  >
                    Add API Credits
                  </a>
                  <button
                    onClick={() => setError(null)}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    Dismiss
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <p className="text-red-500 mb-4">{error}</p>
                <motion.button
                  onClick={generateRecap}
                  className="btn-bubbly"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Again
                </motion.button>
              </>
            )}
          </motion.div>
        )}

        {recap && !isLoading && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="prose prose-sm max-w-none">
              {recap.split("\n\n").map((paragraph, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-gray-700 mb-4 leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-4 border-t border-gray-200"
            >
              <motion.button
                onClick={generateRecap}
                className="text-[#D4A574] hover:text-[#B8864E] text-sm font-medium flex items-center gap-1 mx-auto"
                whileHover={{ scale: 1.05 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate Recap
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GreekPillar>
  );
}
