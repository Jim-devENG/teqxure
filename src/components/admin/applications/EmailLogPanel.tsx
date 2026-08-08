import { cn } from "@/lib/utils";

interface EmailLogRow {
  id: string;
  templateKey: string;
  to: string;
  status: string;
  errorMessage: string | null;
  createdAt: string;
}

export function EmailLogPanel({ logs }: { logs: EmailLogRow[] }) {
  return (
    <div className="rounded-xl border border-light-gray bg-white p-5">
      <h2 className="mb-4 text-sm font-medium text-graphite">Email delivery</h2>
      {logs.length === 0 ? (
        <p className="text-sm text-slate">No emails sent yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {logs.map((log) => (
            <li key={log.id} className="text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-graphite">{log.templateKey}</span>
                <span className={cn("rounded-full px-2 py-0.5", log.status === "SENT" ? "bg-emerald/10 text-emerald" : "bg-red-100 text-red-600")}>
                  {log.status}
                </span>
              </div>
              <p className="mt-0.5 text-slate">
                to {log.to} · {new Date(log.createdAt).toLocaleString()}
              </p>
              {log.errorMessage && <p className="mt-0.5 truncate text-red-500" title={log.errorMessage}>{log.errorMessage}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
