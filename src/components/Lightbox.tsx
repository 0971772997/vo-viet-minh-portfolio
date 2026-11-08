"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

type LightboxProps = {
  src: string | null;
  alt: string;
  title?: string;
  onClose: () => void;
};

export default function Lightbox({ src, alt, title, onClose }: LightboxProps) {
  useEffect(() => {
    if (!src) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="lightbox-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || "Xem ảnh phóng to"}
        >
          <motion.div
            className="lightbox-content"
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-top-bar">
              {title && <span className="lightbox-title">{title}</span>}
              <div className="lightbox-actions">
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-icon"
                  title="Mở ảnh gốc trong tab mới"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  type="button"
                  className="close-btn"
                  onClick={onClose}
                  aria-label="Đóng"
                  autoFocus
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="lightbox-image-wrap">
              <Image
                src={src}
                alt={alt}
                width={1280}
                height={800}
                className="lightbox-image"
                unoptimized
                priority
              />
            </div>
            {alt && <p className="lightbox-caption">{alt}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

