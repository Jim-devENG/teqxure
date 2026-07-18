"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Panel } from "@/components/ui/Panel";
import { curriculum, type FrameworkPhaseName } from "@/content/curriculum";
import { cn } from "@/lib/utils";

const phaseColor: Record<FrameworkPhaseName, string> = {
  Problem: "bg-cyan",
  Pattern: "bg-blue",
  Architecture: "bg-blue",
  Engineering: "bg-emerald",
  Production: "bg-emerald",
  Users: "bg-cyan",
  Iteration: "bg-emerald",
};

export function Curriculum() {
  const [activeWeek, setActiveWeek] = useState(0);
  const active = curriculum[activeWeek];

  return (
    <section id="curriculum" className="bg-charcoal py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Twelve Weeks"
          title="An interactive roadmap, not a syllabus PDF"
          description="Every week maps to a stage of the framework. Select a week to see exactly what you'll ship."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr]">
          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
              {curriculum.map((week, i) => (
                <button
                  key={week.week}
                  onClick={() => setActiveWeek(i)}
                  className={cn(
                    "group flex flex-col items-start gap-2 rounded-xl border px-4 py-3.5 text-left transition-colors cursor-pointer",
                    activeWeek === i
                      ? "border-white/20 bg-charcoal-soft"
                      : "border-white/10 hover:border-white/15 hover:bg-charcoal-soft/50",
                  )}
                >
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-paper/40">
                    <span className={cn("h-1.5 w-1.5 rounded-full", phaseColor[week.phase])} />
                    W{String(week.week).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-snug transition-colors",
                      activeWeek === i ? "text-paper" : "text-paper/55 group-hover:text-paper/75",
                    )}
                  >
                    {week.phase}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <Panel className="p-8 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.week}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-cyan">
                      Week {String(active.week).padStart(2, "0")}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-paper/30" />
                    <span className="text-sm text-paper/50">{active.phase}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight text-paper sm:text-3xl">
                    {active.title}
                  </h3>
                  <ul className="mt-7 flex flex-col gap-4">
                    {active.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-3 text-sm text-paper/65 sm:text-base">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" strokeWidth={1.5} />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </Panel>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
