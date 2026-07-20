import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/platform/Sidebar";

export default async function PlatformAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/platform/login");
  }

  return (
    <div className="flex">
      <Sidebar userEmail={user.email} role={user.role} />
      <main className="min-h-screen flex-1 overflow-x-hidden px-8 py-8">{children}</main>
    </div>
  );
}
