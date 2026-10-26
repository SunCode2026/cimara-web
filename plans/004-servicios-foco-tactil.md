# 004 — Iluminar las tarjetas de servicios con el scroll en táctil

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: MEDIUM
- **Category**: Accessibility (estados de hover en táctil) + Performance (`transition-all`)
- **Estimated scope**: 1 archivo (`src/components/sections/Services.tsx`), ~25 líneas

## Problem

1. Las tarjetas de servicios tienen en escritorio una luz cian que sigue al cursor, un borde cian y una flecha que gira. **Todo depende del hover**, así que en táctil las tarjetas son planas e inertes (el `hover:` de Tailwind v4 ya solo se activa con `@media (hover: hover)`).
2. La flecha anima con `transition-all`: cualquier propiedad que cambie se animaría fuera de la GPU.

```tsx
/* src/components/sections/Services.tsx:33-46 — current (clases relevantes) */
<Link
  href={`/servicios#${s.slug}`}
  onPointerMove={spotlight}
  className="group relative … transition-[border-color,background-color,scale] duration-300 ease-out active:scale-[0.99] active:duration-100 before:… before:bg-[radial-gradient(30rem_circle_at_var(--x,50%)_var(--y,0%),var(--color-cyan-soft),transparent_45%)] before:opacity-0 before:transition-opacity before:duration-500 hover:border-cyan-line hover:bg-surface-2 hover:before:opacity-100 focus-visible:border-cyan-line"
>
  …
  <span
    aria-hidden
    className="absolute top-7 right-7 grid size-9 place-items-center rounded-full text-text-3 shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-all duration-500 ease-out group-hover:-rotate-45 group-hover:text-mist"
  >
```

## Target

- **Solo en dispositivos sin hover** (`@media (hover: none)`): la tarjeta cuyo cuerpo ocupa la franja central de la pantalla (IntersectionObserver con `rootMargin: "-40% 0px -40% 0px"`) recibe `data-focus`. Mientras lo tiene, muestra el mismo estado que el hover de escritorio:
  - borde `border-cyan-line`,
  - fondo `bg-surface-2`,
  - luz cian visible (`before:opacity-100`), centrada arriba por el valor por defecto `--x: 50%`, `--y: 0%`,
  - flecha girada `-45deg` y en `text-mist`.
- Al salir de la franja, vuelve a reposo con las mismas transiciones (300 ms el borde y el fondo, 500 ms la luz y la flecha, `ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)`). Son transiciones CSS: si el usuario va y vuelve, el estado se reajusta desde donde esté, sin reiniciarse.
- Solo una tarjeta enfocada a la vez: la franja ocupa el 20 % central de la pantalla.
- La flecha deja de usar `transition-all`: pasa a `transition-[rotate,color]`. En Tailwind v4, `-rotate-45` usa la propiedad `rotate`.
- Escritorio sin cambios.

## Repo conventions to follow

- Variantes arbitrarias de media query en Tailwind v4: `[@media(hover:none)]:…`.
- Componente ya marcado como `"use client"` (línea 1); el resto de observadores del proyecto usan `IntersectionObserver` directamente (ejemplo: `src/components/ServiceIndex.tsx:9-19`).

## Steps

1. Línea 3: añade `import { useEffect, useRef } from "react";` (conserva el `import type { PointerEvent } from "react";`).
2. Al principio de `Services()`, antes del `return`, añade:
   ```tsx
   const cards = useRef<(HTMLAnchorElement | null)[]>([]);

   // Táctil: la tarjeta que cruza el centro de la pantalla se ilumina como con el hover de escritorio.
   useEffect(() => {
     if (!matchMedia("(hover: none)").matches) return;
     const io = new IntersectionObserver(
       (entries) => entries.forEach((e) => e.target.toggleAttribute("data-focus", e.isIntersecting)),
       { rootMargin: "-40% 0px -40% 0px" },
     );
     cards.current.forEach((el) => el && io.observe(el));
     return () => io.disconnect();
   }, []);
   ```
3. En el `<Link>`, añade `ref={(el) => { cards.current[i] = el; }}` y, al final de su `className`, añade:
   ```
   [@media(hover:none)]:data-[focus]:border-cyan-line [@media(hover:none)]:data-[focus]:bg-surface-2 [@media(hover:none)]:data-[focus]:before:opacity-100
   ```
4. En el `<span>` de la flecha, sustituye `transition-all` por `transition-[rotate,color]` y añade al final de su `className`:
   ```
   [@media(hover:none)]:group-data-[focus]:-rotate-45 [@media(hover:none)]:group-data-[focus]:text-mist
   ```

## Boundaries

- Do NOT change the desktop hover behaviour, the `spotlight` handler or card layout.
- Do NOT add scroll listeners; use only the IntersectionObserver above.
- Do NOT add dependencies.
- If the quoted code doesn't match, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src` y `npx next build` sin errores.
- **Feel check** (móvil real o DevTools 390×844 con «touch» activado, que hace que `(hover: none)` coincida):
  - Al bajar por Servicios, cada tarjeta se ilumina (borde y luz cian arriba, flecha girada) cuando pasa por el centro y se apaga al salir. Nunca hay dos encendidas a la vez.
  - Subiendo y bajando rápido, las transiciones se reajustan suavemente, sin parpadeos ni reinicios desde cero.
  - En DevTools → Animations al 10 %: la flecha solo anima `rotate` y `color`.
  - En escritorio con ratón: sin `data-focus` (inspecciona el DOM); el hover funciona como antes.
  - Con `prefers-reduced-motion: reduce`, el cambio de estado es instantáneo pero visible.
- **Done when**: en táctil la tarjeta central de Servicios se ilumina con el scroll, y la flecha ya no usa `transition-all`.
