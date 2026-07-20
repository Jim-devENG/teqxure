import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { CohortForm } from "@/components/platform/manage/CohortForm";

export default async function NewCohortPage() {
  const bootcamps = await db.bootcamp.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } });

  if (bootcamps.length === 0) {
    return (
      <div>
        <PageHeader title="New cohort" />
        <p className="text-sm text-slate">
          You need a bootcamp before you can create a cohort.{" "}
          <Link href="/platform/manage/bootcamps/new" className="text-blue hover:underline">
            Create one first
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="New cohort" description="A timed run of a bootcamp that students enroll into." />
      <CohortForm bootcamps={bootcamps} />
    </div>
  );
}
