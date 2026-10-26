"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/content";
import { Button } from "./Button";
import { lenis } from "./SmoothScroll";

export function Nav() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menú abierto: scroll en pausa, Escape cierra y el foco vuelve al botón.
  useEffect(() => {
    if (!open) return;
    const button = toggle.current;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  return (
    <>
      <header
      style={{ viewTransitionName: "site-header" }}
      data-compact={compact || undefined}
      className="group/nav fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-500 ease-out data-[compact]:bg-ink/70 data-[compact]:shadow-[0_1px_0_var(--color-line)] data-[compact]:backdrop-blur-xl data-[compact]:backdrop-saturate-150"
    >
      <nav aria-label="Principal" className="wrap flex h-20 items-center justify-between transition-[height] duration-500 ease-out group-data-[compact]/nav:h-16">
        <Link href="/" aria-label="CIMARA, inicio" className="relative z-10 -m-2 rounded-md p-2">
          <Image src="/brand/cimara-horizontal.svg" alt="CIMARA" width={128} height={43} priority />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="rounded-full px-4 py-2 text-small text-text-2 transition-colors duration-200 hover:text-mist aria-[current=page]:text-mist"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="ml-3">
            <Button href="/contacto" size="sm">
              Hablemos
            </Button>
          </li>
        </ul>

        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="relative z-10 -mr-2 grid size-11 place-items-center rounded-full md:hidden"
        >
          <span aria-hidden className="relative block h-3 w-6">
            <span className={`absolute left-0 h-px w-6 bg-mist transition-all duration-500 ease-out ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 h-px w-6 bg-mist transition-all duration-500 ease-out ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>
    </header>

      {/* Menú móvil en CSS: siempre en el DOM, inerte y oculto cuando está cerrado. Entra de golpe de fondo y los enlaces suben escalonados. */}
      <div
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!open}
        data-open={open || undefined}
        className="group/menu invisible fixed inset-0 z-40 bg-ink opacity-0 transition-[opacity,visibility] delay-150 duration-300 ease-out data-[open]:visible data-[open]:opacity-100 data-[open]:delay-0 data-[open]:duration-[400ms] md:hidden"
      >
        <div className="wrap flex h-full flex-col justify-between pt-28 pb-10">
          <ul className="flex flex-col gap-2">
            {[...NAV, { href: "/contacto", label: "Contacto" }].map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <div
                  style={open ? { transitionDelay: `${80 + i * 50}ms` } : undefined}
                  className="translate-y-full transition-transform duration-300 ease-in group-data-[open]/menu:translate-y-0 group-data-[open]/menu:duration-[800ms] group-data-[open]/menu:ease-out"
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="block py-1 font-display text-h1 font-medium">
                    {item.label}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex translate-y-4 flex-col gap-6 opacity-0 transition-[opacity,translate] duration-200 group-data-[open]/menu:translate-y-0 group-data-[open]/menu:opacity-100 group-data-[open]/menu:delay-[350ms] group-data-[open]/menu:duration-[800ms] group-data-[open]/menu:ease-out">
            <Button href="/contacto" onClick={() => setOpen(false)} className="w-full">
              Agenda una consultoría
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
