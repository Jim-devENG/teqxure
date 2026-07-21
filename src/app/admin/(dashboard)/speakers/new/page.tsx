import { PageHeader } from "@/components/admin/PageHeader";
import { SpeakerForm } from "@/components/admin/speakers/SpeakerForm";

export default function NewSpeakerPage() {
  return (
    <div>
      <PageHeader title="New speaker" />
      <SpeakerForm />
    </div>
  );
}
