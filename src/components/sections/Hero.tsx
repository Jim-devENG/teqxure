"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import { Reveal } from "@/components/ui/Reveal";
import { useWaitlist } from "@/components/waitlist/WaitlistProvider";
import { products } from "@/content/products";
import { cn } from "@/lib/utils";

export function Hero() {
  const { openWaitlist } = useWaitlist();
  const lenis = useLenis();

  return (
    <section id="top" className="relative overflow-hidden bg-charcoal pb-24 pt-36 sm:pt-44">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-paper/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                Product Engineering Bootcamp
              </span>
            </Reveal>

            <h1 className="mt-6 max-w-2xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              <RevealText text="Stop building tutorials." className="text-paper/35" />{" "}
              <RevealText
                text="Start building products people"
                delay={0.25}
                className="text-paper"
              />{" "}
              <RevealText text="actually use." delay={0.42} className="text-blue" />
            </h1>

            <Reveal delay={0.55}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/60 sm:text-lg">
                Learn the exact Product Engineering system used to build production
                software across SaaS, marketplaces, education technology,
                cybersecurity, creator platforms, and AI products.
              </p>
            </Reveal>

            <Reveal delay={0.65}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <MagneticButton onClick={openWaitlist}>
                  Join the waitlist
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </MagneticButton>
                <MagneticButton
                  variant="ghost"
                  onClick={() => lenis?.scrollTo("#framework")}
                >
                  See the framework
                  <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.75}>
              <div className="mt-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/35">
                  Built by builders behind
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
                  {products.map((p) => (
                    <span key={p.slug} className="text-sm text-paper/45">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <HeroMockup />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div style={{ perspective: 1600 }} className="relative">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: springRotateX, rotateY: springRotateY }}
        className="relative rounded-2xl border border-white/10 bg-charcoal-soft"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald" />
          <span className="ml-3 h-5 max-w-40 flex-1 rounded-md bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-[56px_1fr]">
          <div className="flex flex-col gap-3 border-r border-white/10 p-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn("h-2 rounded-full bg-white/10", i === 1 && "bg-blue/70")}
              />
            ))}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-paper/40">
              <span className="text-blue">Problem</span>
              <span className="h-px w-4 bg-white/15" />
              <span>Pattern</span>
              <span className="h-px w-4 bg-white/15" />
              <span>Architecture</span>
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="h-2.5 w-4/5 rounded-full bg-white/10" />
              <div className="h-2.5 w-3/5 rounded-full bg-white/10" />
              <div className="h-2.5 w-full rounded-full bg-white/[0.06]" />
              <div className="h-2.5 w-2/3 rounded-full bg-white/[0.06]" />
            </div>

            <div className="mt-6 flex gap-2">
              <div className="h-16 flex-1 rounded-lg border border-white/10 bg-white/[0.02]" />
              <div className="h-16 flex-1 rounded-lg border border-white/10 bg-white/[0.02]" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="panel-glass absolute -bottom-6 -left-6 flex items-center gap-2 rounded-xl px-4 py-3 shadow-2xl"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald/60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <span className="text-xs text-paper/80">Shipped to production</span>
      </motion.div>
    </div>
  );
}
