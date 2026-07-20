import { PageHeader } from "@/components/admin/PageHeader";
import { WeekForm } from "@/components/platform/manage/WeekForm";

export default async function NewWeekPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <PageHeader title="Add week" description="Weeks are shared curriculum — every cohort of this bootcamp sees them." />
      <WeekForm bootcampId={id} />
    </div>
  );
}
