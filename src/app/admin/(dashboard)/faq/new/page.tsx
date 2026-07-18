import { PageHeader } from "@/components/admin/PageHeader";
import { FaqForm } from "@/components/admin/faq/FaqForm";

export default function NewFaqPage() {
  return (
    <div>
      <PageHeader title="New question" description="Add a question to the FAQ section." />
      <FaqForm />
    </div>
  );
}
