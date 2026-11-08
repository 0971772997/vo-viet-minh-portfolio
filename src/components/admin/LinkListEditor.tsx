"use client";
import type { CustomLink } from "@/data/site";
import { Plus, Trash2, ExternalLink } from "lucide-react";

type LinkListEditorProps = {
  links: CustomLink[];
  onChange: (links: CustomLink[]) => void;
  maxLinks?: number;
  label?: string;
  presetLabels?: string[];
};

export default function LinkListEditor({
  links,
  onChange,
  maxLinks = 8,
  label = "Liên kết bổ sung (Demo / Tài liệu)",
  presetLabels = ["Video demo", "Figma", "Swagger API", "Bản mobile", "Slide thuyết trình", "Bài viết"],
}: LinkListEditorProps) {
  function addRow(presetLabel = "") {
    if (links.length >= maxLinks) return;
    onChange([...links, { label: presetLabel, url: "" }]);
  }

  function updateRow(index: number, field: "label" | "url", value: string) {
    const updated = links.map((link, idx) => {
      if (idx !== index) return link;
      return { ...link, [field]: value };
    });
    onChange(updated);
  }

  function removeRow(index: number) {
    onChange(links.filter((_, idx) => idx !== index));
  }

  return (
    <div className="link-editor-field">
      <div className="link-editor-header">
        <label className="f-label">
          {label} ({links.length}/{maxLinks})
        </label>
        {links.length < maxLinks && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => addRow()}
          >
            <Plus size={14} /> Thêm liên kết
          </button>
        )}
      </div>

      {links.length === 0 ? (
        <div className="link-editor-empty">
          <p className="muted">Chưa có liên kết bổ sung nào.</p>
          <div className="link-presets">
            <span className="muted" style={{ fontSize: "0.85rem" }}>Gợi ý nhanh:</span>
            {presetLabels.slice(0, 4).map((p) => (
              <button
                key={p}
                type="button"
                className="chip-btn"
                onClick={() => addRow(p)}
              >
                + {p}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="link-rows-list">
          {links.map((link, idx) => {
            const isInvalidUrl = link.url.trim().length > 0 && !/^https?:\/\//i.test(link.url.trim());
            return (
              <div key={idx} className="link-row-card">
                <div className="link-inputs-grid">
                  <div className="link-input-group">
                    <input
                      type="text"
                      placeholder="Nhãn (VD: Video demo, Figma...)"
                      value={link.label}
                      onChange={(e) => updateRow(idx, "label", e.target.value)}
                      maxLength={100}
                      aria-label={`Nhãn liên kết ${idx + 1}`}
                    />
                  </div>
                  <div className="link-input-group">
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updateRow(idx, "url", e.target.value)}
                      className={isInvalidUrl ? "invalid-input" : ""}
                      aria-label={`URL liên kết ${idx + 1}`}
                    />
                    {isInvalidUrl && (
                      <span className="err-mini">URL phải bắt đầu bằng http:// hoặc https://</span>
                    )}
                  </div>
                  <div className="link-actions">
                    {/^https?:\/\//i.test(link.url.trim()) && (
                      <a
                        href={link.url.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-icon"
                        title="Mở thử liên kết"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn-icon danger"
                      onClick={() => removeRow(idx)}
                      title="Xóa dòng này"
                      aria-label={`Xóa liên kết ${idx + 1}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

