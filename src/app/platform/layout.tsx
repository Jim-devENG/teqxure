import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Teqxure Workspace",
    template: "%s — Teqxure Workspace",
  },
  description: "The Teqxure Product Engineering workspace — cohorts, sprints, and live sessions.",
  robots: { index: false, follow: false },
};

export default function PlatformRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased bg-soft-white [color-scheme:light] [scrollbar-color:rgba(27,31,41,0.25)_transparent]`}
    >
      <body className="min-h-full bg-soft-white text-graphite [font-family:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
