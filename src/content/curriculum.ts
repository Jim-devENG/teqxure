export type FrameworkPhaseName =
  | "Problem"
  | "Pattern"
  | "Architecture"
  | "Engineering"
  | "Production"
  | "Users"
  | "Iteration";

export interface CurriculumWeek {
  week: number;
  phase: FrameworkPhaseName;
  title: string;
  outcomes: string[];
}

export const curriculum: CurriculumWeek[] = [
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
