import { PageHeader } from "@/components/admin/PageHeader";
import { WeekForm } from "@/components/admin/curriculum/WeekForm";

export default function NewWeekPage() {
  return (
    <div>
      <PageHeader title="New week" description="Add a week to the curriculum roadmap." />
      <WeekForm />
    </div>
  );
}
