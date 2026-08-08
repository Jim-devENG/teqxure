"use client";

import { useState } from "react";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { AssessmentWizard } from "@/components/onboarding/AssessmentWizard";
import { CompletionScreen } from "@/components/onboarding/CompletionScreen";
import type { AssessmentSectionData } from "@/components/onboarding/types";

interface OnboardingFlowProps {
  token: string;
  applicantFirstName: string;
  sections: AssessmentSectionData[];
  initialResponses: Record<string, unknown>;
}

export function OnboardingFlow({ token, applicantFirstName, sections, initialResponses }: OnboardingFlowProps) {
  const [stage, setStage] = useState<"welcome" | "assessment" | "completed">("welcome");

  if (stage === "completed") {
    return <CompletionScreen applicantFirstName={applicantFirstName} />;
  }

  if (stage === "welcome") {
    return <WelcomeScreen firstName={applicantFirstName} onBegin={() => setStage("assessment")} />;
  }

  return (
    <AssessmentWizard
      token={token}
      sections={sections}
      initialResponses={initialResponses}
      onComplete={() => setStage("completed")}
    />
  );
}
