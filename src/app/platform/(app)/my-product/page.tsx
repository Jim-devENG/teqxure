import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { StudentProductForm } from "@/components/platform/StudentProductForm";

export default async function MyProductPage() {
  const user = await getCurrentUser();
  if (user!.role !== "STUDENT") redirect("/dashboard");

  const product = await db.studentProduct.findUnique({ where: { studentId: user!.id } });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My Product"
        description="The product you're building throughout the bootcamp — this becomes your portfolio."
      />
      <StudentProductForm product={product ?? undefined} />

      {product?.mentorNotes && (
        <div className="max-w-2xl rounded-2xl border border-light-gray bg-soft-white p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-slate">Mentor notes</p>
          <p className="mt-2 whitespace-pre-line text-sm text-graphite">{product.mentorNotes}</p>
        </div>
      )}
    </div>
  );
}
