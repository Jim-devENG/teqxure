import { Users } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export function WhoShouldAttendBlock({ content }: { content: BlockContent<"WHO_SHOULD_ATTEND"> }) {
  if (content.items.length === 0) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
        </Reveal>
        <ul className="mt-6 flex flex-col gap-3">
          {content.items.map((item, i) => (
            <Reveal key={item} delay={i * 0.04}>
              <li className="flex items-start gap-3 rounded-xl border border-white/10 bg-charcoal-soft px-5 py-4">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-blue" strokeWidth={1.5} />
                <p className="text-sm text-paper/70 sm:text-base">{item}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
