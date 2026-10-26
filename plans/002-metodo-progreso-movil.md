# 002 — Encender la cima paso a paso en «Método» en móvil

- **Status**: DONE
- **Commit**: 8540bff
- **Severity**: HIGH
- **Category**: Missed opportunities (paridad móvil con escritorio)
- **Estimated scope**: 2 archivos, ~35 líneas

## Problem

En escritorio, «Método» es una sección fijada con scroll horizontal: cada paso enciende dos niveles de la cima y el 04 ilumina la cima en cian. Es la metáfora de marca hecha progreso: los datos suben hasta la decisión.

En móvil esa lógica está desactivada (solo existe en `min-width: 1024px`). Las cuatro tarjetas se apilan con sus minicimas **ya encendidas desde el principio** y los números en gris permanente. No hay progreso que invite a seguir bajando.

```tsx
/* src/components/sections/Method.tsx:17-20 — current */
useGsap(({ gsap }) => {
  const mm = gsap.matchMedia();
  // Escritorio: sección fijada y pasos en horizontal, vinculados al scroll.
  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
```

```tsx
/* src/components/sections/Method.tsx:62-71 — current */
<li
  key={m.title}
  data-active={i <= step || undefined}
  className="group flex shrink-0 flex-col rounded-lg border border-line bg-surface-1 p-8 lg:min-h-[26rem] lg:w-[min(30rem,38vw)] lg:p-10"
>
  <div className="flex items-start justify-between">
    <span className="font-display text-display text-text-3 transition-colors duration-700 lg:group-data-[active]:text-mist">
      0{i + 1}
    </span>
    <SummitMark lit={litFor(i)} className="w-16 lg:hidden" />
```

`SummitMark` (`src/components/SummitMark.tsx:20-33`) cambia la opacidad y el color de cada punto con `transition-[opacity,fill] duration-700 ease-out`, todos a la vez.

## Target

- En móvil (< 1024 px, sin movimiento reducido), cada tarjeta queda **apagada** (`lit = 0`, número en `text-text-3`) hasta que su centro cruza el 65 % de la altura de la pantalla. Entonces se **enciende**: su minicima sube **nivel a nivel desde la base** (cascada) hasta `litFor(i)` y el número pasa a `text-mist`. La tarjeta 04 termina con la cima en cian y su halo.
- Al volver hacia arriba por encima de una tarjeta, esta se apaga.
- Cascada: cada nivel se retrasa `(8 − nivel) × 60 ms`, y la cima `540 ms`. Duración por punto: `700ms`, curva `ease-out` (token de marca `cubic-bezier(0.16, 1, 0.3, 1)`).
- Con movimiento reducido: todas las tarjetas encendidas desde el principio, como ahora.
- La cascada es opcional (prop `cascade`) para no ralentizar los otros usos de `SummitMark` ligados al scroll (`SummitScrub` en Sobre CIMARA, columna de escritorio de Método).

## Repo conventions to follow

- GSAP solo a través de `useGsap` (`src/lib/gsap.ts`) y `gsap.matchMedia()`, como en `Method.tsx:17-38`.
- Estado de activación con `data-*` + `group-data-[…]`.

## Steps

1. `src/components/SummitMark.tsx`: añade la prop `cascade?: boolean` (por defecto `false`):
   ```tsx
   export function SummitMark({ lit, className = "", cascade = false }: { lit: number; className?: string; cascade?: boolean }) {
   ```
   En el `<circle>` de cada punto (líneas 23-31), añade:
   ```tsx
   style={cascade ? { transitionDelay: `${d.cima ? 540 : (SUMMIT.levels - d.level) * 60}ms` } : undefined}
   ```
   Al `<circle>` del halo (línea 19), añade `style={cascade ? { transitionDelay: "540ms" } : undefined}`.
2. `src/components/sections/Method.tsx`: debajo de `const [step, setStep] = useState(0);` añade:
   ```tsx
   const [mobileStep, setMobileStep] = useState(-1); // móvil: último paso alcanzado; -1 = ninguno
   const cards = useRef<(HTMLLIElement | null)[]>([]);
   ```
3. Dentro del callback de `useGsap`, después del bloque `mm.add("(min-width: 1024px) …", …)` y antes de `return () => mm.revert();`, añade:
   ```tsx
   // Móvil: cada tarjeta se enciende al cruzar el 65 % de la pantalla y se apaga al volver.
   mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
     cards.current.forEach((el, i) =>
       ScrollTrigger.create({
         trigger: el,
         start: "center 65%",
         onEnter: () => setMobileStep((s) => Math.max(s, i)),
         onLeaveBack: () => setMobileStep(i - 1),
       }),
     );
   });
   mm.add("(max-width: 1023px) and (prefers-reduced-motion: reduce)", () => setMobileStep(METHOD.length - 1));
   ```
   Cambia la firma del callback de `useGsap(({ gsap }) => {` a `useGsap(({ gsap, ScrollTrigger }) => {`.
4. En el `<li>` de cada paso, añade `ref={(el) => { cards.current[i] = el; }}` y `data-seen={i <= mobileStep || undefined}`.
5. En el `<span>` del número, añade la clase `max-lg:group-data-[seen]:text-mist` (sin quitar `lg:group-data-[active]:text-mist`).
6. Sustituye `<SummitMark lit={litFor(i)} className="w-16 lg:hidden" />` por:
   ```tsx
   <SummitMark lit={i <= mobileStep ? litFor(i) : 0} cascade className="w-16 lg:hidden" />
   ```

## Boundaries

- Do NOT touch the desktop pinned/horizontal timeline (el bloque `min-width: 1024px`) ni la columna izquierda de escritorio.
- Do NOT pass `cascade` to any other `SummitMark` usage (`SummitScrub`, `CtaBand`, `contacto/page.tsx`, `not-found.tsx`, la columna de escritorio de Método).
- Do NOT add dependencies.
- If the quoted code doesn't match, STOP and report.

## Verification

- **Mechanical**: `npx tsc --noEmit`, `npx eslint src` y `npx next build` sin errores.
- **Feel check** (móvil real o DevTools a 390×844):
  - Al bajar, la tarjeta 01 llega apagada (cima gris tenue, número gris). Cuando su centro pasa algo por debajo de la mitad de la pantalla, los dos niveles de la base se encienden y el número pasa a blanco.
  - En la tarjeta 02 se encienden cuatro niveles, y se ve la cascada de abajo arriba.
  - En la tarjeta 04, los ocho niveles suben en cascada y al final la cima se enciende en cian con su halo (unos 540 ms después del primer nivel).
  - Al subir de nuevo, la tarjeta que dejas por debajo se apaga.
  - En DevTools → Animations al 10 %: los niveles se encienden de la base a la cima, nunca todos a la vez.
  - Con `prefers-reduced-motion: reduce`, las cuatro tarjetas aparecen encendidas y sin cascada perceptible.
  - En escritorio (≥ 1024 px), la sección fijada horizontal funciona exactamente igual que antes.
- **Done when**: en móvil cada tarjeta de Método se enciende en cascada al llegar a ella y se apaga al dejarla atrás hacia arriba.
