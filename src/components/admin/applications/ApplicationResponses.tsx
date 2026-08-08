interface Question {
  id: string;
  key: string;
  label: string;
  fieldType: string;
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface ResponseRow {
  questionKey: string;
  value: unknown;
}

function formatValue(fieldType: string, value: unknown): React.ReactNode {
  if (value === undefined || value === null || value === "") {
    return <span className="text-slate/50">Not answered</span>;
  }

  if (fieldType === "VIDEO" || fieldType === "FILE") {
    const uploaded = value as { url?: string; fileName?: string };
    if (!uploaded?.url) return <span className="text-slate/50">Not answered</span>;
    if (fieldType === "VIDEO") {
      return (
        <video controls preload="metadata" className="mt-1 max-h-64 rounded-lg border border-light-gray">
          <source src={uploaded.url} />
        </video>
      );
    }
    return (
      <a href={uploaded.url} target="_blank" rel="noreferrer" className="text-blue hover:underline">
        {uploaded.fileName ?? "View file"}
      </a>
    );
  }

  if (fieldType === "CHECKBOX_GROUP" && Array.isArray(value)) {
    return (value as string[]).join(", ");
  }

  if (fieldType === "RATING") {
    return `${value} / 5`;
  }

  return String(value);
}

export function ApplicationResponses({ sections, responses }: { sections: Section[]; responses: ResponseRow[] }) {
  const byKey = new Map(responses.map((r) => [r.questionKey, r.value]));
  const answeredCount = responses.length;
  const totalCount = sections.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-graphite">Assessment responses</h2>
        <span className="text-xs text-slate">
          {answeredCount} / {totalCount} answered
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.id}>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-blue">{section.title}</h3>
            <dl className="flex flex-col gap-3">
              {section.questions.map((question) => (
                <div key={question.id} className="border-b border-light-gray pb-3 last:border-0 last:pb-0">
                  <dt className="text-sm text-graphite">{question.label}</dt>
                  <dd className="mt-1 text-sm text-slate">{formatValue(question.fieldType, byKey.get(question.key))}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
