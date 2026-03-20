"use client";

import { useEffect, useState } from "react";

interface Star {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
}

export function CosmicStarfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 96 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2.2 + 0.4,
        delay: Math.random() * 8,
        duration: 3 + Math.random() * 5,
      })),
    );
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#030712]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_100%,rgba(147,51,234,0.1),transparent_50%)]" />
      <div
        className="absolute -left-1/4 top-1/4 h-[120%] w-1/2 rotate-12 opacity-40 blur-3xl"
        style={{
          background:
            "linear-gradient(105deg, rgba(14,165,233,0.25), transparent 60%)",
        }}
      />
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/90 cosmic-star-twinkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
