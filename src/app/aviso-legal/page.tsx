import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { COMPANY, LEGAL_UPDATED } from "@/lib/legal";
import { SITE } from "@/lib/content";
import { Datum, LegalPage } from "@/components/Legal";

export const metadata = pageMeta("Aviso legal", "Aviso legal de cimara.ai conforme a la Ley 34/2002 de servicios de la sociedad de la información.", "/aviso-legal");

export default function AvisoLegalPage() {
  const c = COMPANY;
  return (
    <LegalPage title="Aviso legal" updated={LEGAL_UPDATED} current="/aviso-legal">
      <h2>1. Titular del sitio web</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio
        electrónico (LSSI-CE), te informamos de los datos del titular de {SITE.url.replace("https://", "")}:
      </p>
      <ul>
        <li>
          <strong>Titular:</strong> <Datum value={c.legalName} label="Razón social" />, que opera con el nombre comercial CIMARA.
        </li>
        <li>
          <strong>NIF:</strong> <Datum value={c.taxId} label="NIF / CIF" />
        </li>
        <li>
          <strong>Domicilio:</strong> <Datum value={c.address} label="Domicilio social" />
        </li>
        <li>
          <strong>Inscripción registral:</strong> <Datum value={c.registry} label="Registro Mercantil, tomo, folio y hoja" />
        </li>
        <li>
          <strong>Email:</strong> <Datum value={c.email} label="Email de contacto" />
        </li>
      </ul>

      <h2>2. Objeto</h2>
      <p>
        Este sitio web informa sobre los servicios de consultoría de inteligencia artificial y automatización de CIMARA y permite
        contactar con nosotros. El acceso y la navegación implican la aceptación de este aviso legal.
      </p>

      <h2>3. Condiciones de uso</h2>
      <p>
        Te comprometes a usar el sitio de forma lícita y a no realizar acciones que puedan dañar, inutilizar o sobrecargar el sitio o
        impedir su uso normal por otras personas. CIMARA puede modificar en cualquier momento el contenido, la presentación y las
        condiciones de este sitio.
      </p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>
        Los textos, el diseño, el logotipo, el símbolo y el resto de elementos de este sitio son propiedad de CIMARA o se usan con
        autorización. Queda prohibida su reproducción, distribución o transformación sin autorización expresa, salvo para uso personal
        y privado.
      </p>

      <h2>5. Responsabilidad</h2>
      <p>
        Cuidamos que la información publicada sea correcta y esté actualizada, pero no garantizamos la ausencia de errores ni la
        disponibilidad continua del sitio. CIMARA no se hace responsable de los daños derivados del uso de la información de este sitio
        ni del contenido de sitios de terceros enlazados desde él.
      </p>

      <h2>6. Protección de datos y cookies</h2>
      <p>
        El tratamiento de tus datos personales se explica en la <Link href="/privacidad">política de privacidad</Link>, y el uso de
        cookies, en la <Link href="/cookies">política de cookies</Link>.
      </p>

      <h2>7. Legislación aplicable</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y
        tribunales que correspondan conforme a la normativa aplicable.
      </p>
    </LegalPage>
  );
}
