# 🔒 Lock-in

> A minimalist deep focus productivity tracker built with Next.js + SQLite.

---

## What is Lock-in?

Lock-in answers one simple question: **how much time did you actually spend focused today?**

You start a chrono when you begin working. Every time you stop — check your phone, get distracted, take a break — you hit Pause. The chrono only counts the time you were really in it.

---

## Learning Context

This is a rebuild project. The original version was built with **Spring Boot + React**.

This version is rebuilt using a pure JavaScript/TypeScript stack to learn:
- Next.js fullstack (App Router + API Routes)
- Plain SQLite without an ORM
- React state management for real-time chrono tracking

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | Fullstack — frontend + API routes |
| Language | TypeScript | Type-safe throughout |
| Database | SQLite (plain) | No ORM — raw SQL with `better-sqlite3` |
| Styling | Tailwind CSS | Utility-first styling |

---

## Data Model

### Users
```sql
id, name, email, password_hash, created_at
```

### Projects
```sql
id, name, user_id, created_at
```
A project groups chronos under a theme (e.g. "Thesis", "Work", "Side project").

### Chronos
```sql
id, user_id, project_id, status, total_focus_time, stopped_at, created_at
```
- `status` can be `running`, `paused`, or `stopped`
- `total_focus_time` is stored in seconds
- `project_id` is optional — a chrono can exist without a project
- `stopped_at` is `NULL` while the chrono is active

---

## API Routes

### Auth
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and return user data |

### Projects
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/projects` | List all projects |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/[id]` | Get a single project |
| `PATCH` | `/api/projects/[id]` | Rename a project |
| `DELETE` | `/api/projects/[id]` | Delete a project |

### Chronos
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/chronos` | List all chronos |
| `POST` | `/api/chronos` | Start a new chrono |
| `GET` | `/api/chronos/[id]` | Get a single chrono |
| `PATCH` | `/api/chronos/[id]` | Pause / Resume / Stop a chrono |
| `DELETE` | `/api/chronos/[id]` | Delete a stopped chrono |

> ⚠️ `USER_ID` is currently hardcoded to `1` in all API routes. JWT auth is planned for a future iteration.

---

## Folder Structure

```
lock-in/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   └── login/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── chronos/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── projects/
│   │   └── page.tsx
│   ├── chronos/
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx              ← Dashboard
├── components/
│   ├── ChronoTimer.tsx
│   ├── ChronoCard.tsx
│   └── ProjectCard.tsx
├── lib/
│   ├── db.ts                 ← SQLite connection
│   └── migrate.ts            ← Raw SQL migrations
├── database.sqlite           ← Auto-generated, gitignored
└── package.json
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the database migration
```bash
npm run migrate
```

### 3. Create a user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","email":"you@example.com","password":"secret123"}'
```

### 4. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/` | Active chrono with live timer |
| Projects | `/projects` | Create, rename, delete projects |
| History | `/chronos` | All completed chronos + total focus time |

---

## Known Limitations

- `USER_ID` is hardcoded to `1` — no real authentication yet
- No frontend error handling — API failures are silent
- No loading states on buttons — actions can be triggered multiple times

---

## What's Next

- [ ] JWT authentication — replace hardcoded `USER_ID`
- [ ] Loading states & error handling on the frontend
- [ ] Filter chrono history by project
- [ ] Daily / weekly focus time stats
- [ ] Package as a desktop app with Tauri
- [ ] Rebuild frontend as a mobile app with React Native
