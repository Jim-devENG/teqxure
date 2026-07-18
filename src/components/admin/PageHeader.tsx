import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-medium tracking-tight text-graphite">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate">{description}</p>}
      </div>
      {action}
    </div>
  );
}
