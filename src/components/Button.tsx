"use client";

import Link from "next/link";
import type { ComponentProps, PointerEvent, ReactNode } from "react";

const PULL = 0.25; // fracción del desplazamiento del cursor que sigue el botón

const base =
  "group relative inline-flex select-none items-center justify-center gap-3 whitespace-nowrap rounded-full font-medium " +
  "transition-[background-color,box-shadow,color,scale] duration-200 ease-out active:scale-[0.97] active:duration-100";

const variants = {
  primary: "bg-mist text-ink hover:bg-[#fff]",
  ghost: "text-mist shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:bg-surface-2",
};
const sizes = { md: "h-13 px-6 text-body", sm: "h-10 px-4 text-small" };

type Props = {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

// Imán en CSS (clase .magnet): la transición siempre arranca del valor actual, así que se puede interrumpir.
function move(e: PointerEvent<HTMLSpanElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${(e.clientX - r.left - r.width / 2) * PULL}px`);
  el.style.setProperty("--my", `${(e.clientY - r.top - r.height / 2) * PULL}px`);
}
function leave(e: PointerEvent<HTMLSpanElement>) {
  e.currentTarget.style.removeProperty("--mx");
  e.currentTarget.style.removeProperty("--my");
}

export function Button({ href, children, variant = "primary", size = "md", className = "", ...rest }: Props) {
  // El envoltorio se desplaza (imán); el enlace conserva el foco y el estado activo.
  return (
    <span onPointerMove={move} onPointerLeave={leave} className={`magnet inline-flex ${className}`}>
      <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} w-full`} {...rest}>
        {variant === "primary" && (
          <span
            aria-hidden
            className="size-2 rounded-full bg-cyan transition-shadow duration-300 ease-out group-hover:shadow-[0_0_14px_3px_rgb(47_211_245/0.6)]"
          />
        )}
        {children}
      </Link>
    </span>
  );
}
