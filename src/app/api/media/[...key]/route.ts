import { NextResponse } from "next/server";
import { getFromR2 } from "@/lib/r2";

export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const objectKey = key.join("/");

  const object = await getFromR2(objectKey);
  if (!object) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(Buffer.from(object.body), {
    headers: {
      "Content-Type": object.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
