# Marketing Content Generator

Frontend-only prototype for the SWE tech test. The app lets a user fill product details, simulate poster generation, preview a beach-themed marketing poster, and browse mock previous generations.

## Current Scope

- Next.js App Router
- React with TypeScript
- Tailwind CSS
- shadcn/ui components and blocks
- Client-side mock auth screens
- Client-side mock poster generation
- No backend, API, database, JWT, or file generation yet

## Routes

```txt
/           redirects to /dashboard
/login      mock login screen
/register   mock registration screen
/dashboard  poster generator workspace
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run build
```

## Technical Decisions

- The dashboard uses shadcn's `sidebar-07` block as the base layout.
- The login and register screens use shadcn's `login-03` block as the base layout.
- Poster generation is simulated with `setTimeout` so the frontend has the same loading/status behavior the backend will provide later.
- Generated poster history is local React state for now. It will later come from PostgreSQL through the Express API.
- The beach poster template is a project-local PNG asset in `public/beach-poster-template.png`, with product text overlaid in React.

## Known Limitations

- Auth is not real yet.
- Poster records are not persisted after refresh.
- Export/download is intentionally disabled until backend image generation is added.
- Poster text layout is frontend-only and will need to be matched by the backend `sharp` renderer later.

## Later Backend Phase

The backend will be built from zero as a learning exercise, starting with `server.ts`, then Express middleware, routes, validation, auth cookies, PostgreSQL queries, and image generation.

## AI Tools Used

Codex was used to inspect the tech test PDF and PRD, scaffold the frontend, generate a project-local beach poster template asset, and implement the frontend prototype.
