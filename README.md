# kruv. — Portfolyo CMS

Production-ready rebuild of the single-file `kruv.html` prototype.
A premium, minimal portfolio CMS for a design agency.

---

## Tech stack

| Layer                | Choice                                  | Why                                                  |
| -------------------- | --------------------------------------- | ---------------------------------------------------- |
| Framework            | **Next.js 15 (App Router)** + React 19  | SSR, SEO metadata, API routes, ISR, best DX.         |
| Language             | **TypeScript** (strict)                 | Type safety across DB ↔ API ↔ UI.                    |
| Styling              | **Tailwind CSS v3** + CSS tokens        | Utility-first, but tokens carry the kruv aesthetic.  |
| Data / Auth          | **Supabase** (Postgres + Auth + RLS)    | Managed Postgres + session cookies + row-level sec.  |
| Images               | **Cloudinary** (signed uploads)         | Auto format / quality / resize; CDN delivery.        |
| Validation           | **Zod**                                 | One schema, client & server.                         |
| Lightweight state    | **Zustand** (for toasts only)           | No Redux needed.                                     |
| Deploy               | **Vercel**                              | First-class Next.js target.                          |

---

## Folder structure

```
portfolyo-cms/
├── src/
│   ├── app/                            # App Router
│   │   ├── layout.tsx                  # Root + fonts + metadata base
│   │   ├── page.tsx                    # Public homepage (portfolio grid)
│   │   ├── projects/[slug]/page.tsx    # Public project detail + SEO + JSON-LD
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── actions.ts              # Server actions: login / logout
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Sidebar + toast host
│   │   │   ├── page.tsx                # Dashboard: project list + reorder
│   │   │   ├── projects/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── SettingsForm.tsx
│   │   ├── api/
│   │   │   ├── projects/route.ts               # GET, POST
│   │   │   ├── projects/[id]/route.ts          # PATCH, DELETE
│   │   │   ├── projects/reorder/route.ts       # POST
│   │   │   ├── settings/route.ts               # PATCH
│   │   │   └── upload/sign/route.ts            # Cloudinary signed upload
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── not-found.tsx
│   │   └── globals.css                 # Design tokens + base layer
│   │
│   ├── components/
│   │   ├── public/                     # SiteHeader, FilterBar, PortfolioGrid,
│   │   │                               # PortfolioCard, ProjectDetail, Lightbox,
│   │   │                               # SiteFooter
│   │   ├── admin/                      # Sidebar, ProjectList, ProjectForm,
│   │   │                               # TagInput, SectionEditor,
│   │   │                               # CoverUpload, GalleryUpload
│   │   └── ui/                         # Field, Toast, ImagePlaceholder
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser client
│   │   │   ├── server.ts               # RSC / route handler client + admin
│   │   │   └── middleware.ts           # Session refresh + /admin gate
│   │   ├── cloudinary.ts               # Signed URL + delivery helper
│   │   ├── queries.ts                  # getProjects / getProjectBySlug / …
│   │   ├── api.ts                      # Typed fetch wrapper (client)
│   │   ├── validators.ts               # Zod schemas
│   │   ├── sanitize.ts                 # Text / URL cleaners
│   │   ├── auth-guard.ts               # requireUser() for API routes
│   │   ├── slugify.ts                  # Turkish-aware slugger
│   │   └── env.ts                      # Strict env accessor
│   │
│   ├── hooks/
│   │   └── useCloudinaryUpload.ts
│   │
│   └── types/
│       └── index.ts                    # Project, ProjectSection, SiteSettings
│
├── supabase/
│   └── schema.sql                      # Tables, triggers, RLS policies
├── scripts/
│   └── seed.ts                         # Seed prototype data into Supabase
├── middleware.ts                       # Root middleware (calls lib/supabase/middleware)
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── .env.example
└── package.json
```

---

## Setup

### 1. Install

```bash
cd portfolyo-cms
npm install
cp .env.example .env.local
```

### 2. Supabase

1. Create a project at https://supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase/schema.sql`, run.
3. **Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)
4. **Authentication → Users → Add user** — create your admin account (email + password). This replaces the old hard-coded `adminSifre`.
5. (Optional) **Authentication → Providers** → disable sign-ups if you want to be the only admin.

### 3. Cloudinary

1. Create a free account at https://cloudinary.com.
2. Dashboard → Product Environment Credentials → fill `.env.local`:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. **Settings → Upload → Upload presets → Add** — create a preset:
   - Name: `kruv_portfolio`
   - Signing mode: **Signed**
   - Folder: `kruv-portfolio`
   - Set it to `CLOUDINARY_UPLOAD_PRESET`.

### 4. Seed (optional)

Imports the three prototype projects:

```bash
npm run seed
```

### 5. Run

```bash
npm run dev
```

- Public site → http://localhost:3000
- Admin login → http://localhost:3000/login
- Admin panel → http://localhost:3000/admin

---

## Security model

| Concern            | How it's handled                                                    |
| ------------------ | ------------------------------------------------------------------- |
| Auth               | Supabase email/password. HTTP-only cookies, auto-refresh token.     |
| /admin gate        | `middleware.ts` checks `supabase.auth.getUser()` on every request.  |
| API writes         | Every POST/PATCH/DELETE calls `requireUser()` first.                |
| DB-level           | Row-Level Security: public read, authenticated write.               |
| Credentials        | Never in the client bundle. Service role key is server-only.        |
| Input validation   | Zod schemas on every API route. All text passes through sanitizer.  |
| File uploads       | Signed Cloudinary uploads (signature + timestamp), size & MIME gate |
| XSS                | All content rendered as text via JSX (React auto-escapes).          |
| SSRF               | `cleanUrl()` rejects non-http(s) protocols before persisting.       |

---

## SEO

- Per-project `generateMetadata()` → title, description, canonical, OG, Twitter.
- JSON-LD (`CreativeWork`) embedded on each detail page.
- `app/sitemap.ts` + `app/robots.ts` generated dynamically.
- `/admin` and `/api` blocked in robots and marked `noindex` via metadata.
- Next.js `<Image>` used everywhere for lazy loading, AVIF/WebP, `sizes`.

---

## Deploy to Vercel

1. Push repo to GitHub.
2. In Vercel → **Import Project** → select the repo.
3. Add all env vars from `.env.example` (including the three Supabase + four Cloudinary keys).
4. Deploy. First build produces a static shell; project pages are ISR'd with `revalidate = 60`.

---

## Roadmap (post-MVP)

- [ ] Dark mode toggle (tokens already abstracted — ~1 CSS var set away).
- [ ] Version history (new `project_revisions` table + diff viewer).
- [ ] Framer Motion micro-interactions.
- [ ] Client-side search (Fuse.js over projects).
- [ ] Multi-admin roles (user metadata `role = 'editor' | 'owner'`).
- [ ] Export/import JSON from the admin UI.
