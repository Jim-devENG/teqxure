import "server-only";
import { db } from "@/lib/db";

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Teqxure <notifications@teqxure.xyz>";

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API;
  if (!apiKey || !to) return;

  try {
    await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to,
        subject,
        html,
      }),
    });
  } catch {
    // Email delivery failures shouldn't break the calling flow.
  }
}

function renderTemplate(text: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (acc, [key, value]) => acc.split(`{{${key}}}`).join(value),
    text,
  );
}

export async function sendTemplatedEmail(
  templateKey: string,
  to: string,
  variables: Record<string, string>,
): Promise<void> {
  if (!to) return;

  const template = await db.emailTemplate.findUnique({ where: { key: templateKey } });
  if (!template) return;

  const subject = renderTemplate(template.subject, variables);
  const html = renderTemplate(template.body, variables);

  await sendEmail(to, subject, html);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function formatFieldsAsHtml(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");
}
