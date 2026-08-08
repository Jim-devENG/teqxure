import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { WaitlistProvider } from "@/components/waitlist/WaitlistProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

const siteUrl = "https://teqxure.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Teqxure — Africa's Product Engineering Company",
    template: "%s — Teqxure",
  },
  description:
    "Artificial Intelligence changed what it means to build software. Teqxure prepares Africa's builders — engineers, designers, founders, and teams — to create products the world depends on, using Artificial Intelligence as an advantage, not a threat.",
  keywords: [
    "Product Engineering",
    "Product Engineering Africa",
    "Artificial Intelligence training",
    "product building",
    "AI-native builders",
    "technology leaders Africa",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Teqxure — Africa's Product Engineering Company",
    description:
      "Artificial Intelligence changed what it means to build software. Teqxure prepares Africa's builders to create products the world depends on.",
    siteName: "Teqxure",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teqxure — Africa's Product Engineering Company",
    description:
      "Artificial Intelligence changed what it means to build software. Teqxure prepares Africa's builders to create products the world depends on.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Teqxure",
  description:
    "Africa's Product Engineering company. Teqxure prepares builders to create products the world depends on, through a Studio that builds, an Academy that trains, a Community that connects, and Research that looks ahead.",
  url: siteUrl,
  logo: `${siteUrl}/logo-icon.png`,
  sameAs: ["https://x.com", "https://linkedin.com", "https://github.com"],
};

export default async function MarketingLayout({
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
      <body className="min-h-full flex flex-col bg-charcoal text-paper">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <WaitlistProvider fields={fields}>
            <ScrollProgress />
            <CursorFollower />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </WaitlistProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
