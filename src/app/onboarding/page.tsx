import { validateApplicationToken, getAssessmentSections } from "@/lib/actions/assessment";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { CompletionScreen } from "@/components/onboarding/CompletionScreen";
import { ErrorScreen } from "@/components/onboarding/ErrorScreen";

// Gives the AI readiness analysis scheduled via after() in
// completeAssessmentAction room to finish before the function is recycled.
export const maxDuration = 60;

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const validation = await validateApplicationToken(token ?? "");

  if (validation.status === "invalid") {
    return (
      <ErrorScreen
        title="This link isn't valid"
        body="Double-check the link from your email, or reach out to our admissions team and we'll help you sort it out."
      />
    );
  }

  if (validation.status === "expired") {
    return (
      <ErrorScreen
        title="This link has expired"
        body="Your onboarding link is tied to the application cycle it was issued for. Reach out to our admissions team and we'll send you a fresh one."
      />
    );
  }

  if (validation.status === "completed") {
    return <CompletionScreen applicantFirstName={validation.record.application.applicant.fullName.split(" ")[0]} />;
  }

  const sections = await getAssessmentSections();
  const responses = Object.fromEntries(
    validation.record.application.responses.map((r) => [r.questionKey, r.value]),
  );

  return (
    <OnboardingFlow
      token={token!}
      applicantFirstName={validation.record.application.applicant.fullName.split(" ")[0]}
      sections={sections.map((s) => ({
        id: s.id,
        key: s.key,
        title: s.title,
        description: s.description,
        questions: s.questions.map((q) => ({
          id: q.id,
          key: q.key,
          label: q.label,
          helpText: q.helpText,
          fieldType: q.fieldType,
          options: Array.isArray(q.options) ? (q.options as string[]) : [],
          required: q.required,
          conditionalOn: q.conditionalOn as { questionKey: string; equals: string } | null,
        })),
      }))}
      initialResponses={responses as Record<string, unknown>}
    />
  );
}
