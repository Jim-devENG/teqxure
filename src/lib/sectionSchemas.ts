import { z } from "zod";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "boolean"
  | "list-string"
  | "list-object"
  | "image"
  | "richtext";

export interface FieldMeta {
  key: string;
  label: string;
  type: FieldType;
  subFields?: FieldMeta[];
}

export interface SectionDefinition {
  label: string;
  description: string;
  schema: z.ZodTypeAny;
  fields: FieldMeta[];
}

const statSchema = z.object({
  value: z.coerce.number(),
  suffix: z.string(),
  label: z.string(),
});

export const sectionRegistry = {
  HERO: {
    label: "Hero",
    description: "The first thing visitors see.",
    schema: z.object({
      badge: z.string(),
      headlineMuted: z.string(),
      headlineEmphasis: z.string(),
      headlineAccent: z.string(),
      subhead: z.string(),
      primaryCtaText: z.string(),
      secondaryCtaText: z.string(),
      trustLabel: z.string(),
    }),
    fields: [
      { key: "badge", label: "Eyebrow badge", type: "text" },
      { key: "headlineMuted", label: "Headline — muted first line", type: "text" },
      { key: "headlineEmphasis", label: "Headline — emphasis line", type: "text" },
      { key: "headlineAccent", label: "Headline — accent phrase", type: "text" },
      { key: "subhead", label: "Subheading", type: "textarea" },
      { key: "primaryCtaText", label: "Primary button text", type: "text" },
      { key: "secondaryCtaText", label: "Secondary button text", type: "text" },
      { key: "trustLabel", label: "Trust strip label", type: "text" },
    ],
  },
  SOCIAL_PROOF: {
    label: "Social Proof",
    description: "The strip of product names below the hero.",
    schema: z.object({ eyebrow: z.string() }),
    fields: [{ key: "eyebrow", label: "Eyebrow label", type: "text" }],
  },
  WHY_PRODUCT_ENGINEERING: {
    label: "Why Product Engineering",
    description: "Tutorials vs. products comparison section.",
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      tutorialTraits: z.array(z.string()),
      productTraits: z.array(z.string()),
      captionTitle: z.string(),
      captionBody: z.string(),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "tutorialTraits", label: "\"Tutorials\" column bullets", type: "list-string" },
      { key: "productTraits", label: "\"Product Engineering\" column bullets", type: "list-string" },
      { key: "captionTitle", label: "Photo caption title", type: "text" },
      { key: "captionBody", label: "Photo caption body", type: "textarea" },
    ],
  },
  FRAMEWORK_INTRO: {
    label: "Framework",
    description: "Intro copy above the 7-stage system diagram.",
    schema: z.object({ eyebrow: z.string(), title: z.string(), description: z.string() }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  CURRICULUM_INTRO: {
    label: "Curriculum",
    description: "Intro copy above the interactive 12-week roadmap.",
    schema: z.object({ eyebrow: z.string(), title: z.string(), description: z.string() }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  PRODUCT_SHOWCASE_INTRO: {
    label: "Product Showcase",
    description: "Intro copy above the product cards.",
    schema: z.object({ eyebrow: z.string(), title: z.string(), description: z.string() }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  WHAT_YOULL_BUILD: {
    label: "What You'll Build",
    description: "Requirements checklist section.",
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      requirements: z.array(z.string()),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "requirements", label: "Requirement bullets", type: "list-string" },
    ],
  },
  STUDENT_OUTCOMES: {
    label: "Student Outcomes",
    description: "Stat tiles + outcomes list.",
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      stats: z.array(statSchema),
      outcomes: z.array(z.string()),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "stats",
        label: "Stat tiles",
        type: "list-object",
        subFields: [
          { key: "value", label: "Value", type: "number" },
          { key: "suffix", label: "Suffix", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
      { key: "outcomes", label: "Outcome bullets", type: "list-string" },
    ],
  },
  INSTRUCTOR_PHILOSOPHY: {
    label: "Instructor Philosophy",
    description: "Editorial quote section.",
    schema: z.object({
      eyebrow: z.string(),
      quote: z.string(),
      paragraph1: z.string(),
      paragraph2: z.string(),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "quote", label: "Pull quote", type: "textarea" },
      { key: "paragraph1", label: "Paragraph 1", type: "textarea" },
      { key: "paragraph2", label: "Paragraph 2", type: "textarea" },
    ],
  },
  FAQ_INTRO: {
    label: "FAQ",
    description: "Intro copy above the FAQ accordion.",
    schema: z.object({ eyebrow: z.string(), title: z.string() }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  FINAL_CTA: {
    label: "Final Call To Action",
    description: "The closing section before the footer.",
    schema: z.object({
      badge: z.string(),
      title: z.string(),
      description: z.string(),
      buttonText: z.string(),
    }),
    fields: [
      { key: "badge", label: "Eyebrow badge", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "buttonText", label: "Button text", type: "text" },
    ],
  },

  // ---------- About page ----------
  ABOUT_HERO: {
    label: "About — Hero",
    description: "The top of the About page.",
    schema: z.object({
      pageTitle: z.string(),
      headline: z.string(),
      description: z.string(),
      ctaText: z.string(),
      ctaUrl: z.string(),
      backgroundImage: z.string().optional().default(""),
    }),
    fields: [
      { key: "pageTitle", label: "Eyebrow / page title", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "description", label: "Supporting description", type: "textarea" },
      { key: "ctaText", label: "Call-to-action button text", type: "text" },
      { key: "ctaUrl", label: "Call-to-action button link", type: "url" },
      { key: "backgroundImage", label: "Background illustration (optional)", type: "image" },
    ],
  },
  ABOUT_STORY: {
    label: "About — Company Story",
    description: "The narrative section about how Teqxure came to be.",
    schema: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string().optional().default(""),
    }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "content", label: "Story", type: "richtext" },
      { key: "image", label: "Supporting image (optional)", type: "image" },
    ],
  },
  ABOUT_MISSION: {
    label: "About — Mission",
    description: "The company mission statement.",
    schema: z.object({
      title: z.string(),
      statement: z.string(),
      icon: z.string().optional().default(""),
    }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "statement", label: "Mission statement", type: "textarea" },
      { key: "icon", label: "Icon (Lucide icon name, optional)", type: "text" },
    ],
  },
  ABOUT_VISION: {
    label: "About — Vision",
    description: "The company vision statement.",
    schema: z.object({
      title: z.string(),
      statement: z.string(),
    }),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "statement", label: "Vision statement", type: "textarea" },
    ],
  },
  ABOUT_STATS: {
    label: "About — Company Statistics",
    description: "Counters like products built, students trained, etc.",
    schema: z.object({
      eyebrow: z.string(),
      stats: z.array(statSchema),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      {
        key: "stats",
        label: "Statistics",
        type: "list-object",
        subFields: [
          { key: "value", label: "Value", type: "number" },
          { key: "suffix", label: "Suffix (e.g. +)", type: "text" },
          { key: "label", label: "Label (e.g. Products Built)", type: "text" },
        ],
      },
    ],
  },
  ABOUT_FOUNDER: {
    label: "About — Founder",
    description: "The dedicated founder section.",
    schema: z.object({
      fullName: z.string(),
      title: z.string(),
      shortBio: z.string(),
      longBio: z.string(),
      profilePhoto: z.string().optional().default(""),
      coverImage: z.string().optional().default(""),
      signatureImage: z.string().optional().default(""),
      quote: z.string().optional().default(""),
      email: z.string().optional().default(""),
      socialLinks: z.array(z.object({ platform: z.string(), href: z.string() })),
    }),
    fields: [
      { key: "fullName", label: "Full name", type: "text" },
      { key: "title", label: "Professional title", type: "text" },
      { key: "shortBio", label: "Short biography", type: "textarea" },
      { key: "longBio", label: "Long biography", type: "richtext" },
      { key: "profilePhoto", label: "Profile photo", type: "image" },
      { key: "coverImage", label: "Cover image", type: "image" },
      { key: "signatureImage", label: "Signature image (optional)", type: "image" },
      { key: "quote", label: "Quote (optional)", type: "textarea" },
      { key: "email", label: "Email address", type: "text" },
      {
        key: "socialLinks",
        label: "Social links",
        type: "list-object",
        subFields: [
          { key: "platform", label: "Platform", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
      },
    ],
  },
  ABOUT_FAQ_INTRO: {
    label: "About — FAQ",
    description: "Intro copy above the About page's FAQ accordion.",
    schema: z.object({ eyebrow: z.string(), title: z.string() }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  ABOUT_SEO: {
    label: "About — SEO",
    description: "Search engine metadata for the About page.",
    schema: z.object({
      pageTitle: z.string(),
      metaDescription: z.string(),
      ogImage: z.string().optional().default(""),
      canonicalUrl: z.string().optional().default(""),
      keywords: z.array(z.string()),
    }),
    fields: [
      { key: "pageTitle", label: "Page title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "ogImage", label: "Open Graph image (optional)", type: "image" },
      { key: "canonicalUrl", label: "Canonical URL (optional)", type: "url" },
      { key: "keywords", label: "Keywords", type: "list-string" },
    ],
  },
} as const satisfies Record<string, SectionDefinition>;

export type SectionKey = keyof typeof sectionRegistry;
export const SECTION_KEYS = Object.keys(sectionRegistry) as SectionKey[];
export type SectionContent<K extends SectionKey> = z.infer<(typeof sectionRegistry)[K]["schema"]>;
