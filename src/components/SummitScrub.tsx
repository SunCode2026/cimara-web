"use client";

import { useRef, useState } from "react";
import { useGsap } from "@/lib/gsap";
import { SummitMark } from "./SummitMark";

/** El símbolo se enciende nivel a nivel mientras entra en pantalla. Con movimiento reducido, encendido del todo. */
export function SummitScrub({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useGsap(({ gsap, ScrollTrigger }) => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 80%",
        end: "center 45%",
        onUpdate: (self) => setLit(Math.round(self.progress * 8)),
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => setLit(8));
    return () => mm.revert();
  });

  return (
    <div ref={ref} className={className}>
      <SummitMark lit={lit} className="w-full" />
    </div>
  );
}
