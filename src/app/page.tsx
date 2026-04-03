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
  const packRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevIndexRef = useRef(0);
  const hasAnimated = useRef(false);
  const isTransitioning = useRef(false);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const toggleCart = useCartStore((s) => s.toggleCart);

  // --- Lock viewport ---
  useEffect(() => {
    const prevent = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-cart-drawer]")) return;
      e.preventDefault();
    };
    document.addEventListener("touchmove", prevent, { passive: false });
    document.body.style.cssText = "overflow:hidden;position:fixed;inset:0;width:100%;height:100%";
    return () => {
      document.removeEventListener("touchmove", prevent);
      document.body.style.cssText = "";
    };
  }, []);

  // --- Initial bg color ---
  useEffect(() => {
    document.body.style.backgroundColor = product.theme.background;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Product switch ---
  const goTo = useCallback((i: number, dir: 1 | -1) => {
    if (isTransitioning.current) return;
    const idx = (i + products.length) % products.length;
    if (idx === activeIndex) return;
    isTransitioning.current = true;

    const prevIdx = activeIndex;
    const prevPack = packRefs.current[prevIdx];
    const nextPack = packRefs.current[idx];
    prevIndexRef.current = prevIdx;

    // --- Smooth background color interpolation ---
    gsap.to(document.body, {
      backgroundColor: products[idx].theme.background,
      duration: 0.7,
      ease: "power2.inOut",
    });

    // --- Animate OLD pack OUT ---
    if (prevPack) {
      gsap.to(prevPack, {
        y: dir * -80,
        opacity: 0,
        scale: 0.92,
        duration: 0.4,
        ease: "power3.in",
        force3D: true,
        onComplete: () => {
          gsap.set(prevPack, { visibility: "hidden", y: 0, opacity: 1, scale: 1 });
        },
      });
    }

    // --- Animate NEW pack IN (slightly delayed) ---
    if (nextPack) {
      gsap.set(nextPack, { visibility: "visible", y: dir * 100, opacity: 0, scale: 0.9 });
      gsap.to(nextPack, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        ease: "power3.out",
        delay: 0.1,
        force3D: true,
      });
    }

    // Update state (triggers text change)
    setTimeout(() => setActiveIndex(idx), 150);
    setThumbPage(Math.floor(idx / THUMBS_PER_PAGE));

    setTimeout(() => { isTransitioning.current = false; }, 650);
  }, [activeIndex]);

  // --- Keyboard ---
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goTo(activeIndex + 1, 1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goTo(activeIndex - 1, -1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, goTo]);

  // --- Wheel ---
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioning.current || Math.abs(e.deltaY) < 25) return;
      goTo(e.deltaY > 0 ? activeIndex + 1 : activeIndex - 1, e.deltaY > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, [activeIndex, goTo]);

  // --- Touch swipe ---
  useEffect(() => {
    let x0 = 0, y0 = 0;
    const ts = (e: TouchEvent) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; };
    const te = (e: TouchEvent) => {
      if (isTransitioning.current) return;
      const dx = x0 - e.changedTouches[0].clientX;
      const dy = y0 - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 35 && Math.abs(dy) > Math.abs(dx)) {
        goTo(dy > 0 ? activeIndex + 1 : activeIndex - 1, dy > 0 ? 1 : -1);
      } else if (Math.abs(dx) > 50) {
        goTo(dx > 0 ? activeIndex + 1 : activeIndex - 1, dx > 0 ? 1 : -1);
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
    tl.from(packRefs.current[0]!, { opacity: 0, scale: 0.85, y: 50, duration: 1 }, 0.3)
      .from(".bg-text-el", { opacity: 0, scale: 0.95, duration: 1 }, 0.2)
      .from(".left-block > *", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08 }, 0.5)
      .from(".mobile-info-inner > *", { opacity: 0, y: 15, duration: 0.45, stagger: 0.06 }, 0.5)
      .from(".right-block", { opacity: 0, x: 20, duration: 0.5 }, 0.6)
      .from(".bottom-price", { opacity: 0, y: 15, duration: 0.4 }, 0.7)
      .from(".nav-el", { opacity: 0, y: -10, duration: 0.5 }, 0.3);
  }, { scope: containerRef });

  // --- Text switch animation (runs on activeIndex change) ---
  useGSAP(() => {
    if (!hasAnimated.current) return;
    gsap.fromTo(".bg-text-el span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(".left-block > *", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power2.out" });
    gsap.fromTo(".mobile-info-inner > *", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.025, ease: "power2.out" });
    gsap.fromTo(".bottom-price", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.05 });
  }, { scope: containerRef, dependencies: [activeIndex], revertOnUpdate: true });

  // --- Thumbnails ---
  const thumbStart = thumbPage * THUMBS_PER_PAGE;
  const visibleThumbs = products.slice(thumbStart, thumbStart + THUMBS_PER_PAGE);

  const handleShopNow = useCallback(() => { addItem(product); openCart(); }, [product, addItem, openCart]);
  const cartCount = totalItems();

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden">

      {/* NAV */}
      <nav className="nav-el fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 md:px-12 py-3 md:py-4">
        <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 400 }}>SliceUp</div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-sm cursor-pointer" style={{ background: "rgba(255,255,255,0.95)", color: "#222", borderRadius: 20, padding: "6px 20px", fontWeight: 500 }}>Menu</span>
          <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">About</a>
          <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Shop</a>
          <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-opacity">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <button className="md:hidden p-1" aria-label="Menu"><MenuIcon size={20} strokeWidth={1.5} /></button>
          <button onClick={toggleCart} className="relative p-1 hover:opacity-80 transition-opacity" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {/* BG TEXT */}
      <div className="bg-text-el absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" style={{ zIndex: 1 }}>
        <span style={{
          fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: "clamp(100px, 22vw, 400px)",
          textTransform: "uppercase", color: "rgba(255,255,255,0.12)", lineHeight: 0.85, whiteSpace: "nowrap", letterSpacing: 10,
        }}>{product.name}</span>
      </div>

      {/* ALL PACKS — preloaded, GSAP controls visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
        {products.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => { packRefs.current[i] = el; }}
            className="absolute will-change-transform md:translate-x-[5%] -translate-y-[5%] md:translate-y-0"
            style={{
              maxWidth: 320, maxHeight: 460, width: "52vmin", height: "70vmin",
              visibility: i === 0 ? "visible" : "hidden",
            }}
          >
            <Image
              src={p.images.pack}
              alt={p.name}
              width={350}
              height={500}
              className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
              priority={i < 3}
              loading="eager"
            />
          </div>
        ))}
      </div>

      {/* LEFT BLOCK (desktop) */}
      <div className="left-block absolute z-10 hidden md:flex flex-col" style={{ left: 48, top: "50%", transform: "translateY(-50%)", maxWidth: 340 }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, opacity: 0.6, marginBottom: 8 }}>{product.subtitle}</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 42, fontWeight: 700, lineHeight: 1.05, marginBottom: 10 }}>{product.name}</h1>
        <div className="flex items-baseline gap-3" style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && <span style={{ fontSize: 14, opacity: 0.5, textDecoration: "line-through" }}>{formatPrice(product.compareAtPrice)}</span>}
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.65, marginBottom: 20 }}>{product.description}</p>
        <button onClick={handleShopNow} className="group relative overflow-hidden" style={{ border: "1.5px solid rgba(255,255,255,0.7)", background: "transparent", borderRadius: 30, padding: "12px 32px", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "white", alignSelf: "flex-start" }}>
          <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Shop now</span>
          <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
        </button>
      </div>

      {/* MOBILE INFO */}
      <div className="absolute z-10 md:hidden left-0 right-0 bottom-0 px-5 pb-6 pt-16 text-center" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }}>
        <div className="mobile-info-inner">
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, opacity: 0.7, marginBottom: 4 }}>{product.subtitle}</p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 32, fontWeight: 700, lineHeight: 1.1, marginBottom: 4, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{product.name}</h1>
          <p style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.75, marginBottom: 8, maxWidth: 280, marginLeft: "auto", marginRight: "auto", textShadow: "0 1px 6px rgba(0,0,0,0.2)" }}>{product.description}</p>
          <div className="flex items-baseline justify-center gap-3 mb-3">
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 700, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>{formatPrice(product.price)}</span>
            {product.compareAtPrice && <span style={{ fontSize: 14, opacity: 0.5, textDecoration: "line-through" }}>{formatPrice(product.compareAtPrice)}</span>}
          </div>
          <button onClick={handleShopNow} className="group relative overflow-hidden mx-auto" style={{ border: "1.5px solid rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", borderRadius: 30, padding: "11px 36px", fontSize: 13, fontWeight: 500, color: "white" }}>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Shop now</span>
            <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {products.map((_, i) => (
              <button key={i} onClick={() => goTo(i, i > activeIndex ? 1 : -1)} className="rounded-full transition-all duration-300"
                style={{ width: i === activeIndex ? 18 : 5, height: 5, backgroundColor: i === activeIndex ? "white" : "rgba(255,255,255,0.35)" }}
                aria-label={`Product ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT BLOCK (desktop) */}
      <div className="right-block absolute z-10 hidden md:flex flex-col items-center" style={{ right: 48, top: "50%", transform: "translateY(-50%)" }}>
        <div className="flex items-center gap-2 mb-4">
          <ArrowBtn dir="left" onClick={() => goTo(activeIndex - 1, -1)} />
          <ArrowBtn dir="right" onClick={() => goTo(activeIndex + 1, 1)} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {visibleThumbs.map((p, i) => {
            const realIdx = thumbStart + i;
            return <Thumb key={p.id} product={p} isActive={realIdx === activeIndex} onClick={() => goTo(realIdx, realIdx > activeIndex ? 1 : -1)} />;
          })}
        </div>
        <span className="text-[10px] opacity-30 mt-3 tracking-wider">{activeIndex + 1} / {products.length}</span>
      </div>

      {/* BOTTOM PRICE (desktop) */}
      <div className="bottom-price absolute z-10 hidden md:block" style={{ bottom: 40, left: "50%", transform: "translateX(-50%)" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 48, fontWeight: 700 }}>{formatPrice(product.price)}</span>
      </div>

      <CartDrawer />
    </div>
  );
}

function ArrowBtn({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.3)" }} aria-label={dir === "left" ? "Previous" : "Next"}>
      {dir === "left" ? <ChevronLeft size={18} strokeWidth={1.5} /> : <ChevronRight size={18} strokeWidth={1.5} />}
    </button>
  );
}

function Thumb({ product, isActive, onClick }: { product: Product; isActive: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="overflow-hidden flex items-center justify-center transition-all duration-300"
      style={{ width: 56, height: 56, borderRadius: 12, border: isActive ? "2px solid white" : "1.5px solid rgba(255,255,255,0.15)", background: isActive ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", opacity: isActive ? 1 : 0.6, padding: 4 }} title={product.name}>
      <Image src={product.images.pack} alt={product.name} width={48} height={48} className="w-full h-full object-contain" />
    </button>
  );
}
