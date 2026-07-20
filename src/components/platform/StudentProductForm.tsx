"use client";

import { useActionState } from "react";
import { updateStudentProductAction, type ActionState } from "@/lib/actions/studentProduct";
import { TextField, TextAreaField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";

const initialState: ActionState = {};

interface StudentProductFormProps {
  product?: {
    name: string | null;
    problemStatement: string | null;
    repositoryUrl: string | null;
    designFilesUrl: string | null;
    backendUrl: string | null;
    frontendUrl: string | null;
    deploymentUrl: string | null;
    productionUrl: string | null;
    currentMilestone: string | null;
  };
}

export function StudentProductForm({ product }: StudentProductFormProps) {
  const [state, formAction] = useActionState(updateStudentProductAction, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <TextField label="Product name" name="name" defaultValue={product?.name ?? ""} placeholder="What are you building?" />
      <TextAreaField
        label="Problem statement"
        name="problemStatement"
        defaultValue={product?.problemStatement ?? ""}
        hint="What problem does this product solve, and for whom?"
      />
      <TextField label="Current milestone" name="currentMilestone" defaultValue={product?.currentMilestone ?? ""} placeholder="e.g. Auth + database schema shipped" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField label="Repository" name="repositoryUrl" type="url" defaultValue={product?.repositoryUrl ?? ""} placeholder="https://github.com/…" />
        <TextField label="Design files" name="designFilesUrl" type="url" defaultValue={product?.designFilesUrl ?? ""} placeholder="https://figma.com/…" />
        <TextField label="Backend" name="backendUrl" type="url" defaultValue={product?.backendUrl ?? ""} />
        <TextField label="Frontend" name="frontendUrl" type="url" defaultValue={product?.frontendUrl ?? ""} />
        <TextField label="Deployment" name="deploymentUrl" type="url" defaultValue={product?.deploymentUrl ?? ""} />
        <TextField label="Production URL" name="productionUrl" type="url" defaultValue={product?.productionUrl ?? ""} />
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald">Saved.</p>}

      <div>
        <SubmitButton>Save product</SubmitButton>
      </div>
    </form>
  );
}
