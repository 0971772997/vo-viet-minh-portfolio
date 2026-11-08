import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { sb, dbReady } from "@/lib/db";

const ALLOWED_FOLDERS = new Set(["projects", "experiences", "certificates"]);
const MIME_EXT_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (!dbReady) {
    return NextResponse.json({ error: "Chưa cấu hình Supabase (.env)" }, { status: 503 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Dữ liệu tải lên không hợp lệ" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || !(file.type in MIME_EXT_MAP) || file.size > 5_000_000) {
    return NextResponse.json(
      { error: "Chỉ nhận ảnh png/jpg/webp/gif tối đa 5MB" },
      { status: 400 }
    );
  }

  const rawFolder = String(formData.get("folder") ?? new URL(req.url).searchParams.get("folder") ?? "projects").trim();
  const folder = ALLOWED_FOLDERS.has(rawFolder) ? rawFolder : "projects";
  const ext = MIME_EXT_MAP[file.type] ?? "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const path = `${folder}/${filename}`;

  const r = await sb(`/storage/v1/object/portfolio/${path}`, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: new Uint8Array(await file.arrayBuffer()),
  });

  if (!r.ok) {
    const errorDetails = await r.text().catch(() => "");
    const isRls = errorDetails.includes("row-level security") || r.status === 403;
    const msg = isRls
      ? "Lỗi quyền Supabase (RLS): Hãy copy và chạy lại file supabase.sql trong Supabase SQL Editor để cho phép tải ảnh lên bucket 'portfolio'."
      : `Upload thất bại: ${errorDetails || "Lỗi không xác định"}`;
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`;
  return NextResponse.json({ url: publicUrl });
}
