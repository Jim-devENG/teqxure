"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { blockRegistry, type BlockType } from "@/lib/blockSchemas";
import { formDataToContent } from "@/lib/formDataToContent";
import type { FieldMeta } from "@/lib/sectionSchemas";

export interface BlockFormState {
  success?: boolean;
  error?: string;
}

function revalidateEventPaths(eventId: string, slug?: string) {
  revalidatePath(`/admin/events/${eventId}/blocks`);
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

export async function createEventBlockAction(eventId: string, type: BlockType): Promise<{ id: string } | { error: string }> {
  const user = await requireAdmin();
  const definition = blockRegistry[type];
  if (!definition) return { error: "Unknown block type." };

  const count = await db.eventBlock.count({ where: { eventId } });
  const defaults = definition.schema.safeParse({});
  const block = await db.eventBlock.create({
    data: { eventId, type, content: defaults.success ? defaults.data : {}, order: count },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "EventBlock", entityId: block.id });
  revalidateEventPaths(eventId);
  return { id: block.id };
}

export async function updateEventBlockAction(
  blockId: string,
  _prev: BlockFormState,
  formData: FormData,
): Promise<BlockFormState> {
  const user = await requireAdmin();
  const block = await db.eventBlock.findUnique({ where: { id: blockId }, include: { event: true } });
  if (!block) return { error: "Block not found." };

  const definition = blockRegistry[block.type as BlockType];
  if (!definition) return { error: "Unknown block type." };

  const content = formDataToContent(definition.fields as unknown as FieldMeta[], formData);
  const parsed = definition.schema.safeParse(content);
  if (!parsed.success) return { error: "Please check the form for errors." };

  await db.eventBlock.update({ where: { id: blockId }, data: { content: parsed.data } });
  await logActivity({ userId: user.id, action: "updated", entityType: "EventBlock", entityId: blockId });
  revalidateEventPaths(block.eventId, block.event.slug);

  return { success: true };
}

export async function deleteEventBlockAction(blockId: string): Promise<void> {
  const user = await requireAdmin();
  const block = await db.eventBlock.delete({ where: { id: blockId }, include: { event: true } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "EventBlock", entityId: blockId });
  revalidateEventPaths(block.eventId, block.event.slug);
}

export async function reorderEventBlocksAction(eventId: string, orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.eventBlock.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "EventBlock" });
  revalidateEventPaths(eventId);
}

export async function toggleEventBlockVisibilityAction(blockId: string, visible: boolean): Promise<void> {
  const user = await requireAdmin();
  const block = await db.eventBlock.update({ where: { id: blockId }, data: { visible }, include: { event: true } });
  await logActivity({ userId: user.id, action: "updated", entityType: "EventBlock", entityId: blockId });
  revalidateEventPaths(block.eventId, block.event.slug);
}

export async function saveBlockAsTemplateAction(blockId: string, name: string): Promise<{ error?: string }> {
  const user = await requireAdmin();
  if (!name.trim()) return { error: "Give the template a name." };

  const block = await db.eventBlock.findUnique({ where: { id: blockId } });
  if (!block) return { error: "Block not found." };

  await db.blockTemplate.create({ data: { name: name.trim(), type: block.type, content: block.content as object } });
  await logActivity({ userId: user.id, action: "created", entityType: "BlockTemplate" });
  revalidatePath("/admin/block-templates");
  return {};
}

export async function insertBlockFromTemplateAction(eventId: string, templateId: string): Promise<{ error?: string }> {
  const user = await requireAdmin();
  const template = await db.blockTemplate.findUnique({ where: { id: templateId } });
  if (!template) return { error: "Template not found." };

  const count = await db.eventBlock.count({ where: { eventId } });
  const block = await db.eventBlock.create({
    data: { eventId, type: template.type, content: template.content as object, order: count },
  });

  await logActivity({ userId: user.id, action: "created", entityType: "EventBlock", entityId: block.id });
  revalidateEventPaths(eventId);
  redirect(`/events/${eventId}/blocks`);
}

export async function deleteBlockTemplateAction(templateId: string): Promise<void> {
  const user = await requireAdmin();
  await db.blockTemplate.delete({ where: { id: templateId } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "BlockTemplate", entityId: templateId });
  revalidatePath("/admin/block-templates");
}
