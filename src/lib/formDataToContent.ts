import "server-only";
import type { FieldMeta } from "@/lib/sectionSchemas";

/** Reconstructs a typed content object from FormData, driven by field metadata — shared by the
 * HomepageSection (sectionRegistry) and EventBlock (blockRegistry) generic engines. */
export function formDataToContent(fields: FieldMeta[], formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "list-string" || field.type === "image-list" || field.type === "reference-list") {
      result[field.key] = formData
        .getAll(field.key)
        .map((v) => String(v).trim())
        .filter(Boolean);
    } else if (field.type === "list-object" && field.subFields) {
      const groupCount = Number(formData.get(`${field.key}__count`) ?? 0);
      const list = [];
      for (let i = 0; i < groupCount; i++) {
        const item: Record<string, unknown> = {};
        for (const sub of field.subFields) {
          const raw = formData.get(`${field.key}.${i}.${sub.key}`);
          item[sub.key] = sub.type === "number" ? Number(raw ?? 0) : String(raw ?? "");
        }
        list.push(item);
      }
      result[field.key] = list;
    } else if (field.type === "number") {
      result[field.key] = Number(formData.get(field.key) ?? 0);
    } else if (field.type === "boolean") {
      result[field.key] = formData.get(field.key) === "on";
    } else {
      result[field.key] = String(formData.get(field.key) ?? "");
    }
  }

  return result;
}
