"use client";
import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

type SingleImageUploaderProps = {
  folder: "projects" | "experiences" | "certificates";
  value: string;
  onChange: (url: string) => void;
  label?: string;
  recommendedText?: string;
};

export default function SingleImageUploader({
  folder,
  value,
  onChange,
  label = "Ảnh",
  recommendedText = "Hỗ trợ PNG, JPG, WEBP, GIF tối đa 5MB",
}: SingleImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Tải ảnh thất bại");
      }
      if (data.url) {
        onChange(data.url);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi khi tải ảnh lên");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="img-uploader-field">
      <label className="f-label">{label}</label>
      <div className="img-uploader-box">
        {value ? (
          <div className="single-img-preview">
            <Image
              src={value}
              alt="Ảnh xem trước"
              width={280}
              height={160}
              className="prev"
              unoptimized
            />
            <div className="single-img-actions">
              <label className="btn btn-sm">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  disabled={loading}
                  onChange={handleFileSelect}
                  className="sr-only"
                />
                {loading ? <Loader2 className="spin-icon" size={14} /> : <Upload size={14} />}
                <span>Thay ảnh</span>
              </label>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={() => onChange("")}
                title="Gỡ ảnh này"
              >
                <X size={14} /> Gỡ ảnh
              </button>
            </div>
          </div>
        ) : (
          <label className={`upload-dropzone ${loading ? "uploading" : ""}`}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={loading}
              onChange={handleFileSelect}
              className="sr-only"
            />
            {loading ? (
              <span className="upload-dropzone-inner">
                <Loader2 className="spin-icon" size={20} />
                <span>Đang tải lên...</span>
              </span>
            ) : (
              <span className="upload-dropzone-inner">
                <Upload size={20} />
                <span>Chọn ảnh từ máy tính</span>
                <small className="muted">{recommendedText}</small>
              </span>
            )}
          </label>
        )}

        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

