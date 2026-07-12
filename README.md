# Arian — Portfolio (Cosmos edition) 🪐

An interactive, space-themed personal portfolio built to help **get Arian hired**.
Features a rotating 3D Saturn, an orbiting skill system, and **Arian AI** — a rocket-ship
chatbot (powered by DeepSeek) that answers visitors' questions about Arian, and *only* Arian.

## ✏️ Where to put your info

| What | File |
|------|------|
| Name, tagline, bio, projects, skills, stats, contact links | [`src/app/content.ts`](src/app/content.ts) |
| What the **AI assistant** is allowed to know about you | [`netlify/functions/chat.ts`](netlify/functions/chat.ts) → `ARIAN_PROFILE` |

Both files have `TODO` markers. Edit the text, save, done — no other code changes needed.
The 3D model is `public/Saturn_1_120536.glb` (swap the file + the path in `Saturn3D.tsx` to change it).

## 🚀 Running locally

```bash
npm install        # already done
npm run dev        # site only (the AI chatbot needs netlify dev — see below)
```

### Running the AI chatbot locally
The chatbot calls a serverless function, so use the Netlify CLI:

```bash
npm install -g netlify-cli      # one time
cp .env.example .env            # then paste your real DeepSeek key into .env
netlify dev                     # serves the site + the /api/chat function
```

Get a DeepSeek API key at <https://platform.deepseek.com/>.

> Without a key, the site still works — the chatbot just replies that it isn't configured yet.

## ☁️ Deploying to Netlify

1. Push this folder to GitHub (or drag-and-drop in the Netlify UI).
2. In Netlify: **Add new site → Import**. Build settings are auto-read from `netlify.toml`
   (build `npm run build`, publish `dist`, functions `netlify/functions`).
3. **Site settings → Environment variables** → add `DEEPSEEK_API_KEY` = your key.
4. Deploy. The chatbot will be live at `/api/chat`.

## 🛡️ How the guardrail works

The DeepSeek key lives **only on the server** (Netlify env var) — it never reaches the browser.
The function in `netlify/functions/chat.ts` injects a system prompt that forces the assistant to
answer **only** questions about Arian and politely decline everything else. It also strips any
client-supplied system messages and caps message length/history.

## Tech

React 18 · Vite · Tailwind v4 · Motion · three.js / react-three-fiber · Netlify Functions · DeepSeek
