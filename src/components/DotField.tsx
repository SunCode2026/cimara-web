"use client";

import { useEffect, useRef } from "react";
import { SUMMIT, summitDots } from "@/lib/summit";

/**
 * Campo de puntos en canvas 2D. Los datos dispersos (el campo) se ordenan y
 * 45 de ellos suben a formar la cima exacta del símbolo. Reacciona al cursor.
 * El bucle solo corre mientras algo se mueve y el canvas está en pantalla.
 */

export type Anchor = { cx: number; top: number; scale: number };

type Props = {
  /** Dónde y a qué escala se dibuja la cima, según el tamaño del canvas (px CSS). */
  anchor: (w: number, h: number) => Anchor;
  /** "load": se ensambla al montar. "view": al entrar en pantalla. */
  trigger?: "load" | "view";
  /** Separación media del campo en px; en pantallas táctiles se abre un 30 %. */
  spacing?: number;
  className?: string;
};

type Dot = {
  fx: number; fy: number; fr: number; fa: number; // estado disperso
  tx: number; ty: number; tr: number; // estado en la cima (solo los de la cima)
  summit: boolean; cima: boolean; delay: number;
  ox: number; oy: number; vx: number; vy: number; // desplazamiento por el cursor (muelle)
  glow: number; // brillo extra cerca del cursor
};

const DURATION = 1400;
const REPEL_R = 140;
const REPEL_PX = 26;
const K = 0.08; // rigidez del muelle
const FRICTION = 0.45; // ≈ amortiguamiento crítico con K: vuelve sin rebote
const MIST = "245,245,247";
const CYAN = "47,211,245";

const easeOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function DotField({ anchor, trigger = "load", spacing = 30, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef(anchor);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(pointer: coarse)").matches;
    const interactive = !reduce && !touch;

    let w = 0, h = 0, dpr = 1;
    let dots: Dot[] = [];
    let summitAt: Anchor = { cx: 0, top: 0, scale: 1 };
    let start = -1; // inicio del ensamblado; -1 = aún no
    let raf = 0;
    let visible = true;
    const mouse = { x: -9999, y: -9999 };

    function build() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      summitAt = anchorRef.current(w, h);

      // Retícula triangular con ruido: la misma geometría del símbolo, desordenada.
      const s = touch ? spacing * 1.3 : spacing;
      const row = s * 0.866;
      dots = [];
      for (let y = row / 2, j = 0; y < h; y += row, j++) {
        for (let x = (j % 2 ? s / 2 : 0) + s / 4; x < w; x += s) {
          dots.push({
            fx: x + rand(-0.4, 0.4) * s, fy: y + rand(-0.4, 0.4) * s,
            fr: rand(0.6, 1.5), fa: rand(0.1, 0.32),
            tx: 0, ty: 0, tr: 0, summit: false, cima: false, delay: 0,
            ox: 0, oy: 0, vx: 0, vy: 0, glow: 0,
          });
        }
      }

      // Cada punto de la cima sale de un punto del campo cercano: el orden emerge del ruido.
      const { cx, top, scale } = summitAt;
      const reach = Math.max(w, h) * 0.45;
      const free = dots.filter((d) => Math.hypot(d.fx - cx, d.fy - (top + SUMMIT.height * scale * 0.5)) < reach);
      for (const t of summitDots()) {
        const d = free.splice(Math.floor(Math.random() * free.length), 1)[0];
        if (!d) break;
        d.summit = true;
        d.cima = t.cima;
        d.tx = cx + t.x * scale;
        d.ty = top + t.y * scale;
        d.tr = t.r * scale;
        // De la base a la cima: los datos suben. La cima llega la última.
        d.delay = t.cima ? 220 + 9 * 80 + 200 : 220 + (SUMMIT.levels - t.level) * 80 + rand(0, 120);
      }
    }

    function progress(d: Dot, now: number) {
      if (reduce) return start < 0 ? 0 : 1;
      if (start < 0) return 0;
      return easeOut(Math.max(0, Math.min(1, (now - start - d.delay) / DURATION)));
    }

    function frame(now: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      let moving = start >= 0 && now - start < DURATION + 1400;
      const assembled = start < 0 ? 0 : easeOut(Math.min(1, (now - start) / (DURATION + 800)));

      let cima: { x: number; y: number; r: number; p: number } | null = null;
      for (const d of dots) {
        const p = d.summit ? progress(d, now) : 0;
        const bx = d.summit ? d.fx + (d.tx - d.fx) * p : d.fx;
        const by = d.summit ? d.fy + (d.ty - d.fy) * p : d.fy;

        if (interactive) {
          let gx = 0, gy = 0, g = 0;
          const dx = bx - mouse.x, dy = by - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_R && dist > 0.001) {
            const f = (1 - dist / REPEL_R) ** 2;
            const push = REPEL_PX * f * (d.summit ? 0.3 * p + (1 - p) : 1);
            gx = (dx / dist) * push; gy = (dy / dist) * push; g = f;
          }
          d.vx = (d.vx + (gx - d.ox) * K) * FRICTION;
          d.vy = (d.vy + (gy - d.oy) * K) * FRICTION;
          d.ox += d.vx; d.oy += d.vy;
          d.glow += (g - d.glow) * 0.15;
          if (Math.abs(d.vx) + Math.abs(d.vy) > 0.01 || Math.abs(d.glow - g) > 0.005) moving = true;
        }

        const x = bx + d.ox, y = by + d.oy;
        const r = d.summit ? d.fr + (d.tr - d.fr) * p : d.fr;
        // El ruido se retira un poco cuando aparece la cima.
        const a = d.summit ? d.fa + (1 - d.fa) * p : d.fa * (1 - assembled * 0.35);
        if (d.cima) { cima = { x, y, r, p }; continue; }
        ctx.globalAlpha = Math.min(1, a + d.glow * 0.55);
        ctx.fillStyle = `rgb(${MIST})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (cima) {
        // La cima pasa de dato gris a punto de luz cian al llegar, con el halo del logotipo.
        const { x, y, r, p } = cima;
        const light = Math.max(0, (p - 0.75) / 0.25);
        if (light > 0) {
          const gr = SUMMIT.glow * summitAt.scale;
          const grad = ctx.createRadialGradient(x, y, 0, x, y, gr);
          grad.addColorStop(0, `rgba(${CYAN},${0.55 * light})`);
          grad.addColorStop(1, `rgba(${CYAN},0)`);
          ctx.globalAlpha = 1;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(x, y, gr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = Math.max(0.3, p);
        ctx.fillStyle = light > 0.5 ? `rgb(${CYAN})` : `rgb(${MIST})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = moving && visible ? requestAnimationFrame(frame) : 0;
    }

    const wake = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
    const begin = () => { if (start < 0) { start = performance.now(); wake(); } };

    build();
    frame(performance.now());

    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      if (Math.abs(r.width - w) < 1 && Math.abs(r.height - h) < 60) return; // ignora la barra del navegador móvil
      const done = start >= 0;
      build();
      if (done) start = performance.now() - 10000; // ya ensamblada: redibuja en su sitio
      frame(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        if (trigger === "view" && e.intersectionRatio > 0.35) begin();
        wake();
      }
    }, { threshold: [0, 0.35] });
    io.observe(canvas);

    // El ensamblado inicial arranca tras el primer pintado, para no competir con el LCP.
    let idle = 0;
    if (trigger === "load") idle = window.setTimeout(begin, 250);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      wake();
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; wake(); };
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [trigger, spacing]);

  return <canvas ref={canvasRef} aria-hidden className={`pointer-events-none absolute inset-0 size-full ${className}`} />;
}

/** Ajusta la cima dentro de un elemento de referencia (posicionado respecto al contenedor del canvas). */
export function anchorIn(slot: HTMLElement | null, w: number, h: number): Anchor {
  if (!slot) return { cx: w / 2, top: h * 0.2, scale: 2 };
  const box = { x: slot.offsetLeft, y: slot.offsetTop, w: slot.offsetWidth, h: slot.offsetHeight };
  const scale = Math.min(box.w / 100, box.h / 86.6);
  return { cx: box.x + box.w / 2, top: box.y + (box.h - 86.6 * scale) / 2, scale };
}
