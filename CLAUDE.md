# CLAUDE.md — Part Finder App (SanityPress with TypeGen)

## Project Overview

A marketing website built on the SanityPress with TypeGen starter template. Next.js 16 frontend with an embedded Sanity v5 Studio for content management. All content (pages, blog posts, navigation, etc.) is authored in Sanity and rendered via GROQ queries with auto-generated TypeScript types.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **React**: 19 with React Compiler enabled
- **CMS**: Sanity v5 (embedded Studio at `/admin`)
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/postcss`)
- **Language**: TypeScript (strict mode)
- **State**: Zustand (search, blog index), `nuqs` (URL query params)
- **Node**: v22 (see `.nvmrc`)
- **Package Manager**: npm (`legacy-peer-deps=true` in `.npmrc`)

## Commands

```sh
npm run dev          # Start dev server (webpack mode — turbopack has lightningcss issues)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run typegen      # Extract Sanity schema + generate types (watch mode)
npm run format       # Prettier format all TS/TSX/JS/JSX
```

## Project Structure

```
src/
├── app/
│   ├── (frontend)/              # Public-facing routes
│   │   ├── [[...slug]]/page.tsx # Catch-all page route (/, /about, /services, etc.)
│   │   ├── blog/
│   │   │   ├── [slug]/page.tsx  # Individual blog post
│   │   │   └── rss.xml/route.ts # RSS feed endpoint
│   │   ├── api/
│   │   │   ├── draft-mode/      # Enable/disable Sanity draft mode
│   │   │   └── og/route.tsx     # Dynamic OpenGraph image generation
│   │   ├── layout.tsx           # Frontend layout (header, main, footer)
│   │   └── not-found.tsx        # Custom 404 page (content from Sanity)
│   ├── (studio)/
│   │   └── admin/[[...tool]]/   # Embedded Sanity Studio
│   └── sitemap.ts               # Auto-generated sitemap
├── hooks/
│   ├── useMatchMedia.ts         # Responsive media query hook
│   └── usePagination.tsx        # Pagination with URL state
├── lib/
│   ├── env.ts                   # dev flag, ROUTES constants
│   └── utils.ts                 # cn(), slug(), count(), debounce(), getBlockText()
├── sanity/
│   ├── schemaTypes/             # All Sanity schema definitions
│   │   ├── documents/           # Document types (10 types)
│   │   ├── modules/             # Content module types (15 types)
│   │   ├── objects/             # Reusable object types (6 types)
│   │   ├── fragments/           # Shared schema fragments (modules array factory)
│   │   └── index.ts             # Schema export with singleton config
│   ├── lib/
│   │   ├── client.ts            # Sanity client (CDN, stega for visual editing)
│   │   ├── live.ts              # sanityFetchLive() — draft-aware data fetching
│   │   ├── queries.ts           # All GROQ queries + getSite() export
│   │   ├── token.ts             # Server-only API read token
│   │   ├── image.ts             # urlFor() image URL builder
│   │   ├── resolve-slug.ts      # Slug resolution for links
│   │   └── builders.ts          # Studio structure helpers (singleton, group)
│   ├── ui/
│   │   └── character-count.tsx  # Custom schema input with char counter
│   ├── env.ts                   # apiVersion, dataset, projectId from env vars
│   ├── presentation.ts          # Visual editing / presentation tool config
│   ├── structure.ts             # Studio sidebar structure
│   ├── types.ts                 # AUTO-GENERATED — do not edit manually
│   └── extract.json             # AUTO-GENERATED — schema extraction for typegen
├── ui/
│   ├── header/                  # Header components (nav, dropdown, megamenu, mobile)
│   ├── footer/                  # Footer components (nav, link lists)
│   ├── modules/                 # Module renderers (1:1 with schema module types)
│   │   ├── blog/                # Blog components (index, post content, previews)
│   │   ├── search/              # Search components (form, results, store)
│   │   ├── prose/               # Rich text rendering (headings, code, images)
│   │   ├── custom-html/         # Custom HTML/CSS/JS injection
│   │   └── *.tsx                # Other module components
│   ├── table-of-contents/       # TOC with intersection observer
│   ├── img.tsx                  # Smart image component (Sanity + Next Image)
│   ├── logo.tsx                 # Site logo (async, fetches from Sanity)
│   ├── sanity-link.tsx          # Universal link component (internal/external)
│   ├── cta-list.tsx             # CTA button list renderer
│   ├── social-navigation.tsx    # Social links with platform icon detection
│   ├── hover-details.tsx        # Desktop hover / mobile tap disclosure
│   ├── click-to-copy.tsx        # Clipboard copy with feedback
│   └── loading.tsx              # Loading spinner
├── sanity.config.ts             # Studio config (plugins, schema, basePath: /admin)
├── sanity.cli.ts                # CLI config (typegen paths, schema extraction)
└── next.config.ts               # Next.js config (redirects from Sanity, React Compiler)
```

## Architecture Patterns

### Data Flow

All content flows from Sanity CMS through GROQ queries:

1. **Sanity Studio** (`/admin`) — authors create/edit content
2. **GROQ queries** (`src/sanity/lib/queries.ts`) — fetch and transform content
3. **`sanityFetchLive()`** (`src/sanity/lib/live.ts`) — draft-aware fetching with live updates
4. **Server Components** render content; limited client components for interactivity

### Module System

Pages are composed of reusable **modules** — the core content building pattern:

- **Schema** (`src/sanity/schemaTypes/modules/`) defines each module's fields
- **Fragment** (`src/sanity/schemaTypes/fragments/modules.ts`) is a factory that creates the modules array field used by `page` and `global-module` documents
- **Renderer** (`src/ui/modules/index.tsx`) maps `_type` to component
- **Components** (`src/ui/modules/*.tsx`) render each module

Available modules: `accordion-list`, `blog-index`, `blog-post-content`, `blog-post-list`, `breadcrumbs`, `callout`, `card-list`, `custom-html`, `hero.split`, `logo-list`, `person-list`, `prose`, `quote-list`, `search-module`, `stat-list`, `step-list`

### Global Modules

`global-module` documents inject modules before/after page content based on URL path patterns. Supports wildcards (`*`, `blog/`) and path exclusions.

### Draft Mode & Visual Editing

- Enable: `GET /api/draft-mode/enable` (authenticated)
- Disable: `GET /api/draft-mode/disable`
- `sanityFetchLive()` switches between `published` and `drafts` perspectives
- `VisualEditing` component overlays editing controls in draft mode
- Stega encoding in client config enables click-to-edit in Studio

## Sanity Schema Summary

### Documents (10)

| Type | Description | Singleton |
|------|-------------|-----------|
| `site` | Global settings (title, logo, navigation refs, footer) | Yes |
| `page` | CMS pages with modules array + metadata | No |
| `blog.post` | Blog posts with rich content, author, categories | No |
| `blog.category` | Blog category with title + slug | No |
| `navigation` | Navigation structure (links, dropdowns, megamenus) | No |
| `logo` | Logo with default/light/dark image variants | No |
| `global-module` | Path-based module injection (before/after) | No |
| `redirect` | URL redirects (source path → destination link) | No |
| `person` | Person with name + image (used by blog author, person-list) | No |
| `quote` | Testimonial quote with author info | No |

### Objects (6)

| Type | Description |
|------|-------------|
| `metadata` | SEO fields: title (60 char), description (160 char), slug, image, noIndex |
| `cta` | Call-to-action wrapping a link with style variant |
| `link` | Internal (page ref + params) or external URL with label |
| `link.list` | Parent link with array of child links (dropdowns) |
| `megamenu` | Parent link with array of link.list groups |
| `module-attributes` | UID for anchor links + hidden toggle |

### Studio Structure

```
Content
├── Global (Site singleton, Global modules)
├── Pages
├── Blog (Posts, Categories)
├── Navigation (Navigation, Redirects)
└── References (Logos, People, Quotes)
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/sanity/lib/queries.ts` | All GROQ queries — the data layer |
| `src/sanity/lib/live.ts` | `sanityFetchLive()` — use this for all data fetching |
| `src/sanity/schemaTypes/index.ts` | Schema registry with singleton config |
| `src/sanity/schemaTypes/fragments/modules.ts` | Module array factory (add new modules here) |
| `src/ui/modules/index.tsx` | Module type → component mapping |
| `src/sanity/types.ts` | Auto-generated types — run `npm run typegen` to regenerate |
| `src/sanity/structure.ts` | Studio sidebar organization |
| `src/lib/env.ts` | `dev` flag and route constants (`ROUTES.blog`) |
| `src/lib/utils.ts` | `cn()`, `slug()`, `count()`, `debounce()` |

## Path Aliases

- `@/*` → `./src/*`
- `@@/*` → `./` (project root)

## Environment Variables

```sh
NEXT_PUBLIC_BASE_URL          # Production domain (e.g. https://example.com)
NEXT_PUBLIC_SANITY_PROJECT_ID # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET    # Sanity dataset (e.g. production)
SANITY_API_READ_TOKEN         # Sanity API token with Viewer permissions (server-only)
```

## Code Style

- **Formatter**: Prettier (format on save via VS Code)
- **Semicolons**: None
- **Quotes**: Single
- **Indentation**: Tabs
- **Trailing commas**: Always
- **Import order**: Built-ins → Sanity → Third-party → `@/` aliases → Relative

## Adding a New Module

1. **Schema**: Create `src/sanity/schemaTypes/modules/my-module.ts` with `defineType({ type: 'object', ... })`
2. **Register**: Add to the `types` array in `src/sanity/schemaTypes/index.ts`
3. **Fragment**: Add to the modules array in `src/sanity/schemaTypes/fragments/modules.ts`
4. **Query**: Add GROQ projection in `src/sanity/lib/queries.ts` inside `MODULES_QUERY`
5. **Typegen**: Run `npm run typegen` to regenerate types
6. **Component**: Create `src/ui/modules/my-module.tsx`
7. **Renderer**: Add the import and type mapping in `src/ui/modules/index.tsx`

## Required Sanity Documents

The site needs these documents published to function:

| Document | Slug | Purpose |
|----------|------|---------|
| `site` | — | Global settings (required) |
| `page` | `index` | Homepage (required) |
| `page` | `404` | Not found page |
| `page` | `blog` | Blog listing (add Blog Index module) |
| `global-module` | path: `blog/` | Blog post template (add Blog Post Content module) |

A demo dataset can be imported: `sanity dataset import demo.tar.gz`

## SEO & Generated Routes

- `/sitemap.xml` — Auto-generated from all pages and blog posts
- `/blog/rss.xml` — RSS 2.0 feed of all blog posts
- `/api/og?slug=...` — Dynamic OpenGraph images (1200x630, supports `invert` param)

## VS Code Snippets

The project includes Sanity-specific snippets in `.vscode/sanitypress.code-snippets` for quickly scaffolding schema definitions and module components.
