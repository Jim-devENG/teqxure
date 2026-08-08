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
        headlineMuted: "Engineer Products.",
        headlineEmphasis: "",
        headlineAccent: "Build Businesses.",
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

async function seedAboutSections() {
  const sections: { key: string; order: number; content: object }[] = [
    {
      key: "ABOUT_HERO",
      order: 0,
      content: {
        pageTitle: "About Teqxure",
        headline: "We build engineers who ship real products, not tutorials.",
        description:
          "Teqxure is a Product Engineering company and training organization — we build production software for real businesses, and we teach the exact system behind it.",
        ctaText: "Join the waitlist",
        ctaUrl: "/#waitlist",
        backgroundImage: "",
      },
    },
    {
      key: "ABOUT_STORY",
      order: 1,
      content: {
        title: "Our story",
        content:
          "<p>Teqxure started from a simple observation: most engineering education teaches syntax, not judgment. Tutorials end when the video ends. Real products don't.</p><p>So we built a different kind of program — one where every student ships a production system, end to end, under the same constraints a real engineering team faces: ambiguous requirements, real users, and a deadline.</p>",
        image: "",
      },
    },
    {
      key: "ABOUT_MISSION",
      order: 2,
      content: {
        title: "Our mission",
        statement:
          "To turn engineers into product builders — people who can take a problem from a blank page to something a stranger depends on.",
        icon: "Target",
      },
    },
    {
      key: "ABOUT_VISION",
      order: 3,
      content: {
        title: "Our vision",
        statement: "A world where every engineer knows how to build the whole product, not just their part of it.",
      },
    },
    {
      key: "ABOUT_STATS",
      order: 4,
      content: {
        eyebrow: "Teqxure by the numbers",
        stats: [
          { value: 12, suffix: "+", label: "Products Built" },
          { value: 100, suffix: "+", label: "Students Trained" },
          { value: 6, suffix: "", label: "Countries Reached" },
          { value: 20000, suffix: "+", label: "Engineering Hours" },
        ],
      },
    },
    {
      key: "ABOUT_FOUNDER",
      order: 5,
      content: {
        fullName: "Your Name",
        title: "Founder & CEO, Teqxure",
        shortBio: "Add a short, one-paragraph biography here from the admin.",
        longBio: "<p>Add the full founder biography here from the admin — this supports rich text formatting.</p>",
        profilePhoto: "",
        coverImage: "",
        signatureImage: "",
        quote: "",
        email: "",
        socialLinks: [],
      },
    },
    {
      key: "ABOUT_FAQ_INTRO",
      order: 6,
      content: {
        eyebrow: "Frequently Asked",
        title: "Questions about Teqxure",
      },
    },
    {
      key: "ABOUT_SEO",
      order: 7,
      content: {
        pageTitle: "About",
        metaDescription:
          "Teqxure is a Product Engineering company and training organization. Learn our story, mission, values, and the team behind the system.",
        ogImage: "",
        canonicalUrl: "",
        keywords: ["Teqxure", "Product Engineering", "about us"],
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

async function seedAboutCollections() {
  const coreValueCount = await db.coreValue.count();
  if (coreValueCount === 0) {
    const coreValues = [
      {
        title: "Craftsmanship",
        description: "We treat every product like it will be judged by a stranger who depends on it — because it will be.",
        icon: "Hammer",
      },
      {
        title: "Ownership",
        description: "Engineers here own outcomes, not just tickets — from the first user interview to the last deploy.",
        icon: "Flag",
      },
      {
        title: "Transparency",
        description: "Architecture decisions, trade-offs, and mistakes are discussed openly — nothing is hidden behind polish.",
        icon: "Eye",
      },
      {
        title: "Curiosity",
        description: "We stay students of the craft — new tools, new patterns, new constraints are treated as material to learn from.",
        icon: "Lightbulb",
      },
    ];
    for (let i = 0; i < coreValues.length; i++) {
      await db.coreValue.create({ data: { ...coreValues[i], order: i } });
    }
  }

  const differentiatorCount = await db.differentiator.count();
  if (differentiatorCount === 0) {
    const differentiators = [
      {
        heading: "Product Engineering",
        description: "We teach and practice the full discipline — problem, architecture, engineering, and shipping — not just code.",
        icon: "Layers",
      },
      {
        heading: "Architecture First",
        description: "Every system starts on paper: data flow, boundaries, and failure modes, before a single line of implementation.",
        icon: "Blocks",
      },
      {
        heading: "Artificial Intelligence Driven",
        description: "AI is used as a force multiplier for velocity — never a substitute for understanding what the code does.",
        icon: "Sparkles",
      },
      {
        heading: "Real Product Building",
        description: "No toy exercises. Every engagement ships something a real user depends on, under real constraints.",
        icon: "Rocket",
      },
      {
        heading: "Engineering Excellence",
        description: "Typed, tested, reviewed — the same bar we hold for client work is the bar every student is trained to.",
        icon: "ShieldCheck",
      },
    ];
    for (let i = 0; i < differentiators.length; i++) {
      await db.differentiator.create({ data: { ...differentiators[i], order: i } });
    }
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

function platformEmail(
  eyebrow: string,
  heading: string,
  paragraphs: string[],
  cta?: { label: string; url: string },
) {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1B1F29;">
      <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #1764FF; margin-bottom: 16px;">${eyebrow}</p>
      <h1 style="font-size: 22px; margin: 0 0 16px;">${heading}</h1>
      ${paragraphs.map((p) => `<p style="font-size: 15px; line-height: 1.6; color: #4A5568;">${p}</p>`).join("\n      ")}
      ${cta ? `<a href="${cta.url}" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #1764FF; color: #FFFFFF; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none;">${cta.label}</a>` : ""}
      <p style="font-size: 13px; color: #4A5568; margin-top: 24px;">— The Teqxure team</p>
    </div>
  `.trim();
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
    {
      key: "EVENT_REGISTRATION_CONFIRMATION",
      name: "Event registration confirmation (sent to the registrant)",
      subject: "You're registered for {{eventTitle}}",
      body: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1B1F29;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #1764FF; margin-bottom: 16px;">Event registration</p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">You're registered for {{eventTitle}}.</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">
            We'll send you the details and any reminders as the event gets closer. Here's what you told us:
          </p>
          <div style="font-size: 14px; line-height: 1.6; color: #1B1F29; background: #F8FAFC; border: 1px solid #E9EDF3; border-radius: 8px; padding: 16px;">
            {{fields}}
          </div>
          <p style="font-size: 13px; color: #4A5568; margin-top: 24px;">— The Teqxure team</p>
        </div>
      `.trim(),
    },
    {
      key: "EVENT_REGISTRATION_ADMIN_NOTIFICATION",
      name: "New event registration notification (sent to the admin)",
      subject: "New registration for {{eventTitle}}",
      body: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1B1F29;">
          <h1 style="font-size: 18px; margin: 0 0 16px;">New registration for {{eventTitle}}</h1>
          <div style="font-size: 14px; line-height: 1.6; color: #1B1F29; background: #F8FAFC; border: 1px solid #E9EDF3; border-radius: 8px; padding: 16px;">
            {{fields}}
          </div>
          <p style="font-size: 13px; color: #4A5568; margin-top: 16px;">View all registrations in the admin dashboard.</p>
        </div>
      `.trim(),
    },
    {
      key: "EVENT_REMINDER_24H",
      name: "Event reminder — 24 hours before (sent to registrants)",
      subject: "Tomorrow: {{eventTitle}}",
      body: platformEmail("Reminder", "{{eventTitle}} is tomorrow", [
        "Your event starts at {{eventDate}}. We've attached a calendar invite when you registered — see you there.",
      ]),
    },
    {
      key: "EVENT_REMINDER_1H",
      name: "Event reminder — 1 hour before (sent to registrants)",
      subject: "Starting in 1 hour: {{eventTitle}}",
      body: platformEmail("Reminder", "{{eventTitle}} starts in 1 hour", [
        "Your event starts at {{eventDate}}. See you there.",
      ]),
    },
    {
      key: "ACCOUNT_INVITE",
      name: "Workspace invite (sent when a user is provisioned)",
      subject: "You've been invited to the Teqxure workspace",
      body: platformEmail(
        "Workspace invite",
        "You're invited to the Teqxure workspace.",
        [
          "Hi {{name}}, you've been added to the Teqxure Engineering Workspace as a {{role}}.",
          "Set your password to activate your account and get started.",
        ],
        { label: "Set your password", url: "{{inviteUrl}}" },
      ),
    },
    {
      key: "WELCOME",
      name: "Welcome (sent after a new account is activated)",
      subject: "Welcome to Teqxure, {{name}}",
      body: platformEmail("Welcome", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "PAYMENT_CONFIRMED",
      name: "Payment confirmed",
      subject: "Your payment has been confirmed",
      body: platformEmail("Billing", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "COHORT_ASSIGNED",
      name: "Cohort assigned",
      subject: "You've been assigned to a cohort",
      body: platformEmail("Cohort", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SESSION_SCHEDULED",
      name: "Live session scheduled",
      subject: "New live session scheduled",
      body: platformEmail("Live session", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SESSION_REMINDER_24H",
      name: "Live session reminder — 24 hours before",
      subject: "Live session tomorrow: {{title}}",
      body: platformEmail("Reminder", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SESSION_REMINDER_1H",
      name: "Live session reminder — 1 hour before",
      subject: "Live session in 1 hour: {{title}}",
      body: platformEmail("Reminder", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SESSION_REMINDER_10M",
      name: "Live session reminder — 10 minutes before",
      subject: "Starting in 10 minutes: {{title}}",
      body: platformEmail("Reminder", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SESSION_STARTED",
      name: "Live session started",
      subject: "Your live session has started",
      body: platformEmail("Live now", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SPRINT_RELEASED",
      name: "New sprint released",
      subject: "New sprint: {{title}}",
      body: platformEmail("Sprint Room", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SPRINT_DEADLINE_REMINDER",
      name: "Sprint deadline reminder",
      subject: "Sprint deadline approaching: {{title}}",
      body: platformEmail("Sprint Room", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SUBMISSION_RECEIVED",
      name: "Submission received",
      subject: "We've received your submission",
      body: platformEmail("Sprint Room", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "FEEDBACK_RECEIVED",
      name: "Mentor feedback received",
      subject: "You've got mentor feedback",
      body: platformEmail("Sprint Room", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SUBMISSION_APPROVED",
      name: "Submission approved",
      subject: "Your submission was approved",
      body: platformEmail("Sprint Room", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "SUBMISSION_NEEDS_REVISION",
      name: "Submission needs revision",
      subject: "Your submission needs a revision",
      body: platformEmail("Sprint Room", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "RESOURCE_UPLOADED",
      name: "New resource uploaded",
      subject: "New resource available: {{title}}",
      body: platformEmail("Resources", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "ANNOUNCEMENT_POSTED",
      name: "New announcement",
      subject: "{{title}}",
      body: platformEmail("Announcement", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "MESSAGE_RECEIVED",
      name: "New direct message",
      subject: "You have a new message on Teqxure",
      body: platformEmail("Messages", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "CERTIFICATE_AVAILABLE",
      name: "Certificate available",
      subject: "Your certificate is ready",
      body: platformEmail("Certificate", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
    },
    {
      key: "BOOTCAMP_COMPLETED",
      name: "Bootcamp completed",
      subject: "You completed the bootcamp",
      body: platformEmail("Congratulations", "{{title}}", ["{{body}}"], { label: "{{actionLabel}}", url: "{{actionUrl}}" }),
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

async function seedAiIntegrations() {
  const providers = [
    { provider: "NVIDIA", type: "CHAT", label: "NVIDIA NIM", defaultModel: "meta/llama-3.1-70b-instruct", baseUrl: "https://integrate.api.nvidia.com/v1" },
    { provider: "OPENAI", type: "CHAT", label: "OpenAI", defaultModel: "gpt-4o-mini", baseUrl: null },
    { provider: "ANTHROPIC", type: "CHAT", label: "Anthropic", defaultModel: "claude-3-5-sonnet-20241022", baseUrl: null },
    {
      provider: "NVIDIA_COSMOS",
      type: "VIDEO",
      label: "NVIDIA Cosmos (Video)",
      defaultModel: "nvidia/cosmos3-generator",
      baseUrl: "https://api.ngc.nvidia.com/v2/org/nim/team/nvidia/repos/cosmos3-generator",
    },
  ];

  for (const p of providers) {
    await db.aiProvider.upsert({
      where: { provider: p.provider },
      update: {},
      create: { provider: p.provider, type: p.type, label: p.label, defaultModel: p.defaultModel, baseUrl: p.baseUrl },
    });
  }

  const existing = await db.aiSettings.findFirst();
  if (!existing) {
    await db.aiSettings.create({ data: {} });
  }
}

// ---------- Admissions: cohort application & onboarding assessment ----------

interface SeedQuestion {
  key: string;
  label: string;
  helpText?: string;
  fieldType: string;
  options?: string[];
  required?: boolean;
  conditionalOn?: { questionKey: string; equals: string };
}

interface SeedSection {
  key: string;
  title: string;
  description?: string;
  questions: SeedQuestion[];
}

const ASSESSMENT_SECTIONS: SeedSection[] = [
  {
    key: "PERSONAL_BACKGROUND",
    title: "Personal Background",
    description: "The basics — who you are and where you're starting from.",
    questions: [
      { key: "pb_occupation", label: "Current occupation", fieldType: "TEXT", required: true },
      {
        key: "pb_education_level",
        label: "Highest level of education",
        fieldType: "SELECT",
        options: ["High School", "Undergraduate Degree", "Postgraduate Degree", "Bootcamp / Vocational Training", "Self-Taught", "Other"],
        required: true,
      },
      { key: "pb_institution", label: "Institution or company", fieldType: "TEXT" },
      {
        key: "pb_worked_in_tech",
        label: "Have you worked in technology before?",
        fieldType: "RADIO",
        options: ["Yes", "No"],
        required: true,
      },
      { key: "pb_about_you", label: "Tell us a little about yourself.", fieldType: "TEXTAREA", required: true },
    ],
  },
  {
    key: "TECHNOLOGY_READINESS",
    title: "Technology Readiness",
    description: "What you'll be building with — device, connectivity, and power.",
    questions: [
      {
        key: "tr_primary_device",
        label: "What is your primary device?",
        fieldType: "SELECT",
        options: ["Windows Laptop", "MacBook", "Linux Laptop", "Desktop Computer", "Android Phone", "iPhone", "Tablet", "Other"],
        required: true,
      },
      {
        key: "tr_device_access",
        label: "Do you currently have access to a laptop or desktop computer?",
        fieldType: "RADIO",
        options: ["Yes, I own one", "Yes, I can borrow one", "No"],
        required: true,
      },
      {
        key: "tr_spec_processor",
        label: "Processor",
        helpText: "What are the specifications of your device? It's fine to say \"I don't know.\"",
        fieldType: "TEXT",
        conditionalOn: { questionKey: "tr_device_access", equals: "Yes, I own one" },
      },
      {
        key: "tr_spec_ram",
        label: "Random Access Memory (RAM)",
        fieldType: "SELECT",
        options: ["4GB or less", "8GB", "16GB", "32GB or more", "I don't know"],
        conditionalOn: { questionKey: "tr_device_access", equals: "Yes, I own one" },
      },
      {
        key: "tr_spec_storage",
        label: "Storage",
        fieldType: "SELECT",
        options: ["Less than 128GB", "128GB–256GB", "512GB", "1TB or more", "I don't know"],
        conditionalOn: { questionKey: "tr_device_access", equals: "Yes, I own one" },
      },
      {
        key: "tr_spec_os",
        label: "Operating System",
        fieldType: "TEXT",
        conditionalOn: { questionKey: "tr_device_access", equals: "Yes, I own one" },
      },
      {
        key: "tr_internet_reliability",
        label: "How reliable is your internet connection?",
        fieldType: "RADIO",
        options: ["Very Reliable", "Usually Reliable", "Sometimes Unstable", "Poor"],
        required: true,
      },
      {
        key: "tr_internet_access",
        label: "How do you usually access the internet?",
        fieldType: "SELECT",
        options: ["Home Wi-Fi", "Office Wi-Fi", "Mobile Data", "Public Wi-Fi", "Other"],
        required: true,
      },
      {
        key: "tr_data_budget",
        label: "Approximately how much internet data can you comfortably use every month?",
        fieldType: "TEXT",
      },
      {
        key: "tr_electricity_reliability",
        label: "How reliable is electricity where you live?",
        fieldType: "RADIO",
        options: ["Very Reliable", "Mostly Reliable", "Sometimes Available", "Frequently Unavailable"],
        required: true,
      },
    ],
  },
  {
    key: "TECHNICAL_BACKGROUND",
    title: "Technical Background",
    description: "No exam here — just a picture of where you're starting from technically.",
    questions: [
      { key: "tb_written_code", label: "Have you ever written code?", fieldType: "RADIO", options: ["Yes", "No"], required: true },
      { key: "tb_built_software", label: "Have you built software before?", fieldType: "RADIO", options: ["Yes", "No"], required: true },
      { key: "tb_used_ai_tools", label: "Have you used Artificial Intelligence tools?", fieldType: "RADIO", options: ["Yes", "No"], required: true },
      {
        key: "tb_technologies_explored",
        label: "Which technologies have you explored?",
        fieldType: "CHECKBOX_GROUP",
        options: [
          "JavaScript",
          "Python",
          "Java",
          "HTML / CSS",
          "SQL / Databases",
          "React or another frontend framework",
          "Node.js / backend",
          "Cloud (AWS, GCP, Azure)",
          "Mobile development",
          "AI / ML tools",
          "None yet",
          "Other",
        ],
      },
      { key: "tb_confidence_level", label: "Rate your confidence level.", fieldType: "RATING", required: true },
    ],
  },
  {
    key: "LEARNING_PROFILE",
    title: "Learning Profile",
    questions: [
      {
        key: "lp_learning_style",
        label: "How do you learn best?",
        fieldType: "SELECT",
        options: ["Watching videos", "Reading documentation", "Hands-on practice", "Learning from a mentor or instructor", "Learning in a group or community", "Trial and error"],
        required: true,
      },
      { key: "lp_problem_solving", label: "How do you normally solve difficult problems?", fieldType: "TEXTAREA", required: true },
      { key: "lp_completed_online_programmes", label: "Have you completed online programmes before?", fieldType: "RADIO", options: ["Yes", "No"], required: true },
      { key: "lp_course_dropoff_reasons", label: "What usually prevents you from completing courses?", fieldType: "TEXTAREA" },
    ],
  },
  {
    key: "COMMITMENT",
    title: "Commitment",
    questions: [
      { key: "cm_why_applying", label: "Why are you applying?", fieldType: "TEXTAREA", required: true },
      {
        key: "cm_weekly_hours",
        label: "How many hours each week can you dedicate?",
        fieldType: "SELECT",
        options: ["Less than 10 hours", "10–20 hours", "20–30 hours", "30+ hours"],
        required: true,
      },
      { key: "cm_attend_live_sessions", label: "Can you attend live sessions?", fieldType: "RADIO", options: ["Yes", "Sometimes", "No"], required: true },
      { key: "cm_weekly_assignments", label: "Are you willing to complete assignments every week?", fieldType: "RADIO", options: ["Yes", "No"], required: true },
      { key: "cm_participation_challenges", label: "What challenges might affect your participation?", fieldType: "TEXTAREA" },
    ],
  },
  {
    key: "PRODUCT_THINKING",
    title: "Product Thinking",
    questions: [
      { key: "pt_one_problem", label: "If you could solve one problem with technology, what would it be?", fieldType: "TEXTAREA", required: true },
      { key: "pt_something_built", label: "Describe something you've built before.", fieldType: "TEXTAREA" },
      { key: "pt_six_month_product", label: "If you had six months to build one product, what would you create?", fieldType: "TEXTAREA", required: true },
      { key: "pt_exciting_technology", label: "What technology excites you most today?", fieldType: "TEXT" },
    ],
  },
  {
    key: "REFLECTION",
    title: "Reflection",
    questions: [
      { key: "rf_why_admit_you", label: "Why should we admit you?", fieldType: "TEXTAREA", required: true },
      { key: "rf_hoped_change", label: "What do you hope changes in your life after Teqxure?", fieldType: "TEXTAREA", required: true },
      {
        key: "rf_intro_video",
        label: "Upload a one-minute introduction video (optional)",
        helpText: "MP4, WebM, or MOV — up to 150MB.",
        fieldType: "VIDEO",
      },
    ],
  },
];

async function seedAssessment() {
  const count = await db.assessmentSection.count();
  if (count > 0) return;

  for (let i = 0; i < ASSESSMENT_SECTIONS.length; i++) {
    const section = ASSESSMENT_SECTIONS[i];
    const createdSection = await db.assessmentSection.create({
      data: { key: section.key, title: section.title, description: section.description, order: i },
    });

    for (let j = 0; j < section.questions.length; j++) {
      const q = section.questions[j];
      await db.assessmentQuestion.create({
        data: {
          sectionId: createdSection.id,
          key: q.key,
          label: q.label,
          helpText: q.helpText,
          fieldType: q.fieldType,
          options: q.options,
          required: q.required ?? false,
          order: j,
          conditionalOn: q.conditionalOn,
        },
      });
    }
  }
  console.log(`Seeded ${ASSESSMENT_SECTIONS.length} assessment sections.`);
}

async function seedAdmissionCohort() {
  const count = await db.admissionCohort.count();
  if (count > 0) return;

  await db.admissionCohort.create({
    data: {
      name: "Cohort 8",
      slug: "cohort-8",
      applicationsOpenAt: new Date(),
      status: "OPEN",
    },
  });
  console.log("Seeded starter admission cohort (Cohort 8, OPEN).");
}

async function seedAdmissionsEmailTemplates() {
  const templates = [
    {
      key: "APPLICATION_WELCOME",
      name: "Application received — begin onboarding (sent to the applicant)",
      subject: "Welcome to Teqxure — Your Journey Begins Here",
      body: `
        <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1B1F29;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #1764FF; margin-bottom: 16px;">Cohort applications</p>
          <h1 style="font-size: 22px; margin: 0 0 16px;">Hello {{firstName}},</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">
            Thank you for applying to join {{cohortName}}. We're excited that you've taken the first step.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">
            Before we can review your application, we'd like to understand more about you. This is not an examination —
            there are no right or wrong answers. The assessment simply helps us understand your current experience,
            your learning style, your availability, your goals, and the tools you have available, so we can create the
            best possible learning experience.
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">Please complete your onboarding assessment using the button below.</p>
          <a href="{{onboardingUrl}}" style="display: inline-block; margin-top: 8px; padding: 10px 20px; background: #1764FF; color: #FFFFFF; font-size: 14px; font-weight: 500; border-radius: 8px; text-decoration: none;">Begin Your Onboarding</a>
          <p style="font-size: 13px; color: #4A5568; margin-top: 20px;">Estimated completion time: 10–15 minutes.</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4A5568;">
            We'll review your responses carefully before making admission decisions. We're excited to learn more about you.
          </p>
          <p style="font-size: 13px; color: #4A5568; margin-top: 24px;">— The Teqxure Team</p>
        </div>
      `.trim(),
    },
    {
      key: "APPLICATION_ADMIN_NOTIFICATION",
      name: "New application (sent to admissions)",
      subject: "New application: {{fullName}}",
      body: platformEmail("New Application", "{{fullName}} just applied", [
        "Email: {{email}}",
        "Cohort: {{cohortName}}",
        "Reference: {{referenceCode}}",
      ]),
    },
    {
      key: "ASSESSMENT_COMPLETED_ADMIN_NOTIFICATION",
      name: "Assessment completed (sent to admissions)",
      subject: "Assessment completed: {{fullName}}",
      body: platformEmail("Ready For Review", "{{fullName}} completed their assessment", [
        "Email: {{email}}",
        "Cohort: {{cohortName}}",
        "Reference: {{referenceCode}}",
        "Review the full application and assessment responses in the admin dashboard.",
      ]),
    },
    {
      key: "APPLICATION_ACCEPTED",
      name: "Application accepted (sent to the applicant)",
      subject: "You're in — welcome to {{cohortName}}",
      body: platformEmail("Admission Decision", "Congratulations, {{firstName}}.", [
        "You've been accepted into {{cohortName}}. We'll be in touch shortly with everything you need to get started.",
        "Reference: {{referenceCode}}",
      ]),
    },
    {
      key: "APPLICATION_WAITLISTED",
      name: "Application waitlisted (sent to the applicant)",
      subject: "You're on the waitlist for {{cohortName}}",
      body: platformEmail("Admission Decision", "Thank you, {{firstName}}.", [
        "{{cohortName}} is currently at capacity, and we've placed your application on the waitlist. We'll reach out the moment a spot opens up.",
        "Reference: {{referenceCode}}",
      ]),
    },
    {
      key: "APPLICATION_REJECTED",
      name: "Application not accepted (sent to the applicant)",
      subject: "Your application to {{cohortName}}",
      body: platformEmail("Admission Decision", "Thank you, {{firstName}}.", [
        "After careful review, we're not able to offer you a place in {{cohortName}} at this time. We'd genuinely encourage you to apply again for a future cohort.",
        "Reference: {{referenceCode}}",
      ]),
    },
    {
      key: "APPLICATION_INTERVIEW_REQUIRED",
      name: "Interview requested (sent to the applicant)",
      subject: "Next step: a short interview for {{cohortName}}",
      body: platformEmail("Admission Decision", "Thank you, {{firstName}}.", [
        "We'd like to speak with you before making a final decision on {{cohortName}}. Our team will reach out shortly to schedule a short interview.",
        "Reference: {{referenceCode}}",
      ]),
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
  await seedAboutSections();
  await seedAboutCollections();
  await seedFrameworkStages();
  await seedCurriculum();
  await seedProducts();
  await seedFaq();
  await seedWaitlistFields();
  await seedEmailTemplates();
  await seedAiIntegrations();
  await seedAssessment();
  await seedAdmissionCohort();
  await seedAdmissionsEmailTemplates();
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
