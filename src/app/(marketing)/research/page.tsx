import type { Metadata } from "next";
import { getHomepageSection } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { ResearchAreas } from "@/components/sections/research/ResearchAreas";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSection("RESEARCH_SEO");
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

export default function ResearchPage() {
  return (
    <>
      <PageHero sectionKey="RESEARCH_HERO" accent="slate" />
      <ResearchAreas />
    </>
  );
}
