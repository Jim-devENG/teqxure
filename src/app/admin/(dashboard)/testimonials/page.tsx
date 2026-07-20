import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialsList } from "@/components/admin/testimonials/TestimonialsList";

export default async function TestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Testimonials"
        description="Manage quotes for the (future) testimonials section."
        action={
          <Link
            href="/testimonials/new"
            className="flex items-center gap-1.5 rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            New testimonial
          </Link>
        }
      />
      <TestimonialsList testimonials={testimonials} />
    </div>
  );
}
