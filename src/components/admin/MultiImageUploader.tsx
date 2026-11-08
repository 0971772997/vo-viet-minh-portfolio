"use client";
import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

type MultiImageUploaderProps = {
  folder: "projects" | "experiences" | "certificates";
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
};

export default function MultiImageUploader({
  folder,
  images,
  onChange,
  maxImages = 12,
  label = "Thư viện ảnh",
}: MultiImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setError(`Tối đa ${maxImages} ảnh. Bạn đã có ${images.length} ảnh.`);
      e.target.value = "";
      return;
    }

    setLoading(true);
    setError("");

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || `Tải ảnh "${file.name}" thất bại`);
        }
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi khi tải ảnh lên");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  function removeImage(indexToRemove: number) {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  }

  return (
    <div className="img-uploader-field">
      <div className="img-uploader-header">
        <label className="f-label">
          {label} ({images.length}/{maxImages})
        </label>
        {images.length > 0 && (
          <button
            type="button"
            className="btn-text-danger"
            onClick={() => onChange([])}
            title="Xóa toàn bộ ảnh bổ sung"
          >
            Xóa hết
          </button>
        )}
      </div>

      <div className="img-uploader-box">
        {images.length < maxImages && (
          <label className={`upload-dropzone ${loading ? "uploading" : ""}`}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
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
                <span>Bấm để tải ảnh lên (tối đa 5MB)</span>
              </span>
            )}
          </label>
        )}

        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}

        {images.length > 0 && (
          <div className="img-preview-grid">
            {images.map((url, idx) => (
              <div key={`${url}-${idx}`} className="img-preview-item">
                <Image
                  src={url}
                  alt={`Ảnh demo ${idx + 1}`}
                  width={140}
                  height={90}
                  className="img-preview-thumb"
                  unoptimized
                />
                <button
                  type="button"
                  className="img-remove-btn"
                  onClick={() => removeImage(idx)}
                  aria-label={`Xóa ảnh ${idx + 1}`}
                  title="Xóa ảnh này"
                >
                  <X size={14} />
                </button>
                <span className="img-index-tag">#{idx + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

