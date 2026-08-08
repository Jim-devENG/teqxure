import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teqxure Readiness Assessment",
  robots: { index: false, follow: false },
};

// Deliberately its own minimal layout, not (marketing)'s — this is a
// focused 10–15 minute task flow, not a page to browse away from, so the
// main nav/footer/cursor-follower chrome is left out on purpose.
export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-charcoal [color-scheme:dark]`}
    >
      <body className="min-h-full bg-charcoal text-paper">{children}</body>
    </html>
  );
}
