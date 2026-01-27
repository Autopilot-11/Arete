"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPillars: string[];
  onPillarsUpdate: (pillars: string[]) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  currentPillars,
  onPillarsUpdate,
}: UserProfileModalProps) {
  const { user } = useUser();
  const [pillars, setPillars] = useState<string[]>(currentPillars);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setPillars(currentPillars);
  }, [currentPillars, isOpen]);

  const handlePillarChange = (index: number, value: string) => {
    const newPillars = [...pillars];
    newPillars[index] = value;
    setPillars(newPillars);
  };

  const handleSave = async () => {
    if (pillars.some((p) => !p.trim())) {
      setError("All three pillars are required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ top_3: pillars }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess(true);
      onPillarsUpdate(pillars);

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="px-6 py-5 border-b border-[#D4A574]/20"
              style={{
                background: "linear-gradient(180deg, rgba(212, 165, 116, 0.1) 0%, transparent 100%)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E8C99B] to-[#D4A574] flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  >
                    {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
                  </motion.div>
                  <div>
                    <h2
                      className="text-xl font-bold"
                      style={{
                        fontFamily: "var(--font-playfair), serif",
                        background: "linear-gradient(135deg, #B8864E 0%, #D4A574 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Profile Settings
                    </h2>
                    <p className="text-sm text-gray-500">
                      {user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Your Three Pillars
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                These are your core life priorities that guide your daily focus.
              </p>

              <div className="space-y-4">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
                        style={{
                          background: "linear-gradient(135deg, #E8C99B 0%, #D4A574 100%)",
                        }}
                      >
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={pillars[index] || ""}
                        onChange={(e) => handlePillarChange(index, e.target.value)}
                        placeholder={`Enter pillar ${index + 1}...`}
                        className="input-gold flex-1 rounded-xl"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 flex items-center justify-center gap-2 text-green-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Saved successfully!</span>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 font-medium text-gray-600 hover:border-gray-300 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 btn-bubbly"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
