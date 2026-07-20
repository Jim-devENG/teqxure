import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  if (user!.role !== "STUDENT") redirect("/platform/dashboard");

  const certificates = await db.certificate.findMany({
    where: { studentId: user!.id },
    include: { cohort: { include: { bootcamp: true } } },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Certificates" description="Download, share, or publicly verify your certificates." />
      {certificates.length === 0 ? (
        <p className="text-sm text-slate">No certificates issued yet — finish your bootcamp to earn one.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="rounded-2xl border border-light-gray bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-graphite">{cert.cohort.bootcamp.title}</p>
              <p className="mt-0.5 text-xs text-slate">{cert.cohort.name} · Issued {cert.issuedAt.toLocaleDateString()}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {cert.pdfUrl && (
                  <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-blue px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-dark">
                    Download PDF
                  </a>
                )}
                <a
                  href={`/certificates/verify/${cert.verificationCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-light-gray px-3 py-2 text-sm text-graphite transition-colors hover:border-blue hover:text-blue"
                >
                  Public verification link
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
