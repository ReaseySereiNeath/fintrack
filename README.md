# FinTrack

Personal finance tracker built with Nuxt 4, TanStack Query, and Zod.

## Tech Stack

- **Nuxt 4** — Vue 3 full-stack framework
- **TanStack Query** — async state management with caching
- **Zod** — runtime schema validation
- **@nuxtjs/i18n** — internationalization

## Project Structure

```
app/
  domains/                # Domain-Driven Design modules
    transaction/          # Transaction list, detail, creation
    category/             # Spending category CRUD
    analytics/            # Monthly reports, category breakdowns
    budget/               # Budget limits and tracking
  shared/                 # Reusable components, layouts, utils
  pages/                  # Nuxt file-based routing
  plugins/                # Vue Query setup
server/
  api/                    # Nuxt server routes (mock REST API)
    transactions/
    categories/
    analytics/
    budgets/
  data/                   # Mock data store
```

Each domain contains `components/`, `composables/`, `types/`, and `schemas/` subdirectories.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions (paginated, filterable) |
| POST | `/api/transactions` | Create a transaction |
| GET | `/api/transactions/:id` | Get single transaction |
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create a category |
| PUT | `/api/categories/:id` | Update a category |
| DELETE | `/api/categories/:id` | Delete a category |
| GET | `/api/analytics/monthly` | Monthly spending summary |
| GET | `/api/analytics/by-category` | Spending breakdown by category |
| GET | `/api/budgets` | List budgets |
| POST | `/api/budgets` | Create/update a budget |

Full spec available in `openapi.yaml`.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Production

```bash
npm run build
npm run preview
```
