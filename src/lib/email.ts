import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "virtuegems777@gmail.com";
const FROM_NAME = process.env.FROM_NAME ?? "Virtue Gems";

export function isEmailConfigured(): boolean {
  return Boolean(SMTP_USER && SMTP_PASS);
}

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Email is not configured. Set SMTP_USER and SMTP_PASS in .env.local",
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

type SendEmailOptions = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export async function sendNotificationEmail({
  subject,
  html,
  text,
  replyTo,
}: SendEmailOptions) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    replyTo,
    subject,
    html,
    text,
  });
}

export function contactEmailHtml(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #8b6914; border-bottom: 2px solid #d4af37; padding-bottom: 8px;">
        New Contact — Virtue Gems
      </h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ""}
      <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background: #faf8f5; padding: 12px; border-radius: 8px;">
        ${escapeHtml(data.message)}
      </p>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">
        Sent from the Virtue Gems website contact form.
      </p>
    </div>
  `;
}

export function projectUpdateEmailHtml(data: {
  title: string;
  message: string;
  details?: Record<string, string>;
}) {
  const detailRows = data.details
    ? Object.entries(data.details)
        .map(
          ([key, value]) =>
            `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</p>`,
        )
        .join("")
    : "";

  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #8b6914; border-bottom: 2px solid #d4af37; padding-bottom: 8px;">
        ${escapeHtml(data.title)}
      </h2>
      <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      ${detailRows}
      <p style="color: #888; font-size: 12px; margin-top: 24px;">
        Virtue Gems project notification
      </p>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
