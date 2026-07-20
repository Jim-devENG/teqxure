import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Certificate verification — Teqxure",
    template: "%s — Teqxure",
  },
  description: "Verify a Teqxure Product Engineering Bootcamp certificate.",
};

export default function CertificatesRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased bg-soft-white [color-scheme:light]`}>
      <body className="flex min-h-full flex-col bg-soft-white text-graphite [font-family:var(--font-inter)]">
        <header className="border-b border-light-gray px-6 py-5">
          <Link href="/" className="flex w-fit items-center gap-2 font-mono text-sm font-medium tracking-tight text-graphite">
            <Image src="/logo-icon.png" alt="" width={20} height={20} className="h-5 w-5" />
            Teqxure<span className="text-blue">.</span>
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-6 py-16">{children}</main>
        <footer className="border-t border-light-gray px-6 py-5 text-center text-xs text-slate">
          © {new Date().getFullYear()} Teqxure Global
        </footer>
      </body>
    </html>
  );
}
