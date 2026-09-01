# Marketing Content Generator

Marketing Content Generator is a small production-ready MVP for creating and reviewing campaign poster records. It includes a Next.js frontend, an Express API, PostgreSQL persistence, cookie-based auth, and a simulated async poster generation flow.

The core workflow is complete end to end: users can register, log in, create a poster, see it move from `processing` to `completed`, view poster history, open poster details, and log out.

## How To Run The Application

Prerequisites:

- Node.js and npm
- Docker Desktop

Install dependencies:

```bash
npm install
```

Start PostgreSQL:

```bash
docker compose up -d
```

Create the API environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

Apply the database schema:

```bash
docker exec -i marketing-content-generator-db psql -U marketing_user -d marketing_content_generator < apps/api/src/schema.sql
```

Start the app:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

The API runs on:

```txt
http://localhost:4000
```

## Technical Decisions

- The project uses a monorepo structure with `apps/web` for the frontend and `apps/api` for the backend.
- Next.js is used for the frontend application and routing.
  (I could build the same UI with React + Vite, but Next.js gives more application structure for a full-stack style product.)
- Express is used for the API as per the Tech Stack requirements.
- PostgreSQL is used to persist users and poster records, with UUID primary keys and a foreign key from `posters.user_id` to `users.id` so poster ownership is known.
- Docker Compose is used to make the local database setup reproducible.
- Authentication uses JWTs stored in an httpOnly cookie so the token is not accessed directly from frontend JavaScript.
- Axios is used as the frontend HTTP client with a shared API instance, so API calls can consistently use the same base URL, JSON headers, and cookie credentials (see export const api in apps\web\src\lib\api.ts)
- React Query is used for API/server state so loading, error, caching, invalidation, and polling behavior do not need to be managed manually with separate state variables.
- React Hook Form and Zod are used for frontend form validation with per-field messages.
- Poster generation is simulated by saving a poster as `processing`, then updating it to `completed` after a short backend delay.
- Frontend routes are protected through a shared workspace shell so auth checks are centralized. (see apps\web\src\components\workspace\workspace-shell.tsx)
- The poster preview uses a fixed local template asset with form data overlaid in React.

## Known Limitations

- Poster generation is simulated and does not call a real AI or image generation service.
- The poster shown in the UI is a frontend-rendered preview using a fixed template asset, not a generated image file stored by the backend, although the db has prepared a `image_path` column.
- The simulated background processing uses a manual setTimeout, see completePosterAfterDelay in apps\api\src\routes\posters.ts
- Backend request validation is currently manual instead of schema-driven.
- Download/export functionality is intentionally not implemented yet.
- Automated tests are not included in this exercise submission.
- Production deployment, CI are outside the current scope as per the submission guide in the test.

## What I Would Improve With More Time

- Replace the in-process timer with a durable queue and worker, such as Redis and BullMQ.
- Move database access from raw `pg` queries to Prisma for clearer schema modeling, more readable queries and less manual mapping.
- Integrate a real AI generation API. For an MVP, I would likely start with Cloudflare Workers AI because it has a generous free tier
  (including a completely free model -> stable-diffusion-xl-lightning -> https://developers.cloudflare.com/workers-ai/models/stable-diffusion-xl-lightning/) and would be practical for early testing.
- Once real AI generation is implemented, I would evaluate whether generation metadata should live in PostgreSQL as `JSONB` or in a document database such as MongoDB, depending on how flexible and query-heavy that metadata becomes.
- Store generated poster images in object storage (possibly using AWS S3 / Cloudflare R2), while keeping only the `image_path` reference in PostgreSQL.
- Implement real poster export/download.
- Add dashboard metrics for created posters and generation outcomes.
- Add CI checks for typechecking, linting, and builds.
- Integrate Codex into the GitHub PR workflow so pull requests can be automatically reviewed for issues before merging.

## AI Tools Used

I used Codex as a pair-programming assistant to discuss architecture, debug issues, explain tradeoffs, and iterate on implementation details. I reviewed the suggestions, made project-specific decisions, and tested the app locally with Docker Desktop, Postman, DBeaver, and the browser (especially the network tab).

For example, during the frontend auth work, I initially checked auth in several route components. After discussing the tradeoff, I extracted the `/auth/me` call into a reusable `useCurrentUser` hook and used it inside the shared `WorkspaceShell`. The hook uses React Query with a stable `["currentUser"]` query key, so the authenticated user is cached and reused across client-side route transitions. This centralized workspace route protection while avoiding repeated auth logic in every page.
