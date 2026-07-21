"use client";

interface ReferenceOption {
  id: string;
  label: string;
}

interface ReferenceListFieldProps {
  name: string;
  label: string;
  options: ReferenceOption[];
  defaultValues?: string[];
}

export function ReferenceListField({ name, label, options, defaultValues = [] }: ReferenceListFieldProps) {
  if (options.length === 0) {
    return (
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>
        <p className="mt-2 text-xs text-slate">Nothing to pick from yet.</p>
      </div>
    );
  }

  return (
    <div>
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">{label}</span>
      <div className="mt-2 flex max-h-64 flex-col gap-2 overflow-y-auto rounded-lg border border-light-gray p-3">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2.5 text-sm text-graphite">
            <input
              type="checkbox"
              name={name}
              value={option.id}
              defaultChecked={defaultValues.includes(option.id)}
              className="h-4 w-4 rounded border-light-gray text-blue"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}
