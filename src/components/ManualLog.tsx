"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GreekPillar from "@/components/ui/GreekPillar";
import TimePicker from "@/components/ui/TimePicker";

interface ManualLogProps {
  onTaskAdd: (task: {
    task_name: string;
    tag: string;
    start_time: string;
    end_time: string;
    is_manual: boolean;
  }) => void;
  pillars: string[];
  animationDelay?: number;
}

export default function ManualLog({ onTaskAdd, pillars, animationDelay = 0 }: ManualLogProps) {
  const [taskName, setTaskName] = useState("");
  const [tag, setTag] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingTask, setPendingTask] = useState<{
    task_name: string;
    tag: string;
    start_time: string;
    end_time: string;
    is_manual: boolean;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim() || !startTime || !endTime) return;

    // Create ISO strings for today with the selected times
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    const startDateTime = new Date(`${today}T${startTime}:00`);
    const endDateTime = new Date(`${today}T${endTime}:00`);

    const task = {
      task_name: taskName,
      tag,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      is_manual: true,
    };

    setPendingTask(task);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (pendingTask) {
      onTaskAdd(pendingTask);
      setTaskName("");
      setTag("");
      setStartTime("");
      setEndTime("");
      setPendingTask(null);
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingTask(null);
  };

  return (
    <>
      <GreekPillar title="Manual Log" delay={animationDelay}>
        <p className="text-gray-600 text-sm mb-4">
          Log a task you completed earlier
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What did you work on?"
              className="input-gold w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pillar (optional)
            </label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="input-gold w-full"
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

          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
            />
          </div>

          <motion.button
            type="submit"
            className="btn-bubbly w-full"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Add Task
          </motion.button>
        </form>
      </GreekPillar>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="modal-content"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8864E] flex items-center justify-center"
              >
                <span className="text-2xl">?</span>
              </motion.div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--font-playfair), serif", color: "#D4A574" }}
              >
                No Cheat?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you completed this task? Remember: true excellence
                comes from honest self-accounting.
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={handleCancel}
                  className="px-6 py-2 border-2 border-gray-300 rounded-full hover:border-gray-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="btn-bubbly"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, I&apos;m Honest
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
