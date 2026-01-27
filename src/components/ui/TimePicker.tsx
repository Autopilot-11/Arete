"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

export default function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        const period = h >= 12 ? "PM" : "AM";
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        setHours(displayHour);
        setMinutes(m);
        setPeriod(period);
      }
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const updateTime = (h: number, m: number, p: "AM" | "PM") => {
    let hour24 = h;
    if (p === "PM" && h !== 12) hour24 = h + 12;
    if (p === "AM" && h === 12) hour24 = 0;
    const timeStr = `${hour24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    onChange(timeStr);
  };

  const handleHourChange = (delta: number) => {
    const newHours = hours + delta;
    const wrappedHours = newHours < 1 ? 12 : newHours > 12 ? 1 : newHours;
    setHours(wrappedHours);
    updateTime(wrappedHours, minutes, period);
  };

  const handleMinuteChange = (delta: number) => {
    const newMinutes = minutes + delta * 5;
    const wrappedMinutes = newMinutes < 0 ? 55 : newMinutes > 55 ? 0 : newMinutes;
    setMinutes(wrappedMinutes);
    updateTime(hours, wrappedMinutes, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(newPeriod);
    updateTime(hours, minutes, newPeriod);
  };

  const displayValue = value
    ? `${hours}:${minutes.toString().padStart(2, "0")} ${period}`
    : "Select time";

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-gold w-full text-left flex items-center justify-between rounded-xl"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {displayValue}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="w-5 h-5 text-[#D4A574]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="fixed z-[9999] bg-white rounded-xl shadow-2xl border-2 border-[#D4A574] p-4"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
            >
            <div className="flex items-center justify-center gap-2">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, backgroundColor: "rgba(212, 165, 116, 0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleHourChange(1)}
                  className="p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </motion.button>
                <motion.div
                  key={hours}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold text-gray-800 w-12 text-center"
                >
                  {hours}
                </motion.div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, backgroundColor: "rgba(212, 165, 116, 0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleHourChange(-1)}
                  className="p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              </div>

              <span className="text-3xl font-bold text-[#D4A574]">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, backgroundColor: "rgba(212, 165, 116, 0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMinuteChange(1)}
                  className="p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </motion.button>
                <motion.div
                  key={minutes}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold text-gray-800 w-12 text-center"
                >
                  {minutes.toString().padStart(2, "0")}
                </motion.div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.2, backgroundColor: "rgba(212, 165, 116, 0.2)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMinuteChange(-1)}
                  className="p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              </div>

              {/* AM/PM Toggle */}
              <motion.button
                type="button"
                onClick={togglePeriod}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 px-4 py-3 rounded-xl bg-gradient-to-br from-[#D4A574] to-[#B8864E] text-white font-bold shadow-lg"
              >
                <motion.span
                  key={period}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  {period}
                </motion.span>
              </motion.button>
            </div>

            {/* Quick presets */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"].map((preset) => (
                <motion.button
                  key={preset}
                  type="button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const [time, p] = preset.split(" ");
                    const [h, m] = time.split(":").map(Number);
                    setHours(h);
                    setMinutes(m);
                    setPeriod(p as "AM" | "PM");
                    updateTime(h, m, p as "AM" | "PM");
                    setIsOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 hover:bg-[#D4A574]/20 text-gray-700 transition-colors"
                >
                  {preset}
                </motion.button>
              ))}
            </div>
          </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
