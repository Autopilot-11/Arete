"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/contexts/SidebarContext";
import { Task } from "@/lib/database.types";

interface DayData {
  date: string;
  displayDate: string;
  dayName: string;
  taskCount: number;
  totalMinutes: number;
}

export default function HistorySidebar() {
  const { isOpen, toggleSidebar, selectedDate, setSelectedDate, closeSidebar } =
    useSidebar();
  const [history, setHistory] = useState<DayData[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Fetch last 14 days of history
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const days: DayData[] = [];
        const today = new Date();

        for (let i = 0; i < 14; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toLocaleDateString("en-CA"); // YYYY-MM-DD

          const response = await fetch(`/api/tasks?date=${dateStr}`);
          const data = await response.json();
          const tasks = (data.tasks || []) as Task[];

          const totalMinutes = tasks.reduce((acc: number, task: Task) => {
            if (task.end_time) {
              return (
                acc +
                Math.round(
                  (new Date(task.end_time).getTime() -
                    new Date(task.start_time).getTime()) /
                    60000
                )
              );
            }
            return acc;
          }, 0);

          days.push({
            date: dateStr,
            displayDate: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            dayName:
              i === 0
                ? "Today"
                : i === 1
                ? "Yesterday"
                : date.toLocaleDateString("en-US", { weekday: "short" }),
            taskCount: tasks.length,
            totalMinutes,
          });
        }

        setHistory(days);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  // Fetch tasks for selected date
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedDate) {
        setSelectedTasks([]);
        return;
      }

      setIsLoadingTasks(true);
      try {
        const response = await fetch(`/api/tasks?date=${selectedDate}`);
        const data = await response.json();
        setSelectedTasks(data.tasks || []);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg border-2 border-[#D4A574] hover:bg-[#D4A574]/10 transition-colors"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6 text-[#D4A574]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-[#D4A574]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </motion.div>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 overflow-hidden flex flex-col"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-[#D4A574] to-[#E8C99B] border-b">
              <h2
                className="text-xl font-bold text-gray-900 mt-8"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                History
              </h2>
              <p className="text-sm text-gray-700 mt-1">Last 14 days</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoadingHistory ? (
                <div className="p-6 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#D4A574] border-t-transparent" />
                </div>
              ) : selectedDate ? (
                // Task details view
                <div className="p-4">
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="flex items-center text-[#D4A574] hover:underline mb-4"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back to dates
                  </button>

                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </h3>

                  {isLoadingTasks ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#D4A574] border-t-transparent" />
                    </div>
                  ) : selectedTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No tasks logged this day
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedTasks.map((task) => {
                        const duration = task.end_time
                          ? Math.round(
                              (new Date(task.end_time).getTime() -
                                new Date(task.start_time).getTime()) /
                                60000
                            )
                          : null;

                        return (
                          <div
                            key={task.id}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <p className="font-medium text-sm">
                              {task.task_name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {task.tag && (
                                <span className="text-xs px-2 py-0.5 bg-[#D4A574]/20 text-[#D4A574] rounded">
                                  {task.tag}
                                </span>
                              )}
                              {duration !== null && (
                                <span className="text-xs text-gray-500">
                                  {duration} min
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                // Date list view
                <div className="p-4 space-y-2">
                  {history.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => setSelectedDate(day.date)}
                      className="w-full p-3 rounded-lg bg-gray-50 hover:bg-[#D4A574]/10 transition-colors text-left border border-gray-100 hover:border-[#D4A574]/30"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{day.dayName}</p>
                          <p className="text-xs text-gray-500">
                            {day.displayDate}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className="font-bold text-sm"
                            style={{ color: "#D4A574" }}
                          >
                            {day.taskCount} task{day.taskCount !== 1 ? "s" : ""}
                          </p>
                          {day.totalMinutes > 0 && (
                            <p className="text-xs text-gray-500">
                              {day.totalMinutes} min
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                Click a date to view tasks
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
