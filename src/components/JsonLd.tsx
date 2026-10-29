import { jsonLd } from "@/lib/seo";

/** Datos estructurados en un <script> seguro (escapa «<»). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
