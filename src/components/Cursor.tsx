"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const INTERACTIVE = "a, button, [role='tab'], [role='switch'], label, summary";
const TEXT = "input, textarea, select, [contenteditable='true']";
// Anillo: muelle crítico, un poco más lento que el punto para dar sensación de peso.
const RING = { stiffness: 380, damping: 39 };
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const media = {
  subscribe(cb: () => void) {
    const mq = matchMedia(QUERY);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  },
  get: () => matchMedia(QUERY).matches,
  server: () => false,
};

/**
 * Cursor discreto para escritorio: un punto que va exactamente con el ratón y un anillo que lo sigue.
 * Sobre enlaces y botones el anillo crece; en campos de texto desaparece y vuelve el cursor de texto nativo.
 * Solo con ratón fino y sin movimiento reducido; en el resto de casos, cursor del sistema.
 */
export function Cursor() {
  const enabled = useSyncExternalStore(media.subscribe, media.get, media.server);
  const [state, setState] = useState<"idle" | "hover" | "text" | "hidden">("hidden");
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, RING);
  const ry = useSpring(y, RING);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    let seen = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      // Primera aparición: el anillo nace en el puntero, no vuela desde la esquina.
      if (!seen) {
        rx.jump(e.clientX);
        ry.jump(e.clientY);
        seen = true;
      }
      const t = e.target as Element | null;
      setState(t?.closest(TEXT) ? "text" : t?.closest(INTERACTIVE) ? "hover" : "idle");
    };
    const leave = () => setState("hidden");
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y, rx, ry]);

  if (!enabled) return null;
  const visible = state !== "hidden" && state !== "text";
  const hover = state === "hover";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference">
      <motion.div
        style={{ x: rx, y: ry }}
        animate={{ scale: hover ? (down ? 1.15 : 1.35) : down ? 0.8 : 1, opacity: visible ? (hover ? 0.7 : 0.5) : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.35 }}
        className="absolute -top-4 -left-4 size-8 rounded-full border border-mist"
      />
      <motion.div
        style={{ x, y }}
        animate={{ scale: hover ? 0 : down ? 0.6 : 1, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.25 }}
        className="absolute -top-[3px] -left-[3px] size-1.5 rounded-full bg-mist"
      />
    </div>
  );
}
