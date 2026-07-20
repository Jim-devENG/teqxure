import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { getTeamMembers } from "@/lib/content";
import { socialPlatformIcons, normalizeSocialLinks } from "@/lib/socialPlatforms";

export async function TeamSection() {
  const team = await getTeamMembers();
  if (team.length === 0) return null;

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-blue">Team</span>
          <h2 className="mt-4 max-w-xl text-balance text-3xl font-medium tracking-tight text-graphite sm:text-4xl">
            The people behind Teqxure
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => {
            const links = normalizeSocialLinks(member.socialLinks);
            return (
              <Reveal key={member.id} delay={i * 0.05}>
                <div>
                  {member.photoUrl && (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-light-gray bg-soft-white">
                      <Image src={member.photoUrl} alt={member.name} fill sizes="(min-width: 1024px) 340px, 90vw" className="object-cover" />
                    </div>
                  )}
                  <h3 className="mt-4 text-base font-medium text-graphite">{member.name}</h3>
                  <p className="mt-0.5 text-sm text-slate">{member.role}</p>
                  {member.bio && <p className="mt-2 text-sm leading-relaxed text-slate">{member.bio}</p>}
                  {links.length > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                      {links.map((link) => {
                        const Icon = socialPlatformIcons[link.platform] ?? socialPlatformIcons.website;
                        return (
                          <a
                            key={link.platform}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate transition-colors hover:text-blue"
                          >
                            <Icon className="h-4 w-4" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
