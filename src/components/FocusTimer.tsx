"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GreekPillar from "@/components/ui/GreekPillar";

interface FocusTimerProps {
  onTaskComplete: (task: {
    task_name: string;
    tag: string;
    start_time: string;
    end_time: string;
  }) => void;
  pillars: string[];
  animationDelay?: number;
}

export default function FocusTimer({ onTaskComplete, pillars, animationDelay = 0 }: FocusTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [tag, setTag] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (!taskName.trim()) return;
    setStartTime(new Date());
    setIsRunning(true);
    setElapsedTime(0);
  };

  const handleStop = useCallback(() => {
    if (!startTime || !taskName.trim()) return;

    const endTime = new Date();
    onTaskComplete({
      task_name: taskName,
      tag,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
    });

    setIsRunning(false);
    setTaskName("");
    setTag("");
    setStartTime(null);
    setElapsedTime(0);
  }, [startTime, taskName, tag, onTaskComplete]);

  return (
    <GreekPillar title="Focus Timer" delay={animationDelay}>
      <AnimatePresence mode="wait">
        {!isRunning ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What are you working on?
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="e.g., Writing report, Exercise, Reading..."
                className="input-gold w-full rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pillar (optional)
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="input-gold w-full rounded-xl"
              >
                <option value="">Select a pillar...</option>
                {pillars.map((pillar, i) => (
                  <option key={i} value={pillar}>
                    {pillar}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <motion.button
              onClick={handleStart}
              disabled={!taskName.trim()}
              className="btn-bubbly w-full text-lg py-4"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Focus Session
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <div className="mb-4">
              <p className="text-gray-600 mb-1">Currently working on:</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold"
              >
                {taskName}
              </motion.p>
              {tag && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-block mt-2 px-4 py-1.5 bg-gradient-to-r from-[#D4A574]/20 to-[#E8C99B]/20 text-[#B8864E] rounded-full text-sm font-medium border border-[#D4A574]/30"
                >
                  {tag}
                </motion.span>
              )}
            </div>

            <motion.div
              className="text-6xl font-mono mb-8 py-4"
              style={{
                background: "linear-gradient(135deg, #B8864E 0%, #D4A574 50%, #E8C99B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {formatTime(elapsedTime)}
            </motion.div>

            <motion.button
              onClick={handleStop}
              className="px-10 py-4 rounded-full font-bold text-white text-lg shadow-xl"
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
                boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4), inset 0 2px 0 rgba(255,255,255,0.2)",
              }}
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 12px 35px rgba(239, 68, 68, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Stop & Save
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </GreekPillar>
  );
}
