import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Problem } from "@/components/sections/Problem";
import { Services } from "@/components/sections/Services";
import { Method } from "@/components/sections/Method";
import { Audience } from "@/components/sections/Audience";
import { Results } from "@/components/sections/Results";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQ_PAGE, jsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(FAQ_PAGE) }} />
      <Hero />
      <Manifesto />
      <Problem />
      <Services />
      <Method />
      <Audience />
      <Results />
      <Faq />
      <FinalCta />
    </>
  );
}
