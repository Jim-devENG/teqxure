import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { FieldsList } from "@/components/admin/waitlist/FieldsList";

export default async function WaitlistFormPage() {
  const fields = await db.waitlistField.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Waitlist Form"
        description="The fields shown in the site's waitlist modal, in order."
        action={
          <Link
            href="/admin/waitlist-form/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New field
          </Link>
        }
      />
      <FieldsList fields={fields} />
    </div>
  );
}
