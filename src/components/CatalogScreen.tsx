"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { products, formatPrice } from "@/data/products";
import type { Product } from "@/data/products";
import { useCartStore } from "@/stores/cartStore";

gsap.registerPlugin(useGSAP);

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "fruit", label: "Fruits" },
  { key: "citrus", label: "Citrus" },
  { key: "vegetable", label: "Veggies" },
  { key: "spice", label: "Spice" },
] as const;

export default function CatalogScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("all");
  const addItem = useCartStore((s) => s.addItem);

  const filtered = filter === "all" ? products : products.filter((p) => p.category === filter);

  useGSAP(() => {
    gsap.fromTo(".catalog-title", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.2 });
    gsap.fromTo(".catalog-filters", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.3 });
    gsap.fromTo(".catalog-card", { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: "power3.out", delay: 0.35 });
  }, { scope: ref });

  // Re-animate cards on filter change
  useGSAP(() => {
    gsap.fromTo(".catalog-card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.03, ease: "power2.out" });
  }, { scope: ref, dependencies: [filter], revertOnUpdate: true });

  return (
    <div ref={ref} className="w-full h-full relative flex flex-col items-center justify-center px-6 md:px-12"
      style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "10%", left: "60%", background: "rgba(200,120,50,0.04)", filter: "blur(120px)" }} />
      </div>
      <div className="relative z-10 w-full max-w-6xl">
        <h2 className="catalog-title text-center mb-6" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700 }}>
          Full Catalog
        </h2>

        {/* Category filters */}
        <div className="catalog-filters flex items-center justify-center gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((c) => (
            <button key={c.key} onClick={() => setFilter(c.key)}
              className="text-xs uppercase tracking-wider transition-all duration-300"
              style={{
                padding: "6px 16px", borderRadius: 20,
                background: filter === c.key ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.05)",
                color: filter === c.key ? "#111" : "rgba(255,255,255,0.5)",
                border: filter === c.key ? "none" : "1px solid rgba(255,255,255,0.08)",
                fontWeight: filter === c.key ? 600 : 400,
              }}>
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {filtered.map((p) => (
            <div key={p.id} className="catalog-card flex-shrink-0 snap-center rounded-2xl p-5 flex flex-col items-center group hover:border-white/15 transition-all duration-300"
              style={{ width: 200, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-32 h-40 mb-3 flex items-center justify-center group-hover:-translate-y-1.5 transition-transform duration-300">
                <Image src={p.images.pack} alt={p.name} width={128} height={160} className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.3)]" />
              </div>
              <p className="text-xs opacity-40 uppercase tracking-wider mb-1">{p.subtitle}</p>
              <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{p.name}</p>
              <p className="text-sm font-bold mb-3">{formatPrice(p.price)}</p>
              <button onClick={() => addItem(p)} className="text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 16px" }}>
                Add to cart
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] opacity-20 mt-4 tracking-wider">{filtered.length} products</p>
      </div>
    </div>
  );
}
