# KIDA — Kibabiians Development Association

Official alumni association website and management platform for Kibabii High School, Kenya.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui (Base UI primitives) + Framer Motion
- Supabase (Postgres, Auth, Storage) — all tables prefixed `kida_`
- React Hook Form + Zod, TanStack Query/Table

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in your Supabase project credentials.

## Database

Migrations live in `supabase/migrations/`, applied in order. Push to the remote project with:

```bash
supabase db push --db-url "<connection-string>"
```

Seed demo content (optional, safe to re-run) with `supabase/seed.sql`.

After schema changes, regenerate types:

```bash
npx supabase gen types typescript --project-id <project-ref> > src/lib/supabase/types.ts
```

## Project Structure

- `src/app/(public)` — public marketing site (home, about, news, events, ...)
- `src/app/admin` — staff-only CMS/admin dashboard (role-gated)
- `src/app/actions` — Server Actions (forms, auth, admin writes)
- `src/lib/supabase` — browser/server/admin Supabase clients
- `src/lib/data` — server-side data fetchers with graceful fallbacks
- `src/components/site`, `home`, `admin`, `auth`, `ui` — component library

## Notes

- This Next.js version has breaking changes vs. older releases (e.g. `proxy.ts` instead of
  `middleware.ts`, Base UI's `render` prop instead of Radix's `asChild`) — see `AGENTS.md`.
- Brand colors, fonts, and content are all CMS-driven via `kida_settings`; nothing is hardcoded.
