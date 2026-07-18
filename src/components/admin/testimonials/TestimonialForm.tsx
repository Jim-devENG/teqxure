"use client";

import { useActionState } from "react";
import {
  createTestimonialAction,
  updateTestimonialAction,
  type TestimonialFormState,
} from "@/lib/actions/testimonials";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface TestimonialFormProps {
  testimonial?: {
    id: string;
    quote: string;
    authorName: string;
    authorRole: string | null;
    authorCompany: string | null;
    avatarUrl: string | null;
    rating: number | null;
    pinned: boolean;
    approved: boolean;
    visible: boolean;
  };
}

const initialState: TestimonialFormState = {};

export function TestimonialForm({ testimonial }: TestimonialFormProps) {
  const action = testimonial
    ? updateTestimonialAction.bind(null, testimonial.id)
    : createTestimonialAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <TextAreaField label="Quote" name="quote" defaultValue={testimonial?.quote} rows={4} required />

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Author name" name="authorName" defaultValue={testimonial?.authorName} required />
        <TextField label="Rating (1-5, optional)" name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? ""} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Author role" name="authorRole" defaultValue={testimonial?.authorRole ?? ""} />
        <TextField label="Author company" name="authorCompany" defaultValue={testimonial?.authorCompany ?? ""} />
      </div>

      <ImageUploader name="avatarUrl" label="Avatar" defaultValue={testimonial?.avatarUrl} />

      <div className="flex items-center gap-6">
        <CheckboxField label="Pinned" name="pinned" defaultChecked={testimonial?.pinned ?? false} />
        <CheckboxField label="Approved" name="approved" defaultChecked={testimonial?.approved ?? true} />
        <CheckboxField label="Visible" name="visible" defaultChecked={testimonial?.visible ?? true} />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{testimonial ? "Save changes" : "Create testimonial"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
