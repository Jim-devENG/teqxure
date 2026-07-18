"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { frameworkStages } from "@/content/framework";
import { cn } from "@/lib/utils";

export function Framework() {
  const containerRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.6"],
  });

  return (
    <section id="framework" className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading
          align="center"
          eyebrow="The Teqxure System"
          title="Problem to production, on repeat"
          description="Seven stages, applied to every product you build in the program — and every product you build after it."
          className="mx-auto max-w-2xl"
        />

        <ul ref={containerRef} className="relative mt-20 flex flex-col gap-14 sm:gap-16">
          <div className="absolute left-4 top-0 h-full w-px -translate-x-1/2 bg-white/10 sm:left-1/2" />
          <motion.div
            style={{ scaleY: scrollYProgress }}
            className="absolute left-4 top-0 h-full w-px origin-top -translate-x-1/2 bg-blue sm:left-1/2"
          />

          {frameworkStages.map((stage, i) => (
            <li key={stage.index} className="relative">
              <span className="absolute left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-blue bg-charcoal sm:left-1/2" />
              <Reveal delay={i * 0.04}>
                <div
                  className={cn(
                    "pl-10 sm:w-1/2 sm:pl-0",
                    i % 2 === 0 ? "sm:mr-auto sm:pr-14 sm:text-right" : "sm:ml-auto sm:pl-14",
                  )}
                >
                  <span className="font-mono text-sm text-blue">{stage.index}</span>
                  <h3 className="mt-2 text-2xl font-medium tracking-tight text-paper">
                    {stage.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper/55 sm:text-base">
                    {stage.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
