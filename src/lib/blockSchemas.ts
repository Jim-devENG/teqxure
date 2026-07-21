import { z } from "zod";
import { statSchema, type FieldMeta, type SectionDefinition } from "@/lib/sectionSchemas";

const listObjectSchema = <T extends z.ZodRawShape>(shape: T) => z.array(z.object(shape));

export const blockRegistry = {
  HERO: {
    label: "Hero",
    description: "A large title/subtitle banner with an optional background image and CTA.",
    schema: z.object({
      title: z.string(),
      subtitle: z.string().optional().default(""),
      backgroundImage: z.string().optional().default(""),
      ctaText: z.string().optional().default(""),
      ctaUrl: z.string().optional().default(""),
    }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "backgroundImage", label: "Background image (optional)", type: "image" },
      { key: "ctaText", label: "Button text (optional)", type: "text" },
      { key: "ctaUrl", label: "Button link (optional)", type: "url" },
    ],
  },
  RICH_TEXT: {
    label: "Rich Text",
    description: "A free-form rich text passage.",
    schema: z.object({ content: z.string() }),
    fields: [{ key: "content", label: "Content", type: "richtext" }],
  },
  IMAGE: {
    label: "Image",
    description: "A single image with an optional caption.",
    schema: z.object({ image: z.string().optional().default(""), caption: z.string().optional().default("") }),
    fields: [
      { key: "image", label: "Image", type: "image" },
      { key: "caption", label: "Caption (optional)", type: "text" },
    ],
  },
  VIDEO: {
    label: "Video",
    description: "An embedded video link (YouTube, Vimeo, etc).",
    schema: z.object({ videoUrl: z.string(), caption: z.string().optional().default("") }),
    fields: [
      { key: "videoUrl", label: "Video URL", type: "url" },
      { key: "caption", label: "Caption (optional)", type: "text" },
    ],
  },
  AGENDA: {
    label: "Agenda",
    description: "The event's schedule for the day.",
    schema: z.object({ title: z.string().optional().default("Agenda"), items: listObjectSchema({ time: z.string(), title: z.string(), description: z.string().optional().default("") }) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "items",
        label: "Agenda items",
        type: "list-object",
        subFields: [
          { key: "time", label: "Time", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  TIMELINE: {
    label: "Timeline",
    description: "A sequence of milestones.",
    schema: z.object({ title: z.string().optional().default("Timeline"), items: listObjectSchema({ date: z.string(), title: z.string(), description: z.string().optional().default("") }) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "items",
        label: "Milestones",
        type: "list-object",
        subFields: [
          { key: "date", label: "Date", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  LEARNING_OUTCOMES: {
    label: "Learning Outcomes",
    description: "What attendees will learn.",
    schema: z.object({ title: z.string().optional().default("What you'll learn"), items: z.array(z.string()) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "items", label: "Outcomes", type: "list-string" },
    ],
  },
  WHO_SHOULD_ATTEND: {
    label: "Who Should Attend",
    description: "Who this event is for.",
    schema: z.object({ title: z.string().optional().default("Who should attend"), items: z.array(z.string()) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "items", label: "Audience bullets", type: "list-string" },
    ],
  },
  CTA: {
    label: "Call to Action",
    description: "A focused call-to-action banner.",
    schema: z.object({
      title: z.string(),
      description: z.string().optional().default(""),
      buttonText: z.string(),
      buttonUrl: z.string(),
    }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "buttonText", label: "Button text", type: "text" },
      { key: "buttonUrl", label: "Button link", type: "url" },
    ],
  },
  FAQ: {
    label: "FAQ",
    description: "Questions specific to this event.",
    schema: z.object({ title: z.string().optional().default("Frequently asked questions"), items: listObjectSchema({ question: z.string(), answer: z.string() }) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "items",
        label: "Questions",
        type: "list-object",
        subFields: [
          { key: "question", label: "Question", type: "text" },
          { key: "answer", label: "Answer", type: "textarea" },
        ],
      },
    ],
  },
  SPEAKERS: {
    label: "Speakers",
    description: "One or more speakers for this event, pulled from the Speakers directory.",
    schema: z.object({ title: z.string().optional().default("Speakers"), speakerIds: z.array(z.string()) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "speakerIds", label: "Speakers", type: "reference-list", refModel: "Speaker" },
    ],
  },
  SPONSORS: {
    label: "Sponsors",
    description: "Sponsor logos, pulled from the Sponsors directory.",
    schema: z.object({ title: z.string().optional().default("Sponsors"), sponsorIds: z.array(z.string()) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "sponsorIds", label: "Sponsors", type: "reference-list", refModel: "Sponsor" },
    ],
  },
  TESTIMONIALS: {
    label: "Testimonials",
    description: "Quotes pulled from the sitewide Testimonials collection.",
    schema: z.object({ title: z.string().optional().default("What people are saying"), testimonialIds: z.array(z.string()) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "testimonialIds", label: "Testimonials", type: "reference-list", refModel: "Testimonial" },
    ],
  },
  STATISTICS: {
    label: "Statistics",
    description: "A row of stat counters.",
    schema: z.object({ items: z.array(statSchema) }),
    fields: [
      {
        key: "items",
        label: "Statistics",
        type: "list-object",
        subFields: [
          { key: "value", label: "Value", type: "number" },
          { key: "suffix", label: "Suffix", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
  },
  GALLERY: {
    label: "Gallery",
    description: "A grid of images.",
    schema: z.object({ images: z.array(z.string()) }),
    fields: [{ key: "images", label: "Images", type: "image-list" }],
  },
  DIVIDER: {
    label: "Divider",
    description: "A plain visual spacer between sections.",
    schema: z.object({}),
    fields: [],
  },
  NEWSLETTER: {
    label: "Newsletter",
    description: "A prompt that opens the site's waitlist signup.",
    schema: z.object({ title: z.string().optional().default("Stay in the loop"), description: z.string().optional().default("") }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  RELATED_EVENTS: {
    label: "Related Events",
    description: "Links to other events on the platform.",
    schema: z.object({ title: z.string().optional().default("You might also like"), eventIds: z.array(z.string()) }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "eventIds", label: "Events", type: "reference-list", refModel: "Event" },
    ],
  },
} as const satisfies Record<string, SectionDefinition>;

export type BlockType = keyof typeof blockRegistry;
export const BLOCK_TYPES = Object.keys(blockRegistry) as BlockType[];
export type BlockContent<K extends BlockType> = z.infer<(typeof blockRegistry)[K]["schema"]>;

/** Which reference-list fields (if any) a block type needs options for, and which model to fetch. */
export function getReferenceFields(type: BlockType): FieldMeta[] {
  return (blockRegistry[type].fields as unknown as FieldMeta[]).filter((f) => f.type === "reference-list");
}
