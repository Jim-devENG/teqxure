"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useWaitlist } from "@/components/waitlist/WaitlistProvider";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Framework", href: "#framework" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Products", href: "#products" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openWaitlist } = useWaitlist();

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isScrolled ? "border-b border-white/10 bg-charcoal/80 backdrop-blur-md" : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 lg:py-4">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-mono font-medium tracking-tight text-paper"
        >
          <span className="flex shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm sm:rounded-2xl sm:p-2">
            <span className="relative aspect-square h-6 w-6 sm:h-9 sm:w-9 lg:h-16 lg:w-16">
              <Image
                src="/logo-icon.png"
                alt="Teqxure"
                fill
                sizes="(min-width: 1024px) 64px, (min-width: 640px) 36px, 24px"
                className="object-contain"
                priority
              />
            </span>
          </span>
          <span className="text-sm sm:text-base lg:text-lg">
            Teqxure<span className="text-blue">.</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-paper/60 transition-colors hover:text-blue"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <MagneticButton variant="secondary" className="text-sm" onClick={openWaitlist}>
            Join Waitlist
          </MagneticButton>
        </div>

        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          className="text-paper md:hidden"
        >
          {isMenuOpen ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-white/10 bg-charcoal md:hidden"
          >
            <ul className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2.5 text-base text-paper/70 transition-colors hover:text-blue"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="px-6 pb-6">
              <MagneticButton
                variant="primary"
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  openWaitlist();
                }}
              >
                Join Waitlist
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
