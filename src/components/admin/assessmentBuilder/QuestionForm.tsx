"use client";

import { useActionState } from "react";
import {
  createAssessmentQuestionAction,
  updateAssessmentQuestionAction,
  type QuestionFormState,
} from "@/lib/actions/assessmentQuestions";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/admin/Field";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ASSESSMENT_FIELD_TYPES } from "@/lib/assessmentFieldTypes";

interface QuestionFormProps {
  sectionId: string;
  question?: {
    id: string;
    key: string;
    label: string;
    helpText: string | null;
    fieldType: string;
    options: unknown;
    required: boolean;
    conditionalOn: unknown;
  };
}

const initialState: QuestionFormState = {};

export function QuestionForm({ sectionId, question }: QuestionFormProps) {
  const action = question
    ? updateAssessmentQuestionAction.bind(null, question.id)
    : createAssessmentQuestionAction.bind(null, sectionId);
  const [state, formAction] = useActionState(action, initialState);

  const options = Array.isArray(question?.options) ? (question!.options as string[]).join(", ") : "";
  const conditional = question?.conditionalOn as { questionKey: string; equals: string } | null | undefined;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <TextField
        label="Key"
        name="key"
        defaultValue={question?.key}
        required
        placeholder="pb_about_you"
        hint="A stable identifier — used to store and match responses."
      />
      <TextField label="Label" name="label" defaultValue={question?.label} required placeholder="Tell us a little about yourself." />
      <TextField label="Help text (optional)" name="helpText" defaultValue={question?.helpText ?? ""} />

      <SelectField label="Field type" name="fieldType" defaultValue={question?.fieldType ?? "TEXT"} required>
        {ASSESSMENT_FIELD_TYPES.map((type) => (
          <option key={type} value={type}>
            {type.replaceAll("_", " ")}
          </option>
        ))}
      </SelectField>

      <TextField
        label="Options (optional)"
        name="options"
        defaultValue={options}
        placeholder="Option one, Option two, Option three"
        hint="Comma-separated. Only used for Select, Radio, and Checkbox Group."
      />

      <CheckboxField label="Required" name="required" defaultChecked={question?.required ?? false} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          label="Only show if question (optional)"
          name="conditionalOnKey"
          defaultValue={conditional?.questionKey ?? ""}
          placeholder="tr_device_access"
          hint="The key of another question."
        />
        <TextField
          label="…equals"
          name="conditionalOnEquals"
          defaultValue={conditional?.equals ?? ""}
          placeholder="Yes, I own one"
        />
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{question ? "Save changes" : "Add question"}</SubmitButton>
        {state.error && <span className="text-sm text-red-500">{state.error}</span>}
      </div>
    </form>
  );
}
