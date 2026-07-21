import { Reveal } from "@/components/ui/Reveal";
import { RichTextContent } from "@/components/RichTextContent";
import type { BlockContent } from "@/lib/blockSchemas";

export function RichTextBlock({ content }: { content: BlockContent<"RICH_TEXT"> }) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-6">
        <Reveal>
          <RichTextContent html={content.content} className="prose-dark text-base leading-relaxed text-paper/70 sm:text-lg" />
        </Reveal>
      </div>
    </section>
  );
}
