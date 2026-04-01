"use client";

// TODO: Mouse parallax container
// - Wraps children with transform based on mouse position
// - Configurable intensity and direction
// - GPU-accelerated with will-change: transform
export default function ParallaxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="will-change-transform">{children}</div>;
}
