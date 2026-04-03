"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { ShoppingBag, ChevronLeft, ChevronRight, Menu as MenuIcon } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import { useCartStore } from "@/stores/cartStore";
import CartDrawer from "@/components/CartDrawer";

gsap.registerPlugin(useGSAP);

const THUMBS_PER_PAGE = 4;

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbPage, setThumbPage] = useState(0);
  const product = products[activeIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const isScrolling = useRef(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const toggleCart = useCartStore((s) => s.toggleCart);

  // --- Background color sync ---
  useEffect(() => {
    document.body.style.backgroundColor = product.theme.background;
    document.documentElement.style.setProperty("--theme-bg", product.theme.background);
  }, [product.theme.background]);

  // --- Product switch ---
  const goTo = useCallback((i: number) => {
    const idx = (i + products.length) % products.length;
    setActiveIndex(idx);
    setThumbPage(Math.floor(idx / THUMBS_PER_PAGE));
  }, []);

  // --- Keyboard nav ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(activeIndex + 1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(activeIndex - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, goTo]);

  // --- Wheel scroll = TikTok reels style switch ---
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;
      const threshold = 30;
      if (Math.abs(e.deltaY) < threshold) return;
      isScrolling.current = true;
      if (e.deltaY > 0) {
        goTo(activeIndex + 1);
      } else {
        goTo(activeIndex - 1);
      }
      setTimeout(() => { isScrolling.current = false; }, 700);
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [activeIndex, goTo]);

  // --- Touch swipe (vertical + horizontal) ---
  useEffect(() => {
    let x0 = 0, y0 = 0;
    const ts = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const te = (e: TouchEvent) => {
      if (isScrolling.current) return;
      const dx = x0 - e.changedTouches[0].clientX;
      const dy = y0 - e.changedTouches[0].clientY;
      // Prefer vertical swipe (reels style)
      if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) {
        isScrolling.current = true;
        goTo(dy > 0 ? activeIndex + 1 : activeIndex - 1);
        setTimeout(() => { isScrolling.current = false; }, 700);
      } else if (Math.abs(dx) > 50) {
        isScrolling.current = true;
        goTo(dx > 0 ? activeIndex + 1 : activeIndex - 1);
        setTimeout(() => { isScrolling.current = false; }, 700);
      }
    };
    window.addEventListener("touchstart", ts, { passive: true });
    window.addEventListener("touchend", te, { passive: true });
    return () => { window.removeEventListener("touchstart", ts); window.removeEventListener("touchend", te); };
  }, [activeIndex, goTo]);

  // --- Initial load animation ---
  useGSAP(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".bg-text-el", { opacity: 0, scale: 0.95, duration: 1, delay: 0.2 })
      .from(".product-hero", { opacity: 0, scale: 0.88, y: 30, duration: 0.9 }, "-=0.5")
      .from(".left-block > *", { opacity: 0, y: 20, duration: 0.45, stagger: 0.08 }, "-=0.5")
      .from(".mobile-info > *", { opacity: 0, y: 15, duration: 0.4, stagger: 0.06 }, "-=0.5")
      .from(".right-block", { opacity: 0, x: 20, duration: 0.5 }, "-=0.4")
      .from(".bottom-price", { opacity: 0, y: 15, duration: 0.4 }, "-=0.3")
      .from(".nav-el", { opacity: 0, y: -10, duration: 0.4 }, "-=0.6");
  }, { scope: containerRef });

  // --- Switch animation (reel-like vertical slide) ---
  useGSAP(() => {
    if (!hasAnimated.current) return;
    // Product slides in from below
    gsap.fromTo(".product-hero", { opacity: 0, y: 60, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    gsap.fromTo(".bg-text-el", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
    gsap.fromTo(".left-block > *", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" });
    gsap.fromTo(".mobile-info > *", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: "power2.out" });
    gsap.fromTo(".bottom-price", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", delay: 0.1 });
  }, { scope: containerRef, dependencies: [activeIndex], revertOnUpdate: true });

  // --- Thumbnails visible ---
  const thumbStart = thumbPage * THUMBS_PER_PAGE;
  const visibleThumbs = products.slice(thumbStart, thumbStart + THUMBS_PER_PAGE);

  const handleShopNow = useCallback(() => {
    addItem(product);
    openCart();
  }, [product, addItem, openCart]);

  const cartCount = totalItems();

  return (
    <div ref={containerRef} className="relative h-screen w-screen overflow-hidden">

      {/* ===== NAV (z-100) ===== */}
      <nav className="nav-el fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-12 py-3 md:py-4">
        <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 400 }}>
          SliceUp
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span
            className="text-sm cursor-pointer"
            style={{ background: "rgba(255,255,255,0.95)", color: "#222", borderRadius: 20, padding: "6px 20px", fontWeight: 500 }}
          >
            Menu
          </span>
          <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">About</a>
          <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Shop</a>
          <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="md:hidden p-1" aria-label="Menu">
            <MenuIcon size={20} strokeWidth={1.5} />
          </button>
          <button onClick={toggleCart} className="relative p-1 hover:opacity-80 transition-opacity" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ===== BACKGROUND TEXT (z-1) ===== */}
      <div
        className="bg-text-el absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <span
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 900,
            fontSize: "clamp(100px, 22vw, 400px)",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.12)",
            lineHeight: 0.85,
            whiteSpace: "nowrap",
            letterSpacing: 10,
          }}
        >
          {product.name}
        </span>
      </div>

      {/* ===== PRODUCT IMAGE (z-2) ===== */}
      <div
        className="product-hero absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 2 }}
      >
        {/* Desktop: center+right, Mobile: center+up */}
        <div
          className="md:translate-x-[5%] -translate-y-[8%] md:translate-y-0"
          style={{ maxWidth: 320, maxHeight: 460, width: "52vmin", height: "70vmin" }}
        >
          <Image
            src={product.images.pack}
            alt={product.name}
            width={350}
            height={500}
            className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
            priority
          />
        </div>
      </div>

      {/* ===== LEFT BLOCK (desktop, z-10) ===== */}
      <div
        className="left-block absolute z-10 hidden md:flex flex-col"
        style={{ left: 48, top: "50%", transform: "translateY(-50%)", maxWidth: 340 }}
      >
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, opacity: 0.6, marginBottom: 8 }}>
          {product.subtitle}
        </p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 42, fontWeight: 700, lineHeight: 1.05, marginBottom: 10 }}>
          {product.name}
        </h1>
        <div className="flex items-baseline gap-3" style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span style={{ fontSize: 14, opacity: 0.5, textDecoration: "line-through" }}>
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.65, marginBottom: 20 }}>
          {product.description}
        </p>
        <button
          onClick={handleShopNow}
          className="group relative overflow-hidden"
          style={{
            border: "1.5px solid rgba(255,255,255,0.7)",
            background: "transparent",
            borderRadius: 30,
            padding: "12px 32px",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            color: "white",
            alignSelf: "flex-start",
          }}
        >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Shop now</span>
          <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
        </button>
      </div>

      {/* ===== MOBILE INFO (z-10, bottom, readable) ===== */}
      <div
        className="mobile-info absolute z-10 md:hidden left-0 right-0 px-5 text-center"
        style={{ bottom: 24 }}
      >
        {/* Dark gradient behind text for readability */}
        <div
          className="absolute inset-0 -top-24 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)", borderRadius: "20px 20px 0 0" }}
        />

        <div className="relative">
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, opacity: 0.7, marginBottom: 4 }}>
            {product.subtitle}
          </p>
          <h1 style={{
            fontFamily: "var(--font-playfair)",
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 4,
            textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}>
            {product.name}
          </h1>
          <p style={{
            fontSize: 12,
            lineHeight: 1.5,
            opacity: 0.75,
            marginBottom: 10,
            maxWidth: 280,
            marginLeft: "auto",
            marginRight: "auto",
            textShadow: "0 1px 6px rgba(0,0,0,0.2)",
          }}>
            {product.description}
          </p>
          <div className="flex items-baseline justify-center gap-3 mb-3">
            <span style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 30,
              fontWeight: 700,
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}>
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: 14, opacity: 0.5, textDecoration: "line-through" }}>
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleShopNow}
            className="group relative overflow-hidden mx-auto"
            style={{
              border: "1.5px solid rgba(255,255,255,0.7)",
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              borderRadius: 30,
              padding: "11px 36px",
              fontSize: 13,
              fontWeight: 500,
              color: "white",
            }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Shop now</span>
            <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </button>

          {/* Dots nav */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeIndex ? 18 : 5,
                  height: 5,
                  backgroundColor: i === activeIndex ? "white" : "rgba(255,255,255,0.35)",
                }}
                aria-label={`Product ${i + 1}`}
              />
            ))}
          </div>

          {/* Scroll hint */}
          <p className="mt-3 text-[10px] opacity-30 tracking-widest uppercase animate-pulse">
            Swipe to explore
          </p>
        </div>
      </div>

      {/* ===== RIGHT BLOCK (desktop, z-10) ===== */}
      <div
        className="right-block absolute z-10 hidden md:flex flex-col items-center"
        style={{ right: 48, top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <ArrowButton dir="left" onClick={() => goTo(activeIndex - 1)} />
          <ArrowButton dir="right" onClick={() => goTo(activeIndex + 1)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {visibleThumbs.map((p, i) => {
            const realIdx = thumbStart + i;
            return (
              <Thumbnail key={p.id} product={p} isActive={realIdx === activeIndex} onClick={() => goTo(realIdx)} />
            );
          })}
        </div>
        <span className="text-[10px] opacity-30 mt-3 tracking-wider">
          {activeIndex + 1} / {products.length}
        </span>
      </div>

      {/* ===== BOTTOM CENTER: Price (desktop) ===== */}
      <div
        className="bottom-price absolute z-10 hidden md:block"
        style={{ bottom: 40, left: "50%", transform: "translateX(-50%)" }}
      >
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 48, fontWeight: 700 }}>
          {formatPrice(product.price)}
        </span>
      </div>

      <CartDrawer />
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
      style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.3)" }}
      aria-label={dir === "left" ? "Previous" : "Next"}
    >
      {dir === "left" ? <ChevronLeft size={18} strokeWidth={1.5} /> : <ChevronRight size={18} strokeWidth={1.5} />}
    </button>
  );
}

function Thumbnail({ product, isActive, onClick }: { product: Product; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="overflow-hidden flex items-center justify-center transition-all duration-300"
      style={{
        width: 56, height: 56, borderRadius: 12,
        border: isActive ? "2px solid white" : "1.5px solid rgba(255,255,255,0.15)",
        background: isActive ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        opacity: isActive ? 1 : 0.6, padding: 4,
      }}
      title={product.name}
    >
      <Image src={product.images.pack} alt={product.name} width={48} height={48} className="w-full h-full object-contain" />
    </button>
  );
}
