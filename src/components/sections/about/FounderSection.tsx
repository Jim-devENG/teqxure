import Image from "next/image";
import { Mail } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { RichTextContent } from "@/components/RichTextContent";
import { getHomepageSection } from "@/lib/content";
import { socialPlatformIcons, getSocialLabel } from "@/lib/socialPlatforms";

export async function FounderSection() {
  const founder = await getHomepageSection("ABOUT_FOUNDER");
  if (!founder.fullName) return null;

  return (
    <section className="relative bg-soft-white py-24 sm:py-32">
      {founder.coverImage && (
        <div className="absolute inset-x-0 top-0 h-56 overflow-hidden sm:h-72">
          <Image src={founder.coverImage} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-soft-white via-soft-white/40 to-transparent" />
        </div>
      )}

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Founder</span>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              {founder.profilePhoto && (
                <div className="relative aspect-square w-40 overflow-hidden rounded-2xl border border-light-gray sm:w-48">
                  <Image src={founder.profilePhoto} alt={founder.fullName} fill sizes="192px" className="object-cover" />
                </div>
              )}
              <h3 className="mt-5 text-lg font-medium text-graphite">{founder.fullName}</h3>
              <p className="mt-1 text-sm text-slate">{founder.title}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                {founder.email && (
                  <a href={`mailto:${founder.email}`} aria-label="Email" className="text-slate transition-colors hover:text-blue">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                )}
                {founder.socialLinks.map((link) => {
                  const Icon = socialPlatformIcons[link.platform] ?? socialPlatformIcons.website;
                  return (
                    <a
                      key={link.platform}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={getSocialLabel(link.platform)}
                      className="text-slate transition-colors hover:text-blue"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <div>
            {founder.quote && (
              <Reveal>
                <p className="text-balance text-2xl font-medium leading-snug tracking-tight text-graphite sm:text-3xl">
                  “{founder.quote}”
                </p>
              </Reveal>
            )}

            {founder.shortBio && (
              <Reveal delay={0.1}>
                <p className="mt-6 text-base leading-relaxed text-slate sm:text-lg">{founder.shortBio}</p>
              </Reveal>
            )}

            {founder.longBio && (
              <Reveal delay={0.15}>
                <RichTextContent html={founder.longBio} className="mt-6 text-base leading-relaxed text-slate" />
              </Reveal>
            )}

            {founder.signatureImage && (
              <Reveal delay={0.2}>
                <div className="relative mt-8 h-12 w-40">
                  <Image src={founder.signatureImage} alt="" fill sizes="160px" className="object-contain object-left" />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
