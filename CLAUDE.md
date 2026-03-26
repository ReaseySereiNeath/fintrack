# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Nuxt dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run generate` — Static site generation
- No test runner or linter configured yet

## Architecture

**Nuxt 4 full-stack app** (Vue 3 + Vite under the hood) — a personal finance tracker called FinTrack.

### Frontend (`app/`)

**Domain-Driven Design** structure under `app/domains/`:
- Each domain (transaction, category, analytics, budget) has `components/`, `composables/`, `schemas/`, `types/`
- Only `transaction/` domain has implemented composables/components; others are scaffolded empty

**Pages** (`app/pages/`) — file-based routing:
- `/` — Dashboard with stat cards and spending chart
- `/transactions` — CRUD with search, filter, pagination
- `/analytics` — Doughnut chart + category breakdown
- `/budget` — Budget limits with progress bars

**Shared** (`app/shared/`) — cross-domain components (`AppSidebar`, `MobileNav`)

### Backend (`server/`)

**Mock REST API** using Nuxt server routes with in-memory data store (`server/data/mock.ts`). No database — all data lives in memory arrays. API contract defined in `openapi.yaml`.

Amounts are stored in **cents** (e.g., 4500 = $45.00).

### Key Patterns

- **Data fetching**: TanStack Vue Query v5 via composables (e.g., `useTransactions`, `useCategories`). Query client configured in `app/plugins/vue-query.ts` with 1-minute stale time. Mutations invalidate related queries on success.
- **Validation**: Zod schemas validate all API responses in composables. Types are inferred from schemas via `z.infer<>`.
- **Styling**: Tailwind CSS utility classes only — no custom CSS classes. Mobile-first responsive with `md:` and `lg:` breakpoints.
- **i18n**: `@nuxtjs/i18n` configured in `i18n.config.ts`, English only currently.
- **Icons**: `lucide-vue-next` for all icons.
- **Charts**: Chart.js + vue-chartjs for dashboard and analytics visualizations.

### Nuxt Config Notes

- Components auto-imported from `~/shared/components` and `~/domains`
- Modules: `@nuxtjs/tailwindcss`, `@nuxtjs/i18n`
- Devtools enabled
