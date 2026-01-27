"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Task } from "@/lib/database.types";

interface WeeklyStats {
  totalTasks: number;
  totalMinutes: number;
  activeDays: number;
  avgTasksPerDay: number;
  topPillar: string | null;
  streak: number;
}

export default function ProgressStats() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      setIsLoading(true);
      try {
        const today = new Date();
        let totalTasks = 0;
        let totalMinutes = 0;
        let activeDays = 0;
        let streak = 0;
        let streakBroken = false;
        const pillarCounts: Record<string, number> = {};

        // Fetch last 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = date.toLocaleDateString("en-CA");

          const response = await fetch(`/api/tasks?date=${dateStr}`);
          const data = await response.json();
          const tasks = (data.tasks || []) as Task[];

          if (tasks.length > 0) {
            activeDays++;
            if (!streakBroken) {
              streak++;
            }
          } else if (i > 0) {
            // Don't break streak on today if no tasks yet
            streakBroken = true;
          }

          totalTasks += tasks.length;

          tasks.forEach((task: Task) => {
            if (task.end_time) {
              const duration = Math.round(
                (new Date(task.end_time).getTime() -
                  new Date(task.start_time).getTime()) /
                  60000
              );
              // Only add positive durations (ignore invalid data)
              if (duration > 0) {
                totalMinutes += duration;
              }
            }
            if (task.tag) {
              pillarCounts[task.tag] = (pillarCounts[task.tag] || 0) + 1;
            }
          });
        }

        // Find top pillar
        const topPillar = Object.entries(pillarCounts).reduce<string | null>(
          (max, [pillar, count]) => {
            if (!max) return pillar;
            return count > (pillarCounts[max] || 0) ? pillar : max;
          },
          null
        );

        setStats({
          totalTasks,
          totalMinutes,
          activeDays,
          avgTasksPerDay: activeDays > 0 ? Math.round(totalTasks / activeDays) : 0,
          topPillar,
          streak,
        });
      } catch (error) {
        console.error("Failed to fetch weekly stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyStats();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-[#D4A574]/5 via-[#D4A574]/10 to-[#D4A574]/5 border-y border-[#D4A574]/20 p-4">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#D4A574] border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: "Weekly Tasks",
      value: stats.totalTasks,
      suffix: "",
    },
    {
      label: "Total Time",
      value: Math.round(stats.totalMinutes / 60),
      suffix: "h",
    },
    {
      label: "Active Days",
      value: stats.activeDays,
      suffix: "/7",
    },
    {
      label: "Day Streak",
      value: stats.streak,
      suffix: "",
      icon: stats.streak > 0 ? "🔥" : undefined,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-r from-[#D4A574]/5 via-[#D4A574]/10 to-[#D4A574]/5 border-y border-[#D4A574]/20"
    >
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <h3
              className="text-sm font-medium text-gray-600"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              This Week
            </h3>
            {stats.topPillar && (
              <span className="px-2 py-0.5 bg-[#D4A574]/20 text-[#D4A574] rounded-full text-xs font-medium">
                Top: {stats.topPillar}
              </span>
            )}
          </div>

          <div className="flex gap-6 flex-wrap">
            {statItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.1,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="text-center counter-smooth"
              >
                <p className="text-xl font-bold" style={{ color: "#D4A574" }}>
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  <span className="counter-smooth">{item.value}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {item.suffix}
                  </span>
                </p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
