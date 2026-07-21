import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export function CtaBlock({ content }: { content: BlockContent<"CTA"> }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-charcoal-soft p-8 text-center sm:p-10">
            <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
            {content.description && <p className="mt-3 text-sm text-paper/60 sm:text-base">{content.description}</p>}
            <Link
              href={content.buttonUrl}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
            >
              {content.buttonText}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
