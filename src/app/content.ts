// ════════════════════════════════════════════════════════════════════════════
//  ARIAN'S PORTFOLIO — EDIT EVERYTHING HERE
// ────────────────────────────────────────────────────────────────────────────
//  This is the ONLY file you need to touch to put your real info on the site.
//  Replace every "TODO" / placeholder string below with your real details.
//  The website reads from this file automatically — no other code changes needed.
//
//  NOTE: The Arian AI chatbot's knowledge lives separately, on the SERVER, in
//        netlify/functions/chat.ts (so visitors can't tamper with it). Update
//        the ARIAN_PROFILE block there too when you finalise your bio.
// ════════════════════════════════════════════════════════════════════════════

export const PROFILE = {
  // Your name + a short tagline shown in the hero.
  name: "Arian Khan",
  tagline: "Mechatronics Engineer | ML & Robotics", // TODO: your real title
  // One or two punchy sentences. This is the big intro under your name.
  intro:
    "Whether it's polished web apps, AI models, or robotics, I engineer systems built to launch. " +
    "I'm currently exploring new adventures and looking for my next mission.",

  // Status badge shown at the top of the hero.
  status: "AVAILABLE FOR HIRE", // e.g. "OPEN TO WORK", "FREELANCE OPEN"
  location: "EARTH / REMOTE", // TODO: your city / "Remote"

  // Links used by the contact section + footer. Leave "" to hide a button.
  email: "as8khan@uwaterloo.ca", // TODO
  github: "https://github.com/arian-gif", // TODO
  linkedin: "https://www.linkedin.com/in/ariansadatkhan/", // TODO
  resumeUrl: "https://www.overleaf.com/read/vtxgcgjfwhrd#798763", // TODO: link to a PDF résumé, or leave "" to hide
};

// ─── ABOUT ──────────────────────────────────────────────────────────────────
// ─── ABOUT ──────────────────────────────────────────────────────────────────
export const ABOUT: string[] = [
  "I build everything from intelligent " +
    "AI models to physical robotic systems, " +
    "always focusing on turning complex " +
    "ideas into things people can actually use. " +
    "Whether I'm writing code, training " +
    "models, or wiring hardware, my goal is " +
    "to build systems designed for the real world."
];

// ─── PROJECTS (shown as "MISSIONS") ───────────────────────────────────────────
// Each project becomes a glowing mission card. Add/remove freely.
// `accent` colours: cyan #22D3EE, violet #8B5CF6, amber #F59E0B, red #EF4444,
// green #22C55E, blue #60A5FA — pick whatever fits.
export type Project = {
  name: string;
  type: string; // e.g. "WEB APP", "AI / ML", "OPEN SOURCE"
  year: string;
  status: string; // "LIVE", "IN PROGRESS", "SHIPPED"
  desc: string;       // short blurb shown on the card
  details?: string;   // OPTIONAL longer write-up shown in the "mission briefing" modal.
                      // If omitted, the modal falls back to `desc`.
  tags: string[]; // tech used
  demo?: string;      // OPTIONAL live-demo URL → shows a "Live Demo" button (opens in a new tab)
  repo?: string;      // OPTIONAL GitHub URL → shows a "Code" button (opens in a new tab)
  video?: string;     // OPTIONAL YouTube URL → embeds the video inside the modal
  from: string; // gradient start colour
  via: string; // gradient end colour
  accent: string; // highlight colour
};

export const PROJECTS: Project[] = [
  {
    name: "STEALTH STARTUP",
    type: "STARTUP",
    year: "2026",
    status: "IN PROGRESS",
    desc: "Founding a stealth consumer app: a TikTok-style discovery feed with " +
      "embedding-based recommendations, engineered to scale.",

    details:
      "I'm founding an early-stage, stealth-mode startup rethinking the infinite-scroll " +
      "feed a recommender optimized for real-world intent instead of watch-time. " +
      "I built the personalization engine (per-user taste vectors from embeddings, with an " +
      "explore/exploit ranking loop) and a semantic moderation pipeline that vector-checks " +
      "every post for relevance before it publishes, with an LLM reviewer agent handling the " +
      "gray zone. The stack: Flutter on the front, FastAPI + Postgres behind a JWT/SSO auth " +
      "layer, cache-aside caching, and an AWS architecture (CDN, load balancing, async " +
      "moderation queue) designed to take it to scale.",

    tags: ["AI", "Recommender Systems", "System Design", "Founding", "Stealth"],
    from: "#1e1b4b",
    via: "#312e81",
    accent: "#818CF8",
  },
  {
    name: "AGENTIC FULL-STACK ORCHESTRATOR",
    type: "AI / ML",
    year: "2025",
    status: "SHIPPED",
    desc: "An agentic AI system that turns high-level requirements into complete full-stack apps. " +
      "A manager agent orchestrates specialized frontend, backend, reviewer, and docs agents, " +
      "running in parallel with asyncio, iterating via feedback loops, and auto-generating docs.",
    details:
      "An agentic AI system that autonomously transforms high-level software requirements into complete " +
      "full-stack applications. A manager agent orchestrates specialized frontend, backend, reviewer, and " +
      "documentation agents across the software lifecycle, with agents running in parallel via Python's " +
      "asyncio for efficiency. Generated code is automatically reviewed through iterative feedback loops " +
      "for error detection and correction; once validated, documentation agents produce structured Markdown " +
      "technical docs. Try the live demo to watch it build an app end to end.",
    tags: ["Agentic AI", "Async Systems", "FastAPI", "Python"],
    demo: "https://agentic-coder.netlify.app/",
    repo: "https://github.com/arian-gif/agent-system",
    from: "#0c4a6e",
    via: "#075985",
    accent: "#22D3EE",
  },
  {
    name: "NEURAL NETWORK FROM SCRATCH",
    type: "AI / ML",
    year: "2025",
    status: "SHIPPED",
    desc: "A neural network built entirely in NumPy, with manual backpropagation, gradient descent, " +
      "and cross-entropy loss, plus hand-derived Gradient Boosting, Decision Trees, and " +
      "Linear/Logistic Regression. Deep learning from first principles, no frameworks.",
    details:
      "A neural network built entirely from scratch in NumPy to classify individuals as male or female " +
      "from height and weight, using two inputs, one hidden layer with four activations, and two outputs. " +
      "I implemented backpropagation and gradient descent manually and used cross-entropy loss for " +
      "classification, achieving high accuracy and low loss that confirmed the implementation's correctness. " +
      "I've also hand-derived other ML algorithms from first principles, including Gradient Boosting, " +
      "Decision Trees, Linear Regression, and Logistic Regression.",
    tags: ["Python", "NumPy", "Scikit-learn", "Deep Learning"],
    repo: "https://github.com/arian-gif/Neurel-Network",
    from: "#14532d",
    via: "#166534",
    accent: "#22C55E",
  },
  {
    name: "AUTONOMOUS NAVIGATION ROBOT",
    type: "ROBOTICS",
    year: "2023",
    status: "SHIPPED",
    desc: "A delivery bot in RobotC that autonomously ferries packages across a grid, an assistive " +
      "solution for those like the elderly. It reads positional instructions, navigates via motor " +
      "control and sensor feedback, and routes by box-color detection using encoder, touch, color, and gyro sensors.",
    details:
      "A delivery bot built in RobotC that autonomously delivers packages across a grid, designed as an " +
      "assistive solution for people such as the elderly. The robot reads positional instructions from a " +
      "file, navigates using motor control and sensor feedback, and makes decisions based on box-color " +
      "detection. I programmed functions for distance, rotation, and error correction using encoder, touch, " +
      "color, and gyro sensors. It determines its route, retrieves packages, and returns to the origin while " +
      "tracking delivery time and status. Watch the demo to see it run.",
    tags: ["RobotC", "CAD", "Embedded Systems", "Sensors"],
    video: "https://www.youtube.com/watch?v=nHGaTSK0epw",
    repo: "https://github.com/arian-gif/Robot-",
    from: "#78350f",
    via: "#92400e",
    accent: "#F59E0B",
  },
];

// ─── WORK EXPERIENCE (shown as a clickable "constellation timeline") ──────────
// Each job is a STAR on the timeline. Click a star to expand its details.
//
// ✦ To ADD A JOB: just copy one { ... } block and edit the text. That's it —
//   the star colour is assigned automatically, so you never pick colours.
// ✦ Order them most-recent FIRST (top of the timeline).
export type Job = {
  role: string;        // your job title
  company: string;     // employer / client
  period: string;      // e.g. "2024 — Present", "Jun 2022 – Dec 2023"
  location: string;    // "Remote", a city, etc.
  summary: string;     // one or two sentences about the role
  highlights: string[]; // bullet points: what you did / achieved
  logo?: string;       // OPTIONAL: a company logo. Put the image in /public
                       // (e.g. public/logos/acme.png) and set logo: "/logos/acme.png".
                       // If omitted, the node shows a glowing planet instead.
};

export const EXPERIENCE: Job[] = [
  {
    role: "Robotics Developer (Core Member)",
    company: "Watai",
    period: "May 2026 — Dec 2026",
    location: "Remote",
    summary:
      "Core member training Vision-Language-Action (VLA) models for robotic manipulation and bridging the sim-to-real gap on real hardware.",
    highlights: [
      "Engineered physics-simulation workflows and headless data pipelines to fine-tune Vision-Language-Action (VLA) models for robotic manipulation.",
      "Bridged the sim-to-real gap for robotic manipulation by building MuJoCo and NVIDIA Isaac simulation pipelines to train and evaluate VLA models.",
      "Integrated ROS (Robot Operating System) as the communication layer between nodes and topics, enabling clean, modular coordination across the robotics stack.",
      "Built and wired a physical robot arm capable of picking up and moving boxes to designated target locations.",
    ],
  },
  {
    role: "AI Tools Developer",
    company: "Lynx",
    period: "May 2026 — August 2026",
    location: "Remote",
    summary:
      "Building a multi-agent Microsoft Teams chatbot, the concurrent backend that powers it, and an image-ingestion pipeline that extends its RAG knowledge base.",
    highlights: [
      "Developed a multi-agent Microsoft Teams chatbot using LangGraph, designing stateful agent workflows and a RAG architecture to synthesize responses from over 100 Confluence pages.",
      "Improved multi-user response performance through asynchronous processing, Redis caching, and Azure sidecar warm-up optimizations, reducing average response latency by 95% and minimizing cold-start delays.",
      "Integrated Langfuse for end-to-end agent tracing and telemetry, analyzing 500+ interactions across latency, token usage, tool calls, and model outputs to evaluate and optimize LLM performance for tool-calling workflows.",
      "Built a two-stage image ingestion pipeline that generated descriptive text for 150+ images, incorporated human review, and ingested approved content into a vector database, extending the RAG knowledge base with image-derived information.",
    ],
  },
  {
    role: "ML Researcher",
    company: "Algoverse",
    period: "Jan 2026 — August 2026",
    location: "Remote",
    summary:
      "Researching multimodal LLM hallucinations and novel contrastive decoding methods to reduce them.",
    highlights: [
      "Researched MLLM hallucinations, where models confidently describe objects, attributes, or relations not present in an image, identifying key failure modes in existing contrastive decoding methods (VCD, LayerCD, iTaD).",
      "Developed ACD-VGF to address these failures, contrasting original and content-distorted image passes then cross-checking predictions against an open-vocabulary detector (OWL-ViT) at each decoding step.",
      "Evaluated against POPE and AMBER benchmarks across LLaVA-1.5 and InstructBLIP, demonstrating measurable reductions in existence, attribute, and relation hallucination rates over VCD, LayerCD, and iTaD baselines.",
    ],
  },
  {
    role: "AI Developer",
    company: "BCS Automation",
    period: "Sept 2025 — Dec 2025",
    location: "Belleville, ON",
    summary:
      "Built predictive-maintenance ML systems, cloud data pipelines, and agentic tooling for industrial automation.",
    highlights: [
      "Developed an LSTM AutoEncoder anomaly detection system in PyTorch that predicted failures 2 to 4 weeks early, achieving 92% accuracy and reducing equipment downtime by 35%.",
      "Designed a cloud-scale Azure KQL data pipeline processing 50K+ PLC sensor events per minute, with automated filtering that improved data quality 40% and reduced false alerts by 60%.",
      "Developed a multi-agent workflow using CrewAI, testing agent behaviors across 5+ handoff scenarios and feedback loops, achieving 97% task completion accuracy through agentic coordination.",
      "Built a local MCP server with database extraction resources and schema-aware tools, implementing context-driven retrieval logic that processed 10K+ queries while maintaining data integrity across concurrent connections.",
    ],
  },
  {
    role: "AI Engineer Intern",
    company: "CoinWa",
    period: "May 2025 — Aug 2025",
    location: "Remote",
    summary:
      "Built agentic, personalized AI learning systems for financial literacy education.",
    highlights: [
      "Built an agentic AI tutor with LangChain and LLM APIs that users could interact with naturally using NLP, storing user data in a vector database and using RAG to retrieve personalized learning history, achieving 90% implementation accuracy across quiz generation, adaptive explanations, and difficulty personalization.",
      "Implemented a Duolingo-style AI system with an ANN-based classifier that analyzes user performance across 500+ lessons, detects weaknesses from incorrect answers with 91% pattern recognition accuracy, and dynamically recommends personalized financial literacy lessons through an adaptive feedback engine.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "CoinWa",
    period: "Jan 2025 — Apr 2025",
    location: "Remote",
    summary:
      "Built a cross-platform financial literacy app and its backend for teaching 13 to 18 year-olds about money.",
    highlights: [
      "Created a financial literacy app using Flutter and Dart aimed at educating 13 to 18 year-olds about financial concepts, implementing features such as email verification, password recovery, and 15+ structured learning modules.",
      "Built and integrated a backend system using Node.js and MongoDB, handling 100+ user registrations, authentication with JWT tokens, and secure data storage with 99.9% uptime; collaborated with a 3-person team using Git for version control across 150+ commits.",
      "Debugged and optimized mobile app performance using Flutter DevTools, identifying and resolving 50+ bugs and rendering issues, reducing app load time by 40% and improving overall responsiveness.",
    ],
  },
  {
    role: "Onsite Support",
    company: "Sun Life",
    period: "April 2024 — Aug 2024",
    location: "Toronto, ON",
    summary:
      "Provided onsite IT support and device provisioning for Sun Life staff (ServiceNow, MS Office, SCCM).",
    highlights: [
      "Installed and configured Sun Life software on new computers for onboarding employees, ensuring seamless functionality.",
      "Upgraded old computers to new ones, including hardware upgrades with RAM replacements and software updates, enhancing efficiency and performance.",
      "Provided technical support to Sun Life staff, effectively resolving complex computer issues and maintaining high levels of customer satisfaction.",
    ],
  },
];

// ─── STATS (the "by the numbers" strip) ───────────────────────────────────────
// Use REAL, concrete numbers — vague stats read as filler to recruiters.
// Swap these placeholders for your actual figures.
export const STATS = [
  { num: "6+",   unit: "Roles",          label: "Across AI, ML & robotics teams" },
  { num: "5+",  unit: "AI / ML Systems", label: "Engineered end-to-end" },
  { num: "10+", unit: "Projects",       label: "Designed, built & shipped" }, // CONFIRM: your real total
  { num: "1",   unit: "Research Project",  label: "On reducing MLLM hallucinations" }, // CONFIRM: published, or say "Research Project"
];

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
export const NAV = [
  { id: "home",     label: "HOME" },
  { id: "about",    label: "ABOUT" },
  { id: "projects",   label: "PROJECTS" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "contact",    label: "CONTACT" },
];

// Brand shown in the navbar / footer.
export const BRAND = { first: "ARIAN" }; // renders ARIAN-OS
