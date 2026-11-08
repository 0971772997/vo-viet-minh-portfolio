"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Github, ExternalLink, Globe, Layers } from "lucide-react";
import Image from "next/image";
import {
  about,
  skills,
  profile,
  timeline as defaultTimeline,
  certificates as defaultCertificates,
  type Project,
  type ExperienceItem,
  type CertificateItem,
  type CustomLink,
} from "@/data/site";
import Lightbox from "@/components/Lightbox";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      className="sec wrap"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <h2>{title}</h2>
      {children}
    </motion.section>
  );
}

export function Marquee() {
  const all = Array.from(new Set(skills.flatMap((g) => g.items)));
  return (
    <div className="marquee" aria-hidden="true">
      <div className="track">
        {[...all, ...all].map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export function About() {
  return (
    <Section id="about" title="Giới thiệu">
      <div className="two">
        <p className="lead">
          Tôi là Võ Viết Minh, Full-stack Developer. Tôi làm việc với cả giao diện lẫn hệ thống phía máy chủ,
          và đang tìm hiểu sâu hơn về AI, Deep Learning và AI Agent.
        </p>
        <dl className="facts">
          {about.map((a) => (
            <div key={a.t} className="card">
              <dt>{a.t}</dt>
              <dd>{a.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" title="Kỹ năng">
      <div className="grid">
        {skills.map((g) => (
          <div key={g.group} className="card">
            <h3>{g.group}</h3>
            <ul className="chips">
              {g.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ProjectLinks({ p, compact = false }: { p: Project; compact?: boolean }) {
  const extraLinks = Array.isArray(p.links) ? p.links : [];

  return (
    <div className="links2">
      {p.repo ? (
        <a href={p.repo} target="_blank" rel="noreferrer" className="link-item">
          <Github size={15} /> GitHub
        </a>
      ) : (
        <span className="muted">GitHub: Chưa công khai</span>
      )}

      {p.demo ? (
        <a href={p.demo} target="_blank" rel="noreferrer" className="link-item">
          <Globe size={15} /> Live Demo
        </a>
      ) : (
        <span className="muted">Demo: Chưa công khai</span>
      )}

      {/* Hiển thị gọn trên thẻ nếu có thêm liên kết */}
      {compact && extraLinks.length > 0 && (
        <span className="extra-links-summary" title={extraLinks.map((l) => l.label).join(", ")}>
          <Layers size={13} /> +{extraLinks.length} demo/tài liệu
        </span>
      )}

      {/* Hiển thị đầy đủ trong modal */}
      {!compact &&
        extraLinks.map((link: CustomLink, idx: number) => (
          <a
            key={`${link.url}-${idx}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="link-item highlight"
          >
            <ExternalLink size={15} /> {link.label}
          </a>
        ))}
    </div>
  );
}

export function Projects({ list }: { list: Project[] }) {
  const [sel, setSel] = useState<Project | null>(null);
  const [zoomImg, setZoomImg] = useState<{ src: string; alt: string; title?: string } | null>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomImg) {
          setZoomImg(null);
        } else if (sel) {
          setSel(null);
        }
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [sel, zoomImg]);

  return (
    <Section id="projects" title="Dự án">
      <div className="grid proj">
        {list.map((p) => (
          <motion.article
            key={p.id ?? p.slug}
            className="card"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {p.image && (
              <div
                className="pimg-wrap"
                role="button"
                tabIndex={0}
                onClick={() => setSel(p)}
                onKeyDown={(e) => e.key === "Enter" && setSel(p)}
                aria-label={`Xem chi tiết dự án ${p.name}`}
              >
                <Image
                  src={p.image}
                  alt={`Ảnh bìa dự án ${p.name}`}
                  width={800}
                  height={450}
                  className="pimg"
                  unoptimized
                />
              </div>
            )}
            <h3>{p.name}</h3>
            <p>{p.summary}</p>
            <ul className="chips">
              {p.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <ProjectLinks p={p} compact />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn"
              onClick={() => setSel(p)}
            >
              Xem chi tiết
            </motion.button>
          </motion.article>
        ))}
      </div>

      {/* Modal chi tiết dự án */}
      <AnimatePresence>
        {sel && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
          >
            <motion.div
              className="modal project-detail-modal"
              role="dialog"
              aria-modal="true"
              aria-label={sel.name}
              initial={{ y: 25, scale: 0.94, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close"
                aria-label="Đóng chi tiết"
                onClick={() => setSel(null)}
                autoFocus
              >
                <X />
              </button>

              {/* Ảnh bìa */}
              {sel.image && (
                <div
                  className="modal-cover-wrap"
                  onClick={() =>
                    setZoomImg({
                      src: sel.image as string,
                      alt: `Ảnh bìa dự án ${sel.name}`,
                      title: sel.name,
                    })
                  }
                  title="Bấm để phóng to ảnh bìa"
                >
                  <Image
                    src={sel.image}
                    alt={`Ảnh dự án ${sel.name}`}
                    width={800}
                    height={450}
                    className="pimg zoomable"
                    unoptimized
                  />
                  <span className="zoom-hint">Phóng to ảnh</span>
                </div>
              )}

              {/* Thư viện nhiều ảnh phụ */}
              {sel.images && sel.images.length > 0 && (
                <div className="project-gallery-section">
                  <h4>Thư viện ảnh dự án ({sel.images.length})</h4>
                  <div className="project-gallery-grid">
                    {sel.images.map((imgUrl, i) => (
                      <button
                        key={`${imgUrl}-${i}`}
                        type="button"
                        className="gallery-thumb-btn"
                        onClick={() =>
                          setZoomImg({
                            src: imgUrl,
                            alt: `Ảnh minh họa ${i + 1} của dự án ${sel.name}`,
                            title: `${sel.name} - Ảnh ${i + 1}`,
                          })
                        }
                        title="Bấm để xem ảnh phóng to"
                      >
                        <Image
                          src={imgUrl}
                          alt={`Ảnh demo ${i + 1} của dự án ${sel.name}`}
                          width={200}
                          height={120}
                          className="gallery-thumb"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <h3>{sel.name}</h3>
              <p>{sel.summary}</p>

              <h4>Vai trò</h4>
              <p>{sel.role || "Đang cập nhật"}</p>

              <h4>Công nghệ</h4>
              <ul className="chips">
                {sel.tech.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>

              <h4>Tính năng nổi bật</h4>
              <ul className="feat">
                {sel.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <h4>Liên kết & Bản demo</h4>
              <ProjectLinks p={sel} compact={false} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox xem ảnh lớn */}
      <Lightbox
        src={zoomImg?.src ?? null}
        alt={zoomImg?.alt ?? ""}
        title={zoomImg?.title}
        onClose={() => setZoomImg(null)}
      />
    </Section>
  );
}

export function Experience({ list }: { list?: ExperienceItem[] }) {
  const [zoomImg, setZoomImg] = useState<{ src: string; alt: string; title?: string } | null>(null);
  const items = list && list.length > 0 ? list : defaultTimeline;

  return (
    <Section id="experience" title="Kinh nghiệm và học vấn">
      <ol className="tl">
        {items.map((t, idx) => (
          <li key={t.id ?? `${t.period}-${t.place}-${idx}`}>
            <p className="when">{t.period}</p>
            <h3>{t.place}</h3>
            <p className="muted">{t.role}</p>

            <ul className="feat">
              {t.points.map((x, pIdx) => (
                <li key={pIdx}>{x}</li>
              ))}
            </ul>

            {/* Lưới ảnh demo nhỏ */}
            {t.images && t.images.length > 0 && (
              <div className="tl-images-section">
                <span className="tl-section-label">Hình ảnh minh họa / Kết quả:</span>
                <div className="tl-images-grid">
                  {t.images.map((imgUrl, imgIdx) => (
                    <button
                      key={`${imgUrl}-${imgIdx}`}
                      type="button"
                      className="tl-thumb-btn"
                      onClick={() =>
                        setZoomImg({
                          src: imgUrl,
                          alt: `Ảnh minh họa cho ${t.role} tại ${t.place} - ảnh ${imgIdx + 1}`,
                          title: `${t.place} (${t.period})`,
                        })
                      }
                      title="Bấm để xem ảnh lớn"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Ảnh minh họa cho ${t.role} tại ${t.place} - ảnh ${imgIdx + 1}`}
                        width={180}
                        height={110}
                        loading="lazy"
                        className="tl-thumb"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Link demo / tài liệu */}
            {t.links && t.links.length > 0 && (
              <div className="tl-links-section">
                {t.links.map((link, lIdx) => (
                  <a
                    key={`${link.url}-${lIdx}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="tl-link-item"
                  >
                    <ExternalLink size={14} /> {link.label}
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Lightbox phóng to ảnh kinh nghiệm */}
      <Lightbox
        src={zoomImg?.src ?? null}
        alt={zoomImg?.alt ?? ""}
        title={zoomImg?.title}
        onClose={() => setZoomImg(null)}
      />
    </Section>
  );
}

export function Certificates({ list }: { list?: CertificateItem[] }) {
  const [zoomImg, setZoomImg] = useState<{ src: string; alt: string; title?: string } | null>(null);
  const items = list && list.length > 0 ? list : defaultCertificates;

  return (
    <Section id="certificates" title="Chứng nhận">
      <div className="certs">
        {items.map((c, idx) => {
          const desc = c.description || c.desc || "";
          return (
            <motion.article
              key={c.id ?? `${c.title}-${idx}`}
              className="card cert"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                className="cert-img-btn"
                onClick={() =>
                  setZoomImg({
                    src: c.image,
                    alt: `Giấy chứng nhận ${c.title} do ${c.issuer} cấp cho Võ Viết Minh`,
                    title: `${c.title} - ${c.issuer}`,
                  })
                }
                title="Bấm để xem giấy chứng nhận bản lớn"
                aria-label={`Xem ảnh lớn giấy chứng nhận: ${c.title}`}
              >
                <Image
                  src={c.image}
                  alt={`Giấy chứng nhận ${c.title} do ${c.issuer} cấp cho Võ Viết Minh`}
                  width={c.w || 600}
                  height={c.h || 800}
                  sizes="(max-width: 820px) 90vw, 360px"
                  className="cert-thumb"
                  unoptimized
                />
                <span className="cert-zoom-pill">Phóng to</span>
              </button>

              <div className="cert-info">
                <h3>{c.title}</h3>
                <p className="muted">
                  {c.issuer} · {c.date}
                </p>
                {desc && <p className="cert-desc">{desc}</p>}

                {c.link && (
                  <div className="cert-links">
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-verify"
                    >
                      <ExternalLink size={14} /> Xác thực trực tuyến
                    </a>
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Lightbox xem ảnh lớn chứng nhận */}
      <Lightbox
        src={zoomImg?.src ?? null}
        alt={zoomImg?.alt ?? ""}
        title={zoomImg?.title}
        onClose={() => setZoomImg(null)}
      />
    </Section>
  );
}

type Errs = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function Contact() {
  const [errs, setErrs] = useState<Errs>({});
  const [msg, setMsg] = useState("");

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const v = (k: string) => String(f.get(k) ?? "").trim();
    const er: Errs = {};
    if (v("name").length < 2) er.name = "Nhập họ tên (ít nhất 2 ký tự).";
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) er.email = "Email chưa đúng định dạng.";
    if (v("subject").length < 3) er.subject = "Nhập tiêu đề (ít nhất 3 ký tự).";
    if (v("message").length < 10) er.message = "Nội dung cần ít nhất 10 ký tự.";
    setErrs(er);
    if (Object.keys(er).length) {
      setMsg("");
      return;
    }
    const body = `${v("message")}\n\n— ${v("name")} (${v("email")})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      v("subject")
    )}&body=${encodeURIComponent(body)}`;
    setMsg("Đã mở ứng dụng email của bạn. Nhấn Gửi trong đó để hoàn tất.");
  }

  const field = (k: keyof Errs, label: string, area?: boolean) => (
    <label className="f">
      {label}
      {area ? (
        <textarea name={k} rows={5} aria-invalid={!!errs[k]} />
      ) : (
        <input name={k} type={k === "email" ? "email" : "text"} aria-invalid={!!errs[k]} />
      )}
      {errs[k] && (
        <span className="err" role="alert">
          {errs[k]}
        </span>
      )}
    </label>
  );

  return (
    <Section id="contact" title="Liên hệ">
      <div className="two">
        <div>
          <p className="lead">
            Bạn có cơ hội hoặc muốn trao đổi về một dự án? Gửi tin nhắn hoặc liên hệ qua các kênh dưới đây.
          </p>
          <ul className="contact">
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.cv} download>
                Tải CV (PDF)
              </a>
            </li>
          </ul>
        </div>
        <form className="card" onSubmit={submit} noValidate>
          {field("name", "Họ tên")}
          {field("email", "Email")}
          {field("subject", "Tiêu đề")}
          {field("message", "Nội dung", true)}
          <button className="btn primary" type="submit">
            Gửi tin nhắn
          </button>
          {msg && (
            <p className="ok" role="status">
              {msg}
            </p>
          )}
        </form>
      </div>
    </Section>
  );
}
