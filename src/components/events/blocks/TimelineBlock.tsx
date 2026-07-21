import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export function TimelineBlock({ content }: { content: BlockContent<"TIMELINE"> }) {
  if (content.items.length === 0) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
        </Reveal>
        <div className="mt-8 flex flex-col gap-6 border-l border-white/10 pl-6">
          {content.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="relative">
                <span className="absolute -left-[26px] top-1.5 h-2 w-2 rounded-full bg-blue" />
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-blue">{item.date}</p>
                <p className="mt-1.5 text-sm font-medium text-paper sm:text-base">{item.title}</p>
                {item.description && <p className="mt-1 text-sm text-paper/55">{item.description}</p>}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
