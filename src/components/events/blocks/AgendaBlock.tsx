import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export function AgendaBlock({ content }: { content: BlockContent<"AGENDA"> }) {
  if (content.items.length === 0) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
        </Reveal>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {content.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="flex gap-6 py-4">
                <span className="w-24 shrink-0 font-mono text-xs text-blue">{item.time}</span>
                <div>
                  <p className="text-sm font-medium text-paper sm:text-base">{item.title}</p>
                  {item.description && <p className="mt-1 text-sm text-paper/55">{item.description}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
