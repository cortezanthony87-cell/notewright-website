/**
 * Notewright — backend server (server.js)
 * -----------------------------------------
 * Production-ready Express server:
 *   1. Keeps Anthropic API key OFF the browser (proxied here).
 *   2. Gives Notewright its own API for tools to connect to.
 *   3. Input validation, rate limiting, and error handling built in.
 *
 * Run:
 *   npm install
 *   ANTHROPIC_API_KEY=sk-ant-...  node server.js
 */

const express = require("express");
const cors = require("cors");

const app = express();

// --- Security & parsing ---
app.use(cors()); // TODO: tighten to your domain in production
app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

// --- Simple rate limiter (per-IP, in-memory) ---
const rateLimit = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;

function checkRate(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count++;
  rateLimit.set(ip, entry);
  return entry.count <= RATE_MAX;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(ip);
  }
}, 300_000);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const PROMPTS = {
  summary:   "You are a precise meeting analyst. From the transcript below, write a clear summary: 1) one-line outcome 2) key points 3) decisions 4) open questions. Transcript:\n\n",
  actions:   "Extract every action item from the transcript below as '- [Owner] Task — due [date]'. Transcript:\n\n",
  email:     "Write a concise professional follow-up email from the transcript below, with a subject line, recap, action items, and next steps. Transcript:\n\n",
  decisions: "Produce a decision log from the transcript below: Decision | Rationale | Owner | Date. Transcript:\n\n",
  plan:      "Turn the transcript below into a prioritised plan: Now / Next / Later, each with owner and timeframe. Transcript:\n\n",
  business:  "Draft a concise one-page business plan from the notes below: Overview, Problem, Solution, Target customer, Revenue, Risks, Next 3 steps. Notes:\n\n",
  workflow:  "Output ONLY a valid Mermaid flowchart (start 'flowchart TD') for the process in the notes below. No commentary, no code fences. Notes:\n\n",
};

const TYPE_LABELS = {
  summary: "Summary", actions: "Action Items", email: "Follow-up Email",
  decisions: "Decision Log", plan: "Priority Plan", business: "Business Plan",
  workflow: "Workflow Diagram",
};

const MAX_TRANSCRIPT_LENGTH = 50000;

function validateGenerateInput(body) {
  const { type, transcript } = body || {};
  if (!type || typeof type !== "string") return "type is required";
  if (!PROMPTS[type]) return "Unknown type: " + type + ". Valid: " + Object.keys(PROMPTS).join(", ");
  if (!transcript || typeof transcript !== "string") return "transcript is required";
  if (transcript.trim().length === 0) return "transcript cannot be empty";
  if (transcript.length > MAX_TRANSCRIPT_LENGTH) return "transcript too long (max " + MAX_TRANSCRIPT_LENGTH + " chars)";
  return null;
}

app.post("/api/generate", async (req, res) => {
  try {
    if (!checkRate(req.ip)) return res.status(429).json({ error: "Too many requests. Please wait a moment." });
    if (!ANTHROPIC_API_KEY) return res.status(500).json({ error: "Server missing ANTHROPIC_API_KEY" });
    const err = validateGenerateInput(req.body);
    if (err) return res.status(400).json({ error: err });

    const { type, transcript } = req.body;
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [{ role: "user", content: PROMPTS[type] + transcript }],
      }),
    });

    if (!r.ok) {
      const errBody = await r.text();
      console.error("Anthropic API error:", r.status, errBody);
      return res.status(502).json({ error: "AI service error. Please try again." });
    }

    const data = await r.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    res.json({ type, label: TYPE_LABELS[type], text });
  } catch (e) {
    console.error("Generate error:", e);
    res.status(500).json({ error: "Internal server error." });
  }
});

const projects = new Map();

app.post("/api/projects", (req, res) => {
  if (!checkRate(req.ip)) return res.status(429).json({ error: "Too many requests." });
  const id = "p_" + Date.now().toString(36);
  const project = { id, createdAt: new Date().toISOString(), ...req.body };
  projects.set(id, project);
  res.status(201).json(project);
});

app.get("/api/projects/:id", (req, res) => {
  const p = projects.get(req.params.id);
  if (!p) return res.status(404).json({ error: "Project not found" });
  res.json(p);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", hasApiKey: !!ANTHROPIC_API_KEY, uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Notewright API on http://localhost:" + PORT));
