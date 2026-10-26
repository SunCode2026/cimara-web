"use client";

import { useEffect } from "react";

/**
 * GSAP + ScrollTrigger bajo demanda: fuera del JavaScript inicial, se cargan tras la hidratación.
 * Todo lo que va ligado al scroll está por debajo del primer pantallazo, así que no se nota la espera.
 */
type Gsap = { gsap: typeof import("gsap").gsap; ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger };

let loading: Promise<Gsap> | null = null;
export function loadGsap(): Promise<Gsap> {
  loading ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return loading;
}

/** Ejecuta `setup` cuando GSAP está listo; su función de retorno limpia al desmontar. */
export function useGsap(setup: (g: Gsap) => (() => void) | void) {
  useEffect(() => {
    let dead = false;
    let cleanup: (() => void) | void;
    loadGsap().then((g) => {
      if (!dead) cleanup = setup(g);
    });
    return () => {
      dead = true;
      cleanup?.();
    };
    // `setup` se ejecuta una vez por montaje, como un efecto sin dependencias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
