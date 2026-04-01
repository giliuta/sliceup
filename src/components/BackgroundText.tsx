"use client";

// TODO: Large text behind product
// - Playfair Display, 900 weight
// - clamp(120px, 18vw, 320px)
// - opacity 0.08
// - Moves opposite to mouse (parallax)
export default function BackgroundText({ text }: { text: string }) {
  return (
    <div className="bg-text absolute inset-0 flex items-center justify-center">
      {text}
    </div>
  );
}
