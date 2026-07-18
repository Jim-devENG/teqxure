import { PageHeader } from "@/components/admin/PageHeader";
import { TestimonialForm } from "@/components/admin/testimonials/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <div>
      <PageHeader title="New testimonial" />
      <TestimonialForm />
    </div>
  );
}
