import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";
import { normalizeSocialLinks, socialPlatformIcons, getSocialLabel } from "@/lib/socialPlatforms";
import { Globe } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Framework", href: "#framework" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Products", href: "#products" },
  { label: "Outcomes", href: "#outcomes" },
  { label: "FAQ", href: "#faq" },
];

const DEFAULT_SOCIALS = [
  { platform: "twitter", href: "https://x.com" },
  { platform: "linkedin", href: "https://linkedin.com" },
  { platform: "github", href: "https://github.com" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const normalized = normalizeSocialLinks(settings?.socialLinks);
  const socials = normalized.length > 0 ? normalized : DEFAULT_SOCIALS;
  const tagline =
    settings?.tagline ??
    "The Product Engineering Bootcamp for builders turning ideas into software real people use.";
  const contactEmail = settings?.contactEmail ?? "hello@teqxure.com";

  return (
    <footer className="border-t border-white/10 bg-charcoal">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="flex items-center gap-2.5 font-mono font-medium tracking-tight text-paper">
              <span className="flex shrink-0 items-center justify-center rounded-md bg-white p-1 sm:rounded-lg">
                <span className="relative aspect-square h-3 w-3 sm:h-[18px] sm:w-[18px] lg:h-8 lg:w-8">
                  <Image
                    src="/logo-icon.png"
                    alt="Teqxure"
                    fill
                    sizes="(min-width: 1024px) 32px, (min-width: 640px) 18px, 12px"
                    className="object-contain"
                  />
                </span>
              </span>
              <span className="text-sm sm:text-base lg:text-lg">
                Teqxure<span className="text-blue">.</span>
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/50">{tagline}</p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-paper/40">Site</p>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-paper/60 transition-colors hover:text-blue">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-paper/40">Connect</p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {socials.map((social) => {
                const Icon = socialPlatformIcons[social.platform] ?? Globe;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={getSocialLabel(social.platform)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-paper/70 transition-colors hover:border-blue hover:text-blue"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
            <Link
              href={`mailto:${contactEmail}`}
              className="mt-4 inline-block text-sm text-paper/60 transition-colors hover:text-blue"
            >
              {contactEmail}
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-paper/35 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Teqxure. All rights reserved.</p>
          <p>Product Engineering, not tutorials.</p>
        </div>
      </div>
    </footer>
  );
}
