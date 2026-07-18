import Image from "next/image";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function MediaPage() {
  const media = await db.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 });

  return (
    <div>
      <PageHeader
        title="Media"
        description="Files uploaded across the admin. Upload new media from within Products, Testimonials, or Settings."
      />
      {media.length === 0 ? (
        <p className="text-sm text-slate">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {media.map((item) => (
            <div key={item.id} className="rounded-lg border border-light-gray bg-white p-2">
              <div className="relative aspect-square overflow-hidden rounded-md bg-soft-white">
                <Image src={item.url} alt={item.altText ?? item.fileName} fill sizes="150px" className="object-cover" unoptimized />
              </div>
              <p className="mt-2 truncate text-xs text-slate">{item.fileName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
