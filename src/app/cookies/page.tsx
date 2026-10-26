import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { LEGAL_UPDATED } from "@/lib/legal";
import { CONSENT_COOKIE } from "@/lib/consent";
import { LegalPage } from "@/components/Legal";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";

export const metadata = pageMeta("Política de cookies", "Qué cookies usa cimara.ai, para qué sirven y cómo cambiar tus preferencias.", "/cookies");

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" updated={LEGAL_UPDATED} current="/cookies">
      <p>
        Las cookies son pequeños archivos que un sitio web guarda en tu navegador. Esta política explica cuáles usamos, conforme al
        artículo 22.2 de la LSSI-CE y a la guía sobre el uso de las cookies de la Agencia Española de Protección de Datos.
      </p>

      <h2>1. Cookies que usamos</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Cookie</th>
            <th scope="col">Tipo</th>
            <th scope="col">Finalidad</th>
            <th scope="col">Duración</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>{CONSENT_COOKIE}</code>
            </td>
            <td>Propia, técnica</td>
            <td>Recordar tus preferencias de cookies.</td>
            <td>12 meses</td>
          </tr>
        </tbody>
      </table>
      <p>
        Las cookies técnicas son necesarias para el funcionamiento del sitio y no requieren consentimiento. Ahora mismo no usamos
        cookies de analítica, publicidad ni de terceros.
      </p>

      <h2>2. Cookies de analítica</h2>
      <p>
        Si en el futuro incorporamos herramientas de analítica, solo se activarán si das tu consentimiento en el aviso de cookies, y las
        detallaremos en la tabla anterior con su proveedor y duración.
      </p>

      <h2>3. Cambiar tus preferencias</h2>
      <p>Puedes cambiar o retirar tu consentimiento en cualquier momento:</p>
      <p>
        <CookieSettingsButton className="inline-flex h-11 items-center rounded-full px-5 text-small font-medium text-mist shadow-[inset_0_0_0_1px_var(--color-line-strong)] transition-colors hover:bg-surface-2" />
      </p>
      <p>
        También puedes bloquear o borrar las cookies desde la configuración de tu navegador. Si bloqueas las técnicas, el sitio volverá
        a preguntarte por tus preferencias en cada visita.
      </p>

      <h2>4. Más información</h2>
      <p>
        El tratamiento de tus datos personales se explica en la <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </LegalPage>
  );
}
