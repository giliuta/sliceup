"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import BackgroundText from "./BackgroundText";
import ProductVideo from "./ProductVideo";
import FloatingParticles from "./FloatingParticles";
import ProductSwitcher from "./ProductSwitcher";
import { useParallax } from "@/hooks/useParallax";
import { useCartStore } from "@/stores/cartStore";

gsap.registerPlugin(useGSAP);

interface HeroSectionProps {
  product: Product;
  products: Product[];
  activeIndex: number;
  onProductChange: (index: number) => void;
}

export default function HeroSection({
  product,
  products,
  activeIndex,
  onProductChange,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const parallax = useParallax(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  // Sync background color
  useEffect(() => {
    document.body.style.backgroundColor = product.theme.background;
    document.documentElement.style.setProperty("--theme-bg", product.theme.background);
    document.documentElement.style.setProperty("--theme-bg-dark", product.theme.backgroundDark);
    document.documentElement.style.setProperty("--theme-accent", product.theme.accent);
  }, [product.theme]);

  // Initial load animation (once)
  useGSAP(
    () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-bg-text", { opacity: 0, scale: 0.96, duration: 0.9, delay: 0.4 })
        .from(".hero-product", { opacity: 0, scale: 0.92, duration: 0.8 }, "-=0.4")
        .from(".hero-subtitle", { opacity: 0, y: 25, duration: 0.5 }, "-=0.3")
        .from(".hero-title", { opacity: 0, y: 25, duration: 0.5 }, "-=0.25")
        .from(".hero-desc", { opacity: 0, y: 25, duration: 0.5 }, "-=0.25")
        .from(".hero-cta", { opacity: 0, y: 25, duration: 0.5 }, "-=0.25")
        .from(".hero-price-block", { opacity: 0, y: 20, duration: 0.4 }, "-=0.3")
        .from(".hero-thumbs", { opacity: 0, y: 15, duration: 0.5 }, "-=0.2")
        .from(".hero-scroll", { opacity: 0, duration: 0.4 }, "-=0.1");
    },
    { scope: containerRef }
  );

  // Animate content on product switch
  useGSAP(
    () => {
      if (!hasAnimated.current) return;
      gsap.from(contentRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      });
    },
    { scope: containerRef, dependencies: [activeIndex], revertOnUpdate: true }
  );

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onProductChange((activeIndex + 1) % products.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onProductChange((activeIndex - 1 + products.length) % products.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIndex, products.length, onProductChange]);

  const handleAddToCart = useCallback(() => {
    addItem(product);
    openCart();
  }, [product, addItem, openCart]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* ====== DEPTH LAYERS ====== */}

      {/* Background text — behind everything */}
      <BackgroundText text={product.name} parallax={parallax} />

      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none absolute z-[1] rounded-full"
        style={{
          width: 500,
          height: 500,
          top: "15%",
          left: "-5%",
          background: product.theme.accent,
          filter: "blur(120px)",
          opacity: 0.15,
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="pointer-events-none absolute z-[1] rounded-full"
        style={{
          width: 450,
          height: 450,
          bottom: "10%",
          right: "-8%",
          background: product.theme.backgroundDark,
          filter: "blur(120px)",
          opacity: 0.2,
          transition: "background 0.6s ease",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles parallax={parallax} />

      {/* ====== MAIN CONTENT ====== */}
      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex items-center"
      >
        {/* Desktop: 3-column grid / Mobile: stacked */}
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 xl:px-28 pt-20 pb-32 md:pt-0 md:pb-0">

          {/* LEFT — Product info */}
          <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left order-2 md:order-1 md:w-[30%] lg:w-[28%] mt-4 md:mt-0">
            <p
              className="hero-subtitle uppercase opacity-60 mb-3"
              style={{
                fontSize: 12,
                letterSpacing: "3px",
                fontWeight: 300,
              }}
            >
              {product.subtitle}
            </p>

            <h1
              className="hero-title mb-4"
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
                fontSize: "clamp(36px, 4vw, 56px)",
                lineHeight: 0.95,
              }}
            >
              {product.name}
            </h1>

            <p
              className="hero-desc mb-6"
              style={{
                fontSize: 14,
                fontWeight: 300,
                lineHeight: 1.7,
                opacity: 0.7,
                maxWidth: 380,
              }}
            >
              {product.description}
            </p>

            <button
              onClick={handleAddToCart}
              className="hero-cta group relative overflow-hidden uppercase transition-all duration-300 hover:border-white/70"
              style={{
                border: "2px solid rgba(255,255,255,0.35)",
                borderRadius: 9999,
                padding: "12px 36px",
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "2px",
              }}
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                Shop Now
              </span>
              <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          </div>

          {/* CENTER — Product visual */}
          <div className="flex items-center justify-center order-1 md:order-2 md:w-[40%] lg:w-[44%]">
            <div
              className="hero-product will-change-transform"
              style={{
                transform: `translate(${parallax.x * 15}px, ${parallax.y * 10}px)`,
              }}
            >
              <ProductVideo product={product} />
            </div>
          </div>

          {/* RIGHT — Price */}
          <div className="flex flex-col items-center md:items-end justify-center order-3 md:w-[30%] lg:w-[28%] mt-2 md:mt-0">
            <div className="hero-price-block text-center md:text-right">
              {product.compareAtPrice && (
                <p
                  className="line-through mb-1"
                  style={{ fontSize: 14, opacity: 0.5 }}
                >
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontWeight: 900,
                  fontSize: "clamp(36px, 4vw, 56px)",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {formatPrice(product.price)}
              </p>
              <p style={{ fontSize: 12, fontWeight: 300, opacity: 0.5, marginTop: 6 }}>
                {product.weight}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== OVERLAYS ====== */}

      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Product switcher */}
      <ProductSwitcher
        products={products}
        activeIndex={activeIndex}
        onProductChange={onProductChange}
      />

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 opacity-40">
        <span style={{ fontSize: 10, letterSpacing: "3px", textTransform: "uppercase", fontWeight: 300 }}>
          Scroll
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className="animate-[scrollPulse_2s_ease-in-out_infinite]"
        >
          <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  );
}
