"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project, ExperienceItem, CertificateItem, CustomLink } from "@/data/site";
import SingleImageUploader from "@/components/admin/SingleImageUploader";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import LinkListEditor from "@/components/admin/LinkListEditor";
import {
  FolderKanban,
  Briefcase,
  Award,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  Database,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type TabKey = "projects" | "experiences" | "certificates";

// Project Form
type ProjectForm = {
  id?: string;
  slug: string;
  name: string;
  summary: string;
  role: string;
  tech: string;
  features: string;
  repo: string;
  demo: string;
  image: string;
  images: string[];
  links: CustomLink[];
};
const emptyProject: ProjectForm = {
  slug: "",
  name: "",
  summary: "",
  role: "",
  tech: "",
  features: "",
  repo: "",
  demo: "",
  image: "",
  images: [],
  links: [],
};

// Experience Form
type ExperienceForm = {
  id?: string;
  period: string;
  place: string;
  role: string;
  points: string;
  images: string[];
  links: CustomLink[];
};
const emptyExperience: ExperienceForm = {
  period: "",
  place: "",
  role: "",
  points: "",
  images: [],
  links: [],
};

// Certificate Form
type CertificateForm = {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  link: string;
};
const emptyCertificate: CertificateForm = {
  title: "",
  issuer: "",
  date: "",
  description: "",
  image: "",
  link: "",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("projects");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "err" } | null>(null);

  // Data states
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [experiences, setExperiences] = useState<ExperienceItem[] | null>(null);
  const [certificates, setCertificates] = useState<CertificateItem[] | null>(null);

  // Form states
  const [pForm, setPForm] = useState<ProjectForm>(emptyProject);
  const [eForm, setEForm] = useState<ExperienceForm>(emptyExperience);
  const [cForm, setCForm] = useState<CertificateForm>(emptyCertificate);

  // Edit mode tracking
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isEditingExp, setIsEditingExp] = useState(false);
  const [isEditingCert, setIsEditingCert] = useState(false);

  const showMsg = (text: string, type: "ok" | "err" = "ok") => {
    setMsg({ text, type });
  };

  // Loaders
  const loadProjects = useCallback(async () => {
    const res = await fetch("/api/admin/projects");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    if (res.ok) {
      setProjects(await res.json());
    } else {
      const j = await res.json().catch(() => ({}));
      showMsg(j.error ?? "Lỗi tải dự án", "err");
    }
  }, []);

  const loadExperiences = useCallback(async () => {
    const res = await fetch("/api/admin/experiences");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    if (res.ok) {
      setExperiences(await res.json());
    } else {
      const j = await res.json().catch(() => ({}));
      showMsg(j.error ?? "Lỗi tải kinh nghiệm", "err");
    }
  }, []);

  const loadCertificates = useCallback(async () => {
    const res = await fetch("/api/admin/certificates");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    if (res.ok) {
      setCertificates(await res.json());
    } else {
      const j = await res.json().catch(() => ({}));
      showMsg(j.error ?? "Lỗi tải chứng nhận", "err");
    }
  }, []);

  const loadAll = useCallback(() => {
    loadProjects();
    loadExperiences();
    loadCertificates();
  }, [loadProjects, loadExperiences, loadCertificates]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Auth actions
  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      setPw("");
      setMsg(null);
      setAuthed(true);
      loadAll();
    } else {
      showMsg("Sai mật khẩu truy cập", "err");
    }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  }

  // --- PROJECT HANDLERS ---
  async function saveProject(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...pForm,
      tech: pForm.tech.split(",").map((t) => t.trim()).filter(Boolean),
      features: pForm.features.split("\n").map((f) => f.trim()).filter(Boolean),
    };
    const method = (pForm.id || isEditingProject) ? "PUT" : "POST";
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      showMsg(isEditingProject ? "Đã cập nhật dự án thành công." : "Đã thêm dự án mới.");
      setPForm(emptyProject);
      setIsEditingProject(false);
      loadProjects();
    } else {
      const err = j.error ?? "Lưu dự án thất bại.";
      const isRls = err.includes("policy") || err.includes("violates");
      const hint = isRls ? " (Lỗi quyền Supabase RLS: Vui lòng chạy supabase.sql trong Supabase SQL Editor)." : "";
      showMsg(err + hint, "err");
    }
  }

  async function deleteProject(id?: string) {
    if (!id || !confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showMsg("Đã xóa dự án.");
      loadProjects();
    } else {
      showMsg("Xóa dự án thất bại.", "err");
    }
  }

  async function seedProjects() {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed: true }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      showMsg(j.message ?? "Đã nhập dữ liệu dự án mẫu vào cơ sở dữ liệu.");
      loadProjects();
    } else {
      showMsg(j.error ?? "Lỗi nhập dữ liệu mẫu.", "err");
    }
  }

  // --- EXPERIENCE HANDLERS ---
  async function saveExperience(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      ...eForm,
      points: eForm.points.split("\n").map((p) => p.trim()).filter(Boolean),
    };
    const method = (eForm.id || isEditingExp) ? "PUT" : "POST";
    const res = await fetch("/api/admin/experiences", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      showMsg(isEditingExp ? "Đã cập nhật kinh nghiệm thành công." : "Đã thêm kinh nghiệm mới.");
      setEForm(emptyExperience);
      setIsEditingExp(false);
      loadExperiences();
    } else {
      const err = j.error ?? "Lưu kinh nghiệm thất bại.";
      const isRls = err.includes("policy") || err.includes("violates");
      const hint = isRls ? " (Lỗi quyền Supabase RLS: Vui lòng chạy supabase.sql trong Supabase SQL Editor)." : "";
      showMsg(err + hint, "err");
    }
  }

  async function deleteExperience(id?: string) {
    if (!id || !confirm("Bạn có chắc chắn muốn xóa mục kinh nghiệm này?")) return;
    const res = await fetch(`/api/admin/experiences?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showMsg("Đã xóa mục kinh nghiệm.");
      loadExperiences();
    } else {
      showMsg("Xóa thất bại.", "err");
    }
  }

  async function seedExperiences() {
    const res = await fetch("/api/admin/experiences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed: true }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      showMsg(j.message ?? "Đã nhập dữ liệu kinh nghiệm mẫu vào cơ sở dữ liệu.");
      loadExperiences();
    } else {
      showMsg(j.error ?? "Lỗi nhập dữ liệu mẫu.", "err");
    }
  }

  async function moveExperience(index: number, direction: "up" | "down") {
    if (!experiences) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const current = experiences[index];
    const target = experiences[targetIndex];
    if (!current.id || !target.id) {
      showMsg("Vui lòng nhập dữ liệu mẫu vào DB trước khi sắp xếp.", "err");
      return;
    }

    // Hoán đổi giá trị sort
    const currentSort = current.sort ?? index;
    const targetSort = target.sort ?? targetIndex;
    const newCurrentSort = targetSort === currentSort ? targetIndex : targetSort;
    const newTargetSort = targetSort === currentSort ? index : currentSort;

    await Promise.all([
      fetch("/api/admin/experiences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id, sort: newCurrentSort }),
      }),
      fetch("/api/admin/experiences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id, sort: newTargetSort }),
      }),
    ]);
    loadExperiences();
  }

  // --- CERTIFICATE HANDLERS ---
  async function saveCertificate(e: React.FormEvent) {
    e.preventDefault();
    const method = (cForm.id || isEditingCert) ? "PUT" : "POST";
    const res = await fetch("/api/admin/certificates", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cForm),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      showMsg(isEditingCert ? "Đã cập nhật chứng nhận thành công." : "Đã thêm chứng nhận mới.");
      setCForm(emptyCertificate);
      setIsEditingCert(false);
      loadCertificates();
    } else {
      const err = j.error ?? "Lưu chứng nhận thất bại.";
      const isRls = err.includes("policy") || err.includes("violates");
      const hint = isRls ? " (Lỗi quyền Supabase RLS: Vui lòng chạy supabase.sql trong Supabase SQL Editor)." : "";
      showMsg(err + hint, "err");
    }
  }

  async function deleteCertificate(id?: string) {
    if (!id || !confirm("Bạn có chắc chắn muốn xóa chứng nhận này?")) return;
    const res = await fetch(`/api/admin/certificates?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      showMsg("Đã xóa chứng nhận.");
      loadCertificates();
    } else {
      showMsg("Xóa thất bại.", "err");
    }
  }

  async function seedCertificates() {
    const res = await fetch("/api/admin/certificates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed: true }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      showMsg(j.message ?? "Đã nhập chứng nhận mẫu vào cơ sở dữ liệu.");
      loadCertificates();
    } else {
      showMsg(j.error ?? "Lỗi nhập chứng nhận mẫu.", "err");
    }
  }

  async function moveCertificate(index: number, direction: "up" | "down") {
    if (!certificates) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certificates.length) return;

    const current = certificates[index];
    const target = certificates[targetIndex];
    if (!current.id || !target.id) {
      showMsg("Vui lòng nhập dữ liệu mẫu vào DB trước khi sắp xếp.", "err");
      return;
    }

    const currentSort = current.sort ?? index;
    const targetSort = target.sort ?? targetIndex;
    const newCurrentSort = targetSort === currentSort ? targetIndex : targetSort;
    const newTargetSort = targetSort === currentSort ? index : currentSort;

    await Promise.all([
      fetch("/api/admin/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id, sort: newCurrentSort }),
      }),
      fetch("/api/admin/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: target.id, sort: newTargetSort }),
      }),
    ]);
    loadCertificates();
  }

  // Login view
  if (!authed) {
    return (
      <main className="adm">
        <form onSubmit={login} className="card adm-login-card">
          <h1>Đăng nhập quản trị</h1>
          <p className="muted">Nhập mật khẩu quản trị hệ thống để chỉnh sửa dữ liệu danh mục.</p>
          <label className="f">
            Mật khẩu
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Nhập mật khẩu admin..."
              autoFocus
              required
            />
          </label>
          <button className="btn primary" type="submit">
            Đăng nhập
          </button>
          {msg && (
            <p className={msg.type === "err" ? "err" : "ok"} role="alert">
              {msg.text}
            </p>
          )}
        </form>
      </main>
    );
  }

  const hasProjectId = projects?.some((p) => p.id);
  const hasExperienceId = experiences?.some((e) => e.id);
  const hasCertificateId = certificates?.some((c) => c.id);

  return (
    <main className="adm">
      {/* Top Header */}
      <header className="admh">
        <div>
          <h1>Bảng điều khiển Quản trị</h1>
          <p className="muted">Quản lý Dự án, Kinh nghiệm & Học vấn, Chứng nhận</p>
        </div>
        <div className="adm-header-actions">
          <Link className="btn" href="/" target="_blank">
            <ExternalLink size={16} /> Xem trang chủ
          </Link>
          <button className="btn" onClick={logout} title="Đăng xuất">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </header>

      {/* Quick Setup Hint */}
      <div className="adm-quick-hint">
        <span>💡 <strong>Lưu ý quan trọng:</strong> Nếu gặp lỗi <em>403 Row-level security</em> khi tải ảnh hoặc lưu dữ liệu, hãy mở Supabase &gt; SQL Editor, dán toàn bộ file <code>supabase.sql</code> và nhấn <strong>Run</strong> để cấp quyền lưu trữ tự động.</span>
      </div>

      {/* Notification Banner */}
      {msg && (
        <div className={`adm-banner ${msg.type === "err" ? "err" : "ok"}`} role="status">
          {msg.type === "err" ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="btn-close-banner">
            ✕
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <nav className="adm-tabs" role="tablist" aria-label="Các danh mục quản trị">
        <button
          role="tab"
          aria-selected={activeTab === "projects"}
          className={`adm-tab ${activeTab === "projects" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("projects");
            setMsg(null);
          }}
        >
          <FolderKanban size={18} />
          <span>Dự án</span>
          <span className="adm-tab-count">({projects?.length ?? 0})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "experiences"}
          className={`adm-tab ${activeTab === "experiences" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("experiences");
            setMsg(null);
          }}
        >
          <Briefcase size={18} />
          <span>Kinh nghiệm</span>
          <span className="adm-tab-count">({experiences?.length ?? 0})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "certificates"}
          className={`adm-tab ${activeTab === "certificates" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("certificates");
            setMsg(null);
          }}
        >
          <Award size={18} />
          <span>Chứng nhận</span>
          <span className="adm-tab-count">({certificates?.length ?? 0})</span>
        </button>
      </nav>

      {/* TAB 1: DỰ ÁN */}
      {activeTab === "projects" && (
        <section className="adm-tab-content">
          {projects && !hasProjectId && (
            <div className="card adm-seed-notice">
              <div>
                <strong>Trang đang hiển thị dữ liệu tĩnh dự phòng.</strong>
                <p className="muted">
                  Bảng dự án trong cơ sở dữ liệu đang trống. Hãy nhập dữ liệu mẫu để bắt đầu chỉnh sửa trực tiếp.
                </p>
              </div>
              <button className="btn primary" onClick={seedProjects}>
                <Database size={16} /> Nhập dữ liệu mẫu vào DB
              </button>
            </div>
          )}

          {/* Form thêm / sửa dự án */}
          <form className={`card adm-form ${isEditingProject ? "editing-mode" : ""}`} onSubmit={saveProject}>
            <div className="form-header">
              <h2>{isEditingProject ? `Chỉnh sửa dự án: "${pForm.name}"` : "Thêm dự án mới"}</h2>
              {isEditingProject && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setPForm(emptyProject);
                    setIsEditingProject(false);
                  }}
                >
                  Hủy sửa (Về thêm mới)
                </button>
              )}
            </div>

            <div className="form-row-2">
              <label className="f">
                Tên dự án *
                <input
                  value={pForm.name}
                  onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                  placeholder="VD: Pawbound, Ecommerce Platform..."
                  required
                />
              </label>

              <label className="f">
                Slug URL (không dấu)
                <input
                  value={pForm.slug}
                  onChange={(e) => setPForm({ ...pForm, slug: e.target.value })}
                  placeholder="tự động tạo nếu bỏ trống"
                />
              </label>
            </div>

            <label className="f">
              Mô tả tóm tắt
              <textarea
                rows={3}
                value={pForm.summary}
                onChange={(e) => setPForm({ ...pForm, summary: e.target.value })}
                placeholder="Mô tả ngắn gọn về giải pháp, mục tiêu của dự án..."
              />
            </label>

            <div className="form-row-2">
              <label className="f">
                Vai trò thực hiện
                <input
                  value={pForm.role}
                  onChange={(e) => setPForm({ ...pForm, role: e.target.value })}
                  placeholder="VD: Full-stack Developer, Thiết kế Backend..."
                />
              </label>

              <label className="f">
                Công nghệ chính (cách nhau bằng dấu phẩy)
                <input
                  value={pForm.tech}
                  onChange={(e) => setPForm({ ...pForm, tech: e.target.value })}
                  placeholder="Next.js, TypeScript, PostgreSQL, Docker"
                />
              </label>
            </div>

            <label className="f">
              Tính năng nổi bật (mỗi dòng một tính năng)
              <textarea
                rows={4}
                value={pForm.features}
                onChange={(e) => setPForm({ ...pForm, features: e.target.value })}
                placeholder="Authentication & RBAC&#10;Quản lý sản phẩm và danh mục&#10;AI Orchestration..."
              />
            </label>

            <div className="form-row-2">
              <label className="f">
                GitHub Repository (URL)
                <input
                  type="url"
                  value={pForm.repo}
                  onChange={(e) => setPForm({ ...pForm, repo: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </label>

              <label className="f">
                Live Demo chính (URL)
                <input
                  type="url"
                  value={pForm.demo}
                  onChange={(e) => setPForm({ ...pForm, demo: e.target.value })}
                  placeholder="https://..."
                />
              </label>
            </div>

            {/* Ảnh bìa */}
            <SingleImageUploader
              folder="projects"
              value={pForm.image}
              onChange={(url) => setPForm({ ...pForm, image: url })}
              label="Ảnh bìa dự án (Cover Image)"
              recommendedText="Ảnh đại diện tỷ lệ 16:9, tối đa 5MB"
            />

            {/* Thư viện nhiều ảnh */}
            <MultiImageUploader
              folder="projects"
              images={pForm.images}
              onChange={(imgs) => setPForm({ ...pForm, images: imgs })}
              label="Thư viện ảnh chi tiết (tối đa 12 ảnh)"
              maxImages={12}
            />

            {/* Các link demo bổ sung */}
            <LinkListEditor
              links={pForm.links}
              onChange={(links) => setPForm({ ...pForm, links })}
              label="Các liên kết demo bổ sung (Video, Figma, Swagger, Mobile...)"
              presetLabels={["Video demo", "Figma", "Swagger API", "Bản mobile", "Tài liệu kỹ thuật"]}
              maxLinks={8}
            />

            <div className="form-actions">
              <button className="btn primary" type="submit">
                {isEditingProject ? "Lưu cập nhật dự án" : "Thêm dự án"}
              </button>
              {isEditingProject && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setPForm(emptyProject);
                    setIsEditingProject(false);
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>

          {/* Danh sách dự án */}
          <div className="adm-list-section">
            <div className="adm-list-header">
              <h3>Danh sách dự án ({projects?.length ?? 0})</h3>
            </div>
            <ul className="admlist">
              {projects?.map((p) => (
                <li key={p.id ?? p.slug} className="card adm-item-card">
                  <div className="adm-item-main">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={`Ảnh ${p.name}`}
                        width={90}
                        height={55}
                        className="adm-item-thumb"
                        unoptimized
                      />
                    )}
                    <div>
                      <strong>{p.name}</strong>
                      <p className="muted" style={{ fontSize: "0.85rem" }}>
                        {p.role || "Chưa có vai trò"} · {p.tech.slice(0, 3).join(", ")}
                        {p.tech.length > 3 ? "..." : ""}
                      </p>
                      <div className="adm-item-badges">
                        {p.images && p.images.length > 0 && (
                          <span className="mini-badge">{p.images.length} ảnh demo</span>
                        )}
                        {p.links && p.links.length > 0 && (
                          <span className="mini-badge">{p.links.length} link bổ sung</span>
                        )}
                        {p.demo && <span className="mini-badge-ok">Live Demo</span>}
                        {p.repo && <span className="mini-badge-ok">GitHub</span>}
                      </div>
                    </div>
                  </div>

                  <div className="adm-item-actions">
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        setPForm({
                          id: p.id,
                          slug: p.slug,
                          name: p.name,
                          summary: p.summary,
                          role: p.role,
                          tech: p.tech.join(", "),
                          features: p.features.join("\n"),
                          repo: p.repo ?? "",
                          demo: p.demo ?? "",
                          image: p.image ?? "",
                          images: Array.isArray(p.images) ? p.images : [],
                          links: Array.isArray(p.links) ? p.links : [],
                        });
                        setIsEditingProject(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      title="Chỉnh sửa dự án"
                    >
                      <Edit2 size={14} /> Sửa
                    </button>
                    {p.id && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteProject(p.id)}
                        title="Xóa dự án"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* TAB 2: KINH NGHIỆM */}
      {activeTab === "experiences" && (
        <section className="adm-tab-content">
          {experiences && !hasExperienceId && (
            <div className="card adm-seed-notice">
              <div>
                <strong>Trang đang hiển thị dòng thời gian tĩnh dự phòng.</strong>
                <p className="muted">
                  Bảng kinh nghiệm trong DB đang trống. Nhập dữ liệu mẫu một lần để bắt đầu chỉnh sửa, thêm ảnh và link demo.
                </p>
              </div>
              <button className="btn primary" onClick={seedExperiences}>
                <Database size={16} /> Nhập kinh nghiệm mẫu vào DB
              </button>
            </div>
          )}

          {/* Form thêm / sửa kinh nghiệm */}
          <form className={`card adm-form ${isEditingExp ? "editing-mode" : ""}`} onSubmit={saveExperience}>
            <div className="form-header">
              <h2>{isEditingExp ? `Chỉnh sửa mốc: "${eForm.place}"` : "Thêm mốc kinh nghiệm mới"}</h2>
              {isEditingExp && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setEForm(emptyExperience);
                    setIsEditingExp(false);
                  }}
                >
                  Hủy sửa (Về thêm mới)
                </button>
              )}
            </div>

            <div className="form-row-3">
              <label className="f">
                Thời gian (Period) *
                <input
                  value={eForm.period}
                  onChange={(e) => setEForm({ ...eForm, period: e.target.value })}
                  placeholder="VD: 03/2026 – nay, 05/2025 – 07/2025"
                  required
                />
              </label>

              <label className="f">
                Nơi làm việc / Trường học *
                <input
                  value={eForm.place}
                  onChange={(e) => setEForm({ ...eForm, place: e.target.value })}
                  placeholder="VD: Tinfiniq AI Studio, Đại học Đông Á..."
                  required
                />
              </label>

              <label className="f">
                Vai trò / Chức danh *
                <input
                  value={eForm.role}
                  onChange={(e) => setEForm({ ...eForm, role: e.target.value })}
                  placeholder="VD: Web Developer, Cộng tác viên AI..."
                  required
                />
              </label>
            </div>

            <label className="f">
              Chi tiết công việc / Thành tích (mỗi dòng một mục)
              <textarea
                rows={4}
                value={eForm.points}
                onChange={(e) => setEForm({ ...eForm, points: e.target.value })}
                placeholder="Xử lý bộ dữ liệu 3D phức tạp...&#10;Tối ưu quy trình xử lý dữ liệu..."
              />
            </label>

            {/* Nhiều ảnh demo */}
            <MultiImageUploader
              folder="experiences"
              images={eForm.images}
              onChange={(imgs) => setEForm({ ...eForm, images: imgs })}
              label="Ảnh minh họa / Bằng chứng kết quả (tối đa 12 ảnh)"
              maxImages={12}
            />

            {/* Các link demo bổ sung */}
            <LinkListEditor
              links={eForm.links}
              onChange={(links) => setEForm({ ...eForm, links })}
              label="Liên kết chứng minh / Demo / Website sản phẩm"
              presetLabels={["Website công ty", "Sản phẩm thực tế", "Báo cáo / Certificate", "GitHub"]}
              maxLinks={8}
            />

            <div className="form-actions">
              <button className="btn primary" type="submit">
                {isEditingExp ? "Lưu cập nhật kinh nghiệm" : "Thêm kinh nghiệm"}
              </button>
              {isEditingExp && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setEForm(emptyExperience);
                    setIsEditingExp(false);
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>

          {/* Danh sách kinh nghiệm */}
          <div className="adm-list-section">
            <div className="adm-list-header">
              <h3>Dòng thời gian kinh nghiệm ({experiences?.length ?? 0})</h3>
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                Dùng nút mũi tên lên/xuống để thay đổi thứ tự xuất hiện trên trang chủ.
              </p>
            </div>
            <ul className="admlist">
              {experiences?.map((exp, idx) => (
                <li key={exp.id ?? `${exp.period}-${exp.place}`} className="card adm-item-card">
                  <div className="adm-item-main">
                    <div className="reorder-controls">
                      <button
                        type="button"
                        className="btn-icon"
                        disabled={idx === 0}
                        onClick={() => moveExperience(idx, "up")}
                        title="Di chuyển lên trên"
                        aria-label="Di chuyển lên trên"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        disabled={idx === (experiences.length - 1)}
                        onClick={() => moveExperience(idx, "down")}
                        title="Di chuyển xuống dưới"
                        aria-label="Di chuyển xuống dưới"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    <div>
                      <span className="when" style={{ fontSize: "0.85rem" }}>{exp.period}</span>
                      <h4 style={{ margin: "2px 0", color: "var(--tx)", fontSize: "1rem" }}>{exp.place}</h4>
                      <p className="muted" style={{ fontSize: "0.85rem" }}>{exp.role}</p>

                      <div className="adm-item-badges">
                        {exp.images && exp.images.length > 0 && (
                          <span className="mini-badge">{exp.images.length} ảnh demo</span>
                        )}
                        {exp.links && exp.links.length > 0 && (
                          <span className="mini-badge">{exp.links.length} liên kết</span>
                        )}
                        <span className="mini-badge muted">{exp.points.length} điểm thành tích</span>
                      </div>
                    </div>
                  </div>

                  <div className="adm-item-actions">
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        setEForm({
                          id: exp.id,
                          period: exp.period,
                          place: exp.place,
                          role: exp.role,
                          points: exp.points.join("\n"),
                          images: Array.isArray(exp.images) ? exp.images : [],
                          links: Array.isArray(exp.links) ? exp.links : [],
                        });
                        setIsEditingExp(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      title="Chỉnh sửa kinh nghiệm"
                    >
                      <Edit2 size={14} /> Sửa
                    </button>
                    {exp.id && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteExperience(exp.id)}
                        title="Xóa mốc kinh nghiệm"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* TAB 3: CHỨNG NHẬN */}
      {activeTab === "certificates" && (
        <section className="adm-tab-content">
          {certificates && !hasCertificateId && (
            <div className="card adm-seed-notice">
              <div>
                <strong>Trang đang hiển thị chứng nhận tĩnh dự phòng.</strong>
                <p className="muted">
                  Bảng chứng nhận trong DB đang trống. Hãy bấm &quot;Nhập dữ liệu mẫu&quot; để đưa chứng chỉ KPI xanh của AZ Media vào cơ sở dữ liệu.
                </p>
              </div>
              <button className="btn primary" onClick={seedCertificates}>
                <Database size={16} /> Nhập chứng nhận mẫu vào DB
              </button>
            </div>
          )}

          {/* Form thêm / sửa chứng nhận */}
          <form className={`card adm-form ${isEditingCert ? "editing-mode" : ""}`} onSubmit={saveCertificate}>
            <div className="form-header">
              <h2>{isEditingCert ? `Chỉnh sửa chứng nhận: "${cForm.title}"` : "Thêm chứng nhận mới"}</h2>
              {isEditingCert && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setCForm(emptyCertificate);
                    setIsEditingCert(false);
                  }}
                >
                  Hủy sửa (Về thêm mới)
                </button>
              )}
            </div>

            <div className="form-row-2">
              <label className="f">
                Tên chứng nhận / Vinh danh *
                <input
                  value={cForm.title}
                  onChange={(e) => setCForm({ ...cForm, title: e.target.value })}
                  placeholder="VD: Thành viên đạt KPI xanh"
                  required
                />
              </label>

              <label className="f">
                Đơn vị cấp *
                <input
                  value={cForm.issuer}
                  onChange={(e) => setCForm({ ...cForm, issuer: e.target.value })}
                  placeholder="VD: AZ Media (AZ Homes), Đà Nẵng"
                  required
                />
              </label>
            </div>

            <div className="form-row-2">
              <label className="f">
                Ngày cấp (dd/mm/yyyy)
                <input
                  value={cForm.date}
                  onChange={(e) => setCForm({ ...cForm, date: e.target.value })}
                  placeholder="VD: 25/07/2026"
                />
              </label>

              <label className="f">
                Link xác thực trực tuyến (tùy chọn)
                <input
                  type="url"
                  value={cForm.link}
                  onChange={(e) => setCForm({ ...cForm, link: e.target.value })}
                  placeholder="https://..."
                />
              </label>
            </div>

            <label className="f">
              Mô tả chi tiết chứng nhận
              <textarea
                rows={3}
                value={cForm.description}
                onChange={(e) => setCForm({ ...cForm, description: e.target.value })}
                placeholder="Được ghi nhận và tuyên dương vì đóng góp tích cực..."
              />
            </label>

            {/* Ảnh chứng nhận */}
            <SingleImageUploader
              folder="certificates"
              value={cForm.image}
              onChange={(url) => setCForm({ ...cForm, image: url })}
              label="Ảnh giấy chứng nhận / bằng khen *"
              recommendedText="Chụp rõ nét bản gốc, hỗ trợ PNG, JPG, WEBP"
            />

            <div className="form-actions">
              <button className="btn primary" type="submit">
                {isEditingCert ? "Lưu cập nhật chứng nhận" : "Thêm chứng nhận"}
              </button>
              {isEditingCert && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setCForm(emptyCertificate);
                    setIsEditingCert(false);
                  }}
                >
                  Hủy chỉnh sửa
                </button>
              )}
            </div>
          </form>

          {/* Danh sách chứng nhận */}
          <div className="adm-list-section">
            <div className="adm-list-header">
              <h3>Danh sách chứng nhận ({certificates?.length ?? 0})</h3>
            </div>
            <ul className="admlist">
              {certificates?.map((cert, idx) => (
                <li key={cert.id ?? cert.title} className="card adm-item-card">
                  <div className="adm-item-main">
                    <div className="reorder-controls">
                      <button
                        type="button"
                        className="btn-icon"
                        disabled={idx === 0}
                        onClick={() => moveCertificate(idx, "up")}
                        title="Di chuyển lên trên"
                        aria-label="Di chuyển lên trên"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon"
                        disabled={idx === (certificates.length - 1)}
                        onClick={() => moveCertificate(idx, "down")}
                        title="Di chuyển xuống dưới"
                        aria-label="Di chuyển xuống dưới"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {cert.image && (
                      <Image
                        src={cert.image}
                        alt={`Ảnh ${cert.title}`}
                        width={60}
                        height={75}
                        className="adm-item-cert-thumb"
                        unoptimized
                      />
                    )}
                    <div>
                      <strong>{cert.title}</strong>
                      <p className="muted" style={{ fontSize: "0.85rem" }}>
                        {cert.issuer} · {cert.date}
                      </p>
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noreferrer"
                          className="link-verified"
                        >
                          <ExternalLink size={12} /> Link xác thực
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="adm-item-actions">
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        setCForm({
                          id: cert.id,
                          title: cert.title,
                          issuer: cert.issuer,
                          date: cert.date,
                          description: cert.description || cert.desc || "",
                          image: cert.image,
                          link: cert.link ?? "",
                        });
                        setIsEditingCert(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      title="Chỉnh sửa chứng nhận"
                    >
                      <Edit2 size={14} /> Sửa
                    </button>
                    {cert.id && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteCertificate(cert.id)}
                        title="Xóa chứng nhận"
                      >
                        <Trash2 size={14} /> Xóa
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
