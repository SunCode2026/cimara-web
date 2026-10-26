"use client";

import { openCookieSettings } from "@/lib/consent";

/** Reabre el panel de preferencias de cookies. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Configurar cookies
    </button>
  );
}
