"use client";

import { useEffect, useState } from "react";

export default function BreathingBackground() {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
        background: "transparent",
      }}
    >
      {/* Primary breathing orb - top right */}
      <div
        className="breathing-orb breathing-orb-1"
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "70vw",
          height: "70vw",
          maxWidth: "900px",
          maxHeight: "900px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 165, 116, 0.25) 0%, rgba(212, 165, 116, 0.1) 40%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Secondary breathing orb - bottom left */}
      <div
        className="breathing-orb breathing-orb-2"
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          maxWidth: "800px",
          maxHeight: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232, 201, 155, 0.2) 0%, rgba(232, 201, 155, 0.08) 40%, transparent 70%)",
          filter: "blur(35px)",
        }}
      />

      {/* Tertiary breathing orb - center */}
      <div
        className="breathing-orb breathing-orb-3"
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          height: "50vw",
          maxWidth: "600px",
          maxHeight: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184, 134, 78, 0.15) 0%, rgba(184, 134, 78, 0.05) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Flowing gradient overlay */}
      <div
        className="breathing-flow"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            180deg,
            rgba(212, 165, 116, 0.08) 0%,
            transparent 25%,
            transparent 75%,
            rgba(232, 201, 155, 0.08) 100%
          )`,
        }}
      />

      <style jsx>{`
        @keyframes breathing-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.7;
          }
        }

        @keyframes breathing-medium {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes breathing-fast {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes flow-shift {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .breathing-orb-1 {
          animation: breathing-slow 16s ease-in-out infinite;
        }

        .breathing-orb-2 {
          animation: breathing-medium 12s ease-in-out infinite;
          animation-delay: -4s;
        }

        .breathing-orb-3 {
          animation: breathing-fast 20s ease-in-out infinite;
          animation-delay: -8s;
        }

        .breathing-flow {
          animation: flow-shift 24s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
