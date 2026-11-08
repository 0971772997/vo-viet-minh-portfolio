import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { sb, dbReady, getProjects } from "@/lib/db";
import { projects as seed } from "@/data/site";
import {
  isValidUuid,
  sanitizeImageUrl,
  sanitizeImages,
  sanitizeLinks,
  sanitizeStringArray,
  sanitizeText,
  sanitizeUrl,
} from "@/lib/admin-validate";

const JSON_HEADERS = { "Content-Type": "application/json" };

function pickProject(b: Record<string, unknown>) {
  const name = sanitizeText(b.name, 200);
  const rawSlug = sanitizeText(b.slug, 100).toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const slug = rawSlug || crypto.randomUUID().slice(0, 8);
  const summary = sanitizeText(b.summary, 2000);
  const role = sanitizeText(b.role, 300);
  const tech = sanitizeStringArray(b.tech, 50, 100);
  const features = sanitizeStringArray(b.features, 50, 500);
  const repo = sanitizeUrl(b.repo);
  const demo = sanitizeUrl(b.demo);
  const image = sanitizeImageUrl(b.image);
  const images = sanitizeImages(b.images, 12);
  const links = sanitizeLinks(b.links, 8);
  const sort = typeof b.sort === "number" ? b.sort : 0;

  return {
    slug,
    name,
    summary,
    role,
    tech,
    features,
    repo,
    demo,
    image,
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
  return NextResponse.json(await getProjects());
}

export async function POST(req: Request) {
  const g = await guard();
  if (g) return g;

  const b = await req.json().catch(() => ({}));

  if (b.seed) {
    // Kiểm tra xem đã có dữ liệu trong bảng projects chưa
    const check = await sb("/rest/v1/projects?select=id&limit=1");
    if (check.ok) {
      const existing = await check.json();
      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json(
          { message: "Dữ liệu dự án đã có sẵn trong cơ sở dữ liệu.", skipped: true },
          { status: 200 }
        );
      }
    }

    const rows = seed.map((p, i) => ({
      ...pickProject({ ...p }),
      sort: i,
    }));
    const r = await sb("/rest/v1/projects", {
      method: "POST",
      headers: {
        ...JSON_HEADERS,
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(rows),
    });
    if (!r.ok) {
      const err = await r.text().catch(() => "");
      return NextResponse.json({ error: `Lỗi nhập dữ liệu mẫu: ${err}` }, { status: 500 });
    }
    return NextResponse.json(await r.json().catch(() => ({})), { status: 200 });
  }

  const projectData = pickProject(b);
  if (!projectData.name) {
    return NextResponse.json({ error: "Tên dự án không được để trống" }, { status: 400 });
  }

  // Sử dụng resolution=merge-duplicates để tự động cập nhật nếu slug đã có trong DB
  const r = await sb("/rest/v1/projects", {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(projectData),
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
    const r = await sb(`/rest/v1/projects?id=eq.${b.id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify({ sort: b.sort }),
    });
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
  }

  const projectData = pickProject(b);
  if (!projectData.name) {
    return NextResponse.json({ error: "Tên dự án không được để trống" }, { status: 400 });
  }

  // Nếu có ID hợp lệ -> PATCH theo ID
  if (isValidUuid(b.id)) {
    const r = await sb(`/rest/v1/projects?id=eq.${b.id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(projectData),
    });
    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      return NextResponse.json({ error: `Cập nhật thất bại: ${errText}` }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // Nếu không có ID nhưng có slug (ví dụ sửa dự án mẫu ban đầu) -> Upsert theo slug
  const r = await sb("/rest/v1/projects", {
    method: "POST",
    headers: {
      ...JSON_HEADERS,
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(projectData),
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

  const r = await sb(`/rest/v1/projects?id=eq.${id}`, { method: "DELETE" });
  return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 500 });
}
