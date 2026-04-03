"use client";

import { useRef, useEffect } from "react";
import type { Product } from "@/data/products";

interface ProductVideoProps {
  product: Product;
}

export default function ProductVideo({ product }: ProductVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [product.id]);

  return (
    <div
      className="relative"
      style={{ width: "55vmin", height: "73vmin", maxWidth: "480px", maxHeight: "640px" }}
    >
      {/* Video layer — shown when video files exist */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="video-blend absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500"
        key={product.id}
        onLoadedData={(e) => {
          (e.target as HTMLVideoElement).style.opacity = "1";
        }}
      >
        <source src={product.video.webm} type="video/webm" />
        <source src={product.video.mp4} type="video/mp4" />
      </video>

      {/* Placeholder — large product name, visible until real media loads */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-white/[0.12] text-center leading-none select-none pointer-events-none"
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 900,
            fontSize: "clamp(60px, 12vmin, 140px)",
          }}
        >
          {product.name}
        </span>
      </div>

      {/* Glow behind product */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full opacity-25 -z-10"
        style={{
          backgroundColor: product.theme.accent,
          filter: "blur(100px)",
          transition: "background-color 0.6s ease",
        }}
      />
    </div>
  );
}
