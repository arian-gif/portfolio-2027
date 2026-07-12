// ════════════════════════════════════════════════════════════════════════════
//  StarField — the full-page 2D canvas background (stars + shooting stars).
//  Moved out of App.tsx. Under prefers-reduced-motion it draws ONE static
//  frame (no RAF loop, no shooters) so the sky is still there, just calm.
// ════════════════════════════════════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { useMotionPrefs } from "./useMotionPrefs";

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reducedMotion } = useMotionPrefs();

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;

    const resize = () => {
      c.width = innerWidth;
      c.height = innerHeight;
    };
    resize();
    addEventListener("resize", resize);

    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.3 + 0.2,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.15,
    }));

    // Reduced motion: a single calm frame, then done. No animation loop.
    if (reducedMotion) {
      const drawStatic = () => {
        ctx.clearRect(0, 0, c.width, c.height);
        for (const s of stars) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(210,225,255,0.6)";
          ctx.fill();
        }
      };
      drawStatic();
      const redraw = () => drawStatic();
      addEventListener("resize", redraw);
      return () => {
        removeEventListener("resize", resize);
        removeEventListener("resize", redraw);
      };
    }

    type Shooter = { x: number; y: number; life: number };
    const shooters: Shooter[] = [];
    let t = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      t += 0.007;

      for (const s of stars) {
        const a = 0.25 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,225,255,${a})`;
        ctx.fill();
      }

      if (Math.random() < 0.003) {
        shooters.push({
          x: Math.random() * c.width * 0.75 + c.width * 0.1,
          y: Math.random() * c.height * 0.45,
          life: 1,
        });
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        const g = ctx.createLinearGradient(s.x, s.y, s.x - 80, s.y - 40);
        g.addColorStop(0, `rgba(255,255,255,${s.life})`);
        g.addColorStop(0.4, `rgba(200,230,255,${s.life * 0.5})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - 80, s.y - 40);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        s.x += 7;
        s.y += 3.5;
        s.life -= 0.022;
        if (s.life <= 0) shooters.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
  );
}
