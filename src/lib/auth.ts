import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const mac = (v: string) => createHmac("sha256", process.env.ADMIN_SECRET ?? "").update(v).digest("hex");
const h = (v: string) => createHmac("sha256", "pw").update(v).digest();

export function checkPassword(p: string) {
  const real = process.env.ADMIN_PASSWORD;
  return Boolean(real) && timingSafeEqual(h(p), h(real as string));
}
export function makeToken() {
  const exp = String(Date.now() + 7 * 864e5);
  return `${exp}.${mac(exp)}`;
}
export async function isAdmin() {
  if (!process.env.ADMIN_SECRET) return false;
  const t = (await cookies()).get("admin")?.value;
  const [exp, sig] = t?.split(".") ?? [];
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(mac(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
