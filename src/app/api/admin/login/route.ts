import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  makeSessionToken,
  passwordMatches,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const password =
    typeof body === "object" && body && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  if (!password || !passwordMatches(password)) {
    // Small delay to slow brute-force a little
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { error: "invalid_password" },
      { status: 401 }
    );
  }

  const token = await makeSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
