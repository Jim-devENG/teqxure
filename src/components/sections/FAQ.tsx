"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AccordionItem } from "@/components/ui/Accordion";
import { faqItems } from "@/content/faq";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          align="center"
          eyebrow="Frequently Asked"
          title="Questions builders actually ask"
          className="mx-auto"
        />

        <div className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {faqItems.map((item, i) => (
            <Reveal key={item.question} delay={i * 0.03}>
              <AccordionItem
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                header={
                  <>
                    <span className="text-base font-medium text-paper sm:text-lg">
                      {item.question}
                    </span>
                    <Plus
                      className={cn(
                        "h-5 w-5 shrink-0 text-paper/40 transition-transform duration-300",
                        openIndex === i && "rotate-45 text-cyan",
                      )}
                      strokeWidth={1.5}
                    />
                  </>
                }
              >
                <p className="max-w-2xl text-sm leading-relaxed text-paper/60 sm:text-base">
                  {item.answer}
                </p>
              </AccordionItem>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
