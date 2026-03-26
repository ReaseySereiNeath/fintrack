# FinTrack — Implementation Plan

## Overview

FinTrack is a personal finance tracker built with **Nuxt 4** (Vue 3 + Vite), **TanStack Vue Query v5**, **Zod**, and **Tailwind CSS**. The project follows a **Domain-Driven Design (DDD)** architecture with four core domains: transactions, categories, analytics, and budgets. It uses an OpenAPI-first contract approach and supports internationalization via `@nuxtjs/i18n`.

---

## Current Status

### Completed (Phase 1)

- [x] Nuxt 4 project scaffolded with `app/` directory structure
- [x] Core dependencies installed and configured (TanStack Query, Zod, Tailwind, i18n, Chart.js)
- [x] DDD folder structure created (`app/domains/`, `server/api/`)
- [x] OpenAPI spec written (`openapi.yaml`) as the API contract
- [x] All 11 mock API routes implemented (`server/api/`) with in-memory data store (`server/data/mock.ts`)
- [x] Dashboard page — stat cards, 7-day spending trend chart, recent transactions
- [x] Transactions page — CRUD, search, category filter, pagination, mobile card view
- [x] Analytics page — doughnut chart, category breakdown with percentages
- [x] Budget page — budget cards with progress bars, inline edit, upsert mutation
- [x] Shared layout components (`AppSidebar`, `MobileNav`)
- [x] TanStack Vue Query plugin with 1-minute stale time

### Technical Debt (from Phase 1)

- **DDD violations**: 3 of 4 domains (`analytics/`, `budget/`, `category/`) are empty scaffolds. All composables, mutations, schemas, and formatting logic live inline in page files.
- **No error handling**: No global error handler, no server-side validation, no toast notifications. Zod `.parse()` throws unhandled on unexpected API shapes.
- **Duplicated utilities**: `formatCurrency()` and `formatDate()` are copy-pasted in 4 page files.
- **Budget `spent` is static**: Hardcoded values in `mock.ts` that never update when transactions change.
- **Category domain misplaced**: `useCategories.ts` and `category.ts` schema live in the `transaction` domain.
- **No runtime configuration**: No `runtimeConfig`, no `.env` support.

---

## Core Architecture Decisions

1. **Domain-Driven Design (DDD)**: Code co-located by feature in `app/domains/<domain>/` with its own components, composables, schemas, and types.
2. **API-First with OpenAPI**: `openapi.yaml` serves as the contract. Frontend uses TanStack Query hooks typed by Zod schemas that reflect this contract.
3. **Cent/Integer storage for currency**: All monetary values are integers (cents) to prevent floating-point errors.
4. **Refetch-on-success**: Mutations invalidate related queries via `queryClient.invalidateQueries()` — simple and reliable for a single-user app.
5. **i18n scaffolded**: `@nuxtjs/i18n` configured with English only. Ready for additional locales when needed.

---

## Phase 2: DDD Refactor & Code Quality

**Goal:** Align the codebase with its own DDD architecture. Extract all inline logic into proper domain modules.

### 2.1 Fix Bugs

- Remove broken `defineI18nConfig` redefinition in `i18n.config.ts` (lines 28-31)

### 2.2 Extract Shared Utilities

- Create `app/shared/utils/format.ts`:
  - `formatCurrency(cents: number): string`
  - `formatDate(iso: string): string`
- Replace all inline `fmt()` / `fmtAmount()` / `fmtDate()` in pages

### 2.3 Move Category Domain

- Move `app/domains/transaction/composables/useCategories.ts` → `app/domains/category/composables/useCategories.ts`
- Move `app/domains/transaction/schemas/category.ts` → `app/domains/category/schemas/category.ts`
- Update imports in pages that reference them

### 2.4 Extract Domain Composables

Extract mutations and queries from page files into proper domain composables:

| Domain | Composable | Source Page |
|--------|-----------|-------------|
| `transaction` | `useCreateTransaction()` | `transactions.vue` |
| `transaction` | `useDeleteTransaction()` | `transactions.vue` |
| `budget` | `useBudgets()` | `budget.vue` |
| `budget` | `useUpdateBudget()` | `budget.vue` |
| `budget` | `schemas/budget.ts` | `budget.vue` (inline `BudgetSchema`) |
| `analytics` | `useExpensesByCategory()` | `analytics.vue` |
| `analytics` | `useMonthlyAnalytics()` | `index.vue` |

### 2.5 Extract Domain Components

Extract large template sections from pages into domain components:

| Domain | Component | Source |
|--------|-----------|--------|
| `transaction` | `TransactionForm.vue` | `transactions.vue` (add form modal) |
| `transaction` | `TransactionFilters.vue` | `transactions.vue` (search + category filter) |
| `budget` | `BudgetCard.vue` | `budget.vue` (card with progress bar) |
| `analytics` | `SpendingPieChart.vue` | `analytics.vue` (doughnut chart) |
| `analytics` | `CategoryBreakdown.vue` | `analytics.vue` (category list) |

### 2.6 Shared Components (only if 3+ reuses confirmed)

- `StatCard.vue` — used on dashboard and potentially budget page
- `FormField.vue` — if forms across transaction and budget share the same pattern

---

## Phase 3: Error Handling & Validation

**Goal:** Make the app resilient to bad data and give users clear feedback.

### 3.1 Global Error Handler

- Add `queryCache` config with `onError` callback in `app/plugins/vue-query.ts`
- Create `app/shared/composables/useToast.ts` for toast notifications

### 3.2 Server-Side Validation

- Create `server/utils/validateBody.ts` — wraps Zod parsing with `createError()` on failure
- Apply to all POST/PUT routes in `server/api/`

### 3.3 Client-Side Form Validation

- Validate forms with Zod schemas (e.g., `CreateTransactionSchema`) before calling mutations
- Display field-level error messages

### 3.4 Fix Budget Spent Computation

- In `server/api/budgets/index.get.ts`, compute `spent` dynamically by summing transactions for each budget's `categoryId` and period
- Remove static `spent` values from `server/data/mock.ts`

---

## Phase 4: Configuration & Developer Experience

### 4.1 Runtime Configuration

- Add `runtimeConfig` block to `nuxt.config.ts` with `public.apiBase`
- Create `.env.example` documenting expected variables

### 4.2 Linting

- Add `@nuxt/eslint` module
- Add lint script to `package.json`

---

## Phase 5: Database & Authentication

**Goal:** Graduate from `server/data/mock.ts` to persistent storage while maintaining the OpenAPI contract.

### 5.1 Database & ORM

- Set up PostgreSQL
- Install and configure Drizzle ORM (or Prisma)
- Map existing Zod schemas to database schemas

### 5.2 Authentication

- Implement auth (Nuxt Auth Utils or JWT)
- Add `userId` to all tables for tenant boundaries
- Add auth middleware for protected routes

### 5.3 Endpoint Migration

- Refactor all 11 mock endpoints to execute real DB queries
- Maintain server-side Zod validation from Phase 3

---

## Phase 6: Testing & CI/CD

### 6.1 Testing

| Layer | Tool | Target |
|-------|------|--------|
| **Unit** | Vitest | Zod schemas, utility functions, currency formatting |
| **Component** | Vitest + Vue Test Utils | Form interactions, error states, render behavior |
| **E2E** | Playwright | Full user flows (create transaction → view analytics → check budget) |

### 6.2 CI/CD (GitHub Actions)

- **On PR:** lint, `nuxt typecheck`, unit tests
- **On Merge:** trigger deployment pipeline

### 6.3 Deployment

- Deploy via Vercel or Netlify (SSR or SSG based on preference)

### 6.4 Monitoring

- Lighthouse audits (targeting 90+)
- Sentry integration (`@sentry/vue`) for error logging

---

## Key Files Reference

| File/Directory | Purpose |
|----------------|---------|
| `nuxt.config.ts` | Framework configuration & modules |
| `openapi.yaml` | API contract (source of truth) |
| `i18n.config.ts` | Translation configuration |
| `app/plugins/vue-query.ts` | TanStack Query initialization |
| `server/data/mock.ts` | Mock database (Phases 1-4 only) |
| `server/api/` | Nitro API endpoints |
| `app/domains/*/schemas/` | Domain Zod validations |
| `app/domains/*/composables/` | Domain TanStack Query hooks |
| `app/domains/*/components/` | Domain UI components |
| `app/shared/components/` | Cross-domain reusable UI |
| `app/shared/utils/` | Shared utility functions |
| `app/shared/composables/` | Shared composables (e.g., toast) |
