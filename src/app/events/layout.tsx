import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { WaitlistProvider } from "@/components/waitlist/WaitlistProvider";
import { getWaitlistFields } from "@/lib/content";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://events.teqxure.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Teqxure Events",
    template: "%s — Teqxure Events",
  },
  description: "Workshops, info sessions, and demo days from Teqxure — the Product Engineering Bootcamp.",
  robots: { index: true, follow: true },
};

export default async function EventsRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fields = await getWaitlistFields();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-charcoal [color-scheme:dark] [scrollbar-color:rgba(255,255,255,0.25)_transparent]`}
    >
      <body className="flex min-h-full flex-col bg-charcoal text-paper">
        <SmoothScroll>
          <WaitlistProvider fields={fields}>
            <header className="border-b border-white/10 px-6 py-5">
              <Link href="https://www.teqxure.xyz" className="flex w-fit items-center gap-2 font-mono text-sm font-medium tracking-tight text-paper">
                <Image src="/logo-icon.png" alt="" width={20} height={20} className="h-5 w-5" />
                Teqxure<span className="text-blue">.</span>
                <span className="ml-1 text-paper/40">Events</span>
              </Link>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-paper/40">
              <Link href="https://www.teqxure.xyz" className="hover:text-paper/70">
                © {new Date().getFullYear()} Teqxure Global. All rights reserved.
              </Link>
            </footer>
          </WaitlistProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
