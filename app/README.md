# Notewright — App

A learning + workflow app that turns conversations into action. It is **not** connected to the AI pen — you record and transcribe in the Flowtica app, paste the transcript into Notewright, and it compiles everything into summaries, action plans, follow-up emails, decision logs, a workflow chart, and a branded PowerPoint.

> **Working concept.** The Notewright name is not yet trademark-cleared and there's no registered entity. Treat this as a prototype to build on — not for public launch until clearance, real auth, and a deployed backend are in place. Independent; not affiliated with or endorsed by Flowtica.

## What's in the box

- `index.html` — the full app: 8 learning modules, the **Workspace** (paste → AI drafts), PowerPoint export, prompt/template library, and a prototype sign-in.
- `server.js` — backend starter: an Anthropic proxy (keeps your API key off the browser) and the Notewright API for other tools.
- `README.md` — this file.

## The 8 modules
1. Getting Started · 2. Meeting Productivity · 3. Turning Notes Into Action · 4. Business Communication · 5. Fast Data Management · 6. Company Workflows · 7. Templates & AI Prompts · 8. Privacy, Consent & Professional Use.

## How it actually works (read this)

**The AI drafting.** Inside the Claude preview of this app, the Workspace calls Claude directly and works out of the box — paste a transcript and try it. On your **own hosted site** that direct call won't be authenticated, so you route it through `server.js`:

1. Deploy `server.js` with your `ANTHROPIC_API_KEY` set as an environment variable (Render, Railway, Fly.io, or a serverless function all work).
2. In `index.html`, change `callClaude()` to POST `{ type, transcript }` to `https://your-api.com/api/generate` and read `data.text`.
3. The key lives **only on the server** — never paste it into the HTML.

**Authentication.** The sign-in screen is a **prototype gate only** — it does not store, send, or secure passwords. Before real users:
- Add a provider: **Supabase Auth**, **Auth0**, **Firebase Auth**, or **Clerk**.
- Gate the app and every `/api/*` route behind it; verify the user server-side.
- Don't hand-roll password storage.

**The API.** A static page can't *be* an API — `server.js` is. Once deployed it exposes:
- `POST /api/generate` `{ type, transcript }` → AI draft
- `POST /api/projects` → save a compiled project, returns `{ id }`
- `GET /api/projects/:id` → fetch a project as JSON
Swap the in-memory `Map` for a real database (Postgres/Supabase) for persistence.

**Data & persistence.** The app keeps data in the browser session only (no browser storage is used), so it clears on refresh. Use **Export all (JSON)** / **Copy** to move data out, or add the backend + database for persistence.

## Run the backend locally
```bash
npm init -y
npm install express cors
ANTHROPIC_API_KEY=sk-ant-xxxxx node server.js
# Notewright API on http://localhost:3000
```

## Branding
The header mark is the v5 faceted-nib + circuitry logo (inline SVG). Swap colours/marks in the `nibSVG()` function and the `:root` CSS variables.

## Honest limitations (so nothing surprises you)
- **Tasklet did not build this** — Tasklet automates browser tasks; a custom app like this is written as code (here) and hosted by you.
- AI features need either the Claude preview or your deployed backend + key.
- Sign-in is a prototype; wire a real auth provider before launch.
- No real persistence until you connect a database.
- PowerPoint and JSON export run in the browser and download locally.

## Suggested next steps
1. Try the Workspace in the Claude preview with a real transcript.
2. Deploy `server.js`, set the key, and repoint `callClaude()`.
3. Add an auth provider and a database.
4. Once the name clears: trademark it, add the final logo, and connect your domain.
