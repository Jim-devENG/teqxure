import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

export function CompletionScreen({ applicantFirstName }: { applicantFirstName: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg text-center">
        <Image src="/logo-icon.png" alt="" width={28} height={28} className="mx-auto h-7 w-7" />
        <CheckCircle2 className="mx-auto mt-8 h-11 w-11 text-emerald" strokeWidth={1.5} />
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-paper sm:text-3xl">Assessment Completed</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-paper/60">
          Thank you, {applicantFirstName} — your Teqxure Readiness Assessment is complete and your application is now
          under review.
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/50">
          Our admissions team will carefully review both your application and your onboarding responses. We'll
          contact you by email with next steps. Thank you for choosing to begin your Product Engineering journey
          with Teqxure.
        </p>
      </div>
    </div>
  );
}
