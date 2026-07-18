import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CursorFollower } from "@/components/motion/CursorFollower";
import { WaitlistProvider } from "@/components/waitlist/WaitlistProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

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
    default: "Teqxure — The Product Engineering Bootcamp",
    template: "%s — Teqxure",
  },
  description:
    "Stop building tutorials. Start building products people actually use. Teqxure teaches the exact Product Engineering system used to build production software across SaaS, marketplaces, education technology, cybersecurity, creator platforms, and AI products.",
  keywords: [
    "Product Engineering",
    "coding bootcamp",
    "AI engineering bootcamp",
    "software engineering course",
    "build a startup",
    "product engineering system",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Teqxure — The Product Engineering Bootcamp",
    description:
      "Stop building tutorials. Start building products people actually use.",
    siteName: "Teqxure",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teqxure — The Product Engineering Bootcamp",
    description:
      "Stop building tutorials. Start building products people actually use.",
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
    "The Product Engineering Bootcamp — a twelve-week cohort program teaching builders to turn ideas into production software using AI.",
  url: siteUrl,
  sameAs: ["https://x.com", "https://linkedin.com", "https://github.com"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <WaitlistProvider>
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
