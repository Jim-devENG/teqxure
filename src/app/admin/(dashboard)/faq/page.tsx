import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { FaqList } from "@/components/admin/faq/FaqList";

export default async function FaqPage() {
  const items = await db.faqItem.findMany({ where: { deletedAt: null }, orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader
        title="FAQ"
        description="Questions and answers shown in the FAQ accordion."
        action={
          <Link
            href="/admin/faq/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New question
          </Link>
        }
      />
      <FaqList items={items} />
    </div>
  );
}
