export interface OutcomeStat {
  value: number;
  suffix: string;
  label: string;
}

export const outcomeStats: OutcomeStat[] = [
  { value: 12, suffix: " weeks", label: "From problem to production" },
  { value: 1, suffix: " product", label: "Live, used by real people" },
  { value: 7, suffix: "-stage", label: "Repeatable engineering system" },
  { value: 100, suffix: "%", label: "Shipped to production infrastructure" },
];

export const outcomeList: string[] = [
  "A production-ready software product live on the internet, not a localhost demo",
  "Real users who signed up, used it, and gave you feedback you had to act on",
  "A defensible architecture you can explain and extend under questioning",
  "Fluency directing AI tooling as an engineering accelerant, not a crutch",
  "A repeatable seven-stage system for turning your next idea into shipped software",
  "A portfolio case study built the way hiring managers and investors actually evaluate work",
];
