import { db } from "@/lib/db";
import { sectionRegistry, type SectionKey } from "@/lib/sectionSchemas";
import type { z } from "zod";

export async function getHomepageSection<K extends SectionKey>(
  key: K,
): Promise<z.infer<(typeof sectionRegistry)[K]["schema"]>> {
  const section = await db.homepageSection.findUnique({ where: { key } });
  const definition = sectionRegistry[key];
  const parsed = definition.schema.safeParse(section?.content ?? {});
  if (!parsed.success) {
    throw new Error(`Homepage section "${key}" has invalid content in the database.`);
  }
  return parsed.data as z.infer<(typeof sectionRegistry)[K]["schema"]>;
}

export async function isSectionVisible(key: SectionKey): Promise<boolean> {
  const section = await db.homepageSection.findUnique({ where: { key } });
  return section?.visible ?? true;
}

export async function getProducts() {
  return db.product.findMany({
    where: { deletedAt: null, visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getFrameworkStages() {
  return db.frameworkStage.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getCurriculumWeeks() {
  return db.curriculumWeek.findMany({
    where: { deletedAt: null, visible: true },
    orderBy: { order: "asc" },
    include: { outcomes: { orderBy: { order: "asc" } } },
  });
}

export async function getFaqItems() {
  return db.faqItem.findMany({
    where: { deletedAt: null, visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getTestimonials() {
  return db.testimonial.findMany({
    where: { deletedAt: null, visible: true, approved: true },
    orderBy: { order: "asc" },
  });
}

export async function getWaitlistFields() {
  return db.waitlistField.findMany({
    where: { deletedAt: null, visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getSiteSettings() {
  return db.siteSettings.findFirst();
}

export async function getCoreValues() {
  return db.coreValue.findMany({
    where: { deletedAt: null, visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getDifferentiators() {
  return db.differentiator.findMany({
    where: { deletedAt: null, visible: true },
    orderBy: { order: "asc" },
  });
}

export async function getTeamMembers() {
  return db.teamMember.findMany({
    where: { deletedAt: null, visible: true },
    orderBy: { order: "asc" },
  });
}
