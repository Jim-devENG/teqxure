import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SpeakerForm } from "@/components/admin/speakers/SpeakerForm";

export default async function EditSpeakerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const speaker = await db.speaker.findUnique({ where: { id } });
  if (!speaker) notFound();

  return (
    <div>
      <PageHeader title={speaker.name} />
      <SpeakerForm speaker={speaker} />
    </div>
  );
}
