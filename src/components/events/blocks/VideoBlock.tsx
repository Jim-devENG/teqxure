import { Reveal } from "@/components/ui/Reveal";
import type { BlockContent } from "@/lib/blockSchemas";

function toEmbedUrl(url: string): string | null {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function VideoBlock({ content }: { content: BlockContent<"VIDEO"> }) {
  if (!content.videoUrl) return null;
  const embedUrl = toEmbedUrl(content.videoUrl);

  return (
    <section className="py-8 sm:py-10">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={content.caption || "Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <a
                href={content.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-center justify-center text-sm text-paper/60 hover:text-blue"
              >
                Watch video →
              </a>
            )}
          </div>
          {content.caption && <p className="mt-3 text-center text-sm text-paper/45">{content.caption}</p>}
        </Reveal>
      </div>
    </section>
  );
}
