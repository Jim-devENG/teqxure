import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SponsorForm } from "@/components/admin/sponsors/SponsorForm";

export default async function EditSponsorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sponsor = await db.sponsor.findUnique({ where: { id } });
  if (!sponsor) notFound();

  return (
    <div>
      <PageHeader title={sponsor.name} />
      <SponsorForm sponsor={sponsor} />
    </div>
  );
}
