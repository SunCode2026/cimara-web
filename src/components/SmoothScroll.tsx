"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { loadGsap } from "@/lib/gsap";

/** Instancia activa, para pausar el scroll (menú móvil). Null con movimiento reducido. */
export let lenis: Lenis | null = null;

/** Scroll suave con su propio reloj; cuando GSAP llega, ScrollTrigger se sincroniza con cada desplazamiento. */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({ lerp: 0.1, autoRaf: true, anchors: { offset: -64 } });
    lenis = instance;
    loadGsap().then(({ ScrollTrigger }) => instance.on("scroll", ScrollTrigger.update));
    return () => {
      instance.destroy();
      lenis = null;
    };
  }, []);

  // Al cambiar de página: arriba del todo (salvo ancla) y recalcular los disparadores de scroll.
  const pathname = usePathname();
  useEffect(() => {
    if (!location.hash) lenis?.scrollTo(0, { immediate: true, force: true });
    loadGsap().then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }, [pathname]);
  return null;
}
