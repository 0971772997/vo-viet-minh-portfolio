import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { sb, dbReady, getExperiences } from "@/lib/db";
import { timeline as seedTimeline } from "@/data/site";
import {
  isValidUuid,
  sanitizeImages,
  sanitizeLinks,
  sanitizeStringArray,
  sanitizeText,
} from "@/lib/admin-validate";

const JSON_HEADERS = { "Content-Type": "application/json" };

function pickExperience(b: Record<string, unknown>) {
  const period = sanitizeText(b.period, 100);
  const place = sanitizeText(b.place, 200);
  const role = sanitizeText(b.role, 200);
  const points = sanitizeStringArray(b.points, 30, 1000);
  const images = sanitizeImages(b.images, 12);
  const links = sanitizeLinks(b.links, 8);
  const sort = typeof b.sort === "number" ? b.sort : 0;

  return {
    period,
    place,
    role,
    points,
    images,
    links,
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
  return NextResponse.json(await getExperiences());
}

export async function POST(req: Request) {
  const g = await guard();
  if (g) return g;

  const b = await req.json().catch(() => ({}));

  if (b.seed) {
    const check = await sb("/rest/v1/experiences?select=id&limit=1");
    if (check.ok) {
      const existing = await check.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { message: "Dữ liệu kinh nghiệm đã có sẵn trong cơ sở dữ liệu.", skipped: true },
          { status: 200 }
        );
      }
    }

    const rows = seedTimeline.map((item, i) => ({
      ...pickExperience({ ...item }),
      sort: i,
    }));

    const r = await sb("/rest/v1/experiences", {
      method: "POST",
      headers: { ...JSON_HEADERS, Prefer: "return=representation" },
      body: JSON.stringify(rows),
    });
    return NextResponse.json(await r.json().catch(() => ({})), { status: r.ok ? 200 : 500 });
  }

  const expData = pickExperience(b);
  if (!expData.place || !expData.role) {
    return NextResponse.json(
      { error: "Nơi làm việc / trường học và vai trò không được để trống" },
      { status: 400 }
    );
  }

  const r = await sb("/rest/v1/experiences", {
    method: "POST",
    headers: { ...JSON_HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(expData),
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
    const r = await sb(`/rest/v1/experiences?id=eq.${b.id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify({ sort: b.sort }),
    });
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
  }

  const expData = pickExperience(b);
  if (!expData.place || !expData.role) {
    return NextResponse.json(
      { error: "Nơi làm việc / trường học và vai trò không được để trống" },
      { status: 400 }
    );
  }

  // Nếu có ID hợp lệ -> PATCH theo ID
  if (isValidUuid(b.id)) {
    const r = await sb(`/rest/v1/experiences?id=eq.${b.id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(expData),
    });
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
  }

  // Nếu chưa có ID (sửa từ dữ liệu mẫu) -> chèn mới vào DB
  const r = await sb("/rest/v1/experiences", {
    method: "POST",
    headers: { ...JSON_HEADERS, Prefer: "return=representation" },
    body: JSON.stringify(expData),
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

  const r = await sb(`/rest/v1/experiences?id=eq.${id}`, { method: "DELETE" });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
}

