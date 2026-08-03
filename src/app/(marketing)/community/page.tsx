import type { Metadata } from "next";
import { getHomepageSection } from "@/lib/content";
import { PageHero } from "@/components/sections/PageHero";
import { CommunityBenefits } from "@/components/sections/community/CommunityBenefits";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSection("COMMUNITY_SEO");
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

export default async function CommunityPage() {
  const communityCta = await getHomepageSection("COMMUNITY_CTA");

  return (
    <>
      <PageHero sectionKey="COMMUNITY_HERO" accent="cyan" />
      <CommunityBenefits />
      <FinalCTA section={communityCta} />
    </>
  );
}
