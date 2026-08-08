export interface AssessmentQuestionData {
  id: string;
  key: string;
  label: string;
  helpText: string | null;
  fieldType: string;
  options: string[];
  required: boolean;
  conditionalOn: { questionKey: string; equals: string } | null;
}

export interface AssessmentSectionData {
  id: string;
  key: string;
  title: string;
  description: string | null;
  questions: AssessmentQuestionData[];
}
