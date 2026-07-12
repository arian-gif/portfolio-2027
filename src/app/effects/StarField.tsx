// ════════════════════════════════════════════════════════════════════════════
//  StarField — the full-page "living background" canvas.
// ────────────────────────────────────────────────────────────────────────────
//  • Three star layers at different depths: each layer drifts at its own rate
//    with the mouse (lerped, no React state) and with page scroll, so the sky
//    has real parallax depth.
//  • Nebula clouds: pre-rendered once to a ¼-resolution offscreen canvas,
//    then stamped each frame with a slow sinusoidal drift + alpha pulse.
//    (Replaces the old fixed DOM gradient divs.)
//  • Shooting stars: same behavior as the original implementation.
//  • Tier "lite" (mobile/low-memory): fewer stars, no mouse parallax, static
//    nebula, half shooter spawn rate.
//  • prefers-reduced-motion: ONE static frame (stars + nebula), no RAF loop.
//  • RAF pauses when the tab is hidden; resize is debounced (mobile URL bar).
// ════════════════════════════════════════════════════════════════════════════
import { useEffect, useRef } from "react";
import { useMotionPrefs } from "./useMotionPrefs";

type Star = {
  x: number;
  y: number;
  r: number;
  twinkle: number;
  speed: number;
  tint: string | null; // near-layer stars occasionally glow cyan/violet
};

type Layer = {
  stars: Star[];
  factor: number; // parallax multiplier (0 = pinned, 1 = full drift)
  alphaMul: number;
};

function makeLayer(count: number, rMin: number, rMax: number, factor: number, alphaMul: number, tintChance = 0): Layer {
  return {
    factor,
    alphaMul,
    stars: Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * (rMax - rMin) + rMin,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.15,
      tint:
        Math.random() < tintChance
          ? Math.random() < 0.5
            ? "34,211,238" // cyan
            : "139,92,246" // violet
          : null,
    })),
  };
}

// Nebula blobs pre-rendered at ¼ resolution — one drawImage per frame is far
// cheaper than three huge blurred DOM divs or per-frame gradient fills.
function renderNebula(w: number, h: number): HTMLCanvasElement {
  const off = document.createElement("canvas");
  off.width = Math.max(1, Math.floor(w / 4));
  off.height = Math.max(1, Math.floor(h / 4));
  const ctx = off.getContext("2d")!;
  const blob = (cx: number, cy: number, r: number, rgba: string) => {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, off.width, off.height);
  };
  blob(off.width * 0.82, off.height * 0.28, off.width * 0.5, "rgba(139,92,246,0.10)"); // violet upper-right
  blob(off.width * 0.12, off.height * 0.78, off.width * 0.45, "rgba(34,211,238,0.07)"); // cyan lower-left
  blob(off.width * 0.5, off.height * 0.5, off.width * 0.55, "rgba(96,165,250,0.06)"); // blue center
  return off;
}

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { reducedMotion, tier } = useMotionPrefs();

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const lite = tier === "lite";

    let nebula: HTMLCanvasElement;
    const setSize = () => {
      c.width = innerWidth;
      c.height = innerHeight;
      nebula = renderNebula(c.width, c.height);
    };
    setSize();

    const layers: Layer[] = lite
      ? [
          makeLayer(70, 0.2, 0.7, 0.15, 0.6),
          makeLayer(50, 0.5, 1.1, 0.4, 1),
          makeLayer(25, 0.9, 1.6, 1.0, 1, 0.25),
        ]
      : [
          makeLayer(150, 0.2, 0.7, 0.15, 0.6),
          makeLayer(110, 0.5, 1.1, 0.4, 1),
          makeLayer(60, 0.9, 1.6, 1.0, 1, 0.25),
        ];

    const drawNebula = (time: number, animate: boolean) => {
      const dx = animate ? Math.sin(time * 0.00016) * 20 : 0;
      const dy = animate ? Math.cos(time * 0.00013) * 14 : 0;
      const pulse = animate ? 0.925 + 0.075 * Math.sin(time * 0.00021) : 1;
      ctx.globalAlpha = pulse;
      ctx.drawImage(nebula, dx - 24, dy - 24, c.width + 48, c.height + 48);
      ctx.globalAlpha = 1;
    };

    const drawStars = (t: number, offX: number, offY: number, scrollY: number, twinkling: boolean) => {
      for (const layer of layers) {
        const lx = offX * 30 * layer.factor;
        const ly = offY * 18 * layer.factor + scrollY * 0.12 * layer.factor;
        for (const s of layer.stars) {
          // Wrap positions so parallax never scrolls the layer off-screen.
          const x = (((s.x - lx) % c.width) + c.width) % c.width;
          const y = (((s.y - ly) % c.height) + c.height) % c.height;
          const a = twinkling
            ? (0.25 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.twinkle))) * layer.alphaMul
            : 0.6 * layer.alphaMul;
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = s.tint ? `rgba(${s.tint},${Math.min(1, a + 0.1)})` : `rgba(210,225,255,${a})`;
          ctx.fill();
        }
      }
    };

    // Reduced motion: one calm frame (nebula + stars), redrawn only on resize.
    if (reducedMotion) {
      const drawStatic = () => {
        ctx.clearRect(0, 0, c.width, c.height);
        drawNebula(0, false);
        drawStars(0, 0, 0, 0, false);
      };
      drawStatic();
      const onResize = () => {
        setSize();
        drawStatic();
      };
      addEventListener("resize", onResize);
      return () => removeEventListener("resize", onResize);
    }

    // ── Animated path ──────────────────────────────────────────────────────
    // Mouse parallax target/current, lerped per frame — no React state.
    const mouse = { tx: 0, ty: 0, cx: 0, cy: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.tx = e.clientX / innerWidth - 0.5;
      mouse.ty = e.clientY / innerHeight - 0.5;
    };
    if (!lite) addEventListener("mousemove", onMouse);

    type Shooter = { x: number; y: number; life: number };
    const shooters: Shooter[] = [];
    const spawnRate = lite ? 0.0015 : 0.003;
    let t = 0;
    let raf = 0;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, c.width, c.height);
      t += 0.007;

      mouse.cx += (mouse.tx - mouse.cx) * 0.05;
      mouse.cy += (mouse.ty - mouse.cy) * 0.05;

      drawNebula(time, !lite);
      drawStars(t, mouse.cx, mouse.cy, window.scrollY, true);

      if (Math.random() < spawnRate) {
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

    // Paint the first frame synchronously (RAF does not fire in hidden tabs,
    // and this guarantees stars are visible before the first RAF tick).
    draw(performance.now());

    // Pause the loop entirely while the tab is hidden.
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (document.visibilityState === "visible") raf = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Debounced resize — mobile browsers fire resize on URL-bar show/hide.
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setSize, 150);
    };
    addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      removeEventListener("resize", onResize);
      removeEventListener("mousemove", onMouse);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reducedMotion, tier]);

  return (
    <canvas ref={ref} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
  );
}
