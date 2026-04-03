"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";

interface ProductSwitcherProps {
  products: Product[];
  activeIndex: number;
  onProductChange: (index: number) => void;
}

const VISIBLE_COUNT = 5;

function getVisibleRange(activeIndex: number, total: number) {
  const half = Math.floor(VISIBLE_COUNT / 2);
  let start = activeIndex - half;
  if (start < 0) start = 0;
  if (start + VISIBLE_COUNT > total) start = Math.max(0, total - VISIBLE_COUNT);
  return { start, end: Math.min(start + VISIBLE_COUNT, total) };
}

function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export default function ProductSwitcher({
  products,
  activeIndex,
  onProductChange,
}: ProductSwitcherProps) {
  const { start, end } = getVisibleRange(activeIndex, products.length);
  const visible = products.slice(start, end);

  const goPrev = () => onProductChange((activeIndex - 1 + products.length) % products.length);
  const goNext = () => onProductChange((activeIndex + 1) % products.length);

  // Touch swipe
  useEffect(() => {
    let startX = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goNext() : goPrev();
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  });

  return (
    <div className="hero-thumbs absolute bottom-8 md:bottom-10 left-0 right-0 z-20 flex items-center justify-center gap-3 px-4">
      {/* Left arrow */}
      <button
        onClick={goPrev}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all duration-200"
        aria-label="Previous product"
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
      </button>

      {/* Thumbnails */}
      <div className="flex items-center gap-2">
        {visible.map((p, i) => {
          const realIndex = start + i;
          const isActive = realIndex === activeIndex;
          return (
            <button
              key={p.id}
              onClick={() => onProductChange(realIndex)}
              className="flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                width: 56,
                height: 56,
                border: isActive ? "2px solid rgba(255,255,255,0.85)" : "1.5px solid rgba(255,255,255,0.15)",
                backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                transform: isActive ? "scale(1.1)" : "scale(1)",
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                fontSize: 18,
                color: isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)",
                letterSpacing: "0.5px",
              }}
              aria-label={`Switch to ${p.name}`}
              title={p.name}
            >
              {getInitial(p.name)}
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={goNext}
        className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 transition-all duration-200"
        aria-label="Next product"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
      </button>

      {/* Counter */}
      <span className="text-[11px] font-light text-white/30 tracking-wider ml-2">
        {activeIndex + 1}/{products.length}
      </span>
    </div>
  );
}
