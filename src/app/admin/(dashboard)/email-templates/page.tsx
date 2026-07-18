import Link from "next/link";
import { Pencil } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function EmailTemplatesPage() {
  const templates = await db.emailTemplate.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <PageHeader
        title="Email Templates"
        description="Every automated email the site sends, editable here."
      />

      <ul className="flex flex-col gap-2">
        {templates.map((template) => (
          <li
            key={template.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-light-gray bg-white px-4 py-3.5"
          >
            <div>
              <p className="text-sm font-medium text-graphite">{template.name}</p>
              <p className="text-xs text-slate">{template.subject}</p>
            </div>
            <Link
              href={`/admin/email-templates/${template.key}`}
              className="flex items-center gap-1.5 rounded-lg border border-light-gray px-2.5 py-1.5 text-xs text-graphite transition-colors hover:border-blue hover:text-blue"
            >
              <Pencil className="h-3.5 w-3.5" strokeWidth={1.5} />
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
