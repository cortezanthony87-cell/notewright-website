# Notewright App

AI-powered meeting intelligence — transform transcripts into summaries, action items, emails, decision logs, plans, business plans, and workflow diagrams.

## Quick Start

```bash
npm install
ANTHROPIC_API_KEY=sk-ant-... node server.js
```

Then open http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate AI output from transcript |
| POST | `/api/projects` | Save a project |
| GET | `/api/projects/:id` | Retrieve a project |
| GET | `/api/health` | Server health check |

## Generate Types

- `summary` — Meeting summary with outcome, key points, decisions, open questions
- `actions` — Action items with owner and due date
- `email` — Professional follow-up email
- `decisions` — Decision log table
- `plan` — Prioritised Now/Next/Later plan
- `business` — One-page business plan
- `workflow` — Mermaid flowchart diagram

## Environment Variables

- `ANTHROPIC_API_KEY` (required) — Your Anthropic API key
- `PORT` (optional, default: 3000) — Server port

## Security Notes

- API key is proxied server-side, never exposed to the browser
- Rate limited: 20 requests/minute per IP
- Add real authentication (Supabase/Auth0/Firebase/Clerk) before production launch
- Tighten CORS to your domain before production

---
*Notewright is independent and is not affiliated with or endorsed by Flowtica.*
