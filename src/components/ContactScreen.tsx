"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Mail, MapPin, Globe, MessageCircle, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

export default function ContactScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".contact-el", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.2 });
  }, { scope: ref });

  return (
    <div ref={ref} className="w-full h-full relative flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)" }}>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ top: "20%", left: "50%", transform: "translateX(-50%)", background: "rgba(175, 68, 37, 0.06)", filter: "blur(120px)" }} />
      </div>

      <div className="relative z-10 text-center max-w-md">
        <p className="contact-el text-xs uppercase tracking-[4px] opacity-35 mb-4">Get in touch</p>
        <h2 className="contact-el mb-8" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1 }}>
          Let&apos;s Talk
        </h2>

        <a href="mailto:hello@sliceup.cy" className="contact-el flex items-center justify-center gap-3 mb-6 group">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Mail size={18} strokeWidth={1.2} className="opacity-60" />
          </div>
          <div className="text-left">
            <p className="text-lg group-hover:opacity-100 transition-opacity opacity-80">hello@sliceup.cy</p>
            <p className="text-xs opacity-30">Drop us a line</p>
          </div>
          <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-50 transition-opacity ml-1" />
        </a>

        <div className="contact-el flex items-center justify-center gap-3 mb-10 opacity-40">
          <MapPin size={16} strokeWidth={1.2} />
          <span className="text-sm">Limassol, Cyprus</span>
        </div>

        <div className="contact-el flex items-center justify-center gap-4 mb-10">
          <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <Globe size={16} strokeWidth={1.2} className="opacity-60" />
            <span className="text-sm opacity-60">Instagram</span>
          </a>
          <a href="#" className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <MessageCircle size={16} strokeWidth={1.2} className="opacity-60" />
            <span className="text-sm opacity-60">WhatsApp</span>
          </a>
        </div>

        <div className="contact-el">
          <a href="mailto:hello@sliceup.cy"
            className="inline-block group relative overflow-hidden"
            style={{ border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 30, padding: "12px 36px", fontSize: 13, fontWeight: 500, letterSpacing: 1 }}>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">Start a conversation</span>
            <span className="absolute inset-0 bg-white scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </div>

        <p className="contact-el mt-14 text-[11px] opacity-15 tracking-wider">
          &copy; 2026 SliceUp. Premium Dried Fruits. Limassol, Cyprus.
        </p>
      </div>
    </div>
  );
}
