import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { COMPANY, LEGAL_UPDATED } from "@/lib/legal";
import { Datum, LegalPage, Pending } from "@/components/Legal";

export const metadata = pageMeta("Política de privacidad", "Cómo trata CIMARA tus datos personales, con qué finalidad y cómo ejercer tus derechos.", "/privacidad");

export default function PrivacidadPage() {
  const c = COMPANY;
  return (
    <LegalPage title="Política de privacidad" updated={LEGAL_UPDATED} current="/privacidad">
      <p>
        Esta política explica qué datos personales tratamos cuando usas este sitio web, para qué y cuáles son tus derechos, conforme al
        Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales
        (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>
          <strong>Responsable:</strong> <Datum value={c.legalName} label="Razón social" /> (CIMARA)
        </li>
        <li>
          <strong>NIF:</strong> <Datum value={c.taxId} label="NIF / CIF" />
        </li>
        <li>
          <strong>Domicilio:</strong> <Datum value={c.address} label="Domicilio social" />
        </li>
        <li>
          <strong>Contacto para privacidad:</strong> <Datum value={c.email} label="Email de contacto" />
        </li>
      </ul>

      <h2>2. Qué datos tratamos</h2>
      <p>Solo los que nos facilitas en el formulario de contacto o por correo electrónico:</p>
      <ul>
        <li>Nombre y empresa.</li>
        <li>Email de contacto.</li>
        <li>Tamaño de la empresa.</li>
        <li>El mensaje que nos escribes.</li>
      </ul>
      <p>Te pedimos que no incluyas en el mensaje datos sensibles ni datos personales de terceros.</p>

      <h2>3. Para qué los usamos y con qué base legal</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Finalidad</th>
            <th scope="col">Base legal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Responder a tu solicitud y organizar una primera conversación.</td>
            <td>Tu consentimiento (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).</td>
          </tr>
          <tr>
            <td>Preparar y gestionar una propuesta de servicios, si la solicitas.</td>
            <td>Aplicación de medidas precontractuales o ejecución de un contrato (art. 6.1.b RGPD).</td>
          </tr>
        </tbody>
      </table>
      <p>No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos, y no los usamos para enviarte publicidad.</p>

      <h2>4. Cuánto tiempo los conservamos</h2>
      <p>
        Mientras gestionamos tu solicitud y, como máximo, <Pending>plazo de conservación, p. ej. 12 meses</Pending> desde el último
        contacto si no llegamos a colaborar. Si firmamos un contrato, durante su vigencia y los plazos legales de prescripción.
      </p>

      <h2>5. A quién se comunican</h2>
      <p>
        No cedemos tus datos a terceros, salvo obligación legal. Para prestar el servicio nos apoyamos en proveedores que actúan como
        encargados del tratamiento, con contrato conforme al artículo 28 del RGPD: <Datum value={c.hosting} label="Proveedores de alojamiento y email" />.
      </p>

      <h2>6. Transferencias internacionales</h2>
      <p>
        <Pending>Indicar si algún proveedor trata datos fuera del Espacio Económico Europeo y con qué garantías, por ejemplo cláusulas contractuales tipo o Marco de Privacidad de Datos UE‑EE. UU.</Pending>
      </p>

      <h2>7. Tus derechos</h2>
      <p>Puedes ejercer en cualquier momento tus derechos de:</p>
      <ul>
        <li>Acceso, rectificación y supresión de tus datos.</li>
        <li>Oposición y limitación del tratamiento.</li>
        <li>Portabilidad de los datos.</li>
        <li>Retirada del consentimiento, sin que afecte a la licitud del tratamiento previo.</li>
      </ul>
      <p>
        Escríbenos a <Datum value={c.email} label="Email de contacto" /> indicando el derecho que quieres ejercer. Si consideras que no
        hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos en{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          aepd.es
        </a>
        .
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a pérdidas, accesos no autorizados o usos
        indebidos, incluido el cifrado de las comunicaciones con este sitio.
      </p>

      <h2>9. Cookies</h2>
      <p>
        El uso de cookies se explica en la <Link href="/cookies">política de cookies</Link>.
      </p>
    </LegalPage>
  );
}
