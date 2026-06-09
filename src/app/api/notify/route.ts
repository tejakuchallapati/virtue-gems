import { NextResponse } from "next/server";
import {
  isEmailConfigured,
  projectUpdateEmailHtml,
  sendNotificationEmail,
} from "@/lib/email";

type NotifyBody = {
  title?: string;
  message?: string;
  details?: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key");
    const expectedKey = process.env.NOTIFY_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: "Email service is not configured yet." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as NotifyBody;
    const title = body.title?.trim();
    const message = body.message?.trim();

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required." },
        { status: 400 },
      );
    }

    const detailText = body.details
      ? "\n\n" +
        Object.entries(body.details)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      : "";

    await sendNotificationEmail({
      subject: `[Virtue Gems] ${title}`,
      html: projectUpdateEmailHtml({
        title,
        message,
        details: body.details,
      }),
      text: `${title}\n\n${message}${detailText}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notify error:", error);
    return NextResponse.json(
      { error: "Failed to send notification." },
      { status: 500 },
    );
  }
}
