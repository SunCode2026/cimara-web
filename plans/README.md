# Planes de animación · versión móvil

Auditoría del movimiento en móvil (commit `8540bff`). Objetivo: que la versión móvil tenga el mismo nivel narrativo que la de escritorio. Las tres piezas que cuentan la historia (hero, «El problema» y «Método») estaban estáticas en táctil, y las tarjetas dependían del hover.

| # | Plan | Severidad | Estado |
|---|---|---|---|
| 001 | [Dar vida a los gráficos de «El problema» en móvil](001-problema-graficos-moviles-vivos.md) | HIGH | DONE |
| 002 | [Encender la cima paso a paso en «Método» en móvil](002-metodo-progreso-movil.md) | HIGH | DONE |
| 003 | [Que el campo de puntos responda al dedo y al scroll](003-hero-tactil-vivo.md) | HIGH | DONE |
| 004 | [Iluminar las tarjetas de servicios con el scroll en táctil](004-servicios-foco-tactil.md) (incluye quitar `transition-all` de la flecha) | MEDIUM | DONE |
| 005 | [Salida del menú móvil con ease-out, más rápida](005-menu-movil-salida.md) | MEDIUM | DONE |
| 006 | [En móvil, ensamblar la cima del CTA final con el scroll](006-cta-cima-ligada-al-scroll.md) | LOW (oportunidad) | DONE |
| 007 | [Escalonar los puntos de «Para quién»](007-para-quien-escalonado.md) | LOW (oportunidad) | DONE |
| 008 | [Respuesta háptica al enviar el formulario con éxito](008-formulario-haptica-exito.md) | LOW (oportunidad) | DONE |

## Orden recomendado

1. **001** y **002**: el mayor impacto narrativo con poco código. Son independientes entre sí.
2. **003**: el hero vivo al tacto. Necesita probarse en un móvil real.
3. **006**: **depende de 003**, porque reutiliza su escucha de scroll y toca el mismo archivo (`DotField.tsx`). Ejecutar siempre después.
4. **004** y **005**: independientes.
5. **007** y **008**: pulido final, independientes.

## Archivos por plan (para evitar conflictos si se ejecutan en paralelo)

- `Problem.tsx`: 001
- `Method.tsx` y `SummitMark.tsx`: 002
- `DotField.tsx`: 003 → 006 (en serie)
- `Services.tsx`: 004
- `Nav.tsx`: 005
- `globals.css` y `Audience.tsx`: 007
- `ContactForm.tsx`: 008

## Hallazgos retirados al verificar

- **Curva del gráfico de «El problema»** (`Problem.tsx:66`): se marcó como `ease-out` genérico de CSS, pero en este proyecto la clase `ease-out` de Tailwind usa el token de marca `cubic-bezier(0.16, 1, 0.3, 1)`, definido en `@theme` (`src/app/globals.css:54`). Es correcto; no hay plan.

## Nota para quien ejecute

Tras editar `src/app/globals.css` (plan 007), el servidor de desarrollo de este proyecto a veces no recoge el cambio en Windows: páralo, borra `.next/dev` y vuelve a arrancarlo.
