"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { notifyUser } from "@/lib/notifications";
import { renderCertificatePdf } from "@/lib/certificate";
import { uploadToR2 } from "@/lib/r2";

const STAFF_ROLES = ["SUPER_ADMIN", "PROGRAM_MANAGER"] as const;

export async function issueCertificateAction(cohortId: string, studentId: string): Promise<{ error?: string }> {
  const admin = await requireRole(...STAFF_ROLES);

  const existing = await db.certificate.findUnique({ where: { studentId_cohortId: { studentId, cohortId } } });
  if (existing) return { error: "A certificate has already been issued for this student." };

  const [cohort, student, product] = await Promise.all([
    db.cohort.findUnique({ where: { id: cohortId }, include: { bootcamp: true } }),
    db.user.findUnique({ where: { id: studentId } }),
    db.studentProduct.findUnique({ where: { studentId } }),
  ]);
  if (!cohort || !student) return { error: "Cohort or student not found." };

  const verificationCode = randomBytes(8).toString("hex");
  const issuedAt = new Date();

  const pdfBuffer = await renderCertificatePdf({
    studentName: student.name ?? student.email,
    bootcampTitle: cohort.bootcamp.title,
    cohortName: cohort.name,
    productName: product?.name,
    issuedAt,
    verificationCode,
  });

  const { url } = await uploadToR2(pdfBuffer, `certificate-${verificationCode}.pdf`, "application/pdf", "certificates");

  await db.certificate.create({
    data: {
      studentId,
      cohortId,
      verificationCode,
      productName: product?.name,
      pdfUrl: url,
      issuedAt,
    },
  });

  await db.cohortEnrollment.updateMany({ where: { cohortId, studentId }, data: { status: "COMPLETED" } });
  if (product) {
    await db.studentProduct.update({ where: { studentId }, data: { completionStatus: "COMPLETED" } });
  }

  await logActivity({ userId: admin.id, action: "created", entityType: "Certificate" });

  await notifyUser({
    userId: studentId,
    type: "CERTIFICATE_AVAILABLE",
    title: "Your certificate is ready",
    body: `Congratulations on completing ${cohort.bootcamp.title}!`,
    actionLabel: "View certificate",
    actionUrl: "/platform/certificates",
  });
  await notifyUser({
    userId: studentId,
    type: "BOOTCAMP_COMPLETED",
    title: `You completed ${cohort.bootcamp.title}`,
    body: "You've shipped a real product from problem statement to deployment. Well done.",
    actionLabel: "View your product",
    actionUrl: "/platform/my-product",
  });

  revalidatePath(`/platform/manage/cohorts/${cohortId}`);
  revalidatePath("/platform/certificates");
  return {};
}
