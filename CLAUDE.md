# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Nuxt dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run generate` — Static site generation
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Run ESLint with auto-fix
- `npx nuxt typecheck` — Run TypeScript type checking
- No test runner configured yet (Vitest + Playwright planned)

## Architecture

**Nuxt 4 full-stack app** (Vue 3 + Vite) — a personal finance tracker called FinTrack.

### Domain-Driven Design (`app/domains/`)

Four domains, each with `components/`, `composables/`, `schemas/`, `types/` subdirs:

- **transaction** — `useTransactions()`, `useCreateTransaction()`, `useDeleteTransaction()` + `TransactionSchema`
- **category** — `useCategories()` + `CategorySchema` (cross-cutting, used by all other domains)
- **budget** — `useBudgets()`, `useUpdateBudget()` + `BudgetSchema`
- **analytics** — `useExpensesByCategory()` (fetches all transactions for client-side grouping)

Domain composables own their TanStack Query hooks and mutation logic. Pages should consume composables, not define inline queries/mutations.

### Backend (`server/`)

**Mock REST API** with in-memory data (`server/data/mock.ts`). No database yet — all 11 endpoints use arrays. API contract defined in `openapi.yaml`.

- `server/utils/validateBody.ts` — Zod validation wrapper for all POST/PUT routes. Uses `schema.safeParse()` + `createError()` on failure.
- Budget `spent` values are computed dynamically from transactions in `server/api/budgets/index.get.ts`, not stored statically.

### Key Patterns

- **Currency**: All amounts stored as **cents** (integers). Use `formatCurrency(cents)` from `app/shared/utils/format.ts` for display.
- **Data fetching**: TanStack Vue Query v5 composables. Stale time: 1 minute. Mutations use `queryClient.invalidateQueries()` (refetch-on-success, not optimistic updates).
- **Validation**: Zod schemas validate API responses in composables and request bodies on the server. Types inferred via `z.infer<>`.
- **Error handling**: Global `onError` handlers on both `QueryCache` and `MutationCache` in `app/plugins/vue-query.ts`. Toast notifications via `app/shared/composables/useToast.ts`.
- **Styling**: Tailwind CSS utility classes only. Mobile-first with `md:` and `lg:` breakpoints.
- **$fetch type depth**: When using `$fetch` inside `useMutation`, add explicit `Promise<void>` return type to avoid TypeScript "excessive stack depth" errors (Nuxt route type inference issue).

### Shared Utilities

- `app/shared/utils/format.ts` — `formatCurrency()`, `formatDate()`
- `app/shared/composables/useToast.ts` — reactive toast notification system
- `app/shared/components/ToastContainer.vue` — rendered in `app.vue`

### Nuxt Config

- Components auto-imported from `~/shared/components` and `~/domains`
- Modules: `@nuxtjs/tailwindcss`, `@nuxtjs/i18n`, `@nuxt/eslint`
- `runtimeConfig.public.apiBase` configured (override via `NUXT_PUBLIC_API_BASE` env var)
- ESLint ignores `figma-export/` directory
