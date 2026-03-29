# Repository Guidelines

## Project Structure & Module Organization
The app is a Vite + React + TypeScript frontend. Source code lives in `src/`: page-level composition starts in `src/App.tsx`, reusable UI sits in `src/components/` and `src/components/ui/`, Zustand slices live in `src/store/`, blockchain helpers are in `src/utils/` and `src/lib/`, and static assets are split between `src/assets/` and `public/`.

## Build, Test, and Development Commands
- `npm install`: install dependencies; use Node `>=18`.
- `npm run dev`: start the local Vite dev server with hot reload.
- `npm run build`: run TypeScript project build, then create a production bundle in `dist/`.
- `npm run preview`: serve the built bundle locally for a production-like check.
- `npm run lint`: run ESLint on `ts` and `tsx` files; treat warnings as work to fix before review.

## Coding Style & Naming Conventions
Use TypeScript with 2-space indentation, semicolons, and single quotes, matching the existing codebase. Name React components and store providers in PascalCase (`BlockchainVisualization.tsx`), hooks with a `use` prefix (`useBlockchainStore.ts`), and helpers or slice files in camelCase with clear suffixes such as `*Slice.ts`. Keep Tailwind utility usage close to JSX, and prefer small, focused components over adding more logic to `App.tsx`.

## Testing Guidelines
There is no automated test runner configured yet. Until one is added, every change should pass `npm run lint` and `npm run build` as the minimum verification gate. For behavior changes, manually exercise the affected flow in `npm run dev` and document what you checked in the PR, for example wallet creation, transaction submission, or mining state updates.

## Commit & Pull Request Guidelines
Recent history uses Conventional Commit prefixes such as `feat:`, `fix:`, `refactor:`, `chore:`, and `ci:`. Keep subjects short and imperative, for example `fix: improve responsive layout`. PRs should include a concise summary, linked issue or task when available, verification notes, and screenshots or short recordings for UI changes.

## Architecture Notes
State is centered in Zustand slices under `src/store/`, while visualization and interaction components consume that state. When adding features, prefer extending the relevant slice or utility module first, then keep rendering concerns inside components.
