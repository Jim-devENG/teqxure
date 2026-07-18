"use client";

import { useActionState } from "react";
import { createProductAction, updateProductAction, type ProductFormState } from "@/lib/actions/products";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/Field";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MultiImageUploader } from "@/components/admin/MultiImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";

interface ProductFormProps {
  product?: {
    id: string;
    slug: string;
    name: string;
    category: string;
    oneLiner: string;
    description: string;
    longDescription: string | null;
    logoUrl: string | null;
    builtWith: string[];
    screenshots: string[];
    accent: string;
    metricLabel: string;
    metricValue: string;
    liveUrl: string | null;
    caseStudyUrl: string | null;
    featured: boolean;
    visible: boolean;
  };
}

const initialState: ProductFormState = {};

export function ProductForm({ product }: ProductFormProps) {
  const action = product ? updateProductAction.bind(null, product.id) : createProductAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <TextField label="Name" name="name" defaultValue={product?.name} required />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={product?.slug}
          hint="Lowercase letters, numbers, hyphens"
          required
        />
      </div>
      <TextField label="Category" name="category" defaultValue={product?.category} required />
      <TextField label="One-liner" name="oneLiner" defaultValue={product?.oneLiner} required />
      <TextAreaField label="Description" name="description" defaultValue={product?.description} required />
      <TextAreaField
        label="Long description (optional)"
        name="longDescription"
        defaultValue={product?.longDescription ?? ""}
      />

      <ImageUploader name="logoUrl" label="Logo" defaultValue={product?.logoUrl} />

      <MultiImageUploader name="screenshots" label="Screenshots" defaultValues={product?.screenshots ?? []} />

      <TextField
        label="Built with (comma-separated)"
        name="builtWith"
        defaultValue={product?.builtWith.join(", ")}
      />

      <label className="block">
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Accent color</span>
        <select
          name="accent"
          defaultValue={product?.accent ?? "blue"}
          className="mt-2 w-full rounded-lg border border-light-gray bg-white px-3 py-2.5 text-sm text-graphite outline-none focus:border-blue"
        >
          <option value="blue">Blue</option>
          <option value="cyan">Cyan</option>
          <option value="emerald">Emerald</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Metric label" name="metricLabel" defaultValue={product?.metricLabel} required />
        <TextField label="Metric value" name="metricValue" defaultValue={product?.metricValue} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Live URL (optional)" name="liveUrl" defaultValue={product?.liveUrl ?? ""} />
        <TextField label="Case study URL (optional)" name="caseStudyUrl" defaultValue={product?.caseStudyUrl ?? ""} />
      </div>

      <div className="flex items-center gap-6">
        <CheckboxField label="Featured" name="featured" defaultChecked={product?.featured ?? false} />
        <CheckboxField label="Visible" name="visible" defaultChecked={product?.visible ?? true} />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{product ? "Save changes" : "Create product"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
