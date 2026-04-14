"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface GreekPillarProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  title?: string;
  showCapital?: boolean;
  showBase?: boolean;
  delay?: number;
  variant?: "classic" | "modern";
}

export default function GreekPillar({
  children,
  title,
  showCapital = true,
  showBase = true,
  delay = 0,
  variant = "modern",
  className = "",
  ...props
}: GreekPillarProps) {
  if (variant === "modern") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.5,
          delay,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={`relative bg-white rounded-3xl shadow-xl card-hover-delayed ${className}`}
        style={{
          boxShadow: `
            0 20px 60px rgba(212, 165, 116, 0.12),
            0 8px 24px rgba(0, 0, 0, 0.06),
            inset 0 0 0 1px rgba(212, 165, 116, 0.08)
          `,
        }}
        {...props}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
          <div
            className="absolute -top-8 -left-8 w-16 h-16 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(212, 165, 116, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div
            className="absolute -top-8 -right-8 w-16 h-16 rounded-full"
            style={{
              background: "linear-gradient(225deg, rgba(212, 165, 116, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Header */}
        {showCapital && title && (
          <motion.div
            className="relative px-6 py-5 border-b border-[#D4A574]/20"
            style={{
              background: "linear-gradient(180deg, rgba(212, 165, 116, 0.08) 0%, transparent 100%)",
            }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.2 }}
              className="text-2xl font-bold text-center"
              style={{
                fontFamily: "var(--font-playfair), serif",
                background: "linear-gradient(135deg, #B8864E 0%, #D4A574 50%, #E8C99B 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </motion.h2>
            {/* Decorative underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: delay + 0.3, duration: 0.5 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent, #D4A574, transparent)",
              }}
            />
          </motion.div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Bottom accent */}
        {showBase && (
          <div
            className="h-1.5 w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, #D4A574 20%, #E8C99B 50%, #D4A574 80%, transparent 100%)",
            }}
          />
        )}
      </motion.div>
    );
  }

  // Classic variant (original design)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={`greek-pillar ${className}`}
      {...props}
    >
      {showCapital && (
        <div className="pillar-capital">
          {title && (
            <h2
              className="pillar-title"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              {title}
            </h2>
          )}
        </div>
      )}
      <div className="pillar-content">{children}</div>
      {showBase && <div className="pillar-base" />}
    </motion.div>
  );
}
