import { useEffect, useRef, useState, Suspense, lazy, type CSSProperties } from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  ChevronDown,
  Rocket,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  FileText,
  ArrowUpRight,
  Play,
  Code2,
  Info,
} from "lucide-react";
import {
  PROFILE,
  ABOUT,
  PROJECTS,
  EXPERIENCE,
  STATS,
  NAV,
  BRAND,
  type Project,
} from "./content";
import ArianAI from "./components/ArianAI";
import StarField from "./effects/StarField";

// 3D Saturn is loaded lazily so the page paints instantly while three.js loads.
const Saturn3D = lazy(() => import("./components/Saturn3D"));

// ─── Hero Saturn (3D GLB) ─────────────────────────────────────────────────────

function HeroSaturn({ mx, my }: { mx: number; my: number }) {
  const SIZE = 380;

  return (
    <motion.div
      style={{ width: SIZE, height: SIZE, maxWidth: "90vw", position: "relative", flexShrink: 0 }}
      animate={{ x: mx * 14, y: my * 10 }}
      transition={{ type: "spring", stiffness: 35, damping: 22 }}
    >
      {/* Nebula glow behind the planet */}
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          background:
            "radial-gradient(ellipse, rgba(96,165,250,0.12) 0%, rgba(139,92,246,0.07) 45%, transparent 70%)",
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "50%",
          boxShadow:
            "0 0 70px rgba(34,211,238,0.18), 0 0 140px rgba(139,92,246,0.12)",
          pointerEvents: "none",
        }}
      />

      {/* The actual 3D model */}
      <Suspense fallback={null}>
        <Saturn3D />
      </Suspense>
    </motion.div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);

  const scroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div
        className="flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(2,8,23,0.72)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(96,165,250,0.07)",
        }}
      >
        <button onClick={() => scroll("home")} className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}
          >
            <Rocket size={13} className="text-white" />
          </div>
          <span
            className="tracking-widest text-sm font-semibold text-white"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            {BRAND.first}
            <span style={{ color: "#22d3ee" }}>{BRAND.accent}</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scroll(n.id)}
              className="text-xs tracking-widest transition-colors duration-200 hover:opacity-100"
              style={{
                color: active === n.id ? "#22d3ee" : "rgba(148,163,184,0.75)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("contact")}
          className="hidden md:block px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
            color: "white",
            fontFamily: "JetBrains Mono, monospace",
            boxShadow: "0 0 20px rgba(34,211,238,0.25)",
          }}
        >
          HIRE ME →
        </button>

        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden px-6 py-4 flex flex-col gap-3"
            style={{ background: "rgba(2,8,23,0.96)", backdropFilter: "blur(18px)" }}
          >
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scroll(n.id)}
                className="text-left text-sm tracking-widest py-2 transition-colors"
                style={{
                  color: active === n.id ? "#22d3ee" : "#94a3b8",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                {n.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      setMouse({ x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 });
    };
    addEventListener("mousemove", h);
    return () => removeEventListener("mousemove", h);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20" style={{ zIndex: 1 }}>
      <div className="w-full max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center py-16">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.85, delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xs tracking-widest" style={{ color: "#22d3ee", fontFamily: "JetBrains Mono, monospace" }}>
              {PROFILE.status} / {PROFILE.location}
            </span>
          </div>

          <h1
            className="mb-3 leading-none"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(3rem, 8vw, 5.8rem)",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.025em",
              lineHeight: 0.92,
            }}
          >
            {PROFILE.name.toUpperCase()}
          </h1>

          <h2
            className="mb-6"
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(1.2rem, 3vw, 1.9rem)",
              fontWeight: 600,
              letterSpacing: "0.02em",
              background: "linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            {PROFILE.tagline}
          </h2>

          <p
            className="mb-9 max-w-md leading-relaxed"
            style={{ color: "#94a3b8", fontFamily: "Inter, sans-serif", fontSize: "1.05rem" }}
          >
            {PROFILE.intro}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #0ea5e9)",
                color: "white",
                fontFamily: "Rajdhani, sans-serif",
                letterSpacing: "0.08em",
                boxShadow: "0 0 32px rgba(34,211,238,0.4)",
              }}
            >
              VIEW MY WORK
            </button>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3.5 rounded-full text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                border: "1px solid rgba(148,163,184,0.25)",
                color: "#94a3b8",
                fontFamily: "Rajdhani, sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              GET IN TOUCH →
            </button>
          </div>

          <motion.div
            className="mt-14 flex items-center gap-2"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: "#334155" }}
          >
            <ChevronDown size={15} />
            <span className="text-xs tracking-widest" style={{ fontFamily: "JetBrains Mono, monospace" }}>
              SCROLL TO EXPLORE
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.78 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroSaturn mx={mouse.x} my={mouse.y} />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Section heading helper ───────────────────────────────────────────────────

function SectionLabel({ color, text, center }: { color: string; text: string; center?: boolean }) {
  return (
    <div className={`flex items-center mb-3 ${center ? "justify-center" : ""}`}>
      <span className="text-xs tracking-widest" style={{ color, fontFamily: "JetBrains Mono, monospace" }}>
        {text}
      </span>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

function AboutSection() {
  return (
    <section id="about" className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <SectionLabel color="#22d3ee" text="MISSION LOG / ABOUT" />
        <h2
          className="mb-8"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          WHO IS {PROFILE.name.toUpperCase()}?
        </h2>
        <div className="space-y-5">
          {ABOUT.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{ color: "#94a3b8", fontFamily: "Inter, sans-serif", fontSize: "1.1rem", lineHeight: 1.75 }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Projects Section ─────────────────────────────────────────────────────────

// Turns a YouTube watch/short/embed URL into an embeddable player URL.
function youTubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// Shared button styles for the project card + modal actions.
const projBtnBase =
  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs tracking-widest transition-transform active:scale-95";
const projBtnFont = { fontFamily: "JetBrains Mono, monospace" as const };

function ProjectsSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="projects" className="py-24 relative" style={{ zIndex: 1 }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-12">
          <SectionLabel color="#8b5cf6" text="MISSIONS / SELECTED WORK" />
          <h2
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            PROJECTS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROJECTS.map((m, i) => {
            // When a project has a video but no live demo, its accent button opens
            // the modal (to play the video) — so we don't also show a "Details" button.
            const primaryOpensModal = !!m.video && !m.demo;
            return (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                onClick={() => setOpenIdx(i)}
                className="relative overflow-hidden rounded-2xl cursor-pointer h-full flex flex-col"
                style={{
                  background: `linear-gradient(140deg, ${m.from} 0%, ${m.via} 100%)`,
                  border: "1px solid rgba(255,255,255,0.07)",
                  transform: hovered === i ? "scale(1.025) translateY(-5px)" : "scale(1) translateY(0)",
                  transition: "transform 0.32s ease, box-shadow 0.32s ease",
                  boxShadow: hovered === i ? `0 24px 64px ${m.accent}28` : "0 4px 24px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at top right, ${m.accent}20 0%, transparent 60%)`,
                    opacity: hovered === i ? 1 : 0,
                    transition: "opacity 0.32s ease",
                  }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${m.accent}80, transparent)` }}
                />

                <div className="p-6 relative flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-xs tracking-widest mb-1" style={{ color: m.accent, fontFamily: "JetBrains Mono, monospace" }}>
                        {m.type} / {m.year}
                      </div>
                      <h3
                        style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.45rem", fontWeight: 700, color: "white", letterSpacing: "0.04em" }}
                      >
                        {m.name}
                      </h3>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs tracking-widest flex-shrink-0"
                      style={{ border: `1px solid ${m.accent}55`, color: m.accent, fontFamily: "JetBrains Mono, monospace" }}
                    >
                      {m.status}
                    </span>
                  </div>

                  <p className="text-sm mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Inter, sans-serif" }}>
                    {m.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4 mt-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    {m.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-md text-xs"
                        style={{ background: "rgba(0,0,0,0.25)", color: "rgba(255,255,255,0.7)", fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {m.demo && (
                      <a
                        href={m.demo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={projBtnBase}
                        style={{ ...projBtnFont, background: m.accent, color: "#0a0a14", fontWeight: 600 }}
                      >
                        <Play size={13} /> LIVE DEMO
                      </a>
                    )}
                    {primaryOpensModal && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenIdx(i); }}
                        className={projBtnBase}
                        style={{ ...projBtnFont, background: m.accent, color: "#0a0a14", fontWeight: 600 }}
                      >
                        <Play size={13} /> WATCH DEMO
                      </button>
                    )}
                    {m.repo && (
                      <a
                        href={m.repo}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={projBtnBase}
                        style={{ ...projBtnFont, border: `1px solid ${m.accent}66`, color: m.accent }}
                      >
                        <Code2 size={13} /> CODE
                      </a>
                    )}
                    {!primaryOpensModal && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenIdx(i); }}
                        className={projBtnBase}
                        style={{ ...projBtnFont, border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.75)", background: "rgba(255,255,255,0.05)" }}
                      >
                        <Info size={13} /> DETAILS
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ProjectModal project={openIdx !== null ? PROJECTS[openIdx] : null} onClose={() => setOpenIdx(null)} />
    </section>
  );
}

// ─── Project "mission briefing" modal ─────────────────────────────────────────

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;
  const embed = project.video ? youTubeEmbed(project.video) : null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 120, background: "rgba(4,4,12,0.8)", backdropFilter: "blur(6px)", animation: "proj-fade 0.2s ease" }}
    >
      <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
            style={{
              background: `linear-gradient(150deg, ${project.from} 0%, ${project.via} 100%)`,
              border: `1px solid ${project.accent}55`,
              boxShadow: `0 30px 90px ${project.accent}33, 0 12px 48px rgba(0,0,0,0.65)`,
              animation: "proj-pop 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
            />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full transition-colors"
              style={{ width: 34, height: 34, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)" }}
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto p-6 md:p-8" style={{ maxHeight: "88vh" }}>
              <div className="text-xs tracking-widest mb-2" style={{ color: project.accent, fontFamily: "JetBrains Mono, monospace" }}>
                {project.type} / {project.year}
              </div>
              <div className="flex items-center gap-3 flex-wrap mb-5">
                <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "2rem", fontWeight: 700, color: "white", letterSpacing: "0.02em" }}>
                  {project.name}
                </h3>
                <span
                  className="px-3 py-1 rounded-full text-xs tracking-widest"
                  style={{ border: `1px solid ${project.accent}55`, color: project.accent, fontFamily: "JetBrains Mono, monospace" }}
                >
                  {project.status}
                </span>
              </div>

              {embed && (
                <div
                  className="mb-6 rounded-xl overflow-hidden"
                  style={{ aspectRatio: "16 / 9", border: `1px solid ${project.accent}33`, background: "#000" }}
                >
                  <iframe
                    src={embed}
                    title={`${project.name} demo`}
                    className="w-full h-full"
                    style={{ border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Inter, sans-serif" }}>
                {project.details ?? project.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-md text-xs"
                    style={{ background: "rgba(0,0,0,0.28)", color: "rgba(255,255,255,0.7)", fontFamily: "JetBrains Mono, monospace" }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {(project.demo || project.repo) && (
                <div className="flex flex-wrap gap-2 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className={projBtnBase}
                      style={{ ...projBtnFont, background: project.accent, color: "#0a0a14", fontWeight: 600 }}
                    >
                      <Play size={13} /> LIVE DEMO <ArrowUpRight size={13} />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className={projBtnBase}
                      style={{ ...projBtnFont, border: `1px solid ${project.accent}66`, color: project.accent }}
                    >
                      <Code2 size={13} /> CODE <ArrowUpRight size={13} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
  );
}

// ─── Experience Section (constellation timeline) ──────────────────────────────

// Star colours are auto-assigned by position, so adding a job needs no colour choice.
const TL_PALETTE = [
  { color: "#22D3EE", glow: "#0EA5E9" }, // cyan
  { color: "#8B5CF6", glow: "#7C3AED" }, // violet
  { color: "#F59E0B", glow: "#D97706" }, // amber
  { color: "#60A5FA", glow: "#3B82F6" }, // blue
  { color: "#22C55E", glow: "#16A34A" }, // green
  { color: "#F472B6", glow: "#EC4899" }, // pink
];

// Each job gets a visually distinct planet "type" (by position), with its own
// surface pattern, spin speed, and ring config — all pure CSS, no image assets.
type PlanetVariant = {
  ring: boolean;
  ringTilt: number;
  double: boolean;
  thin: boolean;
  speed: number; // seconds per rotation
  surface: (color: string, glow: string) => string; // CSS background-image
};

const PLANET_VARIANTS: PlanetVariant[] = [
  {
    // 0 — Banded gas giant with a storm spot + ring
    ring: true, ringTilt: 18, double: false, thin: false, speed: 9,
    surface: (_c, glow) =>
      `radial-gradient(circle at 68% 60%, rgba(255,255,255,0.55) 0 4%, transparent 6%),` +
      `repeating-linear-gradient(100deg, rgba(0,0,0,0.28) 0 13%, transparent 13% 26%, rgba(255,255,255,0.16) 26% 33%, transparent 33% 52%),` +
      `linear-gradient(100deg, ${glow}00, ${glow}66 50%, ${glow}00)`,
  },
  {
    // 1 — Cratered rocky world
    ring: false, ringTilt: 0, double: false, thin: false, speed: 16,
    surface: (_c, glow) =>
      `radial-gradient(circle at 20% 35%, rgba(0,0,0,0.32) 0 4%, transparent 6%),` +
      `radial-gradient(circle at 55% 66%, rgba(0,0,0,0.3) 0 5%, transparent 7%),` +
      `radial-gradient(circle at 82% 28%, rgba(0,0,0,0.26) 0 3%, transparent 5%),` +
      `radial-gradient(circle at 38% 82%, rgba(255,255,255,0.14) 0 4%, transparent 6%),` +
      `radial-gradient(circle at 50% 50%, ${glow}66, transparent 72%)`,
  },
  {
    // 2 — Icy striped world + thin ring
    ring: true, ringTilt: -15, double: false, thin: true, speed: 11,
    surface: (_c, glow) =>
      `repeating-linear-gradient(115deg, rgba(255,255,255,0.24) 0 5%, transparent 5% 15%),` +
      `linear-gradient(115deg, ${glow}55, transparent 60%)`,
  },
  {
    // 3 — Stormy world with a great spot
    ring: false, ringTilt: 0, double: false, thin: false, speed: 7,
    surface: (_c, glow) =>
      `radial-gradient(ellipse at 64% 55%, rgba(255,255,255,0.42) 0 7%, ${glow} 8% 15%, transparent 21%),` +
      `radial-gradient(circle at 28% 38%, rgba(0,0,0,0.3) 0 6%, transparent 9%),` +
      `repeating-linear-gradient(98deg, rgba(0,0,0,0.14) 0 18%, transparent 18% 40%)`,
  },
  {
    // 4 — Earth-like world: oceans, continents, clouds
    ring: false, ringTilt: 0, double: false, thin: false, speed: 13,
    surface: (_c, glow) =>
      `radial-gradient(ellipse at 30% 42%, ${glow} 0 11%, transparent 17%),` +
      `radial-gradient(ellipse at 72% 66%, ${glow} 0 13%, transparent 19%),` +
      `radial-gradient(circle at 55% 24%, rgba(255,255,255,0.4) 0 5%, transparent 8%),` +
      `radial-gradient(circle at 18% 75%, rgba(255,255,255,0.3) 0 4%, transparent 7%)`,
  },
  {
    // 5 — Ice giant with a bold double ring
    ring: true, ringTilt: 24, double: true, thin: false, speed: 18,
    surface: (_c, glow) =>
      `repeating-linear-gradient(96deg, rgba(255,255,255,0.12) 0 19%, transparent 19% 50%),` +
      `linear-gradient(96deg, ${glow}55, transparent 55%)`,
  },
];

function ring(color: string, tilt: number, w: number, h: number): CSSProperties {
  return {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: w,
    height: h,
    marginLeft: -w / 2,
    marginTop: -h / 2,
    transform: `rotate(${tilt}deg)`,
    border: `2px solid ${color}cc`,
    borderRadius: "50%",
    boxShadow: `0 0 7px ${color}66`,
    zIndex: 0,
    pointerEvents: "none",
  };
}

function TimelinePlanet({ color, glow, variant, open }: { color: string; glow: string; variant: number; open: boolean }) {
  const v = PLANET_VARIANTS[variant % PLANET_VARIANTS.length];
  const D = 42;

  return (
    <span style={{ position: "relative", width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {v.ring && <span style={ring(color, v.ringTilt, 62, v.thin ? 14 : 18)} />}
      {v.ring && v.double && <span style={ring(color, v.ringTilt, 50, v.thin ? 10 : 13)} />}

      {/* Planet body (clips the spinning surface to a circle) */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          width: D,
          height: D,
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: color,
          boxShadow: `0 0 ${open ? 16 : 9}px ${glow}${open ? "aa" : "66"}`,
        }}
      >
        {/* Spinning surface (tl-surface lets CSS stop it under reduced motion) */}
        <span
          className="tl-surface"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "200%",
            backgroundColor: color,
            backgroundImage: v.surface(color, glow),
            backgroundRepeat: "repeat-x",
            backgroundSize: "50% 100%",
            animation: `tl-spin ${v.speed}s linear infinite`,
          }}
        />
        {/* Spherical shading: top-left highlight + limb darkening */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.5) 0%, transparent 42%)," +
              "radial-gradient(circle at 50% 50%, transparent 48%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
          }}
        />
      </span>
    </span>
  );
}

function ExperienceSection() {
  // First (most recent) job open by default; click a star to toggle.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="experience" className="py-24 relative" style={{ zIndex: 1 }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(139,92,246,0.04) 0%, transparent 60%)" }}
      />
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="mb-14">
          <SectionLabel color="#8b5cf6" text="FLIGHT PATH / CAREER" />
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>
            WORK EXPERIENCE
          </h2>
        </div>

        <div className="relative">
          {/* The constellation line linking the stars */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: 31,
              top: 16,
              bottom: 40,
              width: 2,
              background: "linear-gradient(to bottom, rgba(34,211,238,0.45), rgba(139,92,246,0.45), rgba(245,158,11,0.35))",
            }}
          />

          <div className="flex flex-col">
            {EXPERIENCE.map((job, i) => {
              const c = TL_PALETTE[i % TL_PALETTE.length];
              const isOpen = open === i;
              const toggle = () => setOpen(isOpen ? null : i);

              return (
                <div key={job.company + i} className="relative flex gap-5">
                  {/* Star node */}
                  <button
                    onClick={toggle}
                    aria-expanded={isOpen}
                    aria-label={`${job.role} at ${job.company}`}
                    className="flex-shrink-0 flex items-start"
                    style={{ width: 64, cursor: "pointer" }}
                  >
                    <motion.span
                      className="flex items-center justify-center"
                      animate={{ scale: isOpen ? 1.12 : 1 }}
                      whileHover={{ scale: isOpen ? 1.16 : 1.08 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{ width: 64, height: 64 }}
                    >
                      {job.logo ? (
                        <span
                          className="flex items-center justify-center"
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "#020817",
                            border: `1px solid ${isOpen ? c.color : c.glow + "55"}`,
                            boxShadow: isOpen ? `0 0 26px ${c.glow}66` : `0 0 12px ${c.glow}33`,
                          }}
                        >
                          <img src={job.logo} alt={job.company} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover" }} />
                        </span>
                      ) : (
                        <TimelinePlanet color={c.color} glow={c.glow} variant={i} open={isOpen} />
                      )}
                    </motion.span>
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pb-8">
                    <button onClick={toggle} className="text-left w-full pt-1.5" style={{ cursor: "pointer" }}>
                      <div className="text-xs tracking-widest mb-1" style={{ color: c.color, fontFamily: "JetBrains Mono, monospace" }}>
                        {job.period} · {job.location}
                      </div>
                      <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.55rem", fontWeight: 700, color: "white", letterSpacing: "0.01em", lineHeight: 1.1 }}>
                        {job.role}
                      </h3>
                      <div className="text-sm" style={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>
                        {job.company}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div
                            className="mt-4 p-5 rounded-2xl"
                            style={{ background: "rgba(15,23,42,0.7)", border: `1px solid ${c.glow}33`, backdropFilter: "blur(12px)" }}
                          >
                            <p className="text-sm mb-4 leading-relaxed" style={{ color: "#cbd5e1", fontFamily: "Inter, sans-serif" }}>
                              {job.summary}
                            </p>
                            <ul className="space-y-2">
                              {job.highlights.map((h, j) => (
                                <li key={j} className="flex gap-2.5 text-sm" style={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>
                                  <span style={{ color: c.color, marginTop: 1 }}>▹</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section (stats + CTA) ────────────────────────────────────────────

function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const links = [
    PROFILE.email && { icon: Mail, label: "EMAIL", href: `mailto:${PROFILE.email}` },
    PROFILE.github && { icon: Github, label: "GITHUB", href: PROFILE.github },
    PROFILE.linkedin && { icon: Linkedin, label: "LINKEDIN", href: PROFILE.linkedin },
    PROFILE.resumeUrl && { icon: FileText, label: "RÉSUMÉ", href: PROFILE.resumeUrl },
  ].filter(Boolean) as { icon: typeof Mail; label: string; href: string }[];

  return (
    <section id="contact" className="py-24 relative" ref={ref} style={{ zIndex: 1 }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.055) 0%, transparent 65%)" }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-14 text-center">
          <SectionLabel color="#8b5cf6" text="BY THE NUMBERS" center />
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}>
            THE STATS
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="text-center p-7 rounded-2xl relative overflow-hidden"
              style={{ background: "rgba(15,23,42,0.65)", border: "1px solid rgba(148,163,184,0.07)", backdropFilter: "blur(10px)" }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(34,211,238,0.04) 0%, transparent 65%)" }} />
              <div
                className="text-4xl md:text-5xl font-bold mb-2 relative"
                style={{
                  fontFamily: "Rajdhani, sans-serif",
                  background: "linear-gradient(135deg, #22d3ee, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.num}
              </div>
              <div className="text-sm font-semibold mb-1.5 relative" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em" }}>
                {s.unit}
              </div>
              <div className="text-xs relative" style={{ color: "#475569", fontFamily: "Inter, sans-serif", lineHeight: 1.4 }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="relative rounded-3xl p-10 md:p-14 text-center overflow-hidden"
          style={{
            background: "linear-gradient(140deg, rgba(34,211,238,0.07) 0%, rgba(139,92,246,0.07) 100%)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top center, rgba(139,92,246,0.12) 0%, transparent 55%)" }} />
          <div className="absolute top-6 left-8 w-1.5 h-1.5 rounded-full" style={{ background: "#22d3ee", boxShadow: "0 0 8px #22d3ee" }} />
          <div className="absolute bottom-6 right-10 w-1 h-1 rounded-full" style={{ background: "#8b5cf6", boxShadow: "0 0 6px #8b5cf6" }} />

          <h3
            className="mb-4 relative"
            style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.6rem, 4vw, 2.6rem)", fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}
          >
            GET IN TOUCH
          </h3>
          <p className="mb-8 mx-auto max-w-md relative" style={{ color: "#94a3b8", fontFamily: "Inter, sans-serif", lineHeight: 1.65 }}>
            {PROFILE.status === "AVAILABLE FOR HIRE"
              ? `I'm currently open to new opportunities. Reach out, or ask my AI assistant (the rocket below) anything about me first.`
              : `Want to collaborate or just say hi? Reach out, or ask my AI assistant (the rocket below) anything about me first.`}
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap relative">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: l.label === "EMAIL" ? "linear-gradient(135deg, #22d3ee, #8b5cf6)" : "rgba(2,8,23,0.5)",
                  border: l.label === "EMAIL" ? "none" : "1px solid rgba(148,163,184,0.25)",
                  color: l.label === "EMAIL" ? "white" : "#cbd5e1",
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "0.95rem",
                  letterSpacing: "0.08em",
                  boxShadow: l.label === "EMAIL" ? "0 0 38px rgba(139,92,246,0.38)" : "none",
                }}
              >
                <l.icon size={16} /> {l.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-10 pb-24 relative" style={{ zIndex: 1, borderTop: "1px solid rgba(148,163,184,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}>
            <Rocket size={10} className="text-white" />
          </div>
          <span className="text-sm tracking-widest" style={{ fontFamily: "Rajdhani, sans-serif", color: "#94a3b8" }}>
            {BRAND.first}
            <span style={{ color: "#22d3ee" }}>{BRAND.accent}</span>
          </span>
        </div>

        <p className="text-xs" style={{ color: "#334155", fontFamily: "JetBrains Mono, monospace" }}>
          © {new Date().getFullYear()} {PROFILE.name.toUpperCase()} · BUILT AMONG THE STARS
        </p>

        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: "#22d3ee", boxShadow: "0 0 7px rgba(34,211,238,0.9)" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <span className="text-xs" style={{ color: "#22d3ee", fontFamily: "JetBrains Mono, monospace" }}>
            ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([e]) => e.isIntersecting && setActive(id), { threshold: 0.45 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    // reducedMotion="user" makes motion respect the OS prefers-reduced-motion
    // setting automatically (transform animations skipped, opacity kept).
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#020817", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      {/* Stars + nebula clouds are all painted by the StarField canvas. */}
      <StarField />

      <Nav active={active} />

      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>

      <Footer />

      {/* The rocket-ship Arian AI chatbot, fixed at the bottom */}
      <ArianAI />
    </div>
    </MotionConfig>
  );
}
