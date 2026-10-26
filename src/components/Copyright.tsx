"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Año actual leído en el cliente; el prerender usa el del lanzamiento para que la página siga estática. */
export function Copyright() {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => 2026);
  return <p>© {year} CIMARA. Todos los derechos reservados.</p>;
}
