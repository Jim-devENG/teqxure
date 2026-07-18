import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const accentColor = "text-blue";
  const titleColor = tone === "dark" ? "text-paper" : "text-graphite";
  const descColor = tone === "dark" ? "text-paper/60" : "text-slate";

  return (
    <div className={cn(isCenter && "text-center mx-auto", className)}>
      <Reveal>
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-[0.2em]",
            accentColor,
          )}
        >
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "mt-4 text-balance text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl",
            titleColor,
          )}
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={cn(
              "mt-5 max-w-xl text-base leading-relaxed sm:text-lg",
              isCenter && "mx-auto",
              descColor,
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
