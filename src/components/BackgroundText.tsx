"use client";

interface BackgroundTextProps {
  text: string;
  parallax: { x: number; y: number };
}

export default function BackgroundText({ text, parallax }: BackgroundTextProps) {
  return (
    <div
      className="hero-bg-text absolute inset-0 flex items-center justify-center z-0 will-change-transform pointer-events-none select-none overflow-hidden"
      style={{
        transform: `translate(${parallax.x * -30}px, ${parallax.y * -20}px)`,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 900,
          fontSize: "clamp(150px, 20vw, 350px)",
          textTransform: "uppercase",
          opacity: 0.06,
          lineHeight: 0.85,
          whiteSpace: "nowrap",
          letterSpacing: "15px",
          color: "#ffffff",
        }}
      >
        {text}
      </span>
    </div>
  );
}
