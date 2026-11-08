import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const font = Be_Vietnam_Pro({ subsets: ["vietnamese", "latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
const title = "Võ Viết Minh | Full-stack Developer";
const description = "Portfolio của Võ Viết Minh: dự án web, hệ thống AI Agent và nghiên cứu nhận dạng tiếng nói tiếng Việt.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title, description,
  openGraph: { title, description, type: "website", locale: "vi_VN" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="vi"><body className={font.className}>{children}</body></html>);
}
