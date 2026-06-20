import {
  apiFail,
  apiOk,
  checkRateLimit,
  clientIp,
  parseJsonBody,
  requireString,
} from "@/lib/api-server";
import {
  contactEmailHtml,
  isEmailConfigured,
  sendNotificationEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  const limited = checkRateLimit(`contact:${clientIp(request)}`, 10, 60_000);
  if (limited) return limited;

  if (!isEmailConfigured()) {
    return apiFail("Email service is not configured yet.", 503);
  }

  const parsed = await parseJsonBody<Record<string, unknown>>(request);
  if ("error" in parsed) return parsed.error;

  const body = parsed.data;
  const name = requireString(body.name, "name", 120);
  const email = requireString(body.email, "email", 200);
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 20) : undefined;
  const subject = requireString(body.subject, "subject", 200) ?? "General enquiry";
  const message = requireString(body.message, "message", 5000);

  if (!name || !email || !message) {
    return apiFail("Name, email, and message are required.", 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return apiFail("Please enter a valid email address.", 400);
  }

  const text = [
    `New contact from ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    `Subject: ${subject}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendNotificationEmail({
      subject: `[Virtue Gems] Contact: ${subject}`,
      html: contactEmailHtml({ name, email, phone, subject, message }),
      text,
      replyTo: email,
    });
    return apiOk({});
  } catch (error) {
    console.error("Contact form error:", error);
    return apiFail("Failed to send message. Please try again later.", 500);
  }
}
