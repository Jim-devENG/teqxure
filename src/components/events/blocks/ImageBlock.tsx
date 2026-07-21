import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export function ImageBlock({ content }: { content: BlockContent<"IMAGE"> }) {
  if (!content.image) return null;
  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <Image src={content.image} alt={content.caption ?? ""} fill sizes="(min-width: 1024px) 720px, 90vw" className="object-cover" />
          </div>
          {content.caption && <p className="mt-3 text-center text-sm text-paper/45">{content.caption}</p>}
        </Reveal>
      </div>
    </section>
  );
}
