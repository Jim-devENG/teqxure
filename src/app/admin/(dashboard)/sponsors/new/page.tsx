import { PageHeader } from "@/components/admin/PageHeader";
import { SponsorForm } from "@/components/admin/sponsors/SponsorForm";

export default function NewSponsorPage() {
  return (
    <div>
      <PageHeader title="New sponsor" />
      <SponsorForm />
    </div>
  );
}
