import { db } from "@/lib/db";
import { sectionRegistry, type SectionKey } from "@/lib/sectionSchemas";
import { PAGE_GROUPS } from "@/lib/sectionPages";

const homeSections: Record<string, unknown> = {
  OFFERINGS_OVERVIEW: {
    eyebrow: "Four Ways Into the Renaissance",
    title: "Choose how you enter the Renaissance.",
    description: "Every Product Architect starts somewhere. Pick the door that matches where you are.",
    tiers: [
      {
        name: "Studio",
        tagline: "We build. You own it.",
        description:
          "A dedicated Teqxure team engineers your production-ready AI product in days, not months — for founders and enterprises who need it built, not taught.",
        href: "/studio",
        ctaText: "Enter the Studio",
      },
      {
        name: "Academy",
        tagline: "From Code Writer to Product Architect.",
        description:
          "The twelve-week system that transforms engineers into Product Architects — the same system behind every product in our portfolio.",
        href: "/academy",
        ctaText: "Enter the Academy",
      },
      {
        name: "Community",
        tagline: "The network for those already building.",
        description:
          "Join the standing network of Product Architects — ongoing access, live sessions, and direct proximity to how we build.",
        href: "/community",
        ctaText: "Enter the Community",
      },
      {
        name: "Research",
        tagline: "Preparing for what comes after AI.",
        description: "AI is the current wave. This is where we track the next one — so the Renaissance never stalls.",
        href: "/research",
        ctaText: "Enter Research",
      },
    ],
  },
  HOME_CTA: {
    badge: "Four tiers. One Renaissance.",
    title: "Pick your door. The Renaissance doesn't wait.",
    description:
      "Whether you need a product built, a transformation completed, a network to belong to, or the next wave on your radar — there's a way in. Join the waitlist and we'll route you to the right one.",
    buttonText: "Join the Renaissance",
  },
};

const academySections: Record<string, unknown> = {
  ACADEMY_SEO: {
    pageTitle: "Academy — The Product Engineering Renaissance | Teqxure",
    metaDescription:
      "The twelve-week system that transforms engineers into Product Architects. Real products, real users, AI as your engineering engine — not a course, a transformation.",
    ogImage: "",
    canonicalUrl: "",
    keywords: ["Teqxure Academy", "Product Architect", "Product Engineering", "AI-augmented development", "twelve-week program"],
  },
  ACADEMY_HERO: {
    badge: "The Product Architect Program",
    headlineMuted: "From Code Writer to",
    headlineEmphasis: "",
    headlineAccent: "Product Architect.",
    subhead:
      "Twelve weeks. One production system, engineered by you with AI as your engine. This is the exact transformation behind every product in the Teqxure portfolio. Not a course. Not training. A new engineering hierarchy, installed in you.",
    primaryCtaText: "Join the Renaissance",
    secondaryCtaText: "See the System",
    trustLabel: "Engineered by the Product Architects behind",
  },
};

const studioSections: Record<string, unknown> = {
  STUDIO_SEO: {
    pageTitle: "Studio — Elite AI Product Engineering | Teqxure",
    metaDescription:
      "The Teqxure Studio engineers production-ready AI products for founders and enterprises. We design, orchestrate, and ship — you own what we build.",
    ogImage: "",
    canonicalUrl: "",
    keywords: ["Teqxure Studio", "AI product studio", "product engineering", "AI product development", "Product Architects"],
  },
  STUDIO_HERO: {
    pageTitle: "The Studio",
    headline: "We engineer your product. AI executes. You own it.",
    description:
      "The Elite AI Product Studio is where Teqxure's Product Architects build production-ready AI products for founders and enterprises — designed, orchestrated, and shipped by us, in days, not months.",
    ctaText: "Start a Studio Engagement",
    ctaUrl: "/#waitlist",
    backgroundImage: "",
  },
  STUDIO_PROCESS: {
    eyebrow: "How the Studio Works",
    title: "Four stages. Nothing subtracted, nothing lingered on.",
    description: "The same seven-stage system that trains our Product Architects, compressed into a Studio engagement built for speed.",
    steps: [
      {
        title: "Architect",
        description: "We define the problem, the architecture, and what \"done\" means — before a single line ships.",
      },
      {
        title: "Engineer",
        description: "Our Product Architects direct AI to build the product — typed, tested, reviewed, production-grade from day one.",
      },
      {
        title: "Ship",
        description: "Deployed to real infrastructure with real users in mind. Production-ready in 7–14 days, not sprints stretched into quarters.",
      },
      {
        title: "Hand Off",
        description: "You own the product, the codebase, and the architecture decisions behind it — fully documented, fully yours.",
      },
    ],
  },
  STUDIO_PROOF: {
    eyebrow: "Studio Portfolio",
    title: "Six problems. Six production products. Built by this Studio.",
    description: "Every product below was engineered by Teqxure's Product Architects, using the same system a Studio engagement runs on.",
  },
  STUDIO_CTA: {
    badge: "For founders and enterprise teams",
    title: "Stop looking for a dev team. Get a Studio of Product Architects.",
    description:
      "This is not AI training — this is engineering evolution. Founders get a production-ready AI product in days. Enterprises get their engineering culture transformed to build 5x faster with AI. Tell us what you're building.",
    buttonText: "Start a Studio Engagement",
  },
};

const communitySections: Record<string, unknown> = {
  COMMUNITY_SEO: {
    pageTitle: "Community — The Product Architect Network | Teqxure",
    metaDescription:
      "Join Africa's elite network of Product Architects. Ongoing access, live sessions, and direct proximity to how production AI products get built.",
    ogImage: "",
    canonicalUrl: "",
    keywords: ["Teqxure Community", "Product Architect network", "AI Advantage Community", "engineering community Africa"],
  },
  COMMUNITY_HERO: {
    pageTitle: "The Community",
    headline: "Join Africa's elite network of Product Architects.",
    description:
      "The AI Advantage Community is where Product Architects stay sharp after the transformation — standing access to the people, sessions, and systems behind everything Teqxure builds.",
    ctaText: "Request Access",
    ctaUrl: "/#waitlist",
    backgroundImage: "",
  },
  COMMUNITY_BENEFITS: {
    eyebrow: "Membership, Not Attendance",
    title: "What standing inside the Renaissance gets you.",
    description: "This is not a group chat. It's ongoing proximity to how Product Architects actually work.",
    benefits: [
      "Direct access to the Product Architects behind every Teqxure product",
      "Recurring live sessions on AI-augmented development and product architecture",
      "First access to new Studio case studies and Academy curriculum updates",
      "A standing network of engineers who've already made the transformation",
      "Priority consideration for Studio collaborations and Corporate engagements",
    ],
  },
  COMMUNITY_CTA: {
    badge: "Membership opens in rolling cohorts",
    title: "Don't be replaced. Be transformed — permanently.",
    description: "The Academy transforms you once. The Community keeps you there. Join the waitlist and we'll reach out when membership opens.",
    buttonText: "Join the Waitlist",
  },
};

const researchSections: Record<string, unknown> = {
  RESEARCH_SEO: {
    pageTitle: "Research — Preparing for the Next Wave | Teqxure",
    metaDescription:
      "AI is the current wave. Teqxure's Research vision tracks what comes after — so the Product Engineering Renaissance never stalls.",
    ogImage: "",
    canonicalUrl: "",
    keywords: ["Teqxure Research", "future technology", "emerging technology", "quantum computing", "neural interfaces"],
  },
  RESEARCH_HERO: {
    pageTitle: "Research",
    headline: "While we master AI today, we're preparing for the next wave.",
    description:
      "AI is the current beachhead — not the destination. This is where Teqxure tracks the technologies that will define the engineering hierarchy after it.",
    ctaText: "",
    ctaUrl: "",
    backgroundImage: "",
  },
  RESEARCH_AREAS: {
    eyebrow: "Where We're Looking",
    title: "Forward-thinking authority, not speculation.",
    description:
      "AI is not the finish line. These are the areas the Renaissance is already watching — because the Product Architects of tomorrow will need to master more than one wave.",
    areas: [
      {
        name: "Agentic Systems",
        description:
          "Beyond single-model AI — orchestrated systems of autonomous agents that execute multi-step product work under a Product Architect's direction.",
        icon: "Brain",
      },
      {
        name: "Quantum-Ready Architecture",
        description:
          "Systems designed today so they don't have to be rebuilt when quantum-accelerated computation becomes a production reality, not a research paper.",
        icon: "Zap",
      },
      {
        name: "Neural Interfaces",
        description:
          "The next input layer after keyboards and prompts. We're tracking how direct human-machine interfaces will change what \"the user\" even means.",
        icon: "Compass",
      },
      {
        name: "Autonomous Product Loops",
        description: "Products that architect their own next iteration from usage data — the Iteration stage of our system, pushed toward self-direction.",
        icon: "TrendingUp",
      },
    ],
  },
};

async function validate(groupName: string, sections: Record<string, unknown>) {
  for (const [key, content] of Object.entries(sections)) {
    const definition = sectionRegistry[key as SectionKey];
    if (!definition) throw new Error(`Unknown section key "${key}" in ${groupName}`);
    const result = definition.schema.safeParse(content);
    if (!result.success) {
      console.error(`Validation failed for ${key}:`, result.error.format());
      throw new Error(`Validation failed for ${key} in ${groupName}`);
    }
  }
}

async function main() {
  await validate("home", homeSections);
  await validate("academy", academySections);
  await validate("studio", studioSections);
  await validate("community", communitySections);
  await validate("research", researchSections);
  console.log("All section payloads validated against schema. Writing...");

  await db.$transaction(
    async (tx) => {
      // Home: upsert the 2 new keys, then reassign clean sequential `order`
      // to every key that actually belongs on Home going forward (order
      // genuinely drives Home's dynamic render loop, unlike every other
      // static page below).
      for (const [key, content] of Object.entries(homeSections)) {
        await tx.homepageSection.upsert({
          where: { key },
          update: { content: content as never },
          create: { key, order: 0, content: content as never },
        });
      }
      const homeKeys = PAGE_GROUPS.home.keys;
      await Promise.all(
        homeKeys.map((key, index) => tx.homepageSection.update({ where: { key }, data: { order: index } })),
      );

      // Academy: upsert its 2 brand-new keys, then move the 7 pre-existing
      // keys off Home (visible:false there is what actually hides them —
      // Academy's own page reads them directly, ignoring `visible`).
      const academyKeys = PAGE_GROUPS.academy.keys;
      for (const [i, key] of academyKeys.entries()) {
        const content = academySections[key];
        if (content) {
          await tx.homepageSection.upsert({
            where: { key },
            update: { content: content as never, order: i },
            create: { key, order: i, content: content as never },
          });
        } else {
          await tx.homepageSection.update({ where: { key }, data: { order: i, visible: false } });
        }
      }

      // Studio / Community / Research: brand new page groups, every key is new.
      for (const [groupSlug, sections] of [
        ["studio", studioSections],
        ["community", communitySections],
        ["research", researchSections],
      ] as const) {
        const keys = PAGE_GROUPS[groupSlug].keys;
        for (const [i, key] of keys.entries()) {
          await tx.homepageSection.upsert({
            where: { key },
            update: { content: sections[key] as never, order: i },
            create: { key, order: i, content: sections[key] as never },
          });
        }
      }
    },
    { timeout: 30000, maxWait: 15000 },
  );

  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
