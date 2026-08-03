import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getHomepageSection } from "@/lib/content";

export async function CommunityBenefits() {
  const section = await getHomepageSection("COMMUNITY_BENEFITS");

  return (
    <section className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading align="center" eyebrow={section.eyebrow} title={section.title} description={section.description} />

        <ul className="mx-auto mt-10 flex max-w-2xl flex-col gap-4">
          {section.benefits.map((benefit, i) => (
            <Reveal key={benefit} delay={0.1 + i * 0.05}>
              <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-charcoal-soft px-5 py-4 text-sm text-paper/70 sm:text-base">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" strokeWidth={1.5} />
                {benefit}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
