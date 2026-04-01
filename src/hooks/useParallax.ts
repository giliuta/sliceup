"use client";

import { useEffect, useRef, useState } from "react";

interface ParallaxPosition {
  x: number;
  y: number;
}

export function useParallax(intensity: number = 1) {
  const [position, setPosition] = useState<ParallaxPosition>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const x = ((e.clientX - centerX) / centerX) * intensity;
        const y = ((e.clientY - centerY) / centerY) * intensity;
        setPosition({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity]);

  return position;
}
