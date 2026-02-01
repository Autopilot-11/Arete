"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label: string;
}

export default function TimePicker({ value, onChange, label }: TimePickerProps) {
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [isExpanded, setIsExpanded] = useState(false);

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) {
        const newPeriod = h >= 12 ? "PM" : "AM";
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        setHours(displayHour);
        setMinutes(m);
        setPeriod(newPeriod);
      }
    }
  }, [value]);

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

  // Quick presets
  const presets = [
    { label: "9 AM", h: 9, m: 0, p: "AM" as const },
    { label: "12 PM", h: 12, m: 0, p: "PM" as const },
    { label: "3 PM", h: 3, m: 0, p: "PM" as const },
    { label: "6 PM", h: 6, m: 0, p: "PM" as const },
    { label: "9 PM", h: 9, m: 0, p: "PM" as const },
  ];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <motion.div
        className="overflow-hidden rounded-xl border-2 border-[#e5e5e5] bg-white transition-all duration-300"
        animate={{
          borderColor: isExpanded ? "#D4A574" : "#e5e5e5",
          boxShadow: isExpanded ? "0 4px 20px rgba(212, 165, 116, 0.15)" : "none"
        }}
      >
        {/* Collapsed view - just show selected time */}
        <motion.button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 text-left flex items-center justify-between"
        >
          <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
            {displayValue}
          </span>
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-5 h-5 text-[#D4A574]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        {/* Expanded view - scroll picker */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            {/* Time Scroll Picker */}
            <div className="flex items-center justify-center gap-2 py-3">
              {/* Hours Column */}
              <div className="flex flex-col items-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleHourChange(1)}
                  className="p-2 rounded-full hover:bg-[#D4A574]/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </motion.button>

                <div
                  ref={hoursRef}
                  className="relative h-12 w-14 flex items-center justify-center overflow-hidden"
                >
                  <motion.span
                    key={hours}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-gray-800"
                  >
                    {hours}
                  </motion.span>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleHourChange(-1)}
                  className="p-2 rounded-full hover:bg-[#D4A574]/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              </div>

              <span className="text-3xl font-bold text-[#D4A574] pb-1">:</span>

              {/* Minutes Column */}
              <div className="flex flex-col items-center">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMinuteChange(1)}
                  className="p-2 rounded-full hover:bg-[#D4A574]/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </motion.button>

                <div
                  ref={minutesRef}
                  className="relative h-12 w-14 flex items-center justify-center overflow-hidden"
                >
                  <motion.span
                    key={minutes}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl font-bold text-gray-800"
                  >
                    {minutes.toString().padStart(2, "0")}
                  </motion.span>
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleMinuteChange(-1)}
                  className="p-2 rounded-full hover:bg-[#D4A574]/10 transition-colors"
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
                className="ml-3 px-4 py-3 rounded-xl bg-gradient-to-br from-[#D4A574] to-[#B8864E] text-white font-bold shadow-md"
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

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-gray-100 mt-2">
              {presets.map((preset) => (
                <motion.button
                  key={preset.label}
                  type="button"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setHours(preset.h);
                    setMinutes(preset.m);
                    setPeriod(preset.p);
                    updateTime(preset.h, preset.m, preset.p);
                    setIsExpanded(false);
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 hover:bg-[#D4A574]/20 text-gray-700 transition-colors"
                >
                  {preset.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
