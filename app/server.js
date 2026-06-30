/**
 * Notewright — backend server (server.js)
 * -----------------------------------------
 * This is the small server that makes the app production-ready:
 *   1. Keeps your Anthropic API key OFF the browser (proxied here).
 *   2. Gives Notewright its own API for other tools to connect to.
 *
 * Run:
 *   cd app
 *   npm install
 *   ANTHROPIC_API_KEY=sk-ant-...  node server.js
 *
 * Auth: this starter has NO real authentication. Put a real provider
 * (Supabase / Auth0 / Firebase / Clerk) in front of these routes before
 * launch, and verify the user on every request.
 */

const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());                 // tighten to your domain in production
app.use(express.json({ limit: "1mb" }));

// Serve static files using an absolute path — works no matter
// which directory you start the server from.
app.use(express.static(path.join(__dirname, "public")));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// prompt map — keep in sync with the app
const PROMPTS = {
  summary:   "You are a precise meeting analyst. From the transcript below, write a clear summary: 1) one-line outcome 2) key points 3) decisions 4) open questions. Transcript:\n\n",
  actions:   "Extract every action item from the transcript below as '- [Owner] Task — due [date]'. Transcript:\n\n",
  email:     "Write a concise professional follow-up email from the transcript below, with a subject line, recap, action items, and next steps. Transcript:\n\n",
  decisions: "Produce a decision log from the transcript below: Decision | Rationale | Owner | Date. Transcript:\n\n",
  plan:      "Turn the transcript below into a prioritised plan: Now / Next / Later, each with owner and timeframe. Transcript:\n\n",
  business:  "Draft a concise one-page business plan from the notes below: Overview, Problem, Solution, Target customer, Revenue, Risks, Next 3 steps. Notes:\n\n",
  workflow:  "Output ONLY a valid Mermaid flowchart (start 'flowchart TD') for the process in the notes below. No commentary, no code fences. Notes:\n\n",
};

// --- Health check ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Notewright",
    hasApiKey: !!ANTHROPIC_API_KEY,
    uptime: process.uptime(),
  });
});

// --- AI proxy: the browser calls THIS, never Anthropic directly ---
app.post("/api/generate", async (req, res) => {
  try {
    if (!ANTHROPIC_API_KEY)
      return res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY" });

    const { type, transcript } = req.body || {};
    const pre = PROMPTS[type];
    if (!pre) return res.status(400).json({ error: "Unknown type" });
    if (!transcript || typeof transcript !== "string" || !transcript.trim())
      return res.status(400).json({ error: "transcript required" });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: pre + transcript }],
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("Anthropic error:", data);
      return res.status(502).json({ error: "AI service error", detail: data.error?.message || "Unknown" });
    }
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    res.json({ type, text });
  } catch (e) {
    console.error("Generate error:", e);
    res.status(500).json({ error: String(e) });
  }
});

// --- simple project store (swap the Map for a real database) ---
const projects = new Map();
app.post("/api/projects", (req, res) => {
  const id = "p_" + Date.now().toString(36);
  projects.set(id, { id, createdAt: new Date().toISOString(), ...req.body });
  res.status(201).json({ id });
});
app.get("/api/projects/:id", (req, res) => {
  const p = projects.get(req.params.id);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(p);
});

// --- Catch-all: serve index.html for any non-API route ---
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
  ┌──────────────────────────────────────────┐
  │      NOTEWRIGHT is running!               │
  │                                           │
  │  Local:   http://localhost:${PORT}           │
  │  API key: ${ANTHROPIC_API_KEY ? "✓ loaded" : "✗ missing (set ANTHROPIC_API_KEY)"}${"          ".slice(0, ANTHROPIC_API_KEY ? 10 : 0)}│
  └──────────────────────────────────────────┘
  `);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n  Port ${PORT} is already in use.\n  Try: PORT=3001 node server.js\n`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
