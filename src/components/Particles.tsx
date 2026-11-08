"use client";
import { useEffect, useRef } from "react";

export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const x = c?.getContext("2d");
    if (!c || !x || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0, h = 0, raf = 0;
    const m = { x: -999, y: -999 };
    const n = innerWidth < 768 ? 35 : 70;
    const p = Array.from({ length: n }, () => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0003,
    }));
    const rs = () => { w = c.width = innerWidth; h = c.height = innerHeight; };
    const mv = (e: MouseEvent) => { m.x = e.clientX; m.y = e.clientY; };
    const line = (ax: number, ay: number, bx: number, by: number, col: string) => {
      x.strokeStyle = col; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
    };
    const draw = () => {
      x.clearRect(0, 0, w, h);
      p.forEach((a, i) => {
        a.x = (a.x + a.vx + 1) % 1; a.y = (a.y + a.vy + 1) % 1;
        const ax = a.x * w, ay = a.y * h;
        x.fillStyle = "#A78BFA"; x.fillRect(ax, ay, 2, 2);
        for (let j = i + 1; j < p.length; j++) {
          const bx = p[j].x * w, by = p[j].y * h, d = Math.hypot(ax - bx, ay - by);
          if (d < 120) line(ax, ay, bx, by, `rgba(96,165,250,${0.18 * (1 - d / 120)})`);
        }
        const dm = Math.hypot(ax - m.x, ay - m.y);
        if (dm < 160) line(ax, ay, m.x, m.y, `rgba(103,232,249,${0.35 * (1 - dm / 160)})`);
      });
      raf = requestAnimationFrame(draw);
    };
    rs(); draw();
    addEventListener("resize", rs); addEventListener("mousemove", mv);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", rs); removeEventListener("mousemove", mv); };
  }, []);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
