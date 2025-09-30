---

## Repository Structure & Conventions (Feature-First)

We use a **feature-first** layout to keep code cohesive and scalable. Each top-level feature gets its **own folder** containing UI, server logic, schema, validation, and tests. Cross-feature code lives in shared libraries only.

### Top-Level Layout

.
├─ app/ # Next.js App Router (routes & layout only)
│ ├─ (public)/… # public routes (home, marketplace, listing detail)
│ ├─ (account)/… # authenticated routes (account, settings)
│ ├─ api/… # route handlers that thinly wrap feature server logic
│ └─ layout.tsx / globals.css
├─ features/ # 💡 Primary place for product code
│ ├─ listings/
│ │ ├─ components/ # UI for listings (client/server components)
│ │ ├─ server/ # server actions, services, route helpers
│ │ ├─ db/ # Drizzle schema, queries, repo layer
│ │ ├─ validation/ # Zod schemas & form resolvers
│ │ ├─ hooks/ # feature-specific hooks
│ │ ├─ utils/ # pure helpers for this feature
│ │ ├─ types/ # TypeScript types/interfaces for this feature
│ │ └─ tests/ # Playwright/Vitest tests for this feature
│ ├─ athletes/
│ ├─ offers/
│ ├─ orders/
│ ├─ shipments/
│ ├─ provenance/
│ ├─ certificates/
│ └─ trust/
├─ components/ # truly shared UI (buttons, modals, form controls)
│ └─ ui/ # shadcn wrappers & primitives
├─ lib/ # cross-cutting libraries (no feature knowledge)
│ ├─ db.ts # Drizzle init (Neon client)
│ ├─ auth.ts # NextAuth helpers
│ ├─ stripe.ts # Stripe/Connect client
│ ├─ ai/ # Vercel AI SDK setup & generic helpers
│ ├─ otel.ts # OpenTelemetry setup
│ ├─ i18n/ # i18n config, helpers
│ └─ utils.ts # generic helpers
├─ config/ # project configs (zod env, constants, feature flags)
├─ public/ # static assets
├─ tests/ # e2e test runner setup, global fixtures
├─ drizzle/ # migration files (generated)
├─ scripts/ # dev scripts, seeders
├─ types/ # global types (never feature-specific)
├─ .github/ # PR templates, actions, CODEOWNERS
└─ (root config: tsconfig.json, tailwind.config.ts, playwright.config.ts, etc.)

markdown
Copy code

### Route Placement

- **app/** holds only **routing, layouts, and thin wrappers** (RSC pages that call into `features/*/server` or render `features/*/components`).
- API route handlers in `app/api/*` should **delegate business logic** to `features/*/server` to keep routes minimal and testable.

### Professional Repo Design Rules

1. **Feature Isolation**
   - A feature **must not** import another feature’s internals. Only import from:
     - its own folder,
     - `components/` shared UI,
     - `lib/`, `config/`, `types/`.
   - If two features need the same code, move it to `components/` or `lib/`.

2. **Path Aliases (tsconfig.json)**
   - Use stable aliases to avoid brittle relative paths:
     - `@app/*` → `app/*`
     - `@features/*` → `features/*`
     - `@components/*` → `components/*`
     - `@lib/*` → `lib/*`
     - `@config/*` → `config/*`
     - `@types/*` → `types/*`

3. **File Naming & Boundaries**
   - UI components: `PascalCase.tsx`
   - Server actions/services: `*.server.ts`
   - Drizzle schema: `schema.ts` per feature under `features/<name>/db/`
   - Zod: `*.schema.ts` or `validation/*.ts`
   - Tests colocated under `features/<name>/tests/` + global E2E under `tests/`

4. **Server Actions & APIs**
   - Server actions live in `features/<name>/server/` and are imported by pages.
   - API route handlers in `app/api` should call the same server functions (single source of truth).

5. **Migrations & Schema**
   - All schema changes belong to the feature’s `db/` and generate Drizzle migrations in `/drizzle`.
   - Each PR that changes schema must include generated migrations and a brief note in `UPDATE.md`.

6. **Validation & Types**
   - Every external input (forms, query params, webhooks) validated with Zod.
   - Export DTO types from Zod using `z.infer<…>` and keep them local to the feature unless shared.

7. **Testing**
   - **Unit/logic** tests (Vitest/Jest) colocated in `features/*/tests/`.
   - **E2E** tests (Playwright) use top-level `tests/` fixtures; feature-specific specs can also live under `features/*/tests/e2e`.

8. **Observability**
   - Server functions that hit external services (Stripe, carriers) should log spans via `lib/otel.ts`.
   - No secrets in logs. Use structured logs.

9. **i18n**
   - No hard-coded strings in feature components. Use i18n keys.
   - Shared copy in `lib/i18n/` with namespaces per feature.

10. **Security**
    - AuthZ checks occur **inside** server functions (not just in the route/page).
    - Never access another user’s resource without ownership checks.

### Example: Listings Feature

features/
listings/
components/
ListingCard.tsx
ListingGallery.tsx
ListingProvenance.tsx
CreateListingForm.tsx
server/
create-listing.server.ts
update-listing.server.ts
get-listing.server.ts
search-listings.server.ts
db/
schema.ts # listings, media, provenance tables
queries.ts # typed query helpers
validation/
listing.schema.ts # zod create/update
hooks/
useListingFilters.ts
utils/
price.ts
media.ts
types/
listing.ts
tests/
listing.e2e.spec.ts
listing.unit.spec.ts

markdown
Copy code

**Routes**:
- `app/(public)/marketplace/page.tsx` → imports `search-listings.server.ts` and renders `ListingCard`s.
- `app/(public)/marketplace/[id]/page.tsx` → imports `get-listing.server.ts`, renders `ListingGallery`, `ListingProvenance`.
- `app/(account)/sell/new/page.tsx` → renders `CreateListingForm` that calls `create-listing.server.ts`.

### Code Ownership & PR Quality

- **CODEOWNERS**: set per-feature owners in `.github/CODEOWNERS` for fast, domain-aware reviews.
- **PR Template**: require:
  - Scope (feature),
  - Screenshots,
  - Schema/migrations summary,
  - Security/permissions checked,
  - Tests added/updated,
  - i18n keys added.
- **Conventional Commits** (`feat(listings): …`, `fix(offers): …`).
- **Changesets** (optional but recommended) when we start versioning packages or releasing API contracts.

---
If you want, I can also generate a tsconfig.json alias block and a starter .github/PULL_REQUEST_TEMPLATE.md that matches this structure.
"
