"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Download } from "lucide-react";
import { profile } from "@/data/site";

function useTyping(words: string[]) {
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(words[0].length); return; }
    const w = words[i];
    const t = setTimeout(() => {
      if (!del && n < w.length) setN(n + 1);
      else if (!del) setDel(true);
      else if (n > 0) setN(n - 1);
      else { setDel(false); setI((i + 1) % words.length); }
    }, !del && n === w.length ? 1400 : del ? 35 : 70);
    return () => clearTimeout(t);
  }, [n, del, i, words]);
  return words[i].slice(0, n);
}

export default function Hero() {
  const typed = useTyping(profile.roles);
  return (
    <section id="top" className="hero wrap">
      <motion.div initial={{ opacity: 0, y: 24, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, delay: 0.5 }}>
        <p className="status"><span className="dot" />Sẵn sàng kết nối cơ hội nghề nghiệp</p>
        <h1 className="name">{profile.name}</h1>
        <p className="role" aria-label={profile.title}>{typed}<span className="caret" aria-hidden="true" /></p>
        <p className="headline">{profile.headline}</p>
        <p className="lead">{profile.intro}</p>
        <div className="cta">
          <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn primary" href="#projects">Xem dự án</motion.a>
          <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn" href="#contact">Liên hệ</motion.a>
          <motion.a whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn" href={profile.cv} download><Download size={16} /> Tải CV</motion.a>
        </div>
        <div className="social">
          <motion.a whileHover={{ scale: 1.2, color: "var(--cy)", rotate: 5 }} whileTap={{ scale: 0.9 }} href={profile.github} aria-label="GitHub" target="_blank" rel="noreferrer"><Github /></motion.a>
          <motion.a whileHover={{ scale: 1.2, color: "var(--bl)", rotate: -5 }} whileTap={{ scale: 0.9 }} href={profile.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin /></motion.a>
        </div>
      </motion.div>
      {/* Thay bằng ảnh thật: đặt file vào public/images/avatar/ rồi dùng next/image */}
      <motion.div className="avatar" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} aria-label="Ảnh đại diện (placeholder)">
        <span><img src="https://res.cloudinary.com/ep1epc9p/image/upload/v1794228635/1793668109377_200928654601672101_9066649289913118911_29ea5d210185a8afac51b63033453ad5.jpg" alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /></span>
        <motion.b whileHover={{ scale: 1.15 }} className="chip c1">React</motion.b>
        <motion.b whileHover={{ scale: 1.15 }} className="chip c2">Node.js</motion.b>
        <motion.b whileHover={{ scale: 1.15 }} className="chip c3">AI Agent</motion.b>
        <motion.b whileHover={{ scale: 1.15 }} className="chip c4">Python</motion.b>
      </motion.div>
    </section>
  );
}
