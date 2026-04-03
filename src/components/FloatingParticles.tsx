"use client";

interface FloatingParticlesProps {
  parallax: { x: number; y: number };
}

const PARTICLES = [
  { top: "12%", left: "8%", size: 7, speed: 8, duration: 6, delay: 0 },
  { top: "68%", left: "88%", size: 6, speed: 14, duration: 7, delay: 1.2 },
  { top: "25%", left: "78%", size: 8, speed: 6, duration: 8, delay: 0.5 },
  { top: "82%", left: "15%", size: 6, speed: 10, duration: 5.5, delay: 2 },
  { top: "45%", left: "93%", size: 7, speed: 12, duration: 6.5, delay: 0.8 },
];

export default function FloatingParticles({ parallax }: FloatingParticlesProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full will-change-transform"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: "#ffffff",
            opacity: 0.12,
            transform: `translate(${parallax.x * p.speed}px, ${parallax.y * p.speed}px)`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
