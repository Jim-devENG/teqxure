import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex">
      <Sidebar userEmail={user.email} />
      <main className="min-h-screen flex-1 overflow-x-hidden px-8 py-8">{children}</main>
    </div>
  );
}
