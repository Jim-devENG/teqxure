import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { statusLabel } from "@/components/admin/StatusBadge";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;
  const cohort = searchParams.get("cohort") ?? undefined;
  const q = searchParams.get("q") ?? undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (cohort) where.admissionCohortId = cohort;
  if (q) {
    where.OR = [
      { referenceCode: { contains: q, mode: "insensitive" } },
      { applicant: { fullName: { contains: q, mode: "insensitive" } } },
      { applicant: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const applications = await db.application.findMany({
    where: where as never,
    include: { applicant: true, admissionCohort: true },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const header = [
    "Reference Code",
    "Full Name",
    "Email",
    "Phone",
    "Country",
    "Occupation",
    "Cohort",
    "Status",
    "Submitted At",
    "Assessment Completed At",
    "LinkedIn",
    "GitHub",
    "Portfolio",
  ];

  const rows = applications.map((a) =>
    [
      a.referenceCode,
      a.applicant.fullName,
      a.applicant.email,
      a.applicant.phone,
      a.applicant.country,
      a.applicant.occupation,
      a.admissionCohort.name,
      statusLabel(a.status),
      a.submittedAt.toISOString(),
      a.assessmentCompletedAt?.toISOString() ?? "",
      a.applicant.linkedin ?? "",
      a.applicant.github ?? "",
      a.applicant.portfolio ?? "",
    ]
      .map((v) => csvEscape(String(v)))
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
