import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SALT_BYTES = 16;
const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES).toString("hex");
  const key = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${key}`;
}

export function verifyPassword(password: string, hashed: string): boolean {
  const [salt, originalHex] = hashed.split(":");
  if (!salt || !originalHex) return false;
  const derivedHex = scryptSync(password, salt, KEYLEN).toString("hex");
  return timingSafeEqual(Buffer.from(originalHex, "hex"), Buffer.from(derivedHex, "hex"));
}
