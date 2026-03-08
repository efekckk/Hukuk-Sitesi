# AGENTS.md — Hukuk Sitesi

Coding agent instructions for this Next.js law firm website project.

---

## Project Overview

A bilingual (Turkish/English) law firm website built with:
- **Next.js 16** (App Router, TypeScript strict mode)
- **Tailwind CSS v4**
- **Prisma ORM** with PostgreSQL
- **next-intl** for i18n (`tr` default, `en` secondary)
- **next-auth v5 (beta)** for admin authentication
- **Tiptap** rich text editor in admin panel
- **Zod** for schema validation
- **Framer Motion** + **Lenis** for animations/smooth scroll

---

## Build, Dev & Lint Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint (ESLint with Next.js core-web-vitals + TypeScript rules)
npm run lint
```

> There is **no test suite** configured. No `jest`, `vitest`, or `playwright` is installed.

### Database Commands

```bash
npm run db:generate   # prisma generate (regenerate client after schema changes)
npm run db:push       # push schema changes to DB without migration (dev only)
npm run db:migrate    # prisma migrate dev (create and apply migration)
npm run db:seed       # seed the database via prisma/seed.ts
npm run db:studio     # open Prisma Studio GUI

# Translation script (auto-translate TR content to EN via API)
npm run translate
```

**Always run `npm run db:generate` after modifying `prisma/schema.prisma`.**

---

## Project Structure

```
src/
  app/
    [locale]/          # Public-facing pages (tr/en via next-intl)
    admin/             # Admin panel (no i18n prefix, auth-gated)
    api/               # REST API route handlers
  components/
    admin/             # Admin UI components
    sections/          # Page section components (homepage, etc.)
    ui/                # Reusable UI primitives
    layout/            # Header, footer, nav
    forms/             # Form components
  hooks/               # Custom React hooks
  i18n/                # next-intl config: routing.ts, request.ts, navigation.ts
  lib/
    auth.ts            # NextAuth setup
    auth.config.ts     # NextAuth config
    prisma.ts          # Singleton Prisma client
    utils.ts           # cn(), formatDate(), slugify(), getLocalizedField(), truncate()
    validations/       # Zod schemas (blog.ts, contact.ts)
  middleware.ts        # i18n + admin auth middleware
  types/
    index.ts           # Shared TypeScript types
prisma/
  schema.prisma        # Database schema
  seed.ts              # Seed script
messages/              # i18n JSON translation files (tr.json, en.json)
```

---

## Code Style Guidelines

### TypeScript

- **Strict mode** is enabled (`"strict": true` in tsconfig). Never use `any` unless unavoidable; if you must, add `// eslint-disable-next-line @typescript-eslint/no-explicit-any`.
- Use `interface` for object shapes (e.g., component props, API responses).
- Use `type` for unions, intersections, and aliases (e.g., `type Locale = "tr" | "en"`).
- Derive types from Zod schemas using `z.infer<typeof schema>` (see `ContactFormData`).
- Path alias `@/*` maps to `./src/*`. Always use `@/` for imports within `src/`.

### Imports

Organize imports in this order (no blank lines between groups unless readability demands):
1. React / Next.js internals
2. Third-party libraries
3. Internal modules via `@/` alias (lib, hooks, types)
4. Relative component imports

Example:
```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { blogPostSchema } from "@/lib/validations/blog";
```

### Formatting

- Double quotes for strings in TypeScript/TSX.
- 2-space indentation.
- Trailing commas in multi-line objects/arrays.
- No semicolons are not enforced — follow existing file conventions (semicolons used throughout).
- Keep lines reasonably short; no hard 80-char limit enforced but avoid excessively long lines.

### Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Files/folders | kebab-case | `hero-slider.tsx`, `blog-post/` |
| React components | PascalCase (named export) | `export function HeroSlider()` |
| Hooks | camelCase with `use` prefix | `useScrollReveal` |
| Functions/variables | camelCase | `getLocalizedField`, `formatDate` |
| Types/Interfaces | PascalCase | `BlogPostWithRelations`, `Locale` |
| Zod schemas | camelCase + `Schema` suffix | `contactFormSchema`, `blogPostSchema` |
| Prisma models | PascalCase in schema, camelCase in queries | `prisma.blogPost.findMany()` |
| Env vars | UPPER_SNAKE_CASE | `DATABASE_URL`, `NEXTAUTH_SECRET` |
| DB columns (Prisma `@map`) | snake_case | `"password_hash"`, `"is_published"` |

### React / Next.js Patterns

- Server Components by default. Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- Page components are `async` functions that fetch data directly via Prisma (no separate data-fetching layer).
- Use `Promise.all()` for parallel DB queries in Server Components.
- Locale-aware content: always check `locale === "en" && fieldEn ? fieldEn : fieldTr` pattern. Use `getLocalizedField()` from `@/lib/utils` for simpler cases.
- Component props: define as a local `interface` named `ComponentNameProps` above the component.

### API Routes

- All routes live in `src/app/api/` and use Next.js Route Handlers (`route.ts`).
- Wrap handler bodies in `try/catch`; log errors with `console.error("context:", error)` and return `NextResponse.json({ error: "..." }, { status: 5xx })`.
- Authenticate protected routes using `await auth()` from `@/lib/auth`; return 401 on missing session.
- Validate request bodies with Zod `safeParse`; return 400 with `error.flatten()` details on failure.
- Use `Record<string, unknown>` for dynamic Prisma `where` objects.

### Error Handling

- API routes: always return structured JSON errors with appropriate HTTP status codes.
- Client components: use `try/catch` in async handlers; display user-friendly messages (Turkish by default).
- Never expose raw error objects or stack traces to clients.

### Styling

- Use **Tailwind CSS v4** utility classes exclusively. No CSS Modules or global styles beyond `globals.css`.
- Use the `cn()` utility (`@/lib/utils`) — a `clsx` + `tailwind-merge` wrapper — for conditional/merged class names.
- Dark theme is the default design (dark backgrounds with gold/amber accents).

### i18n

- Translation files: `messages/tr.json` (primary) and `messages/en.json`.
- Use `useTranslations()` hook in Client Components and `getTranslations()` in Server Components/layouts (both from `next-intl`).
- Navigation helpers live in `@/i18n/navigation.ts` (`Link`, `useRouter`, `usePathname`).
- Locales: `tr` (default, no prefix) and `en` (prefix `/en/`).
- Admin panel (`/admin/*`) is excluded from i18n middleware.

### Database / Prisma

- Import the singleton client: `import { prisma } from "@/lib/prisma"`.
- After schema changes, run `npm run db:generate` then `npm run db:migrate`.
- Bilingual models follow `fieldTr` / `fieldEn` naming; `En` variants are optional (`String?`).
- DB table names use `@@map("snake_case_plural")` convention.
- IDs use `cuid()`. Timestamps use `createdAt`/`updatedAt` mapped to `created_at`/`updated_at`.

### Validation

- Define all Zod schemas in `src/lib/validations/`.
- Export both the schema and its inferred type: `export type Foo = z.infer<typeof fooSchema>`.
- Use `.safeParse()` (not `.parse()`) in API routes to avoid thrown exceptions.
