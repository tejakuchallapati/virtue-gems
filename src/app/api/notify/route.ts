import {
  apiFail,
  apiOk,
  checkRateLimit,
  clientIp,
  parseJsonBody,
  requireString,
} from "@/lib/api-server";
import {
  isEmailConfigured,
  projectUpdateEmailHtml,
  sendNotificationEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  const limited = checkRateLimit(`notify:${clientIp(request)}`, 20, 60_000);
  if (limited) return limited;

  try {
    const apiKey = request.headers.get("x-api-key");
    const expectedKey = process.env.NOTIFY_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return apiFail("Unauthorized.", 401);
    }

    if (!isEmailConfigured()) {
      return apiFail("Email service is not configured yet.", 503);
    }

    const parsed = await parseJsonBody<Record<string, unknown>>(request);
    if ("error" in parsed) return parsed.error;

    const title = requireString(parsed.data.title, "title", 200);
    const message = requireString(parsed.data.message, "message", 5000);

    if (!title || !message) {
      return apiFail("Title and message are required.", 400);
    }

    const details =
      parsed.data.details &&
      typeof parsed.data.details === "object" &&
      !Array.isArray(parsed.data.details)
        ? (parsed.data.details as Record<string, string>)
        : undefined;

    const detailText = details
      ? "\n\n" +
        Object.entries(details)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      : "";

    await sendNotificationEmail({
      subject: `[Virtue Gems] ${title}`,
      html: projectUpdateEmailHtml({ title, message, details }),
      text: `${title}\n\n${message}${detailText}`,
    });

    return apiOk({});
  } catch (error) {
    console.error("Notify error:", error);
    return apiFail("Failed to send notification.", 500);
  }
}
