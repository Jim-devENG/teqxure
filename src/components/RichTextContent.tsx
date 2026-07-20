import { cn } from "@/lib/utils";

export function RichTextContent({ html, className }: { html: string; className?: string }) {
  if (!html) return null;
  return <div className={cn("prose-content", className)} dangerouslySetInnerHTML={{ __html: html }} />;
}
