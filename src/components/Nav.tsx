"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [["Giới thiệu", "#about"], ["Kỹ năng", "#skills"], ["Dự án", "#projects"], ["Kinh nghiệm", "#experience"], ["Chứng nhận", "#certificates"], ["Liên hệ", "#contact"]];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav">
      <a href="#top" className="logo">VM</a>
      <button className="burger" aria-label={open ? "Đóng menu" : "Mở menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav className={open ? "links open" : "links"} aria-label="Điều hướng chính">
        {links.map(([t, h]) => (<a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>))}
      </nav>
    </header>
  );
}
