import {
  projects as seedProjects,
  timeline as seedTimeline,
  certificates as seedCertificates,
  type Project,
  type ExperienceItem,
  type CertificateItem,
} from "@/data/site";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
export const dbReady = Boolean(url && key);

export function sb(path: string, init: RequestInit = {}) {
  return fetch(`${url}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key ?? "",
      Authorization: `Bearer ${key}`,
      ...(init.headers as Record<string, string>),
    },
  });
}

export async function getProjects(): Promise<Project[]> {
  if (!dbReady) return seedProjects;
  try {
    const r = await sb("/rest/v1/projects?select=*&order=sort.asc,created_at.asc");
    if (!r.ok) return seedProjects;
    const rows: Project[] = await r.json();
    return rows.length
      ? rows.map((p) => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : [],
          links: Array.isArray(p.links) ? p.links : [],
        }))
      : seedProjects;
  } catch {
    return seedProjects;
  }
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  if (!dbReady) return seedTimeline;
  try {
    const r = await sb("/rest/v1/experiences?select=*&order=sort.asc,created_at.asc");
    if (!r.ok) return seedTimeline;
    const rows: ExperienceItem[] = await r.json();
    return rows.length
      ? rows.map((e) => ({
          ...e,
          points: Array.isArray(e.points) ? e.points : [],
          images: Array.isArray(e.images) ? e.images : [],
          links: Array.isArray(e.links) ? e.links : [],
        }))
      : seedTimeline;
  } catch {
    return seedTimeline;
  }
}

export async function getCertificates(): Promise<CertificateItem[]> {
  if (!dbReady) return seedCertificates;
  try {
    const r = await sb("/rest/v1/certificates?select=*&order=sort.asc,created_at.asc");
    if (!r.ok) return seedCertificates;
    const rows: CertificateItem[] = await r.json();
    return rows.length
      ? rows.map((c) => ({
          ...c,
          description: c.description || c.desc || "",
          desc: c.description || c.desc || "",
        }))
      : seedCertificates;
  } catch {
    return seedCertificates;
  }
}
