# 005 — Salida del menú móvil con ease-out, más rápida

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: MEDIUM
- **Category**: Easing & duration
- **Estimated scope**: 1 archivo (`src/components/Nav.tsx`), 3 líneas

## Problem

Al cerrar el menú móvil, los enlaces bajan con `ease-in` durante 300 ms. `ease-in` empieza lento: retrasa justo el momento que el usuario está mirando y hace que el cierre se sienta perezoso. Además, el fondo espera 150 ms antes de empezar a desvanecerse, y el botón inferior sale con la curva por defecto de Tailwind, distinta de la de la marca. En total, el cierre tarda unos 450 ms.

```tsx
/* src/components/Nav.tsx:96 — current (overlay) */
className="group/menu invisible fixed inset-0 z-40 bg-ink opacity-0 transition-[opacity,visibility] delay-150 duration-300 ease-out data-[open]:visible data-[open]:opacity-100 data-[open]:delay-0 data-[open]:duration-[400ms] md:hidden"
```
```tsx
/* src/components/Nav.tsx:104 — current (cada enlace) */
className="translate-y-full transition-transform duration-300 ease-in group-data-[open]/menu:translate-y-0 group-data-[open]/menu:duration-[800ms] group-data-[open]/menu:ease-out"
```
```tsx
/* src/components/Nav.tsx:113 — current (botón inferior) */
className="flex translate-y-4 flex-col gap-6 opacity-0 transition-[opacity,translate] duration-200 group-data-[open]/menu:translate-y-0 group-data-[open]/menu:opacity-100 group-data-[open]/menu:delay-[350ms] group-data-[open]/menu:duration-[800ms] group-data-[open]/menu:ease-out"
```

Nota: en este proyecto `ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)` y `ease-in` = `cubic-bezier(0.7, 0, 0.84, 0)` (tokens `@theme` en `src/app/globals.css:54-56`).

## Target

Asimétrico: la apertura se queda como está (entrada deliberada y escalonada, 800 ms); el **cierre responde rápido**.

- Enlaces al cerrar: `duration-200 ease-out` (antes `duration-300 ease-in`).
- Fondo al cerrar: `delay-100 duration-200 ease-out` (antes `delay-150 duration-300`). El cierre completo pasa de unos 450 ms a 300 ms.
- Botón inferior al cerrar: `duration-200 ease-out` (añadir `ease-out`).
- Siguen siendo transiciones CSS: abrir y cerrar rápido varias veces se reajusta desde el estado actual.

## Repo conventions to follow

- Clases base = estado cerrado; variantes `group-data-[open]/menu:` y `data-[open]:` = estado abierto (ver las propias líneas citadas).

## Steps

1. Línea 96: sustituye `delay-150 duration-300 ease-out` por `delay-100 duration-200 ease-out`. Deja intactas las variantes `data-[open]:…`.
2. Línea 104: sustituye `duration-300 ease-in` por `duration-200 ease-out`. Deja intactas las variantes `group-data-[open]/menu:…`.
3. Línea 113: después de `duration-200` (la clase base, no la de la variante), añade `ease-out`.

## Boundaries

- Do NOT change the opening timings (`data-[open]`/`group-data-[open]` variants), the stagger delays, the markup or the focus/escape logic.
- Do NOT add dependencies.
- If the quoted code doesn't match, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src` y `npx next build` sin errores.
- **Feel check** (móvil real o DevTools a 390×844):
  - Abrir: igual que antes, con los enlaces subiendo escalonados.
  - Cerrar (botón X, tocar un enlace o Escape): los enlaces desaparecen hacia abajo de inmediato, sin el arranque lento, y el fondo se va justo detrás. Se siente ágil.
  - Abre y cierra rápido varias veces: nunca se reinicia desde cero.
  - En DevTools → Animations al 10 %: en el cierre, el desplazamiento de los enlaces es rápido al principio y frena al final (ease-out).
- **Done when**: el cierre del menú móvil usa `ease-out` en todos sus elementos y termina en unos 300 ms.
