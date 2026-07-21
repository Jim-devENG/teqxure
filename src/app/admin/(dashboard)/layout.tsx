import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { UploadStatusProvider } from "@/components/admin/UploadStatusContext";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  return (
    <UploadStatusProvider>
      <div className="flex">
        <Sidebar userEmail={user.email} />
        <main className="min-h-screen flex-1 overflow-x-hidden px-8 py-8">{children}</main>
      </div>
    </UploadStatusProvider>
  );
}
