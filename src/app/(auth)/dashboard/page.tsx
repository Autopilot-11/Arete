"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import FocusTimer from "@/components/FocusTimer";
import ManualLog from "@/components/ManualLog";
import TaskChart from "@/components/TaskChart";
import DailyRecap from "@/components/DailyRecap";
import HistorySidebar from "@/components/HistorySidebar";
import ProgressStats from "@/components/ProgressStats";
import UserProfileModal from "@/components/UserProfileModal";
import { useSidebar } from "@/contexts/SidebarContext";
import { Task, Profile } from "@/lib/database.types";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { isOpen: isSidebarOpen } = useSidebar();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(`/api/tasks?date=${today}`);
      const data = await response.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (!data.profile || !data.profile.top_3) {
          router.push("/onboarding");
          return;
        }

        setProfile(data.profile);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        router.push("/onboarding");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      fetchProfile();
      fetchTasks();
    }
  }, [isLoaded, user, router, fetchTasks]);

  const handleTaskComplete = async (task: {
    task_name: string;
    tag: string;
    start_time: string;
    end_time: string;
    is_manual?: boolean;
  }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  if (!isLoaded || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const pillars = profile.top_3 || [];

  const handlePillarsUpdate = (newPillars: string[]) => {
    setProfile((prev) => prev ? { ...prev, top_3: newPillars } : null);
  };

  return (
    <>
      <HistorySidebar />
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentPillars={pillars}
        onPillarsUpdate={handlePillarsUpdate}
      />
      <div
        className={`min-h-screen pb-12 transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-80" : ""
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#FDF8F3]/95 backdrop-blur border-b border-[#D4A574]/20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif", color: "#D4A574" }}
          >
            Aretē
          </h1>
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#D4A574]/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E8C99B] to-[#D4A574] flex items-center justify-center text-white font-bold text-sm shadow">
                {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-gray-600 text-sm font-medium">
                {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
            <SignOutButton>
              <button className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Top 3 Pillars Banner */}
      <div className="bg-gradient-to-r from-[#D4A574]/10 via-[#D4A574]/5 to-[#D4A574]/10 border-b border-[#D4A574]/20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg mb-5 text-gray-600"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Your Three Pillars
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-5">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative px-8 py-4 bg-white rounded-2xl cursor-default"
                style={{
                  boxShadow: `
                    0 10px 30px rgba(212, 165, 116, 0.2),
                    0 4px 12px rgba(0, 0, 0, 0.08),
                    inset 0 0 0 2px rgba(212, 165, 116, 0.3)
                  `,
                }}
              >
                <motion.span
                  className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background: "linear-gradient(135deg, #E8C99B 0%, #D4A574 50%, #B8864E 100%)",
                    boxShadow: "0 4px 12px rgba(212, 165, 116, 0.4)",
                  }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {i + 1}
                </motion.span>
                <span className="font-semibold text-gray-800">{pillar}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Progress Stats */}
      <ProgressStats />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <FocusTimer onTaskComplete={handleTaskComplete} pillars={pillars} animationDelay={0} />
            <ManualLog onTaskAdd={handleTaskComplete} pillars={pillars} animationDelay={0.1} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <TaskChart tasks={isLoadingTasks ? [] : tasks} animationDelay={0.05} />
            <DailyRecap pillars={pillars} tasksCount={tasks.length} animationDelay={0.15} />
          </div>
        </div>

        {/* Task List */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-3xl p-6"
            style={{
              boxShadow: `
                0 20px 60px rgba(212, 165, 116, 0.15),
                0 8px 24px rgba(0, 0, 0, 0.08),
                inset 0 0 0 1px rgba(212, 165, 116, 0.1)
              `,
            }}
          >
            <h2
              className="text-2xl font-bold mb-5"
              style={{
                fontFamily: "var(--font-playfair), serif",
                background: "linear-gradient(135deg, #B8864E 0%, #D4A574 50%, #E8C99B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Today&apos;s Tasks
            </h2>
            <div className="space-y-3">
              {tasks.map((task, index) => {
                const duration = task.end_time
                  ? Math.round(
                      (new Date(task.end_time).getTime() -
                        new Date(task.start_time).getTime()) /
                        60000
                    )
                  : null;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.05,
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-[#D4A574]/30 card-hover-subtle"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{task.task_name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {task.tag && (
                          <span className="text-xs px-3 py-1 bg-gradient-to-r from-[#D4A574]/20 to-[#E8C99B]/20 text-[#B8864E] rounded-full font-medium border border-[#D4A574]/20">
                            {task.tag}
                          </span>
                        )}
                        {task.is_manual && (
                          <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                            Manual
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(task.start_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {duration !== null && duration > 0 ? (
                          <motion.p
                            className="font-bold text-lg"
                            style={{
                              background: "linear-gradient(135deg, #B8864E 0%, #D4A574 100%)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {duration} min
                          </motion.p>
                        ) : duration !== null ? (
                          <span className="text-gray-400 text-sm">0 min</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-2 h-2 rounded-full bg-green-500"
                            />
                            In progress
                          </span>
                        )}
                      </div>
                      <motion.button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete task"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
      </div>
    </>
  );
}
