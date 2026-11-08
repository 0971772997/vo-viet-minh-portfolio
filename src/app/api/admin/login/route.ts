import { NextResponse } from "next/server";
import { checkPassword, makeToken } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.password !== "string" || !checkPassword(body.password)) {
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", makeToken(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 7 * 86400 });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin");
  return res;
}
