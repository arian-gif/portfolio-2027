import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, X, Send, Sparkles } from "lucide-react";
import { PROFILE } from "../content";

// Netlify function (see netlify/functions/chat.ts). config.path maps it to /api/chat.
const ENDPOINT = "/api/chat";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Who is Arian?",
  "What can Arian build?",
  "What's Arian's best project?",
  "Is Arian available for hire?",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    `Hi! I'm Arian AI 🚀 — ask me anything about ${PROFILE.name}: skills, ` +
    `projects, experience, or how to get in touch. (I only answer questions about ${PROFILE.name}.)`,
};

export default function ArianAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Don't send the greeting; the server owns the system prompt.
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = (data.reply ?? data.error ?? "").toString().trim();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply || "Hmm, I didn't get a response. Try again?" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I couldn't reach my brain right now. If you're running this locally, start it with " +
            "`netlify dev` and set DEEPSEEK_API_KEY — see the README. 🛰️",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ─── Launch pad: rocket at the bottom ─── */}
      <div
        className="fixed left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
        style={{ bottom: 18 }}
      >
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => setOpen(true)}
              className="group relative flex items-center gap-2.5 rounded-full pl-3 pr-5 py-2.5"
              style={{
                background: "rgba(2,8,23,0.82)",
                border: "1px solid rgba(34,211,238,0.35)",
                backdropFilter: "blur(14px)",
                boxShadow: "0 0 28px rgba(34,211,238,0.25)",
                cursor: "pointer",
              }}
            >
              {/* Engine glow */}
              <span
                className="absolute left-1/2 -translate-x-1/2 -bottom-1 rounded-full"
                style={{
                  width: 26,
                  height: 10,
                  background: "radial-gradient(ellipse, rgba(251,191,36,0.7), transparent 70%)",
                  filter: "blur(4px)",
                }}
              />
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}
              >
                <Rocket size={15} className="text-white" />
              </motion.span>
              <span
                className="text-xs font-semibold tracking-wider text-white"
                style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em" }}
              >
                ASK ARIAN AI
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Chat panel ─── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="fixed z-50 flex flex-col overflow-hidden rounded-2xl"
            style={{
              bottom: 18,
              right: 18,
              width: "min(380px, calc(100vw - 36px))",
              height: "min(560px, calc(100vh - 90px))",
              background: "rgba(8,12,28,0.92)",
              border: "1px solid rgba(34,211,238,0.22)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 50px rgba(139,92,246,0.15)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(148,163,184,0.1)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}
                >
                  <Rocket size={14} className="text-white" />
                </div>
                <div>
                  <div
                    className="text-sm font-semibold text-white leading-tight"
                    style={{ fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.04em" }}
                  >
                    ARIAN AI
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "#22d3ee", fontFamily: "JetBrains Mono, monospace", fontSize: 10 }}
                  >
                    ask me about {PROFILE.name}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      background:
                        m.role === "user"
                          ? "linear-gradient(135deg, #22d3ee, #0ea5e9)"
                          : "rgba(30,41,59,0.7)",
                      color: m.role === "user" ? "white" : "#e2e8f0",
                      border: m.role === "user" ? "none" : "1px solid rgba(148,163,184,0.1)",
                      borderBottomRightRadius: m.role === "user" ? 4 : 16,
                      borderBottomLeftRadius: m.role === "user" ? 16 : 4,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                    style={{ background: "rgba(30,41,59,0.7)", border: "1px solid rgba(148,163,184,0.1)" }}
                  >
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#22d3ee" }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: d * 0.18 }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion chips, only before the first user message */}
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors hover:border-cyan-400/50"
                      style={{
                        border: "1px solid rgba(34,211,238,0.25)",
                        color: "#67e8f9",
                        fontFamily: "JetBrains Mono, monospace",
                        background: "rgba(34,211,238,0.05)",
                      }}
                    >
                      <Sparkles size={11} /> {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(148,163,184,0.1)" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${PROFILE.name}…`}
                className="flex-1 bg-transparent text-sm text-white outline-none px-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg, #22d3ee, #8b5cf6)" }}
                aria-label="Send"
              >
                <Send size={15} className="text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
