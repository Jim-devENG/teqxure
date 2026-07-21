"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { AccordionItem } from "@/components/ui/Accordion";
import type { BlockContent } from "@/lib/blockSchemas";
import { cn } from "@/lib/utils";

export function FaqBlock({ content }: { content: BlockContent<"FAQ"> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (content.items.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
        </Reveal>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {content.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.03}>
              <AccordionItem
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                header={
                  <>
                    <span className="text-base font-medium text-paper">{item.question}</span>
                    <Plus
                      className={cn("h-4 w-4 shrink-0 text-paper/40 transition-transform duration-300", openIndex === i && "rotate-45 text-blue")}
                      strokeWidth={1.5}
                    />
                  </>
                }
              >
                <p className="text-sm leading-relaxed text-paper/60">{item.answer}</p>
              </AccordionItem>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
