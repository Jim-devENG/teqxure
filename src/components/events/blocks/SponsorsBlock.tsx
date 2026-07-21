import Image from "next/image";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export async function SponsorsBlock({ content }: { content: BlockContent<"SPONSORS"> }) {
  if (content.sponsorIds.length === 0) return null;

  const sponsors = await db.sponsor.findMany({ where: { id: { in: content.sponsorIds }, deletedAt: null } });
  const ordered = content.sponsorIds.map((id) => sponsors.find((s) => s.id === id)).filter((s) => s !== undefined);
  if (ordered.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40">{content.title}</p>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {ordered.map((sponsor, i) => (
            <Reveal key={sponsor.id} delay={i * 0.04}>
              {sponsor.url ? (
                <a href={sponsor.url} target="_blank" rel="noreferrer">
                  <SponsorMark sponsor={sponsor} />
                </a>
              ) : (
                <SponsorMark sponsor={sponsor} />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorMark({ sponsor }: { sponsor: { name: string; logoUrl: string | null } }) {
  if (sponsor.logoUrl) {
    return (
      <div className="relative h-10 w-28 grayscale transition-all hover:grayscale-0">
        <Image src={sponsor.logoUrl} alt={sponsor.name} fill sizes="112px" className="object-contain" />
      </div>
    );
  }
  return <span className="text-sm text-paper/60">{sponsor.name}</span>;
}
