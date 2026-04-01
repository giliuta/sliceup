"use client";

// TODO: Scroll-triggered section wrapper
// - Uses GSAP ScrollTrigger
// - Pin support
// - Scrub animations
// - Intersection Observer for lazy content
export default function ScrollSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="relative min-h-screen">{children}</section>;
}
