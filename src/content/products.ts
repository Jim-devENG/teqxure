export type ProductAccent = "blue" | "cyan" | "emerald";

export interface Product {
  slug: string;
  name: string;
  category: string;
  oneLiner: string;
  description: string;
  builtWith: string[];
  accent: ProductAccent;
  metric: { label: string; value: string };
}

export const products: Product[] = [
  {
    slug: "staffintra",
    name: "StaffIntra",
    category: "Enterprise SaaS",
    oneLiner: "Internal staffing operations for distributed teams.",
    description:
      "A workforce-scheduling platform that replaced three spreadsheets and a Slack channel with one system of record — shift planning, coverage alerts, and payroll exports in a single workspace.",
    builtWith: ["Next.js", "Postgres", "Stripe Billing"],
    accent: "blue",
    metric: { label: "Shifts scheduled / week", value: "12,400+" },
  },
  {
    slug: "selecta",
    name: "Selecta",
    category: "Marketplace",
    oneLiner: "A curated marketplace connecting vetted vendors to buyers.",
    description:
      "Two-sided marketplace infrastructure — vendor onboarding, escrowed payments, and a matching engine that ranks vendors by delivery reliability instead of ad spend.",
    builtWith: ["Next.js", "Postgres", "Stripe Connect"],
    accent: "emerald",
    metric: { label: "Vendors onboarded", value: "860" },
  },
  {
    slug: "ispora",
    name: "Ispora",
    category: "Education Technology",
    oneLiner: "Mentorship infrastructure for the African diaspora.",
    description:
      "A structured mentorship platform pairing diaspora professionals with founders and students — cohort scheduling, session notes, and outcome tracking built for accountability, not just introductions.",
    builtWith: ["Next.js", "Postgres", "Twilio"],
    accent: "cyan",
    metric: { label: "Mentorship hours logged", value: "9,100+" },
  },
  {
    slug: "visionsmith",
    name: "VisionSmith",
    category: "Cybersecurity",
    oneLiner: "Attack-surface monitoring for lean security teams.",
    description:
      "Continuous external attack-surface scanning with prioritized findings — built so a two-person security team can triage what matters instead of drowning in raw scanner output.",
    builtWith: ["Next.js", "Go", "ClickHouse"],
    accent: "blue",
    metric: { label: "Assets monitored", value: "48,000+" },
  },
  {
    slug: "trumpet",
    name: "Trumpet",
    category: "Creator Platform",
    oneLiner: "Distribution tooling for independent creators.",
    description:
      "A publishing and audience-growth dashboard that unifies analytics across platforms, so creators see one number that matters instead of five disconnected dashboards.",
    builtWith: ["Next.js", "Postgres", "Redis"],
    accent: "emerald",
    metric: { label: "Creators onboarded", value: "2,300+" },
  },
  {
    slug: "webifant",
    name: "Webifant",
    category: "Artificial Intelligence",
    oneLiner: "AI-assisted website generation for small businesses.",
    description:
      "A generation pipeline that turns a business description into a production-ready site — structured prompting, component assembly, and a review layer that catches hallucinated content before publish.",
    builtWith: ["Next.js", "Claude", "Vercel AI SDK"],
    accent: "cyan",
    metric: { label: "Sites generated", value: "5,600+" },
  },
];
