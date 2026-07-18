import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed.");
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: "Teqxure Admin" },
  });
  console.log(`Admin user ready: ${email}`);
}

async function seedSiteSettings() {
  const existing = await db.siteSettings.findFirst();
  if (existing) return;
  await db.siteSettings.create({
    data: {
      siteName: "Teqxure",
      tagline: "The Product Engineering Bootcamp",
      contactEmail: "teqxureglobal@gmail.com",
      notificationEmail: "teqxureglobal@gmail.com",
      logoUrl: "/logo-icon.png",
      faviconUrl: "/app-icon-512.png",
      socialLinks: [
        { label: "X / Twitter", href: "https://x.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "GitHub", href: "https://github.com" },
      ],
      seoTitle: "Teqxure — The Product Engineering Bootcamp",
      seoDescription:
        "Stop building tutorials. Start building products people actually use. Teqxure teaches the exact Product Engineering system used to build production software.",
    },
  });
}

async function seedHomepageSections() {
  const sections: { key: string; order: number; content: object }[] = [
    {
      key: "HERO",
      order: 0,
      content: {
        badge: "Product Engineering Bootcamp",
        headlineMuted: "Stop building tutorials.",
        headlineEmphasis: "Start building products people",
        headlineAccent: "actually use.",
        subhead:
          "Learn the exact Product Engineering system used to build production software across SaaS, marketplaces, education technology, cybersecurity, creator platforms, and AI products.",
        primaryCtaText: "Join the waitlist",
        secondaryCtaText: "See the framework",
        trustLabel: "Built by builders behind",
      },
    },
    {
      key: "SOCIAL_PROOF",
      order: 1,
      content: { eyebrow: "Real products built with the system" },
    },
    {
      key: "WHY_PRODUCT_ENGINEERING",
      order: 2,
      content: {
        eyebrow: "Why Product Engineering",
        title: "Tutorials teach syntax. Products teach judgment.",
        description:
          "Following a tutorial proves you can type. Shipping a product proves you can decide — what to build, for whom, and when it's actually ready for a stranger to depend on.",
        tutorialTraits: [
          "Follows a script someone else already solved",
          "Ends the moment the video ends",
          "No real user ever touches it",
          'Success means "it compiled"',
        ],
        productTraits: [
          "Starts from a problem no one has solved for this user yet",
          "Continues as long as people rely on it",
          "Strangers use it without you standing behind them",
          "Success means someone came back a second time",
        ],
        captionTitle: "Built in cohort teams",
        captionBody: "Engineers reviewing real architecture decisions, not toy exercises.",
      },
    },
    {
      key: "FRAMEWORK_INTRO",
      order: 3,
      content: {
        eyebrow: "The Teqxure System",
        title: "Problem to production, on repeat",
        description:
          "Seven stages, applied to every product you build in the program — and every product you build after it.",
      },
    },
    {
      key: "CURRICULUM_INTRO",
      order: 4,
      content: {
        eyebrow: "Twelve Weeks",
        title: "An interactive roadmap, not a syllabus PDF",
        description: "Every week maps to a stage of the framework. Select a week to see exactly what you'll ship.",
      },
    },
    {
      key: "PRODUCT_SHOWCASE_INTRO",
      order: 5,
      content: {
        eyebrow: "Product Showcase",
        title: "Six problems. Six production products.",
        description:
          "Each cohort ships real software into one of these categories — built end to end using the same seven-stage system.",
      },
    },
    {
      key: "WHAT_YOULL_BUILD",
      order: 6,
      content: {
        eyebrow: "What You'll Build",
        title: "Production-ready applications. Not toy projects.",
        description:
          "Every project shipped in the program has to survive contact with a real user — which means it has to meet the same bar production software is held to at a real company.",
        requirements: [
          "A real authentication and billing flow, not a mocked login screen",
          "A production database with a schema that survives real usage",
          "Deployed to a live URL — no localhost demos on demo day",
          "Monitoring, error tracking, and analytics wired in from day one",
          "A responsive, accessible interface tested on real devices",
          "Critical paths covered by tests you'd defend in a code review",
        ],
      },
    },
    {
      key: "STUDENT_OUTCOMES",
      order: 7,
      content: {
        eyebrow: "Student Outcomes",
        title: "What you leave with, exactly",
        description: "No participation certificate. A working system and a product real people used.",
        stats: [
          { value: 12, suffix: " weeks", label: "From problem to production" },
          { value: 1, suffix: " product", label: "Live, used by real people" },
          { value: 7, suffix: "-stage", label: "Repeatable engineering system" },
          { value: 100, suffix: "%", label: "Shipped to production infrastructure" },
        ],
        outcomes: [
          "A production-ready software product live on the internet, not a localhost demo",
          "Real users who signed up, used it, and gave you feedback you had to act on",
          "A defensible architecture you can explain and extend under questioning",
          "Fluency directing AI tooling as an engineering accelerant, not a crutch",
          "A repeatable seven-stage system for turning your next idea into shipped software",
          "A portfolio case study built the way hiring managers and investors actually evaluate work",
        ],
      },
    },
    {
      key: "INSTRUCTOR_PHILOSOPHY",
      order: 8,
      content: {
        eyebrow: "Instructor Philosophy",
        quote:
          "Software development asks how to build it. Product Engineering asks whether it should exist, who it's for, and how you'll know it's working.",
        paragraph1:
          "Most engineering education optimizes for correctness — does the function return the right value. Product Engineering optimizes for consequence — does the decision behind that function hold up when a stranger relies on it. That distinction is the entire curriculum.",
        paragraph2:
          "We teach engineers to sit with ambiguity long enough to make it someone else's clarity — then to build fast enough, with AI as leverage, that the clarity ships before it goes stale.",
      },
    },
    {
      key: "FAQ_INTRO",
      order: 9,
      content: {
        eyebrow: "Frequently Asked",
        title: "Questions builders actually ask",
      },
    },
    {
      key: "FINAL_CTA",
      order: 10,
      content: {
        badge: "Applications open for the next cohort",
        title: "Stop building tutorials. Start building the product only you can build.",
        description:
          "Twelve weeks. One production system. Real users. Join the waitlist and we'll reach out when applications open for your cohort.",
        buttonText: "Join the waitlist",
      },
    },
  ];

  for (const section of sections) {
    await db.homepageSection.upsert({
      where: { key: section.key },
      update: {},
      create: { key: section.key, order: section.order, content: section.content },
    });
  }
}

async function seedFrameworkStages() {
  const count = await db.frameworkStage.count();
  if (count > 0) return;

  const stages = [
    {
      index: "01",
      name: "Problem",
      description:
        'Start from a real constraint someone is living with, not a feature idea. Interview the user, name the cost of the status quo, and write down what "solved" looks like before touching a keyboard.',
    },
    {
      index: "02",
      name: "Pattern",
      description:
        "Every problem worth solving has already been solved somewhere adjacent. Study the existing pattern — the mental model, the workflow, the data shape — before inventing a new one.",
    },
    {
      index: "03",
      name: "Architecture",
      description:
        "Decide how data flows before you decide how pixels render. Data model, system boundaries, and failure modes are designed on paper first, so the code that follows has somewhere to stand.",
    },
    {
      index: "04",
      name: "Engineering",
      description:
        "Write the software. Typed, tested, reviewed — using AI as a force multiplier for velocity, never as a substitute for understanding what the code does.",
    },
    {
      index: "05",
      name: "Production",
      description:
        "Ship to real infrastructure with real constraints: auth, billing, monitoring, error budgets. A feature isn't done at \"it works on my machine\" — it's done when it survives a stranger's first session.",
    },
    {
      index: "06",
      name: "Users",
      description:
        "Put it in front of people who did not build it. Watch where they hesitate. Their confusion is data, not a personal failure — and it is the most expensive data you will ever collect.",
    },
    {
      index: "07",
      name: "Iteration",
      description:
        "Feed what you learned back into the problem statement. Product Engineering is a loop, not a launch — the system repeats until the product earns its place in someone's daily routine.",
    },
  ];

  for (let i = 0; i < stages.length; i++) {
    await db.frameworkStage.create({ data: { ...stages[i], order: i } });
  }
}

async function seedCurriculum() {
  const count = await db.curriculumWeek.count();
  if (count > 0) return;

  const weeks: { week: number; phase: string; title: string; outcomes: string[] }[] = [
    {
      week: 1,
      phase: "Problem",
      title: "Finding a problem worth building for",
      outcomes: [
        "Run 5 real user interviews and extract the constraint, not the feature request",
        "Write a one-page problem brief with a named user and a measurable cost of inaction",
        "Kill your first idea for the right reasons",
      ],
    },
    {
      week: 2,
      phase: "Pattern",
      title: "Studying existing patterns",
      outcomes: [
        "Deconstruct three products solving adjacent problems",
        "Map the mental models and workflows users already trust",
        "Choose which patterns to inherit and which to break",
      ],
    },
    {
      week: 3,
      phase: "Architecture",
      title: "Data modeling and system design",
      outcomes: [
        "Design a normalized data model for your product",
        "Define system boundaries: what's client, server, and third-party",
        "Map failure modes before writing a line of application code",
      ],
    },
    {
      week: 4,
      phase: "Architecture",
      title: "Technical architecture and tool selection",
      outcomes: [
        "Choose a stack you can defend in a technical interview",
        "Design your auth, billing, and data-access boundaries",
        "Set up CI, environments, and a repo structure built to scale",
      ],
    },
    {
      week: 5,
      phase: "Engineering",
      title: "Building the core with AI-accelerated engineering",
      outcomes: [
        "Ship the primary user flow end to end",
        "Use AI tooling to accelerate implementation without losing code ownership",
        "Write tests for the paths that would embarrass you in production",
      ],
    },
    {
      week: 6,
      phase: "Engineering",
      title: "Interfaces that feel considered",
      outcomes: [
        "Build a component system, not a page of one-off styles",
        "Implement responsive, accessible interfaces by default",
        "Add the motion and feedback that make software feel alive",
      ],
    },
    {
      week: 7,
      phase: "Engineering",
      title: "Data, integrations, and edge cases",
      outcomes: [
        "Integrate third-party APIs and payment infrastructure",
        "Handle the empty state, the error state, and the slow-network state",
        "Instrument logging so failures are debuggable, not mysterious",
      ],
    },
    {
      week: 8,
      phase: "Production",
      title: "Shipping to real infrastructure",
      outcomes: [
        "Deploy to production with proper environments and secrets management",
        "Set up monitoring, error tracking, and uptime alerts",
        "Pass a security and performance review before launch",
      ],
    },
    {
      week: 9,
      phase: "Users",
      title: "Getting real people to use it",
      outcomes: [
        "Recruit and onboard your first 10 real users",
        "Run structured usability sessions and capture friction, not opinions",
        "Ship a fix within 48 hours of a session, not a sprint later",
      ],
    },
    {
      week: 10,
      phase: "Iteration",
      title: "Reading usage data and iterating",
      outcomes: [
        "Instrument product analytics tied to your core value metric",
        "Identify the single highest-leverage change to make next",
        "Ship a second version informed by real usage, not assumptions",
      ],
    },
    {
      week: 11,
      phase: "Iteration",
      title: "Positioning and go-to-market",
      outcomes: [
        "Write positioning that names the problem, not just the feature list",
        "Build a launch narrative and a distribution plan",
        "Prepare a walkthrough that sells the product in under two minutes",
      ],
    },
    {
      week: 12,
      phase: "Iteration",
      title: "Demo day and what's next",
      outcomes: [
        "Present a production product to a panel of working engineers and founders",
        "Leave with a repeatable system you can apply to the next problem",
        "Walk away with a portfolio piece real users are still using",
      ],
    },
  ];

  for (let i = 0; i < weeks.length; i++) {
    const { week, phase, title, outcomes } = weeks[i];
    await db.curriculumWeek.create({
      data: {
        week,
        phase,
        title,
        order: i,
        outcomes: {
          create: outcomes.map((text, oi) => ({ text, order: oi })),
        },
      },
    });
  }
}

async function seedProducts() {
  const count = await db.product.count();
  if (count > 0) return;

  const products = [
    {
      slug: "staffintra",
      name: "StaffIntra",
      category: "Enterprise SaaS",
      oneLiner: "Internal staffing operations for distributed teams.",
      description:
        "A workforce-scheduling platform that replaced three spreadsheets and a Slack channel with one system of record — shift planning, coverage alerts, and payroll exports in a single workspace.",
      builtWith: ["Next.js", "Postgres", "Stripe Billing"],
      accent: "blue",
      metricLabel: "Shifts scheduled / week",
      metricValue: "12,400+",
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
      metricLabel: "Vendors onboarded",
      metricValue: "860",
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
      metricLabel: "Mentorship hours logged",
      metricValue: "9,100+",
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
      metricLabel: "Assets monitored",
      metricValue: "48,000+",
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
      metricLabel: "Creators onboarded",
      metricValue: "2,300+",
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
      metricLabel: "Sites generated",
      metricValue: "5,600+",
    },
  ];

  for (let i = 0; i < products.length; i++) {
    await db.product.create({ data: { ...products[i], order: i, screenshots: [] } });
  }
}

async function seedFaq() {
  const count = await db.faqItem.count();
  if (count > 0) return;

  const items = [
    {
      question: "Is this a coding bootcamp?",
      answer:
        "No. We assume you can already write code, or are prepared to learn fast. Teqxure teaches Product Engineering — the system for turning a validated problem into software real users depend on. Syntax is the easy part; deciding what to build and how to architect it is the hard part we teach.",
    },
    {
      question: "What's the difference between Product Engineering and software development?",
      answer:
        'Software development asks "how do I build this?" Product Engineering asks "should this exist, who is it for, and how do I know it\'s working?" first. You\'ll leave able to take an idea from a napkin sketch to a production deploy with paying or active users — not just a repository that runs.',
    },
    {
      question: "Do I need prior experience to join?",
      answer:
        "You need working comfort with at least one programming language and basic web concepts. This isn't an introductory programming course — it's built for engineers, technical founders, and builders ready to ship something real, with AI tooling accelerating the parts that used to take longest.",
    },
    {
      question: "What will I actually leave with?",
      answer:
        "A production-grade software product, live on the internet, used by real people you personally recruited — plus the repeatable seven-stage system to build the next one. Not a tutorial clone. Not a toy project that lives in a private repo.",
    },
    {
      question: "How much of this involves AI tooling?",
      answer:
        "AI is used throughout as an engineering accelerant — for architecture exploration, implementation speed, and review — the same way senior engineers at top companies use it today. We teach you to stay the engineer in the loop: understanding, directing, and verifying every line that ships.",
    },
    {
      question: "Is this cohort-based or self-paced?",
      answer:
        "Cohort-based. You move through the twelve-week system alongside a small group of builders, with structured milestones each week — because shipping deadlines and peer accountability are part of what makes the system work.",
    },
    {
      question: "What happens after week 12?",
      answer:
        "Demo day, where you present your live product to a panel of working engineers and founders — followed by ongoing access to the Teqxure builder network as you take on your next problem.",
    },
  ];

  for (let i = 0; i < items.length; i++) {
    await db.faqItem.create({ data: { ...items[i], order: i } });
  }
}

async function seedWaitlistFields() {
  const count = await db.waitlistField.count();
  if (count > 0) return;

  const fields = [
    { label: "Full name", fieldType: "TEXT", placeholder: "Ada Lovelace", required: true },
    { label: "Email address", fieldType: "EMAIL", placeholder: "you@domain.com", required: true },
    {
      label: "What are you building? (optional)",
      fieldType: "TEXT",
      placeholder: "SaaS, marketplace, AI product…",
      required: false,
    },
  ];

  for (let i = 0; i < fields.length; i++) {
    await db.waitlistField.create({ data: { ...fields[i], order: i } });
  }
}

async function seedEmailTemplates() {
  const templates = [
    {
      key: "WAITLIST_CONFIRMATION",
      name: "Waitlist confirmation (sent to the registrant)",
      subject: "You're on the Teqxure waitlist",
      body: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1B1F29;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #1764FF; margin-bottom: 16px;">Cohort applications</p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">You're on the list.</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">
            Thanks for registering for Teqxure — the Product Engineering Bootcamp. Here's what happens next:
          </p>
          <ol style="font-size: 15px; line-height: 1.8; color: #4A5568; padding-left: 20px;">
            <li>We review every application by hand — no automated filtering.</li>
            <li>You'll hear from us by email when the next cohort opens.</li>
            <li>If it's a fit, we'll send a short onboarding call invite before the cohort starts.</li>
          </ol>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">Here's what you told us:</p>
          <div style="font-size: 14px; line-height: 1.6; color: #1B1F29; background: #F8FAFC; border: 1px solid #E9EDF3; border-radius: 8px; padding: 16px;">
            {{fields}}
          </div>
          <p style="font-size: 13px; color: #4A5568; margin-top: 24px;">— The Teqxure team</p>
        </div>
      `.trim(),
    },
    {
      key: "WAITLIST_ADMIN_NOTIFICATION",
      name: "New registration notification (sent to the admin)",
      subject: "New Teqxure waitlist registration",
      body: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1B1F29;">
          <h1 style="font-size: 18px; margin: 0 0 16px;">Someone just joined the waitlist</h1>
          <div style="font-size: 14px; line-height: 1.6; color: #1B1F29; background: #F8FAFC; border: 1px solid #E9EDF3; border-radius: 8px; padding: 16px;">
            {{fields}}
          </div>
          <p style="font-size: 13px; color: #4A5568; margin-top: 16px;">View all applications in the admin dashboard.</p>
        </div>
      `.trim(),
    },
  ];

  for (const template of templates) {
    await db.emailTemplate.upsert({
      where: { key: template.key },
      update: {},
      create: template,
    });
  }
}

async function main() {
  await seedAdmin();
  await seedSiteSettings();
  await seedHomepageSections();
  await seedFrameworkStages();
  await seedCurriculum();
  await seedProducts();
  await seedFaq();
  await seedWaitlistFields();
  await seedEmailTemplates();
  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
