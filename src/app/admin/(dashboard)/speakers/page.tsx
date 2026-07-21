import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { SpeakersList } from "@/components/admin/speakers/SpeakersList";

export default async function SpeakersPage() {
  const speakers = await db.speaker.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="Speakers"
        description="A reusable directory — add a speaker once, attach them to any event's Speakers block."
        action={
          <Link
            href="/speakers/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New speaker
          </Link>
        }
      />
      <SpeakersList items={speakers} />
    </div>
  );
}
