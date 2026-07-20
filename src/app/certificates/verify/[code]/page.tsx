import { db } from "@/lib/db";

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const certificate = await db.certificate.findUnique({
    where: { verificationCode: code },
    include: { student: true, cohort: { include: { bootcamp: true } } },
  });

  if (!certificate) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-light-gray bg-white p-8 text-center shadow-sm">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-red-500">Not verified</p>
        <h1 className="mt-3 text-xl font-medium text-graphite">We couldn't verify this certificate</h1>
        <p className="mt-2 text-sm text-slate">The verification code doesn't match any issued certificate.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-light-gray bg-white p-8 text-center shadow-sm">
      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-emerald">Verified</p>
      <h1 className="mt-3 text-xl font-medium text-graphite">{certificate.student.name ?? certificate.student.email}</h1>
      <p className="mt-2 text-sm text-slate">
        completed {certificate.cohort.bootcamp.title} ({certificate.cohort.name}) on {certificate.issuedAt.toLocaleDateString()}.
      </p>
      {certificate.productName && <p className="mt-2 text-sm text-graphite">Product built: {certificate.productName}</p>}
      {certificate.pdfUrl && (
        <a
          href={certificate.pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-lg bg-blue px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
        >
          View certificate PDF
        </a>
      )}
      <p className="mt-6 font-mono text-xs text-slate">Verification code: {certificate.verificationCode}</p>
    </div>
  );
}
