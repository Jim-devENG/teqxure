import type { Metadata } from "next";
import { getHomepageSection, getProducts, getFrameworkStages, getCurriculumWeeks, getFaqItems } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { Framework } from "@/components/sections/Framework";
import { Curriculum } from "@/components/sections/Curriculum";
import { WhatYoullBuild } from "@/components/sections/WhatYoullBuild";
import { StudentOutcomes } from "@/components/sections/StudentOutcomes";
import { InstructorPhilosophy } from "@/components/sections/InstructorPhilosophy";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSection("ACADEMY_SEO");
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

export default async function AcademyPage() {
  const [hero, framework, curriculum, faqIntro, finalCta, products, frameworkStages, curriculumWeeks, faqItems] =
    await Promise.all([
      getHomepageSection("ACADEMY_HERO"),
      getHomepageSection("FRAMEWORK_INTRO"),
      getHomepageSection("CURRICULUM_INTRO"),
      getHomepageSection("FAQ_INTRO"),
      getHomepageSection("FINAL_CTA"),
      getProducts(),
      getFrameworkStages(),
      getCurriculumWeeks(),
      getFaqItems(),
    ]);

  return (
    <>
      <Hero section={hero} productNames={products.map((p) => p.name)} secondaryCtaTarget="#framework" />
      <Framework section={framework} stages={frameworkStages} />
      <Curriculum section={curriculum} weeks={curriculumWeeks} />
      <WhatYoullBuild />
      <StudentOutcomes />
      <InstructorPhilosophy />
      <FAQ section={faqIntro} items={faqItems} />
      <FinalCTA section={finalCta} />
    </>
  );
}
