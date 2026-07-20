import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { PaymentsList } from "@/components/platform/manage/PaymentsList";

export default async function ManagePaymentsPage() {
  const enrollments = await db.cohortEnrollment.findMany({
    where: { paymentStatus: "PENDING" },
    include: { student: true, cohort: { include: { bootcamp: true } } },
    orderBy: { enrolledAt: "asc" },
  });

  return (
    <div>
      <PageHeader title="Payment verification" description="Students waiting on manual payment confirmation." />
      <PaymentsList enrollments={enrollments.map((e) => ({
        id: e.id,
        student: e.student,
        cohortName: e.cohort.name,
        bootcampTitle: e.cohort.bootcamp.title,
      }))} />
    </div>
  );
}
