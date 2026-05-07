# PMI Study Assistant — Research Prototype

An AI-powered PMP exam prep tutor built with React + Vite and an Express proxy.  
**Not an official PMI product.**

---

## Local Development

### 1. Clone / navigate to the project

```bash
cd pmi-study-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set your Anthropic API key

Copy `.env.example` to `.env` and fill in your key:

```bash
cp .env.example .env
```

Then edit `.env`:

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxx
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

### 4. Run the dev server

```bash
npm run dev
```

This starts:
- Express proxy on **http://localhost:3001**
- Vite dev server on **http://localhost:5173**

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Yes | Anthropic API key (used server-side only — never sent to the browser) |

> **Security note:** The `VITE_` prefix is required by Vite's env loading, but the key is only read inside `server/index.js` and `api/chat.js` — it is never bundled into the frontend JS.

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create pmi-study-agent --public --push
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Vite** (auto-detected from `vercel.json`)
4. Build command: `npm run build`  
5. Output directory: `dist`

### 3. Add environment variable

In the Vercel project settings → **Environment Variables**, add:

| Name | Value |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-xxxxxxxxxxxxxxxxx` |

Set it for **Production**, **Preview**, and **Development** environments.

### 4. Deploy

Click **Deploy**. Vercel will:
- Build the React app with `npm run build`
- Serve the `dist/` folder as the frontend
- Expose `api/chat.js` as a serverless function at `/api/chat`

### How the Vercel routing works

Vite's proxy (`/api → localhost:3001`) only runs locally. On Vercel, any request to `/api/chat` is automatically routed to `api/chat.js` — a serverless function that calls Anthropic server-side. The API key stays secure.

---

## Project Structure

```
pmi-study-agent/
├── api/
│   └── chat.js              # Vercel serverless function (production)
├── server/
│   └── index.js             # Express proxy (local dev)
├── src/
│   ├── components/
│   │   ├── ChatMessage.jsx
│   │   ├── Flashcard.jsx
│   │   ├── FollowUpChips.jsx
│   │   ├── Header.jsx
│   │   ├── MessageInput.jsx
│   │   ├── PracticeQuestion.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StarterCards.jsx
│   │   └── TypingIndicator.jsx
│   ├── hooks/
│   │   └── useSessionTimer.js
│   ├── utils/
│   │   └── parseResponse.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## Features

- **Practice questions** — Rendered as interactive A/B/C/D buttons with green/red feedback and explanation reveal
- **Flashcards** — Flippable cards with pagination, generated for any PMBOK topic
- **PMBOK explanations** — Deep concept breakdowns from the 7th edition
- **Study plans** — Personalized roadmaps based on timeline and weak areas
- **Exam structure** — ECO domains, question format, and scoring
- **Follow-up chips** — Context-aware suggestion buttons after each response
- **Session timer** — Tracks time spent per study session
- **Mode detection** — Sidebar shows current study mode based on conversation
