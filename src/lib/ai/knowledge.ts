import "server-only";
import { getHomepageSection, getFrameworkStages, getCurriculumWeeks } from "@/lib/content";

/**
 * Assembles the factual grounding every Teqxure AI conversation gets — the founder's
 * bio, the company philosophy, and the seven-stage system — straight from the same
 * database rows the public site renders, so editing them in admin updates the
 * assistant's knowledge too. Computed fresh per request; the underlying content
 * changes rarely and this app's traffic is small, so caching isn't worth the complexity.
 */
export async function getProductEngineeringKnowledge(): Promise<string> {
  const [founder, philosophy, whyProductEngineering, stages, weeks] = await Promise.all([
    getHomepageSection("ABOUT_FOUNDER"),
    getHomepageSection("INSTRUCTOR_PHILOSOPHY"),
    getHomepageSection("WHY_PRODUCT_ENGINEERING"),
    getFrameworkStages(),
    getCurriculumWeeks(),
  ]);

  const stagesText = stages.map((s) => `${s.index}. ${s.name} — ${s.description}`).join("\n");
  const weeksText = weeks.map((w) => `Week ${w.week} (${w.phase}): ${w.title}`).join("\n");

  return `
## About the founder
${founder.fullName}, ${founder.title}.
${founder.shortBio.replace(/\r?\n/g, " ").trim()}

## Product Engineering philosophy
"${philosophy.quote}"
${philosophy.paragraph1}
${philosophy.paragraph2}
${whyProductEngineering.description}

## The Teqxure System — seven stages
${stagesText}

## The twelve-week curriculum
${weeksText}
`.trim();
}
