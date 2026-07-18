export interface FrameworkStage {
  index: string;
  name: string;
  description: string;
}

export const frameworkStages: FrameworkStage[] = [
  {
    index: "01",
    name: "Problem",
    description:
      "Start from a real constraint someone is living with, not a feature idea. Interview the user, name the cost of the status quo, and write down what \"solved\" looks like before touching a keyboard.",
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
