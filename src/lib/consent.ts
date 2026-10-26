/**
 * Consentimiento de cookies (LSSI-CE art. 22.2 y guía de la AEPD).
 * Se guarda en una cookie técnica propia durante 12 meses; pasado ese plazo se vuelve a preguntar.
 * Cualquier script opcional debe comprobar `hasConsent("analytics")` antes de cargarse.
 */

export type Category = "analytics";
export type Consent = { v: 1; analytics: boolean; date: string };

export const CONSENT_COOKIE = "cimara_consent";
const MAX_AGE = 60 * 60 * 24 * 365;
const CHANGE = "cimara:consent";
const OPEN = "cimara:cookie-settings";

function rawCookie(): string {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1)) : "";
}

export function parseConsent(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw);
    return c?.v === 1 && typeof c.analytics === "boolean" ? c : null;
  } catch {
    return null;
  }
}

export function hasConsent(category: Category): boolean {
  return parseConsent(rawCookie())?.[category] === true;
}

export function saveConsent(choice: Omit<Consent, "v" | "date">) {
  const value: Consent = { v: 1, ...choice, date: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CHANGE));
}

/** Reabre el panel de preferencias (pie de página y política de cookies). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN));
}

/** Para useSyncExternalStore: la cookie cruda es una instantánea estable entre renders. */
export const consentStore = {
  subscribe(cb: () => void) {
    window.addEventListener(CHANGE, cb);
    return () => window.removeEventListener(CHANGE, cb);
  },
  getSnapshot: rawCookie,
  getServerSnapshot: () => null, // en servidor no se sabe: el banner no se pinta hasta hidratar
  onOpen(cb: () => void) {
    window.addEventListener(OPEN, cb);
    return () => window.removeEventListener(OPEN, cb);
  },
};
