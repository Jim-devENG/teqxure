import Link from "next/link";
import Image from "next/image";
import { AlertCircle } from "lucide-react";

export function ErrorScreen({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <Image src="/logo-icon.png" alt="" width={28} height={28} className="mx-auto h-7 w-7" />
        <AlertCircle className="mx-auto mt-8 h-9 w-9 text-paper/40" strokeWidth={1.5} />
        <h1 className="mt-5 text-xl font-medium text-paper">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-paper/60">{body}</p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-paper/80 transition-colors hover:border-blue hover:text-blue"
        >
          Back to teqxure.xyz
        </Link>
      </div>
    </div>
  );
}
