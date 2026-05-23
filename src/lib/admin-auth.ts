// Edge-runtime safe (uses Web Crypto). Usable from middleware AND API routes.

export const ADMIN_COOKIE = "admin_session";

const FALLBACK_SECRET = "change-me-in-env";
const SESSION_PAYLOAD = "ok:v1";

function getSecret(): string {
  return process.env.ADMIN_SECRET || FALLBACK_SECRET;
}

function getPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return toHex(sig);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function passwordMatches(input: string): boolean {
  const expected = getPassword();
  if (!expected) return false;
  return constantTimeEqual(input, expected);
}

export async function makeSessionToken(): Promise<string> {
  return hmacHex(getSecret(), SESSION_PAYLOAD);
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const expected = await makeSessionToken();
  return constantTimeEqual(token, expected);
}
