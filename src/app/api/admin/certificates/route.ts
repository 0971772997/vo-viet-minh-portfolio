import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { sb, dbReady, getCertificates } from "@/lib/db";
import { certificates as seedCertificates } from "@/data/site";
import {
  isValidUuid,
  sanitizeImageUrl,
  sanitizeText,
  sanitizeUrl,
} from "@/lib/admin-validate";

const JSON_HEADERS = { "Content-Type": "application/json" };

function pickCertificate(b: Record<string, unknown>) {
  const title = sanitizeText(b.title, 200);
  const issuer = sanitizeText(b.issuer, 200);
  const date = sanitizeText(b.date, 50);
  const description = sanitizeText(b.description ?? b.desc, 2000);
  const image = sanitizeImageUrl(b.image) ?? "";
  const link = sanitizeUrl(b.link);
  const sort = typeof b.sort === "number" ? b.sort : 0;

  return {
    title,
    issuer,
    date,
    description,
    image,
    link,
    sort,
  };
}

async function guard() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }
  if (!dbReady) {
    return NextResponse.json({ error: "Chưa cấu hình Supabase (.env)" }, { status: 503 });
  }
  return null;
}

export async function GET() {
  const g = await guard();
  if (g) return g;
  return NextResponse.json(await getCertificates());
}

export async function POST(req: Request) {
  const g = await guard();
  if (g) return g;

  const b = await req.json().catch(() => ({}));

  if (b.seed) {
    const check = await sb("/rest/v1/certificates?select=id&limit=1");
    if (check.ok) {
      const existing = await check.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { message: "Dữ liệu chứng nhận đã có sẵn trong cơ sở dữ liệu.", skipped: true },
          { status: 200 }
        );
      }
    }

    const rows = seedCertificates.map((item, i) => ({
      ...pickCertificate({ ...item }),
      sort: i,
    }));

    const r = await sb("/rest/v1/certificates", {
      method: "POST",
      headers: { ...JSON_HEADERS, Prefer: "return=representation" },
      body: JSON.stringify(rows),
    });
    return NextResponse.json(await r.json().catch(() => ({})), { status: r.ok ? 200 : 500 });
  }

  const certData = pickCertificate(b);
  if (!certData.title || !certData.issuer || !certData.image) {
    return NextResponse.json(
      { error: "Tên chứng nhận, đơn vị cấp và ảnh không được để trống" },
      { status: 400 }
    );
  }

  const r = await sb("/rest/v1/certificates", {
    method: "POST",
    headers: { ...JSON_HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(certData),
  });

  if (!r.ok) {
    const errText = await r.text().catch(() => "");
    return NextResponse.json({ error: `Lưu thất bại: ${errText}` }, { status: 500 });
  }

  return NextResponse.json(await r.json().catch(() => ({})), { status: 200 });
}

export async function PUT(req: Request) {
  const g = await guard();
  if (g) return g;

  const b = await req.json().catch(() => ({}));

  // Hỗ trợ cập nhật thứ tự sort nhanh
  if (isValidUuid(b.id) && typeof b.sort === "number" && Object.keys(b).length === 2) {
    const r = await sb(`/rest/v1/certificates?id=eq.${b.id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify({ sort: b.sort }),
    });
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
  }

  const certData = pickCertificate(b);
  if (!certData.title || !certData.issuer || !certData.image) {
    return NextResponse.json(
      { error: "Tên chứng nhận, đơn vị cấp và ảnh không được để trống" },
      { status: 400 }
    );
  }

  // Nếu có ID hợp lệ -> PATCH theo ID
  if (isValidUuid(b.id)) {
    const r = await sb(`/rest/v1/certificates?id=eq.${b.id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(certData),
    });
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
  }

  // Nếu chưa có ID (sửa từ dữ liệu mẫu) -> chèn mới vào DB
  const r = await sb("/rest/v1/certificates", {
    method: "POST",
    headers: { ...JSON_HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(certData),
  });

  if (!r.ok) {
    const errText = await r.text().catch(() => "");
    return NextResponse.json({ error: `Lưu thất bại: ${errText}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (g) return g;

  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!isValidUuid(id)) {
    return NextResponse.json({ error: "id không hợp lệ (yêu cầu UUID)" }, { status: 400 });
  }

  const r = await sb(`/rest/v1/certificates?id=eq.${id}`, { method: "DELETE" });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
}

