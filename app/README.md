# Notewright — AI Meeting Intelligence App

Transform meeting transcripts and notes into summaries, action items, emails, decision logs, plans, business plans, and workflow diagrams — powered by Claude AI.

## Quick Start

### Prerequisites
- **Node.js 18+** — download from [nodejs.org](https://nodejs.org)
- **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

### Setup (3 steps)

```bash
# 1. Navigate to the app folder
cd app

# 2. Install dependencies
npm install

# 3. Start the server (replace with your real key)
ANTHROPIC_API_KEY=sk-ant-your-key-here node server.js
```

**Windows (Command Prompt):**
```cmd
cd app
npm install
set ANTHROPIC_API_KEY=sk-ant-your-key-here
node server.js
```

**Windows (PowerShell):**
```powershell
cd app
npm install
$env:ANTHROPIC_API_KEY="sk-ant-your-key-here"
node server.js
```

### 4. Open the app

Go to **http://localhost:3000** in your browser.

You should see the Notewright banner in the terminal:

```
  ┌──────────────────────────────────────────┐
  │                                          │
  │   NOTEWRIGHT is running!                 │
  │                                          │
  │   → Open: http://localhost:3000          │
  │   → API key: ✅ loaded                   │
  │                                          │
  └──────────────────────────────────────────┘
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot find module 'express'` | Run `npm install` first |
| `Port 3000 is already in use` | Use `PORT=3001 node server.js` |
| Page loads but AI says "missing API key" | Set `ANTHROPIC_API_KEY` before starting |
| `node: command not found` | Install Node.js from [nodejs.org](https://nodejs.org) |
| Page shows "Server unreachable" (red dot) | Make sure the server is running in your terminal |

## Output Types

| Button | What it generates |
|--------|-------------------|
| 📋 Summary | One-line outcome, key points, decisions, open questions |
| ✅ Actions | Action items with owner and due date |
| 📧 Email | Professional follow-up email |
| ⚖️ Decisions | Decision log table |
| 📊 Plan | Prioritised Now / Next / Later plan |
| 💼 Business | One-page business plan |
| 🔀 Workflow | Mermaid.js flowchart diagram |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate AI output (body: `{ type, transcript }`) |
| POST | `/api/projects` | Save a project |
| GET | `/api/projects/:id` | Retrieve a project |
| GET | `/api/health` | Server health check |

## Architecture

```
Browser (index.html)  →  Express server (server.js)  →  Anthropic API
                          ├── API key stays here (never in browser)
                          ├── Rate limiting (20 req/min/IP)
                          └── Input validation
```

## Security Notes

- The Anthropic API key is **never exposed to the browser** — all AI calls go through the server.
- Add real authentication (Supabase / Auth0 / Firebase / Clerk) before launching publicly.
- Tighten CORS to your domain in production.
- Swap the in-memory project store for a real database.

---

*Notewright is independent and is not affiliated with or endorsed by Flowtica.*
