# Mayan School

**খেলতে খেলতে শেখা · Organized by Bugsfree Studio**

Repository: https://github.com/bugsfreeweb/MayanSchool

A Bengali-first learning platform for ages 4–10, built with Next.js App Router and Drizzle ORM. PostgreSQL powers the local preview; configuring Turso switches the same application to the Turso/libSQL backend.

## Learning experiences

- 20 playable games across **Bangla, Mathematics, English, Science, and Creative Skills**.
- Eight Bangla games: first vowels, remaining vowels, consonants, picture–letter recognition, words, vowel signs, sentences, and rhymes.
- 11 vowel and 39 consonant flashcards, example words, and an optional browser-native Bengali voice. Voice is offered only when the device has a Bengali voice installed.
- A finger/mouse writing pad for letter tracing. This is ungraded practice; drawings are not stored or analyzed.
- Chapter-based learning paths for all five subjects, teaching cards before practice, and persistent mastery after scoring at least 60% in a quiz.
- Gentle feedback, answer review, stars, achievements, bookmarks, daily goals, and learning history.
- A compact four-link sidebar, persistent collapse/expand preference, mobile focus handling, and a motion toggle. CSS also honors `prefers-reduced-motion`; animations are brief rather than continuously distracting.
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

## Admin panel

Open `/admin` to upload, edit, publish/unpublish, or delete uploaded games. Without an admin password, only the non-Vercel local preview exposes an explicitly labeled demo entry. On Vercel, admin access fails closed until `ADMIN_PASSWORD` is configured.

Uploads support a standalone HTML file or a ZIP with an `index.html`/`index.htm` entry, including in a nested directory. All assets must be bundled locally, with relative references.

- Game file: up to **3 MB** compressed.
- Optional PNG/JPG/WebP cover: up to **1 MB**.
- ZIP: up to 300 entries, 20 MB expanded total, 3 MB per entry.
- These limits keep requests and individual responses below Vercel's 4.5 MB function limit.
- Files persist in the database, not in the web server's filesystem.
- Games run in an iframe without same-origin privileges, with a sandbox and restrictive content-security policy. External network calls and forms are blocked.
- Review all uploaded content for child suitability and copyright permission before publication. Sandboxing does not certify educational content.
- A sample game is available at `/sample-game.html`.

## Privacy and settings

Learners are recognized by an HTTP-only cookie. No email, phone number, chat, advertising, or tracking integration is required. Clearing this cookie loses access to that browser's profile. Legacy preview learner cookies are recognized for continuity. Motion and sidebar preferences use browser local storage; they do not contain personal data.

## Validation

Run `npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, and `npm run build` before deploying. Browser tests use Playwright Chromium and expect a running local preview. See `tests/mayan-school.mjs` for Bangla quizzes, lesson mastery, answer review, tracing, collapse persistence, motion preferences, mobile layouts, and upload regression checks.
