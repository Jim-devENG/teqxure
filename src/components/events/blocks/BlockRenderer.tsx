import { blockRegistry, type BlockType } from "@/lib/blockSchemas";
import { HeroBlock } from "./HeroBlock";
import { RichTextBlock } from "./RichTextBlock";
import { ImageBlock } from "./ImageBlock";
import { VideoBlock } from "./VideoBlock";
import { AgendaBlock } from "./AgendaBlock";
import { TimelineBlock } from "./TimelineBlock";
import { LearningOutcomesBlock } from "./LearningOutcomesBlock";
import { WhoShouldAttendBlock } from "./WhoShouldAttendBlock";
import { CtaBlock } from "./CtaBlock";
import { FaqBlock } from "./FaqBlock";
import { SpeakersBlock } from "./SpeakersBlock";
import { SponsorsBlock } from "./SponsorsBlock";
import { TestimonialsBlock } from "./TestimonialsBlock";
import { StatisticsBlock } from "./StatisticsBlock";
import { GalleryBlock } from "./GalleryBlock";
import { DividerBlock } from "./DividerBlock";
import { NewsletterBlock } from "./NewsletterBlock";
import { RelatedEventsBlock } from "./RelatedEventsBlock";

interface BlockRow {
  id: string;
  type: string;
  content: unknown;
}

export function BlockRenderer({ block }: { block: BlockRow }) {
  const type = block.type as BlockType;
  const definition = blockRegistry[type];
  if (!definition) return null;

  const parsed = definition.schema.safeParse(block.content);
  if (!parsed.success) return null;
  const content = parsed.data as never;

  switch (type) {
    case "HERO":
      return <HeroBlock content={content} />;
    case "RICH_TEXT":
      return <RichTextBlock content={content} />;
    case "IMAGE":
      return <ImageBlock content={content} />;
    case "VIDEO":
      return <VideoBlock content={content} />;
    case "AGENDA":
      return <AgendaBlock content={content} />;
    case "TIMELINE":
      return <TimelineBlock content={content} />;
    case "LEARNING_OUTCOMES":
      return <LearningOutcomesBlock content={content} />;
    case "WHO_SHOULD_ATTEND":
      return <WhoShouldAttendBlock content={content} />;
    case "CTA":
      return <CtaBlock content={content} />;
    case "FAQ":
      return <FaqBlock content={content} />;
    case "SPEAKERS":
      return <SpeakersBlock content={content} />;
    case "SPONSORS":
      return <SponsorsBlock content={content} />;
    case "TESTIMONIALS":
      return <TestimonialsBlock content={content} />;
    case "STATISTICS":
      return <StatisticsBlock content={content} />;
    case "GALLERY":
      return <GalleryBlock content={content} />;
    case "DIVIDER":
      return <DividerBlock />;
    case "NEWSLETTER":
      return <NewsletterBlock content={content} />;
    case "RELATED_EVENTS":
      return <RelatedEventsBlock content={content} />;
    default:
      return null;
  }
}
