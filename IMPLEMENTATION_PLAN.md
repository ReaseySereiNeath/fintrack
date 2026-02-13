# FinTrack — Implementation Plan

## Overview

FinTrack is a personal finance tracker built with Nuxt 4, TanStack Query, and Zod. The project follows a Domain-Driven Design (DDD) architecture with four core domains: transactions, categories, analytics, and budgets.

---

## Current Progress

### Completed

- [x] Nuxt 4 project scaffolded
- [x] Core dependencies installed (TanStack Query, Zod, i18n)
- [x] Dependencies configured in `nuxt.config.ts` and plugins
- [x] DDD folder structure created (`app/domains/`, `server/api/`)
- [x] OpenAPI spec written (`openapi.yaml`)
- [x] All mock API routes implemented (11 endpoints)
- [x] Transaction list page with pagination, TanStack Query, and Zod validation

### Not Started

- [ ] Category management page (CRUD)
- [ ] Analytics dashboard (charts)
- [ ] Budget tracking page
- [ ] Shared UI component library
- [ ] Storybook
- [ ] ESLint + Prettier
- [ ] Testing (Vitest + Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Deployment setup

---

## Phase 1: Shared UI Foundation

**Goal:** Build reusable UI components used across all pages.

### 1.1 Install a CSS utility framework

- Install Tailwind CSS (or keep scoped CSS — decide on approach)
- Set up design tokens: colors, spacing, typography

### 1.2 Shared components (`app/shared/components/`)

| Component | Purpose |
|-----------|---------|
| `AppLayout.vue` | Sidebar navigation + header + main content area |
| `StatCard.vue` | Display a metric (e.g. total income, total expenses) |
| `DataTable.vue` | Generic sortable, paginated table |
| `Badge.vue` | Colored label (for categories) |
| `ProgressBar.vue` | Budget usage indicator |
| `Modal.vue` | Dialog for create/edit forms |
| `EmptyState.vue` | Placeholder when no data exists |
| `FormField.vue` | Label + input + error message wrapper |

### 1.3 App layout (`app/shared/layouts/`)

- Create `default.vue` layout with sidebar navigation
- Navigation links: Transactions, Categories, Analytics, Budgets

---

## Phase 2: Core Feature Pages

Build in this order — each builds on the previous.

### 2.1 Category Management

**Page:** `app/pages/categories.vue`
**Domain:** `app/domains/category/`

| Task | Details |
|------|---------|
| Zod schemas | `CategorySchema`, `CreateCategorySchema` in `schemas/` |
| Composables | `useCategories()`, `useCreateCategory()`, `useUpdateCategory()`, `useDeleteCategory()` with TanStack Query mutations |
| Components | `CategoryList.vue`, `CategoryForm.vue` (modal for create/edit) |
| Features | List all categories, create new, edit inline, delete with confirmation, optimistic updates |

### 2.2 Transaction Management (enhance existing)

**Page:** `app/pages/index.vue` (or move to `app/pages/transactions.vue`)
**Domain:** `app/domains/transaction/`

| Task | Details |
|------|---------|
| Composables | `useCreateTransaction()` mutation |
| Components | `TransactionForm.vue` (modal), `TransactionFilters.vue` (date range, category dropdown) |
| Features | Create new transaction, filter by category and date range, link categories by name/color |

### 2.3 Analytics Dashboard

**Page:** `app/pages/analytics.vue`
**Domain:** `app/domains/analytics/`

| Task | Details |
|------|---------|
| Install chart library | `chart.js` + `vue-chartjs` (or `@vueuse/charts`) |
| Zod schemas | `MonthlyReportSchema`, `CategorySpendingSchema` |
| Composables | `useMonthlyAnalytics()`, `useCategoryAnalytics()` |
| Components | `MonthlyChart.vue` (bar chart — daily spending), `CategoryPieChart.vue` (spending breakdown), `SummaryCards.vue` (income/expense/savings) |
| Features | Monthly spending bar chart, category pie chart, stat cards, month selector |

### 2.4 Budget Tracking

**Page:** `app/pages/budgets.vue`
**Domain:** `app/domains/budget/`

| Task | Details |
|------|---------|
| Zod schemas | `BudgetSchema`, `CreateBudgetSchema` |
| Composables | `useBudgets()`, `useUpsertBudget()` |
| Components | `BudgetList.vue`, `BudgetForm.vue`, `BudgetProgressBar.vue` |
| Features | List budgets per category, progress bars (spent vs limit), create/edit budget limits, visual warning when over budget |

---

## Phase 3: Polish & Quality

### 3.1 Storybook

```bash
npx storybook@latest init
```

- Write stories for each shared component (`StatCard`, `DataTable`, `Badge`, etc.)
- Write stories for key domain components

### 3.2 Linting & Formatting

```bash
npm install -D @nuxt/eslint eslint prettier eslint-config-prettier
```

- Configure ESLint with `@nuxt/eslint` module
- Add `.prettierrc` config
- Add `lint` and `format` scripts to `package.json`

### 3.3 Testing

```bash
npm install -D vitest @vue/test-utils @nuxt/test-utils happy-dom
npm install -D @playwright/test
```

| Layer | Tool | What to test |
|-------|------|-------------|
| Unit | Vitest | Zod schemas, utility functions, composable logic |
| Component | Vitest + Vue Test Utils | Component rendering, user interactions |
| E2E | Playwright | Full user flows (create transaction, view analytics) |

### 3.4 Internationalization

- Add more translation keys as pages are built
- Add a language switcher component
- Add at least one additional locale to demonstrate i18n capability

---

## Phase 4: Production Readiness

### 4.1 CI/CD — GitHub Actions

Create `.github/workflows/ci.yml`:

- **On PR:** lint, type-check (`nuxt typecheck`), unit tests, build
- **On merge to main:** deploy

### 4.2 Deployment

- Static generation (`npm run generate`) to S3 + CloudFront
- Or server deployment to Vercel/Netlify (simpler for SSR)

### 4.3 Performance

- Run Lighthouse audit, target 90+ on all metrics
- Lazy load chart library (analytics page only)
- Analyze bundle size (`npx nuxt analyze`)
- Add Web Vitals tracking

### 4.4 Error Monitoring

- Integrate Sentry (`@sentry/vue`)
- Configure source maps upload in build

---

## Suggested Build Order

| Order | Task | Estimated Complexity |
|-------|------|---------------------|
| 1 | Shared layout + navigation | Low |
| 2 | Category CRUD page | Medium |
| 3 | Enhance transaction page (filters, create form) | Medium |
| 4 | Analytics dashboard with charts | Medium-High |
| 5 | Budget tracking page | Medium |
| 6 | ESLint + Prettier setup | Low |
| 7 | Storybook setup + stories | Low-Medium |
| 8 | Unit + component tests | Medium |
| 9 | E2E tests | Medium |
| 10 | CI/CD pipeline | Low |
| 11 | Deployment + performance | Medium |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `nuxt.config.ts` | Framework config, modules |
| `openapi.yaml` | API contract (source of truth) |
| `i18n.config.ts` | Translation messages |
| `app/plugins/vue-query.ts` | TanStack Query setup |
| `server/data/mock.ts` | Mock data store |
| `app/domains/*/schemas/` | Zod validation schemas |
| `app/domains/*/composables/` | TanStack Query hooks |
| `app/domains/*/components/` | Domain-specific Vue components |
| `app/shared/components/` | Reusable UI components |
