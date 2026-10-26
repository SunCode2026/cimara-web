"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/gsap";

const TEXT = "No vendemos inteligencia artificial. Vendemos tiempo, procesos que funcionan y resultados que se pueden medir";

/** La frase se enciende palabra a palabra mientras la sección está fijada. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGsap(({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        root.current!.querySelectorAll("[data-word]"),
        { opacity: 0.36 }, // mínimo con contraste 3:1 (texto grande, AA) sobre el negro
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  });

  return (
    <section ref={root} aria-label="Manifiesto" className="relative motion-safe:h-[240svh]">
      <div className="sticky top-0 flex min-h-svh items-center">
        <p className="wrap text-display">
          {TEXT.split(" ").map((word, i, all) => (
            <span key={i}>
              <span data-word className="inline-block">
                {word}
                {i === all.length - 1 && <span className="cima-dot">.</span>}
              </span>{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
