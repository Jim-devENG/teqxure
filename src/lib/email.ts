import "server-only";

const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendNotificationEmail(subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API;
  const to = process.env.ADMIN_EMAIL;
  if (!apiKey || !to) return;

  try {
    await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Teqxure <notifications@teqxure.com>",
        to,
        subject,
        html,
      }),
    });
  } catch {
    // Notification failures shouldn't break the submission flow.
  }
}
