import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function WelcomeScreen({ firstName, onBegin }: { firstName: string; onBegin: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <Image src="/logo-icon.png" alt="" width={28} height={28} className="mx-auto h-7 w-7" />

        <span className="mt-8 block font-mono text-xs uppercase tracking-[0.2em] text-blue">
          Welcome, {firstName}
        </span>

        <h1 className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
          Welcome to the Teqxure Readiness Assessment
        </h1>

        <div className="mx-auto mt-6 max-w-md space-y-4 text-left text-sm leading-relaxed text-paper/60">
          <p>This assessment is not an examination. There are no right or wrong answers.</p>
          <p>We simply want to understand:</p>
          <ul className="flex flex-col gap-1.5 pl-1">
            {["Where you are today", "How you learn", "What your goals are", "How prepared you are for an intensive Product Engineering programme"].map(
              (item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue" />
                  {item}
                </li>
              ),
            )}
          </ul>
          <p>Please answer honestly.</p>
        </div>

        <div className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-paper/50">
          <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
          Approximately 10–15 minutes · Your progress saves automatically
        </div>

        <MagneticButton onClick={onBegin} variant="primary" className="mx-auto mt-9">
          Begin Assessment
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </MagneticButton>
      </div>
    </div>
  );
}
