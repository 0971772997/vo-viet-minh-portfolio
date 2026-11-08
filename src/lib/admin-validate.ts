import type { CustomLink } from "@/data/site";

export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(id: unknown): id is string {
  return typeof id === "string" && uuidRegex.test(id.trim());
}

export function sanitizeText(value: unknown, maxLength = 5000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function sanitizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (/^https?:\/\//i.test(s) && s.length <= 1000) {
    return s;
  }
  return null;
}

export function sanitizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  if ((/^https?:\/\//i.test(s) || s.startsWith("/")) && s.length <= 1000) {
    return s;
  }
  return null;
}

export function sanitizeStringArray(input: unknown, maxItems = 50, maxLength = 1000): string[] {
  if (!Array.isArray(input)) return [];
  const result: string[] = [];
  for (const item of input) {
    const s = String(item ?? "").trim();
    if (s.length > 0) {
      result.push(s.slice(0, maxLength));
    }
    if (result.length >= maxItems) break;
  }
  return result;
}

export function sanitizeImages(input: unknown, maxItems = 12): string[] {
  if (!Array.isArray(input)) return [];
  const result: string[] = [];
  for (const item of input) {
    const url = sanitizeImageUrl(item);
    if (url) {
      result.push(url);
    }
    if (result.length >= maxItems) break;
  }
  return result;
}

export function sanitizeLinks(input: unknown, maxItems = 8): CustomLink[] {
  if (!Array.isArray(input)) return [];
  const result: CustomLink[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const label = sanitizeText((item as Record<string, unknown>).label, 100);
    const url = sanitizeUrl((item as Record<string, unknown>).url);
    if (label && url) {
      result.push({ label, url });
    }
    if (result.length >= maxItems) break;
  }
  return result;
}

