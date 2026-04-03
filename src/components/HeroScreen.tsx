"use client";

import { useCallback, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { useCartStore } from "@/stores/cartStore";

gsap.registerPlugin(useGSAP);

const THUMBS_PER_PAGE = 4;
const BADGES: Record<string, string> = { "dragon-fruit": "New", "strawberry-slices": "Best seller", "pineapple-rings": "Popular", "chilli-pepper": "Spicy" };
const PAIRS: Record<string, string> = { "dragon-fruit": "Yogurt \u00b7 Smoothie", "orange-chips": "Cocktails \u00b7 Tea", "strawberry-slices": "Oatmeal \u00b7 Ice cream", "apple-chips": "Cheese board \u00b7 Wine", "pineapple-rings": "Cocktails \u00b7 Desserts", "mushroom-chips": "Ramen \u00b7 Risotto", "chilli-pepper": "Pizza \u00b7 Pasta", "tomato-chips": "Bruschetta \u00b7 Salads" };
const TESTIMONIALS = ["\u201cBest dried mango I\u2019ve ever tried\u201d \u2014 Maria K.", "\u201cFinally, snacks with zero junk\u201d \u2014 Alex D.", "\u201cPremium quality, fast delivery\u201d \u2014 Elena P.", "\u201cMy kids love the apple chips!\u201d \u2014 Sophia R.", "\u201cThe pineapple rings are addictive\u201d \u2014 James W.", "\u201cPerfect for my restaurant menu\u201d \u2014 Chef Nikos"];

function AnimatedPrice({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current === value || !ref.current) { prev.current = value; return; }
    const o = { v: prev.current };
    gsap.to(o, { v: value, duration: 0.5, ease: "power2.out", onUpdate: () => { if (ref.current) ref.current.textContent = formatPrice(Math.round(o.v)); } });
    prev.current = value;
  }, [value]);
  return <span ref={ref}>{formatPrice(value)}</span>;
}

// Fixed particles — no Math.random() to avoid hydration mismatch
const PARTICLE_DATA = [
  { top: "14%", left: "8%", size: 4, dur: 7, delay: 0 },
  { top: "72%", left: "85%", size: 3, dur: 9, delay: 1.5 },
  { top: "28%", left: "62%", size: 5, dur: 8, delay: 0.8 },
  { top: "65%", left: "22%", size: 3, dur: 10, delay: 2.5 },
  { top: "45%", left: "92%", size: 4, dur: 7.5, delay: 1 },
  { top: "82%", left: "48%", size: 3, dur: 11, delay: 3 },
  { top: "18%", left: "75%", size: 5, dur: 8.5, delay: 0.5 },
  { top: "55%", left: "12%", size: 4, dur: 9.5, delay: 2 },
];

function Particles() {
  return (<div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>{PARTICLE_DATA.map((d, i) => (<div key={i} className="absolute rounded-full" style={{ top: d.top, left: d.left, width: d.size, height: d.size, background: "rgba(255,255,255,0.07)", animation: `particleDrift ${d.dur}s ease-in-out ${d.delay}s infinite` }} />))}</div>);
}

// Color burst on product switch
function useColorBurst(heroRef: React.RefObject<HTMLDivElement | null>, activeIndex: number) {
  const prevIdx = useRef(activeIndex);
  useEffect(() => {
    if (prevIdx.current === activeIndex || !heroRef.current) { prevIdx.current = activeIndex; return; }
    const color = products[activeIndex].theme.accent;
    const container = heroRef.current;
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement("div");
      dot.style.cssText = `position:absolute;width:6px;height:6px;border-radius:50%;background:${color};left:50%;top:50%;z-index:60;pointer-events:none;`;
      container.appendChild(dot);
      const angle = (Math.PI * 2 * i) / 12;
      const dist = 80 + Math.random() * 120;
      gsap.to(dot, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0, duration: 0.6 + Math.random() * 0.3, ease: "power3.out", onComplete: () => dot.remove() });
    }
    prevIdx.current = activeIndex;
  }, [activeIndex, heroRef]);
}

// Magnetic button hook
function useMagnetic(ref: React.RefObject<HTMLElement | null>, strength: number = 0.3) {
  useEffect(() => {
    if ("ontouchstart" in window) return;
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [ref, strength]);
}

interface HeroScreenProps { activeIndex: number; thumbPage: number; onProductChange: (idx: number, dir: 1 | -1) => void; }

export default function HeroScreen({ activeIndex, thumbPage, onProductChange }: HeroScreenProps) {
  const product = products[activeIndex];
  const packRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const isTransitioning = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const shopBtnRef = useRef<HTMLButtonElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const badge = BADGES[product.id];
  const pair = PAIRS[product.id];

  useColorBurst(heroRef, activeIndex);
  useMagnetic(shopBtnRef, 0.25);

  const goTo = useCallback((i: number, dir: 1 | -1) => {
    if (isTransitioning.current) return;
    const idx = (i + products.length) % products.length;
    if (idx === activeIndex) return;
    isTransitioning.current = true;
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    const prevPack = packRefs.current[activeIndex];
    const nextPack = packRefs.current[idx];
    gsap.to(document.body, { backgroundColor: products[idx].theme.background, duration: 0.7, ease: "power2.inOut" });
    if (prevPack) gsap.to(prevPack, { y: dir * -80, opacity: 0, scale: 0.92, duration: 0.4, ease: "power3.in", force3D: true, onComplete: () => { gsap.set(prevPack, { visibility: "hidden", y: 0, opacity: 1, scale: 1 }); } });
    if (nextPack) { gsap.set(nextPack, { visibility: "visible", y: dir * 100, opacity: 0, scale: 0.9 }); gsap.to(nextPack, { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out", delay: 0.1, force3D: true }); }
    setTimeout(() => onProductChange(idx, dir), 150);
    setTimeout(() => { isTransitioning.current = false; }, 650);
  }, [activeIndex, onProductChange]);

  // 3D tilt + parallax on pack AND opposite parallax on BG text
  useEffect(() => {
    if ("ontouchstart" in window) return;
    const handler = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      const cy = (e.clientY / window.innerHeight - 0.5) * 2;
      const pack = packRefs.current[activeIndex];
      if (pack) gsap.to(pack, { x: cx * 12, y: cy * 8, rotateY: cx * 4, rotateX: -cy * 3, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      if (bgTextRef.current) gsap.to(bgTextRef.current, { x: cx * -25, y: cy * -15, duration: 0.8, ease: "power2.out", overwrite: "auto" });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [activeIndex]);

  useEffect(() => { const h = (e: Event) => { goTo(activeIndex + (e as CustomEvent).detail.dir, (e as CustomEvent).detail.dir); }; window.addEventListener("hero-scroll", h); return () => window.removeEventListener("hero-scroll", h); }, [activeIndex, goTo]);
  useEffect(() => { const h = (e: KeyboardEvent) => { if (e.key === "ArrowDown") { e.preventDefault(); goTo(activeIndex + 1, 1); } if (e.key === "ArrowUp") { e.preventDefault(); goTo(activeIndex - 1, -1); } }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [activeIndex, goTo]);

  useGSAP(() => { if (hasAnimated.current) return; hasAnimated.current = true; const tl = gsap.timeline({ defaults: { ease: "power3.out" } }); tl.from(packRefs.current[0]!, { opacity: 0, scale: 0.85, y: 50, duration: 1 }, 0.3).from(".hero-bg-text span", { opacity: 0, scale: 0.95, duration: 1 }, 0.2).from(".hero-left > *", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08 }, 0.5).from(".hero-mobile-inner > *", { opacity: 0, y: 15, duration: 0.45, stagger: 0.06 }, 0.5).from(".hero-right", { opacity: 0, x: 20, duration: 0.5 }, 0.6).from(".hero-bottom-price", { opacity: 0, y: 15, duration: 0.4 }, 0.7).from(".hero-ticker", { opacity: 0, duration: 0.5 }, 0.9); }, { scope: heroRef });

  useGSAP(() => { if (!hasAnimated.current) return; gsap.fromTo(".hero-bg-text span", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }); gsap.fromTo(".hero-left > *", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: "power2.out" }); gsap.fromTo(".hero-mobile-inner > *", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.025, ease: "power2.out" }); gsap.fromTo(".hero-bottom-price", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.05 }); }, { scope: heroRef, dependencies: [activeIndex], revertOnUpdate: true });

  const thumbStart = thumbPage * THUMBS_PER_PAGE;
  const visibleThumbs = products.slice(thumbStart, thumbStart + THUMBS_PER_PAGE);
  const handleShopNow = useCallback(() => { addItem(product); openCart(); }, [product, addItem, openCart]);
  const handleQuickAdd = useCallback(() => {
    addItem(product);
    // Bounce cart badge
    const badge = document.querySelector("[data-cart-badge]");
    if (badge) gsap.fromTo(badge, { scale: 1.5 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.3)" });
  }, [product, addItem]);

  const tickerText = TESTIMONIALS.join("     \u2022     ");

  return (
    <div ref={heroRef} className="w-full h-full relative" style={{ perspective: "1000px" }}>
      <Particles />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50, background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.2) 100%)" }} />

      {/* Glow blobs */}
      <div className="absolute pointer-events-none" style={{ width: 500, height: 500, top: "10%", left: "-8%", background: "currentColor", opacity: 0.08, borderRadius: "50%", filter: "blur(120px)", animation: "glowPulse 6s ease-in-out infinite", color: product.theme.accent, transition: "color 0.8s" }} />
      <div className="absolute pointer-events-none" style={{ width: 400, height: 400, bottom: "5%", right: "-5%", background: "currentColor", opacity: 0.1, borderRadius: "50%", filter: "blur(100px)", animation: "glowPulse 8s ease-in-out 2s infinite", color: product.theme.backgroundDark, transition: "color 0.8s" }} />

      {/* Light leak */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        <div style={{ position: "absolute", top: "-20%", left: 0, width: "40%", height: "140%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)", animation: "lightLeak 10s linear infinite" }} />
      </div>

      {/* BG TEXT — parallax opposite to pack */}
      <div ref={bgTextRef} className="hero-bg-text absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden will-change-transform" style={{ zIndex: 1 }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontSize: product.name.length > 10 ? "clamp(50px, 10vw, 180px)" : product.name.length > 6 ? "clamp(60px, 15vw, 280px)" : "clamp(100px, 22vw, 400px)", textTransform: "uppercase", color: "rgba(255,255,255,0.08)", lineHeight: 0.85, whiteSpace: "nowrap", letterSpacing: 8 }}>{product.name}</span>
      </div>

      {/* PACKS — 3D tilt via perspective */}
      <div className="absolute inset-0 flex items-center justify-center" data-cursor-label="Explore" style={{ zIndex: 4, transformStyle: "preserve-3d" }}>
        {products.map((p, i) => (
          <div key={p.id} ref={(el) => { packRefs.current[i] = el; }}
            className="absolute will-change-transform md:translate-x-[5%] -translate-y-[15%] md:-translate-y-[2%]"
            style={{ maxWidth: 340, maxHeight: 480, width: "55vmin", height: "72vmin", visibility: i === 0 ? "visible" : "hidden", transformStyle: "preserve-3d" }}>
            <Image src={p.images.pack} alt={p.name} width={350} height={500}
              className="w-full h-full object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.3)]"
              priority={i < 3} loading="eager" />
          </div>
        ))}
        {/* Quick add button */}
        <button onClick={handleQuickAdd} className="absolute z-10 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 md:translate-x-[5%]"
          style={{ bottom: "18%", width: 36, height: 36, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(8px)" }}
          aria-label="Quick add to cart">
          <Plus size={16} strokeWidth={2} />
        </button>
        {/* Floor shadow */}
        <div className="absolute md:translate-x-[5%]" style={{ bottom: "8%", width: "30vmin", height: 20, background: "rgba(0,0,0,0.2)", borderRadius: "50%", filter: "blur(15px)", zIndex: -1 }} />
      </div>

      {/* LEFT (desktop) */}
      <div className="hero-left absolute z-10 hidden md:flex flex-col" style={{ left: 48, top: "50%", transform: "translateY(-50%)", maxWidth: 340 }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 3, opacity: 0.5, marginBottom: 8 }}>{product.subtitle}</p>
        <div className="flex items-center gap-3 mb-2">
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 42, fontWeight: 700, lineHeight: 1.05 }}>{product.name}</h1>
          {badge && <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)", whiteSpace: "nowrap" }}>{badge}</span>}
        </div>
        <div className="flex items-baseline gap-3" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && <span style={{ fontSize: 14, opacity: 0.4, textDecoration: "line-through" }}>{formatPrice(product.compareAtPrice)}</span>}
          <span style={{ fontSize: 11, opacity: 0.35, marginLeft: 4 }}>{product.weight}</span>
        </div>
        {pair && <p style={{ fontSize: 11, opacity: 0.35, marginBottom: 10 }}>Pairs with: {pair}</p>}
        <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.6, marginBottom: 20 }}>{product.description}</p>
        <button ref={shopBtnRef} onClick={handleShopNow} className="group relative overflow-hidden will-change-transform" style={{ border: "1.5px solid rgba(255,255,255,0.5)", background: "transparent", borderRadius: 30, padding: "12px 32px", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "white", alignSelf: "flex-start" }}>
          <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Shop now</span>
          <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          <span className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)", animation: "shimmer 3s infinite" }} />
        </button>
      </div>

      {/* MOBILE INFO */}
      <div className="absolute z-10 md:hidden left-0 right-0 bottom-0 px-5 pb-5 pt-20 text-center" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }}>
        <div className="hero-mobile-inner">
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, opacity: 0.6, marginBottom: 3 }}>{product.subtitle}</p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 700, lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>{product.name}</h1>
            {badge && <span style={{ fontSize: 8, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.15)", letterSpacing: 1, textTransform: "uppercase" }}>{badge}</span>}
          </div>
          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 700, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>{formatPrice(product.price)}</span>
            {product.compareAtPrice && <span style={{ fontSize: 13, opacity: 0.45, textDecoration: "line-through" }}>{formatPrice(product.compareAtPrice)}</span>}
          </div>
          <button onClick={handleShopNow} className="group relative overflow-hidden mx-auto" style={{ border: "1.5px solid rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)", borderRadius: 30, padding: "10px 34px", fontSize: 12, fontWeight: 500, color: "white" }}>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Shop now</span>
            <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {products.map((_, i) => (<button key={i} onClick={() => goTo(i, i > activeIndex ? 1 : -1)} className="rounded-full transition-all duration-300" style={{ width: i === activeIndex ? 18 : 5, height: 5, backgroundColor: i === activeIndex ? "white" : "rgba(255,255,255,0.3)" }} aria-label={`Product ${i + 1}`} />))}
          </div>
        </div>
      </div>

      {/* RIGHT (desktop) — gradient border on active thumb */}
      <div className="hero-right absolute z-10 hidden md:flex flex-col items-center" style={{ right: 48, top: "50%", transform: "translateY(-50%)" }}>
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => goTo(activeIndex - 1, -1)} className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.2)", animation: "arrowBounce 5s ease infinite" }}><ChevronLeft size={18} strokeWidth={1.5} /></button>
          <button onClick={() => goTo(activeIndex + 1, 1)} className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 40, height: 40, border: "1px solid rgba(255,255,255,0.2)", animation: "arrowBounce 5s ease 2.5s infinite" }}><ChevronRight size={18} strokeWidth={1.5} /></button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {visibleThumbs.map((p, i) => {
            const realIdx = thumbStart + i;
            const active = realIdx === activeIndex;
            return (
              <div key={p.id} className="rounded-xl p-[2px] transition-all duration-500" style={{ background: active ? "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2), rgba(255,255,255,0.8))" : "transparent" }}>
                <button onClick={() => goTo(realIdx, realIdx > activeIndex ? 1 : -1)} className="overflow-hidden flex items-center justify-center transition-all duration-300 rounded-[10px]"
                  style={{ width: 52, height: 52, background: active ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", opacity: active ? 1 : 0.5, padding: 4 }} title={p.name}>
                  <Image src={p.images.pack} alt={p.name} width={48} height={48} className="w-full h-full object-contain" />
                </button>
              </div>
            );
          })}
        </div>
        <span className="text-[10px] opacity-25 mt-3 tracking-wider">{activeIndex + 1} / {products.length}</span>
      </div>

      {/* BOTTOM PRICE (desktop) */}
      <div className="hero-bottom-price absolute z-10 hidden md:block" style={{ bottom: 48, left: "50%", transform: "translateX(-50%)" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 48, fontWeight: 700 }}><AnimatedPrice value={product.price} /></span>
      </div>

      {/* Testimonials ticker */}
      <div className="hero-ticker absolute z-10 hidden md:block left-0 right-0 overflow-hidden" style={{ bottom: 10, opacity: 0.15 }}>
        <div className="whitespace-nowrap" style={{ animation: "marquee 40s linear infinite", fontSize: 11, letterSpacing: 1 }}><span>{tickerText}</span><span className="ml-8">{tickerText}</span></div>
      </div>
    </div>
  );
}
