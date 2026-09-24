# franciscoalencar.com

Personal portfolio for Francisco "Champs" Alencar — Creative Director, Screenwriter, Strategist.
Live at **https://www.franciscoalencar.com**.

Bilingual (EN default, PT-BR via `?lang=pt`). Fully static, aggressive performance budget.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| UI | React 19.2.4, Tailwind CSS v4 |
| Language | TypeScript 5 |
| Fonts | Unbounded (display), Geist Mono |
| Hosting | Vercel — project `champs-portfolio` |
| Analytics | Vercel Web Analytics (pageviews) |

> **Next.js 16 note:** this version carries breaking changes relative to most
> model/LLM training data. Consult `node_modules/next/dist/docs/` before writing
> Next-specific code rather than relying on recalled API shapes.

---

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build — must pass before deploying
```

If the dev server dies with a V8 OOM (a known Next 16 + Turbopack issue on this
project), restart it with a larger heap:

```bash
NODE_OPTIONS=--max-old-space-size=8192 npm run dev
```

---

## Deploy

**Deploys are CLI-driven from local disk. This repo is not connected to Vercel
for automatic git-triggered builds — and must not be.**

```bash
npx vercel deploy --prod --yes --scope=ofranciscoalencar-4350s-projects
```

The reason is the media policy below: videos are gitignored, so a build
triggered from a git checkout would ship a site with broken media. The CLI
uploads the working directory, videos included, which is what makes it correct.

---

## Media

`public/videos/` is **gitignored** — roughly 450 MB of source films and 15s
edits. Keeping them in git would bloat every clone and push two files past
GitHub's 50 MB warning threshold.

Where they actually live:

- **Production** — uploaded to Vercel static hosting on each `vercel deploy`
- **Local** — on Champs' working machine, the source of truth for deploys

A fresh clone will build and run, but brand pages and hero backgrounds will have
missing video until `public/videos/` is repopulated.

Expected layout:

```
public/videos/
├── hero.mp4                      # home background loop
├── originals/{slug}.mp4          # full films, one per Film in src/data/work.ts
├── edits-15s/{slug}.mp4          # 15s hover previews used by /branded
├── entertainment/{slug}.mp4      # IP slate backgrounds
└── ai/{slug}.mp4                 # AI project backgrounds
```

`src/data/youtube-ids.ts` maps each film slug to its public YouTube ID where one
exists — the closest thing to a recovery manifest for the originals.

---

## Structure

```
src/
├── app/                # routes: /, /ai, /branded, /branded/[brand],
│                       #         /entertainment, /meet
│                       # + sitemap.ts, icon.tsx, apple-icon.tsx,
│                       #   opengraph-image.tsx
├── components/         # IPBrowser, HoverReel, FilmBrowser, Nav, MobileMenu…
├── content/            # per-page copy dictionaries (EN + PT)
├── data/               # work.ts (films × brands), entertainment.ts,
│                       # ai-projects.ts, youtube-ids.ts
└── lib/                # contact.ts, schema.ts (JSON-LD), i18n.ts

remotion-ads/           # Remotion project for short-form social cuts
scripts/                # local tooling (analytics report) — not deployed
reports/                # generated KPI reports + raw snapshots
```

Design tokens live in `src/app/globals.css` under Tailwind v4 `@theme`:
background `#0A0A0A`, foreground `#F5F5F1`, accent `#FF2D1A`, muted `#7A7A75`,
line `#1A1A1A`.

---

## Analytics report

```bash
npm run report
```

Pulls Vercel Web Analytics, archives a raw snapshot to `reports/data/`, and
writes a human-readable KPI report to `reports/`. Requires `.env.local` with
`VERCEL_TOKEN`, `VERCEL_PROJECT_ID` and `VERCEL_TEAM_ID`.

The snapshots matter: the Vercel Hobby plan only retains a 1-month window, so
month-over-month comparison is only possible from our own accumulated archive.
