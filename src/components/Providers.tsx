"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";

// Fuera del camino crítico: se cargan tras la hidratación inicial.
const Cursor = dynamic(() => import("./Cursor").then((m) => m.Cursor), { ssr: false });
const CookieBanner = dynamic(() => import("./CookieBanner").then((m) => m.CookieBanner), { ssr: false });

/** Piezas globales de cliente: scroll suave y, cargados después, cursor y aviso de cookies. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      {children}
      <CookieBanner />
    </>
  );
}
