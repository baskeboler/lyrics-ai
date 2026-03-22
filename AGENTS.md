# Repository Guidelines

## Project Structure & Module Organization
Application code lives in `app/`. Route entrypoints are defined in `app/routes.ts`, with route modules in `app/routes/` such as `app/routes/home.tsx`. Shared UI for the current landing page lives in `app/welcome/`. Global styles are in `app/app.css`, and static assets belong in `public/`. Planning notes and product documentation live under `docs/`. Build output is generated into `build/` and should not be committed manually.

## Build, Test, and Development Commands
- `npm run dev`: start the React Router dev server with HMR at `http://localhost:5173`.
- `npm run build`: produce the production server and client bundles in `build/`.
- `npm run start`: serve the built app from `build/server/index.js`.
- `npm run typecheck`: regenerate React Router types and run strict TypeScript checks.
- `docker build -t lyrics-ai .`: build the production container defined in [Dockerfile](C:\Users\Admin\dev\lyrics-ai\Dockerfile).

## Coding Style & Naming Conventions
Use TypeScript with strict typing enabled. Follow the existing style: 2-space indentation, semicolons, double quotes, and small route modules that export `meta` plus a default component. Name React components in PascalCase, route files in lowercase (`home.tsx`), and keep reusable modules grouped by feature under `app/`. Prefer the `~/*` path alias for imports from `app/` when it improves clarity.

## Testing Guidelines
There is no automated test framework configured yet. Until one is added, treat `npm run typecheck` and a production build with `npm run build` as the minimum validation for every change. When adding tests, place them near the feature they cover or under a dedicated `app/__tests__/` folder, and use filenames ending in `.test.ts` or `.test.tsx`.

## Commit & Pull Request Guidelines
The current history is minimal (`initial`), so keep commit subjects short, imperative, and specific, for example `Add lyric editor route`. Keep subjects under 72 characters. Pull requests should include a concise description, the user-visible impact, any setup or migration notes, and screenshots for UI changes. Link the relevant issue or planning doc when one exists.

## Configuration & Security Tips
Do not commit secrets or local `.env` files. Review generated route types under `.react-router/` only when debugging; avoid editing generated files directly.
