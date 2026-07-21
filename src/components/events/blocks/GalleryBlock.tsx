import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

export function GalleryBlock({ content }: { content: BlockContent<"GALLERY"> }) {
  if (content.images.length === 0) return null;
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {content.images.map((src, i) => (
            <Reveal key={src + i} delay={i * 0.03}>
              <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                <Image src={src} alt="" fill sizes="(min-width: 640px) 220px, 45vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
