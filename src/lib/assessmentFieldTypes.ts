export const ASSESSMENT_FIELD_TYPES = [
  "TEXT",
  "TEXTAREA",
  "EMAIL",
  "PHONE",
  "NUMBER",
  "SELECT",
  "RADIO",
  "CHECKBOX_GROUP",
  "RATING",
  "FILE",
  "VIDEO",
] as const;

export type AssessmentFieldType = (typeof ASSESSMENT_FIELD_TYPES)[number];
