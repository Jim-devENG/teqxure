"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

const eventSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1),
  description: z.string().min(1),
  startsAt: z.string().min(1),
  endsAt: z.string().optional(),
  location: z.string().optional(),
  isVirtual: z.coerce.boolean().optional(),
  coverImageUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  registrationMode: z.enum(["INTERNAL", "EXTERNAL"]),
  externalUrl: z.string().optional(),
  capacity: z.coerce.number().int().positive().optional(),
  visible: z.coerce.boolean().optional(),
});

export interface EventFormState {
  success?: boolean;
  error?: string;
}

const DEFAULT_REGISTRATION_FIELDS = [
  { label: "Full Name", fieldType: "TEXT", required: true },
  { label: "Email Address", fieldType: "EMAIL", required: true },
  { label: "Phone Number", fieldType: "PHONE", required: false },
  { label: "Country", fieldType: "TEXT", required: false },
  { label: "Profession", fieldType: "TEXT", required: false },
  { label: "How did you hear about Teqxure?", fieldType: "TEXT", required: false },
];

function parseEventForm(formData: FormData) {
  const capacityRaw = formData.get("capacity");
  return eventSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    startsAt: formData.get("startsAt"),
    endsAt: formData.get("endsAt"),
    location: formData.get("location"),
    isVirtual: formData.get("isVirtual") === "on",
    coverImageUrl: formData.get("coverImageUrl"),
    status: formData.get("status"),
    registrationMode: formData.get("registrationMode"),
    externalUrl: formData.get("externalUrl"),
    capacity: capacityRaw ? capacityRaw : undefined,
    visible: formData.get("visible") === "on",
  });
}

function toEventData(parsed: z.infer<typeof eventSchema>) {
  const { startsAt, endsAt, ...rest } = parsed;
  return {
    ...rest,
    startsAt: new Date(startsAt),
    endsAt: endsAt ? new Date(endsAt) : null,
  };
}

function getCategoryIds(formData: FormData): string[] {
  return formData.getAll("categoryIds").map(String).filter(Boolean);
}

export async function createEventAction(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  const user = await requireAdmin();
  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const count = await db.event.count();
  const categoryIds = getCategoryIds(formData);

  const event = await db.event.create({
    data: {
      ...toEventData(parsed.data),
      order: count,
      categories: { connect: categoryIds.map((id) => ({ id })) },
    },
  });

  await db.eventFormField.createMany({
    data: DEFAULT_REGISTRATION_FIELDS.map((field, i) => ({ ...field, eventId: event.id, order: i })),
  });

  await logActivity({ userId: user.id, action: "created", entityType: "Event", entityId: event.id });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
  redirect("/events");
}

export async function updateEventAction(
  id: string,
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const user = await requireAdmin();
  const parsed = parseEventForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form for errors." };
  }

  const categoryIds = getCategoryIds(formData);

  await db.event.update({
    where: { id },
    data: {
      ...toEventData(parsed.data),
      categories: { set: categoryIds.map((cid) => ({ id: cid })) },
    },
  });

  await logActivity({ userId: user.id, action: "updated", entityType: "Event", entityId: id });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath(`/events/${parsed.data.slug}`);
  revalidatePath("/admin/events");
  redirect("/events");
}

export async function deleteEventAction(id: string): Promise<void> {
  const user = await requireAdmin();
  await db.event.update({ where: { id }, data: { deletedAt: new Date(), visible: false } });
  await logActivity({ userId: user.id, action: "deleted", entityType: "Event", entityId: id });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function reorderEventsAction(orderedIds: string[]): Promise<void> {
  const user = await requireAdmin();
  await Promise.all(orderedIds.map((id, index) => db.event.update({ where: { id }, data: { order: index } })));
  await logActivity({ userId: user.id, action: "reordered", entityType: "Event" });
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}
