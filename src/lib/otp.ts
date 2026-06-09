import { createHmac, randomInt, timingSafeEqual } from "crypto";

const OTP_COOKIE = "vg-otp-challenge";
const SESSION_COOKIE = "vg-admin-session";
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  return (
    process.env.OTP_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "virtue-gems-otp-secret"
  );
}

export function getAdminEmail(): string {
  return (
    process.env.ADMIN_EMAIL ??
    process.env.NOTIFY_EMAIL ??
    "virtuegems777@gmail.com"
  );
}

export function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

function hashValue(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function hashOtp(otp: string): string {
  return hashValue(`otp:${otp}`);
}

export function createOtpPayload(email: string, otp: string): string {
  const exp = Date.now() + OTP_TTL_MS;
  const data = `${email}|${exp}|${hashOtp(otp)}`;
  const sig = hashValue(`challenge:${data}`);
  return Buffer.from(`${data}|${sig}`).toString("base64url");
}

export function verifyOtpPayload(
  payload: string,
  email: string,
  otp: string,
): boolean {
  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const parts = decoded.split("|");
    if (parts.length !== 4) return false;

    const [storedEmail, expStr, storedHash, sig] = parts;
    const exp = Number(expStr);

    if (storedEmail !== email.toLowerCase()) return false;
    if (Date.now() > exp) return false;

    const data = `${storedEmail}|${expStr}|${storedHash}`;
    const expectedSig = hashValue(`challenge:${data}`);

    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expectedBuf)) return false;

    const otpHash = hashOtp(otp);
    const otpBuf = Buffer.from(storedHash);
    const enteredBuf = Buffer.from(otpHash);
    if (otpBuf.length !== enteredBuf.length) return false;
    return timingSafeEqual(otpBuf, enteredBuf);
  } catch {
    return false;
  }
}

export function createSessionToken(email: string): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const data = `${email.toLowerCase()}|${exp}`;
  const sig = hashValue(`session:${data}`);
  return Buffer.from(`${data}|${sig}`).toString("base64url");
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split("|");
    if (parts.length !== 3) return false;

    const [email, expStr, sig] = parts;
    const exp = Number(expStr);

    if (email !== getAdminEmail().toLowerCase()) return false;
    if (Date.now() > exp) return false;

    const data = `${email}|${expStr}`;
    const expectedSig = hashValue(`session:${data}`);

    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}

export { OTP_COOKIE, SESSION_COOKIE, OTP_TTL_MS };
