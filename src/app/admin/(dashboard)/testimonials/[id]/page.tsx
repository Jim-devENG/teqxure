import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await db.testimonial.findUnique({ where: { id } });

  if (!testimonial) notFound();

  return (
    <div>
      <PageHeader title={testimonial.authorName} />
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
