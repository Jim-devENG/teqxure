import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const MANAGE_NAV = [
  { href: "/platform/manage/users", label: "Users & invites" },
  { href: "/platform/manage/cohorts", label: "Bootcamps & cohorts" },
  { href: "/platform/manage/submissions", label: "Submissions review" },
  { href: "/platform/manage/payments", label: "Payment verification" },
  { href: "/platform/manage/announcements", label: "Announcements" },
];

export default async function ManageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "SUPER_ADMIN" && user.role !== "PROGRAM_MANAGER")) {
    redirect("/platform/dashboard");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1 border-b border-light-gray pb-3">
        {MANAGE_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-1.5 text-sm text-slate transition-colors hover:bg-soft-white hover:text-graphite"
          >
            {item.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
