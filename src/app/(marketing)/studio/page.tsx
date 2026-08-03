import type { Metadata } from "next";
import { getHomepageSection, getProducts } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { StudioProcess } from "@/components/sections/studio/StudioProcess";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSection("STUDIO_SEO");
  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo.pageTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function StudioPage() {
  const [studioProof, studioCta, products] = await Promise.all([
    getHomepageSection("STUDIO_PROOF"),
    getHomepageSection("STUDIO_CTA"),
    getProducts(),
  ]);

  return (
    <>
      <PageHero sectionKey="STUDIO_HERO" accent="blue" />
      <StudioProcess />
      <ProductShowcase section={studioProof} products={products} />
      <FinalCTA section={studioCta} />
    </>
  );
}
