#!/usr/bin/env node
/**
 * Sends the "project started" email once SMTP is configured.
 * Usage: node --env-file=.env.local scripts/send-startup-email.mjs
 */
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "virtuegems777@gmail.com";
const FROM_NAME = process.env.FROM_NAME ?? "Virtue Gems";

if (!SMTP_USER || !SMTP_PASS) {
  console.error("Set SMTP_USER and SMTP_PASS in .env.local first.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const html = `
  <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
    <h2 style="color: #8b6914; border-bottom: 2px solid #d4af37; padding-bottom: 8px;">
      Virtue Gems — Project Started
    </h2>
    <p>Dear Team,</p>
    <p>We're pleased to confirm that the <strong>Virtue Gems</strong> project has officially started.</p>
    <h3 style="color: #8b6914;">What's done</h3>
    <ul>
      <li>GitHub repo connected</li>
      <li>Next.js app scaffolded</li>
      <li>Contact form with email notifications</li>
      <li>GitHub push/PR email alerts enabled</li>
    </ul>
    <h3 style="color: #8b6914;">Notifications you'll receive</h3>
    <ul>
      <li>Contact form submissions from the website</li>
      <li>Project updates via the notify API</li>
      <li>Every push and pull request on GitHub</li>
    </ul>
    <p><strong>Repository:</strong> <a href="https://github.com/tejakuchallapati/virtue-gems">github.com/tejakuchallapati/virtue-gems</a></p>
    <p style="color: #888; font-size: 12px; margin-top: 24px;">Virtue Gems automated notification</p>
  </div>
`;

await transporter.sendMail({
  from: `"${FROM_NAME}" <${SMTP_USER}>`,
  to: NOTIFY_EMAIL,
  subject: "Virtue Gems — Project Started | Setup Complete",
  html,
  text: "Virtue Gems project has started. Repo: https://github.com/tejakuchallapati/virtue-gems",
});

console.log(`Startup email sent to ${NOTIFY_EMAIL}`);
