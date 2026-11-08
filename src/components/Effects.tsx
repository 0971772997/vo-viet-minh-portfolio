"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

const CARD = "article.card,div.card,li.card";
const BTN = ".btn,.social a";

export default function Effects() {
  const glow = useRef<HTMLDivElement>(null);
  const [intro, setIntro] = useState(true);
  const [top, setTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const sx = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => setTop(scrollY > 600);
    addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => setIntro(false), reduce ? 0 : 900);
    if (reduce) return () => { removeEventListener("scroll", onScroll); clearTimeout(t); };

    document.documentElement.classList.add("js");
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      el.classList.add("in");
      setTimeout(() => el.classList.add("done"), 1500);
      io.unobserve(el);
    }), { threshold: 0.15 });
    document.querySelectorAll<HTMLElement>(".card,.tl li").forEach((el) => {
      const i = Array.from(el.parentElement?.children ?? []).indexOf(el);
      el.classList.add("rv");
      el.style.setProperty("--d", `${(i % 6) * 90}ms`);
      io.observe(el);
    });

    const pos = { x: innerWidth / 2, y: innerHeight / 2 };
    const tgt = { ...pos };
    let raf = 0;
    const loop = () => {
      pos.x += (tgt.x - pos.x) * 0.12; pos.y += (tgt.y - pos.y) * 0.12;
      if (glow.current) glow.current.style.transform = `translate(${pos.x - 200}px,${pos.y - 200}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    const move = (e: PointerEvent) => {
      tgt.x = e.clientX; tgt.y = e.clientY;
      const t = e.target as Element;
      const c = t.closest<HTMLElement>(CARD);
      if (c) {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--ry", `${(px - 0.5) * 8}deg`);
        c.style.setProperty("--rx", `${(0.5 - py) * 8}deg`);
        c.style.setProperty("--mx", `${px * 100}%`);
        c.style.setProperty("--my", `${py * 100}%`);
      }
      const b = t.closest<HTMLElement>(BTN);
      if (b) {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.25}px`;
      }
    };
    const out = (e: PointerEvent) => {
      const t = e.target as Element, to = e.relatedTarget as Node | null;
      const c = t.closest<HTMLElement>(CARD);
      if (c && !c.contains(to)) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); }
      const b = t.closest<HTMLElement>(BTN);
      if (b && !b.contains(to)) b.style.translate = "";
    };
    addEventListener("pointermove", move); addEventListener("pointerout", out);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); clearTimeout(t);
      removeEventListener("scroll", onScroll); removeEventListener("pointermove", move); removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {intro && <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.5 }} aria-hidden="true"><span>VM</span></motion.div>}
      </AnimatePresence>
      <motion.div className="progress" style={{ scaleX: sx }} aria-hidden="true" />
      <div className="aurora" aria-hidden="true"><i /><i /></div>
      <div ref={glow} className="cursor" aria-hidden="true" />
      <AnimatePresence>
        {top && (
          <motion.button className="totop" aria-label="Lên đầu trang" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => scrollTo({ top: 0, behavior: "smooth" })}>
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
