import type { Metadata } from "next";
import { getHomepageSection, getFaqItems } from "@/lib/content";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { CompanyStory } from "@/components/sections/about/CompanyStory";
import { MissionVision } from "@/components/sections/about/MissionVision";
import { AboutStats } from "@/components/sections/about/AboutStats";
import { CoreValuesSection } from "@/components/sections/about/CoreValuesSection";
import { DifferentiatorsSection } from "@/components/sections/about/DifferentiatorsSection";
import { FounderSection } from "@/components/sections/about/FounderSection";
import { TeamSection } from "@/components/sections/about/TeamSection";
import { FAQ } from "@/components/sections/FAQ";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSection("ABOUT_SEO");
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

export default async function AboutPage() {
  const [faqIntro, faqItems] = await Promise.all([getHomepageSection("ABOUT_FAQ_INTRO"), getFaqItems()]);

  return (
    <>
      <AboutHero />
      <CompanyStory />
      <MissionVision />
      <AboutStats />
      <CoreValuesSection />
      <DifferentiatorsSection />
      <FounderSection />
      <TeamSection />
      {faqItems.length > 0 && <FAQ section={faqIntro} items={faqItems} />}
    </>
  );
}
