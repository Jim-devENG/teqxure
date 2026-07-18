import { db } from "@/lib/db";
import { sectionRegistry, type SectionKey } from "@/lib/sectionSchemas";
import { getProducts, getFrameworkStages, getCurriculumWeeks, getFaqItems } from "@/lib/content";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { WhyProductEngineering } from "@/components/sections/WhyProductEngineering";
import { Framework } from "@/components/sections/Framework";
import { Curriculum } from "@/components/sections/Curriculum";
import { ProductShowcase } from "@/components/sections/ProductShowcase";
import { WhatYoullBuild } from "@/components/sections/WhatYoullBuild";
import { StudentOutcomes } from "@/components/sections/StudentOutcomes";
import { InstructorPhilosophy } from "@/components/sections/InstructorPhilosophy";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const revalidate = 0;

export default async function Home() {
  const [sections, products, frameworkStages, curriculumWeeks, faqItems] = await Promise.all([
    db.homepageSection.findMany({ orderBy: { order: "asc" } }),
    getProducts(),
    getFrameworkStages(),
    getCurriculumWeeks(),
    getFaqItems(),
  ]);

  return (
    <>
      {sections.map((row) => {
        if (!row.visible) return null;
        const key = row.key as SectionKey;
        const content = sectionRegistry[key].schema.parse(row.content);

        switch (key) {
          case "HERO":
            return (
              <Hero
                key={row.id}
                section={content as never}
                productNames={products.map((p) => p.name)}
              />
            );
          case "SOCIAL_PROOF":
            return <SocialProof key={row.id} section={content as never} products={products} />;
          case "WHY_PRODUCT_ENGINEERING":
            return <WhyProductEngineering key={row.id} />;
          case "FRAMEWORK_INTRO":
            return <Framework key={row.id} section={content as never} stages={frameworkStages} />;
          case "CURRICULUM_INTRO":
            return <Curriculum key={row.id} section={content as never} weeks={curriculumWeeks} />;
          case "PRODUCT_SHOWCASE_INTRO":
            return <ProductShowcase key={row.id} section={content as never} products={products} />;
          case "WHAT_YOULL_BUILD":
            return <WhatYoullBuild key={row.id} />;
          case "STUDENT_OUTCOMES":
            return <StudentOutcomes key={row.id} />;
          case "INSTRUCTOR_PHILOSOPHY":
            return <InstructorPhilosophy key={row.id} />;
          case "FAQ_INTRO":
            return <FAQ key={row.id} section={content as never} items={faqItems} />;
          case "FINAL_CTA":
            return <FinalCTA key={row.id} section={content as never} />;
          default:
            return null;
        }
      })}
    </>
  );
}
