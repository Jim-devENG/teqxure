import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export async function TestimonialsBlock({ content }: { content: BlockContent<"TESTIMONIALS"> }) {
  if (content.testimonialIds.length === 0) return null;

  const testimonials = await db.testimonial.findMany({ where: { id: { in: content.testimonialIds }, deletedAt: null } });
  const ordered = content.testimonialIds.map((id) => testimonials.find((t) => t.id === id)).filter((t) => t !== undefined);
  if (ordered.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
        </Reveal>
        <div className={`mt-8 grid grid-cols-1 gap-6 ${ordered.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {ordered.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.05}>
              <div className="rounded-2xl border border-white/10 bg-charcoal-soft p-6">
                <p className="text-sm leading-relaxed text-paper/75">“{t.quote}”</p>
                <p className="mt-4 text-xs text-paper/45">
                  {t.authorName}
                  {t.authorRole ? ` · ${t.authorRole}` : ""}
                  {t.authorCompany ? `, ${t.authorCompany}` : ""}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
