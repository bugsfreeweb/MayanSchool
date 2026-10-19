# Mayan School

**খেলতে খেলতে শেখা · Organized by Bugsfree Studio**

Repository: https://github.com/bugsfreeweb/MayanSchool

A Bengali-first learning platform for ages 3–8, built with Next.js App Router and Drizzle ORM. PostgreSQL powers the local preview; configuring Turso switches the same application to the Turso/libSQL backend (also used for Cloudflare Workers).

## Learning experiences

- 25 playable games across **six subjects: বাংলা (Bangla), গণিত (Math), English, বিজ্ঞান (Science), সৃজনশীল (Creative Skills), and সাধারণ জ্ঞান (General Knowledge)**.
- Eight Bangla games: first vowels, remaining vowels, consonants, picture–letter recognition, words, vowel signs, sentences, and rhymes.
- 11 vowel and 39 consonant flashcards, example words, and an optional browser-native Bengali voice. Voice is offered only when the device has a Bengali voice installed.
- A finger/mouse writing pad for letter tracing. This is ungraded practice; drawings are not stored or analyzed.
- Chapter-based learning paths for all six subjects, teaching cards before practice, and persistent mastery after scoring at least 60% in a quiz.
- A **কবিতা (poems)** and **গল্প (stories)** library with read-aloud support and line-by-line playback.
- Gentle feedback, answer review, stars, achievements, bookmarks, daily goals, and learning history.
- A sidebar navigation for হোম, শেখা, গেম, কবিতা, গল্প, অগ্রগতি, পুরস্কার, and সেটিংস, with a persistent collapse/expand preference, mobile focus handling, and a motion toggle. The অ্যাডমিন link appears only for signed-in admins.
- Four themes (**Light, Dark, Kids, Contrast**) via a pre-paint theme switcher, plus a global voice/audio toggle and a dedicated settings page.
- Custom Mayan School book-and-sun logo, Bengali fonts served locally, and original graphics.

## Development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and configure the local PostgreSQL connection.
3. After PostgreSQL is running, apply the schema with `npx drizzle-kit push`.
4. Start development with `npm run dev`.

The canonical PostgreSQL schema is `src/db/schema.ts`. Database interactions use parameterized Drizzle SQL through `src/db/index.ts` and `src/db/repository.ts`. The Turso migration creates equivalent SQLite tables without changing application behavior. Existing game metadata is never overwritten by library seeding.

## Deploy from GitHub to Vercel with Turso

1. Push this project to **bugsfreeweb/MayanSchool**. Do not commit `.env`, databases, or tokens.
2. Create a Turso database and obtain its URL and auth token.
3. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in your local shell; apply `node scripts/turso-migrate.mjs` once to that database. The migration is idempotent and does not drop existing data.
4. Import the GitHub repository into Vercel, using the Next.js framework preset and the default `npm run build` command.
5. Add `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, a strong `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` to Vercel's server environment settings. None should have a `NEXT_PUBLIC_` prefix.
6. Deploy. The health endpoint is `/api/health`. The 20-game library is seeded on the first library request.

The source is prepared for deployment, but no GitHub push, Vercel deployment, or remote Turso provisioning is performed automatically. A local `file:` libSQL URL may be used for integration tests; **do not use a local database file on Vercel**, whose filesystem is ephemeral/read-only.

## Deploy to Cloudflare Workers (SSR)

Cloudflare hosting uses the `@opennextjs/cloudflare` adapter for server-side rendering, so API routes and database access remain intact.

1. Create a Turso database and set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` (PostgreSQL is not reachable from the Workers runtime). Apply `node scripts/turso-migrate.mjs` once.
2. Configure `wrangler.jsonc` (already present) and set secrets with `npx wrangler secret put TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
3. Preview locally with `npm run preview`, which builds through OpenNext and serves the Worker runtime.
4. Deploy with `npm run deploy`. Cloudflare's Git integration can also build and deploy on each merge.

The adapter bundle uses symbolic links, so a Windows local build requires Developer Mode (or an elevated shell); Cloudflare's Linux CI builds without this limitation.

## Admin panel

Open `/admin` to upload, edit, publish/unpublish, or delete uploaded games. Without an admin password, only the non-Vercel local preview exposes an explicitly labeled demo entry. On Vercel, admin access fails closed until `ADMIN_PASSWORD` is configured.

Uploads support a standalone HTML file or a ZIP with an `index.html`/`index.htm` entry, including in a nested directory. All assets must be bundled locally, with relative references.

- Game file: up to **3 MB** compressed.
- Optional PNG/JPG/WebP cover: up to **1 MB**.
- ZIP: up to 300 entries, 20 MB expanded total, 3 MB per entry.
- These limits keep requests and individual responses below the serverless (Vercel/Workers) request limits.
- Files persist in the database, not in the web server's filesystem.
- Games run in an iframe without same-origin privileges, with a sandbox and restrictive content-security policy. External network calls and forms are blocked.
- Review all uploaded content for child suitability and copyright permission before publication. Sandboxing does not certify educational content.
- A sample game is available at `/sample-game.html`.

## Privacy and settings

Learners are recognized by an HTTP-only cookie. No email, phone number, chat, advertising, or tracking integration is required. Clearing this cookie loses access to that browser's profile. Legacy preview learner cookies are recognized for continuity. Theme, motion, sidebar, and voice preferences use browser local storage; they do not contain personal data.

## Validation

Run `npm run typecheck`, `npm run lint`, and `npm run build` before deploying. Browser tests use Playwright Chromium and expect a running local preview. See `tests/mayan-school.mjs` for Bangla quizzes, lesson mastery, answer review, tracing, collapse persistence, motion preferences, mobile layouts, and upload regression checks.
