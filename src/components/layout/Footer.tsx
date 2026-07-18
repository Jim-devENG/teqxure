import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/content";

const FOOTER_LINKS = [
  { label: "Framework", href: "#framework" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Products", href: "#products" },
  { label: "Outcomes", href: "#outcomes" },
  { label: "FAQ", href: "#faq" },
];

const DEFAULT_SOCIALS = [
  { label: "X / Twitter", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const socials = (settings?.socialLinks as { label: string; href: string }[] | null) ?? DEFAULT_SOCIALS;
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
              <span className="relative aspect-square h-8 w-8 shrink-0 sm:h-12 sm:w-12 lg:h-20 lg:w-20">
                <Image
                  src="/logo-icon.png"
                  alt="Teqxure"
                  fill
                  sizes="(min-width: 1024px) 80px, (min-width: 640px) 48px, 32px"
                  className="object-contain"
                />
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
            <ul className="mt-4 flex flex-col gap-3">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-paper/60 transition-colors hover:text-blue"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={`mailto:${contactEmail}`}
                  className="text-sm text-paper/60 transition-colors hover:text-blue"
                >
                  {contactEmail}
                </Link>
              </li>
            </ul>
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
