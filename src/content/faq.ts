export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "Is this a coding bootcamp?",
    answer:
      "No. We assume you can already write code, or are prepared to learn fast. Teqxure teaches Product Engineering — the system for turning a validated problem into software real users depend on. Syntax is the easy part; deciding what to build and how to architect it is the hard part we teach.",
  },
  {
    question: "What's the difference between Product Engineering and software development?",
    answer:
      "Software development asks \"how do I build this?\" Product Engineering asks \"should this exist, who is it for, and how do I know it's working?\" first. You'll leave able to take an idea from a napkin sketch to a production deploy with paying or active users — not just a repository that runs.",
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
