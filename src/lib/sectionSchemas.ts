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
  | "richtext"
  | "image-list"
  | "reference-list";

/** For "reference-list" fields: which model's rows populate the picker. */
export type RefModel = "Speaker" | "Sponsor" | "Testimonial" | "Event";

export interface FieldMeta {
  key: string;
  label: string;
  type: FieldType;
  subFields?: FieldMeta[];
  refModel?: RefModel;
}

export interface SectionDefinition {
  label: string;
  description: string;
  schema: z.ZodTypeAny;
  fields: FieldMeta[];
}

export const statSchema = z.object({
  value: z.coerce.number(),
  suffix: z.string(),
  label: z.string(),
});

/**
 * Shared shapes reused across Home/About/Academy/Studio/Community/Research —
 * extracted so every "hero"-shaped or "closing CTA"-shaped section validates
 * and renders identically regardless of which page it lives on.
 */
export const heroSchema = z.object({
  badge: z.string(),
  headlineMuted: z.string(),
  headlineEmphasis: z.string(),
  headlineAccent: z.string(),
  subhead: z.string(),
  primaryCtaText: z.string(),
  secondaryCtaText: z.string(),
  trustLabel: z.string(),
});

export const pageHeroSchema = z.object({
  pageTitle: z.string(),
  headline: z.string(),
  description: z.string(),
  ctaText: z.string(),
  ctaUrl: z.string(),
  backgroundImage: z.string().optional().default(""),
});

export const finalCtaSchema = z.object({
  badge: z.string(),
  title: z.string(),
  description: z.string(),
  buttonText: z.string(),
});

export const showcaseIntroSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
});

export const pageSeoSchema = z.object({
  pageTitle: z.string(),
  metaDescription: z.string(),
  ogImage: z.string().optional().default(""),
  canonicalUrl: z.string().optional().default(""),
  keywords: z.array(z.string()),
});

export const sectionRegistry = {
  HERO: {
    label: "Hero",
    description: "The first thing visitors see.",
    schema: heroSchema,
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
    schema: showcaseIntroSchema,
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
    description: "The closing section before the footer (Academy page).",
    schema: finalCtaSchema,
    fields: [
      { key: "badge", label: "Eyebrow badge", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "buttonText", label: "Button text", type: "text" },
    ],
  },

  // ---------- Home page ----------
  OFFERINGS_OVERVIEW: {
    label: "Home — Offerings Overview",
    description: "The four-tier teaser grid linking to Studio/Academy/Community/Research.",
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      tiers: z.array(
        z.object({
          name: z.string(),
          tagline: z.string(),
          description: z.string(),
          href: z.string(),
          ctaText: z.string(),
        }),
      ),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "tiers",
        label: "Tiers",
        type: "list-object",
        subFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "tagline", label: "Tagline", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "href", label: "Link", type: "url" },
          { key: "ctaText", label: "Button text", type: "text" },
        ],
      },
    ],
  },
  HOME_CTA: {
    label: "Home — Call To Action",
    description: "Home's own closing section before the footer.",
    schema: finalCtaSchema,
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
    schema: pageHeroSchema,
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
    schema: pageSeoSchema,
    fields: [
      { key: "pageTitle", label: "Page title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "ogImage", label: "Open Graph image (optional)", type: "image" },
      { key: "canonicalUrl", label: "Canonical URL (optional)", type: "url" },
      { key: "keywords", label: "Keywords", type: "list-string" },
    ],
  },

  // ---------- Academy page ----------
  ACADEMY_SEO: {
    label: "Academy — SEO",
    description: "Search engine metadata for the Academy page.",
    schema: pageSeoSchema,
    fields: [
      { key: "pageTitle", label: "Page title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "ogImage", label: "Open Graph image (optional)", type: "image" },
      { key: "canonicalUrl", label: "Canonical URL (optional)", type: "url" },
      { key: "keywords", label: "Keywords", type: "list-string" },
    ],
  },
  ACADEMY_HERO: {
    label: "Academy — Hero",
    description: "The top of the Academy page.",
    schema: heroSchema,
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

  // ---------- Studio page ----------
  STUDIO_SEO: {
    label: "Studio — SEO",
    description: "Search engine metadata for the Studio page.",
    schema: pageSeoSchema,
    fields: [
      { key: "pageTitle", label: "Page title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "ogImage", label: "Open Graph image (optional)", type: "image" },
      { key: "canonicalUrl", label: "Canonical URL (optional)", type: "url" },
      { key: "keywords", label: "Keywords", type: "list-string" },
    ],
  },
  STUDIO_HERO: {
    label: "Studio — Hero",
    description: "The top of the Studio page.",
    schema: pageHeroSchema,
    fields: [
      { key: "pageTitle", label: "Eyebrow / page title", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "description", label: "Supporting description", type: "textarea" },
      { key: "ctaText", label: "Call-to-action button text", type: "text" },
      { key: "ctaUrl", label: "Call-to-action button link", type: "url" },
      { key: "backgroundImage", label: "Background illustration (optional)", type: "image" },
    ],
  },
  STUDIO_PROCESS: {
    label: "Studio — Process",
    description: "How a Studio engagement runs, step by step.",
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      steps: z.array(z.object({ title: z.string(), description: z.string() })),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "steps",
        label: "Process steps",
        type: "list-object",
        subFields: [
          { key: "title", label: "Step title", type: "text" },
          { key: "description", label: "Step description", type: "textarea" },
        ],
      },
    ],
  },
  STUDIO_PROOF: {
    label: "Studio — Proof",
    description: "Intro copy above the Studio portfolio (reuses the Product Showcase grid).",
    schema: showcaseIntroSchema,
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  STUDIO_CTA: {
    label: "Studio — Call To Action",
    description: "The closing section on the Studio page.",
    schema: finalCtaSchema,
    fields: [
      { key: "badge", label: "Eyebrow badge", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "buttonText", label: "Button text", type: "text" },
    ],
  },

  // ---------- Community page ----------
  COMMUNITY_SEO: {
    label: "Community — SEO",
    description: "Search engine metadata for the Community page.",
    schema: pageSeoSchema,
    fields: [
      { key: "pageTitle", label: "Page title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "ogImage", label: "Open Graph image (optional)", type: "image" },
      { key: "canonicalUrl", label: "Canonical URL (optional)", type: "url" },
      { key: "keywords", label: "Keywords", type: "list-string" },
    ],
  },
  COMMUNITY_HERO: {
    label: "Community — Hero",
    description: "The top of the Community page.",
    schema: pageHeroSchema,
    fields: [
      { key: "pageTitle", label: "Eyebrow / page title", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "description", label: "Supporting description", type: "textarea" },
      { key: "ctaText", label: "Call-to-action button text", type: "text" },
      { key: "ctaUrl", label: "Call-to-action button link", type: "url" },
      { key: "backgroundImage", label: "Background illustration (optional)", type: "image" },
    ],
  },
  COMMUNITY_BENEFITS: {
    label: "Community — Benefits",
    description: "What members get, as a checklist.",
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      benefits: z.array(z.string()),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "benefits", label: "Benefit bullets", type: "list-string" },
    ],
  },
  COMMUNITY_CTA: {
    label: "Community — Call To Action",
    description: "The closing section on the Community page.",
    schema: finalCtaSchema,
    fields: [
      { key: "badge", label: "Eyebrow badge", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "buttonText", label: "Button text", type: "text" },
    ],
  },

  // ---------- Research page ----------
  RESEARCH_SEO: {
    label: "Research — SEO",
    description: "Search engine metadata for the Research page.",
    schema: pageSeoSchema,
    fields: [
      { key: "pageTitle", label: "Page title", type: "text" },
      { key: "metaDescription", label: "Meta description", type: "textarea" },
      { key: "ogImage", label: "Open Graph image (optional)", type: "image" },
      { key: "canonicalUrl", label: "Canonical URL (optional)", type: "url" },
      { key: "keywords", label: "Keywords", type: "list-string" },
    ],
  },
  RESEARCH_HERO: {
    label: "Research — Hero",
    description: "The top of the Research page.",
    schema: pageHeroSchema,
    fields: [
      { key: "pageTitle", label: "Eyebrow / page title", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "description", label: "Supporting description", type: "textarea" },
      { key: "ctaText", label: "Call-to-action button text", type: "text" },
      { key: "ctaUrl", label: "Call-to-action button link", type: "url" },
      { key: "backgroundImage", label: "Background illustration (optional)", type: "image" },
    ],
  },
  RESEARCH_AREAS: {
    label: "Research — Areas",
    description: "The forward-looking technology areas Teqxure is watching.",
    schema: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      areas: z.array(
        z.object({ name: z.string(), description: z.string(), icon: z.string().optional().default("") }),
      ),
    }),
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "areas",
        label: "Research areas",
        type: "list-object",
        subFields: [
          { key: "name", label: "Name", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "icon", label: "Icon (Lucide icon name, optional)", type: "text" },
        ],
      },
    ],
  },
} as const satisfies Record<string, SectionDefinition>;

export type SectionKey = keyof typeof sectionRegistry;
export const SECTION_KEYS = Object.keys(sectionRegistry) as SectionKey[];
export type SectionContent<K extends SectionKey> = z.infer<(typeof sectionRegistry)[K]["schema"]>;
