import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-xl font-medium tracking-tight text-graphite">
        Welcome, {user?.name ?? user?.email}
      </h1>
      <p className="mt-1 text-sm text-slate">Role: {user?.role}</p>
    </div>
  );
}
