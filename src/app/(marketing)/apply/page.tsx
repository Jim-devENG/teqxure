import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import { ApplicationForm } from "@/components/apply/ApplicationForm";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Apply for the Next Cohort",
  description:
    "Apply to Teqxure Academy — the twelve-week Product Engineering program. Start with a short application, then a guided onboarding assessment.",
};

export default async function ApplyPage() {
  const cohort = await db.admissionCohort.findFirst({
    where: { status: "OPEN" },
    orderBy: { applicationsOpenAt: "desc" },
  });

  return (
    <section className="relative overflow-hidden bg-charcoal pb-24 pt-36 sm:pt-44">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,black,transparent)]"
      />

      <div className="relative mx-auto max-w-xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">
            {cohort ? cohort.name : "Applications"}
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-6 text-balance text-3xl font-semibold leading-[1.15] tracking-tight text-paper sm:text-4xl">
            {cohort ? "Apply for the Next Cohort" : "Applications aren't open right now"}
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-5 text-base leading-relaxed text-paper/60">
            {cohort
              ? "This is the beginning, not the whole thing. Tell us who you are — we'll email you a short onboarding assessment next, so we can understand where you're starting from before we make a decision."
              : "We're not reviewing applications for a new cohort at the moment. Check back soon, or reach out and we'll let you know the moment applications open again."}
          </p>
        </Reveal>

        {cohort && (
          <Reveal delay={0.3}>
            <div className="mt-10 rounded-2xl border border-white/10 bg-graphite/40 p-6 sm:p-8">
              <ApplicationForm />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
