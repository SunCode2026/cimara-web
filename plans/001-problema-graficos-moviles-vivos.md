# 001 — Dar vida a los gráficos de «El problema» en móvil

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: HIGH
- **Category**: Missed opportunities (paridad móvil con escritorio)
- **Estimated scope**: 1 archivo, ~10 líneas

## Problem

En escritorio, un único gráfico fijo de 45 puntos pasa de la cima del logo (orden) a tres estados de caos (bucle, islas, cola) a medida que el usuario lee cada problema. Es la pieza que explica visualmente «tu empresa tiene los datos, le falta orden».

En móvil (< 1024 px) ese gráfico está oculto y cada paso muestra un minigráfico **fijo**, ya desordenado, que nunca cambia. Los estilos de «paso activo» (número en cian, texto encendido) llevan prefijo `lg:`, así que en móvil no existen. Sin embargo, el `ScrollTrigger` que calcula `active` **ya se ejecuta en móvil**: el dato está, solo falta usarlo.

```tsx
/* src/components/sections/Problem.tsx:119-126 — current */
<div className="mb-8 aspect-square w-40 lg:hidden">
  <Viz state={i + 1} />
</div>
<p className="label transition-colors duration-500 lg:group-data-[active]:text-cyan">0{i + 1}</p>
<h3 className="mt-4 text-h2 transition-colors duration-500 lg:text-text-3 lg:group-data-[active]:text-mist">{p.title}</h3>
<p className="mt-4 max-w-[28rem] text-text-2 transition-colors duration-500 lg:text-text-3 lg:group-data-[active]:text-text-2">
```

`active` vale 0 antes del primer paso y `i + 1` cuando el paso `i` cruza la franja central (`start: "top 60%"`, `end: "bottom 40%"`, líneas 76-87). `STATES[0]` es la cima del logo.

## Target

- Cada minigráfico móvil empieza mostrando **la cima** (`state 0`, con su punto cian) y, cuando su paso se activa (`active >= i + 1`), se **desordena** hacia su estado (`i + 1`). Si el usuario vuelve hacia arriba por encima del paso, el gráfico **se reordena** en cima. Es reversible: orden ↔ caos.
- Los estilos de paso activo funcionan en todos los tamaños.
- El movimiento lo hacen las transiciones CSS que ya tiene `Viz` (líneas 55-66): `transition-[cx,cy,r,fill,opacity] duration-[1200ms] ease-out` con retardo `(i % 15) * 12ms`. En este proyecto `ease-out` es el token de marca `cubic-bezier(0.16, 1, 0.3, 1)`, definido en `src/app/globals.css:54` dentro de `@theme`. No hay que cambiar curvas ni duraciones.

```tsx
/* target — src/components/sections/Problem.tsx */
<div className="mb-8 aspect-square w-40 lg:hidden">
  <Viz state={active >= i + 1 ? i + 1 : 0} />
</div>
<p className="label transition-colors duration-500 group-data-[active]:text-cyan">0{i + 1}</p>
<h3 className="mt-4 text-h2 text-text-3 transition-colors duration-500 group-data-[active]:text-mist">{p.title}</h3>
<p className="mt-4 max-w-[28rem] text-text-3 transition-colors duration-500 group-data-[active]:text-text-2">
```

`text-text-3` (#86868B) tiene un contraste de 5,5:1 sobre el negro y cumple AA.

## Repo conventions to follow

- Variantes de estado con `data-*` y `group-data-[…]` de Tailwind v4 (ver el propio `<li data-active=…>` en la línea 116).
- Animación de geometría SVG mediante propiedades CSS y transiciones, no Motion (ver `Viz`, líneas 51-70).

## Steps

1. `src/components/sections/Problem.tsx`, línea 120: cambia `<Viz state={i + 1} />` por `<Viz state={active >= i + 1 ? i + 1 : 0} />`.
2. Línea 122: en el `<p className="label …">`, sustituye `lg:group-data-[active]:text-cyan` por `group-data-[active]:text-cyan`.
3. Línea 123: en el `<h3>`, sustituye `lg:text-text-3 lg:group-data-[active]:text-mist` por `text-text-3 group-data-[active]:text-mist`.
4. Línea 124: en el `<p>` de texto, sustituye `text-text-2 … lg:text-text-3 lg:group-data-[active]:text-text-2` por `text-text-3 … group-data-[active]:text-text-2` y conserva el resto de clases (`mt-4 max-w-[28rem] transition-colors duration-500`).

## Boundaries

- Do NOT touch the desktop sticky `Viz` (líneas 101-107) ni las posiciones de `SUMMIT`, `LOOP`, `ISLANDS` y `QUEUE`.
- Do NOT change the ScrollTrigger config (líneas 76-87).
- Do NOT add dependencies.
- If the lines quoted above don't match the file, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit` y `npx eslint src` sin errores; `npx next build` termina con «Generating static pages».
- **Feel check** (móvil real o DevTools a 390×844 con «touch»):
  - Al llegar al paso 01, el minigráfico, que era la cima con su punto cian, se convierte en el círculo; los puntos se mueven escalonados, no todos a la vez.
  - El número 01 pasa a cian y el título a blanco a la vez.
  - Al hacer scroll hacia arriba por encima del paso, los puntos vuelven a formar la cima, sin saltos ni reinicios.
  - En DevTools → Animations al 10 %, los puntos parten de su posición actual si inviertes el scroll a mitad del movimiento.
  - Con `prefers-reduced-motion: reduce` (DevTools → Rendering), el cambio es casi instantáneo (la regla global deja las transiciones en 1 ms) y el estado final es correcto.
  - En escritorio (≥ 1024 px) nada cambia respecto a antes, salvo que el texto de los pasos inactivos usa `text-text-3`, igual que ya hacía en `lg`.
- **Done when**: en móvil cada minigráfico muestra la cima hasta que su paso se activa y se transforma en su estado al activarse.
