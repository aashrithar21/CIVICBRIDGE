# CivicBridge — premium design pass

## Audit of the previous version
- The home hero image was the Vite starter graphic (purple layers), unrelated to the product.
- The navbar's "Home" link had no `end` prop, so it showed as active on every page; the logo wrapped the site name in an `<h1>` on every route (two h1s on the home page).
- Hard-coded Tailwind colours, repeated `rounded-2xl` white panels and three generations of overriding CSS made the look inconsistent and hard to maintain.
- Register form fields used IDs containing spaces; password fields had no show/hide control.
- Loading and error states were plain text, many without a retry. Save/star controls were text glyphs with no accessible name.
- Google Fonts was loaded with a render-blocking CSS `@import`; Leaflet loaded as a blocking script; all pages shipped in one bundle.
- Unused Vite template files and four unused components were still in the project.

## What changed
**Design system** (`src/index.css`): one token set (ink / paper / teal accent, status colours, radii, shadows, easing) and a single component layer — buttons, fields, badges, chips, cards, skeletons, states, bento tiles, timeline, workspace layout. Typography pairs Fraunces (display) with Inter (body).

**Shared components** (`src/components/ui`): `StatusBadge`, `Reveal` (scroll reveal), `CountUp`, `PageHeader`, `States` (skeleton / error-with-retry / empty), `Logo`.

**Pages**: home (editorial hero with a live pin map built from real report coordinates, metrics band, asymmetric bento, recent reports), explore (toolbar, skeletons, accessible save toggle, empty/error states), city map, transparency (donut + animated bars), login/register split layout, report form as three numbered steps with photo preview and drag-and-drop, issue details with sticky action column and timeline, all dashboards.

**Behaviour**: route-level code splitting; responsive navbar (drawer at <1024px, Escape closes, closes on navigation); header gains a divider on scroll; reduced-motion respected everywhere; skip link, labelled controls, `aria-pressed` / `aria-live` on interactive state.

## Preserved
Backend, API routes, data, auth and role rules, every API call, saved-reports storage, filters, map logic and all business behaviour are unchanged. Two display-only differences: the issue timeline now lists the newest update first, and the home "Recent reports" are sorted by creation date.

## Removed (all unreferenced)
`App.css`, `assets/react.svg`, `assets/vite.svg`, `assets/hero.png`, `public/icons.svg`, `layouts/MainLayout.tsx`, `utils/constants.ts`, and the unused `FeatureCard`, `SectionTitle`, `StatCard`, `IssueCard` components.

## Verification (what was and was not done)
- All TypeScript/TSX parses without syntax errors.
- A semantic type-check (unused imports/variables, undefined names, property access on `Complaint`, local prop types) passed. It ran with third-party modules stubbed, because dependencies could not be installed offline here, so React/router/lucide typings were not checked.
- The shared stylesheet was rendered in Chromium against static markup mirroring the home page at 1440 px and 390 px: no horizontal overflow, layouts as intended.
- **Not done:** `npm ci`, `npm run build`, running the app against the backend, other pages in a browser, and any WCAG audit. Please run `npm ci && npm run build` in `frontend`, then click through each page before deploying. New lucide icons used: `Eye`, `EyeOff`, `Star`, `Check`, `Copy`, `ExternalLink`, `RefreshCw`; if your pinned lucide-react version renames one, the build will say so.
