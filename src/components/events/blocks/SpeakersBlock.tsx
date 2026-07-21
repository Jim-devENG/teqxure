import Image from "next/image";
import { db } from "@/lib/db";
import { Reveal } from "@/components/ui/Reveal";
import { socialPlatformIcons, normalizeSocialLinks } from "@/lib/socialPlatforms";
import type { BlockContent } from "@/lib/blockSchemas";

export async function SpeakersBlock({ content }: { content: BlockContent<"SPEAKERS"> }) {
  if (content.speakerIds.length === 0) return null;

  const speakers = await db.speaker.findMany({ where: { id: { in: content.speakerIds }, deletedAt: null } });
  const ordered = content.speakerIds.map((id) => speakers.find((s) => s.id === id)).filter((s) => s !== undefined);
  if (ordered.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <h2 className="text-xl font-medium tracking-tight text-paper sm:text-2xl">{content.title}</h2>
        </Reveal>
        <div className={`mt-8 grid grid-cols-1 gap-8 ${ordered.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {ordered.map((speaker, i) => {
            const links = normalizeSocialLinks(speaker.socialLinks);
            return (
              <Reveal key={speaker.id} delay={i * 0.05}>
                <div className="flex gap-4">
                  {speaker.photoUrl && (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10">
                      <Image src={speaker.photoUrl} alt={speaker.name} fill sizes="64px" className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-paper">{speaker.name}</p>
                    <p className="text-xs text-paper/50">
                      {speaker.title}
                      {speaker.company ? ` · ${speaker.company}` : ""}
                    </p>
                    {speaker.bio && <p className="mt-2 text-sm leading-relaxed text-paper/60">{speaker.bio}</p>}
                    {links.length > 0 && (
                      <div className="mt-2 flex items-center gap-3">
                        {links.map((link) => {
                          const Icon = socialPlatformIcons[link.platform] ?? socialPlatformIcons.website;
                          return (
                            <a key={link.platform} href={link.href} target="_blank" rel="noreferrer" className="text-paper/50 transition-colors hover:text-blue">
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
