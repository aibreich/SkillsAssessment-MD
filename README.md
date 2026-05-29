# Maybelline Product Catalog

A React product catalog built for the Meyer Distributing frontend technical assessment. The app loads Maybelline products from the public [Makeup API](https://makeup-api.herokuapp.com/), presents them in a responsive grid, and supports filtering, sorting, pagination, and an accessible detail modal. Optional enhancements include category-area navigation, a client-side shopping cart, and polish such as skeleton loading and scroll-to-results.

## Overview

This application is a single-page product catalog with a Maybelline-inspired visual system. It addresses the challenge of browsing a large, heterogeneous product dataset by giving users structured ways to explore, refine, and inspect products without leaving the page.

**What users can do:**

- Browse products in a responsive grid (image, name, price, rating when available, color preview)
- Apply filters (price, product type, rating, color) and see removable active filter chips
- Sort results and paginate through them with a configurable page size
- Open a modal for full product details, shade selection, and external product links
- *(Bonus)* Switch catalog areas (All, Face, Eyes, Lips, Nails)
- *(Bonus)* Add items to a cart persisted in `localStorage` and manage them on a dedicated cart route

The project is scoped as a **frontend-only technical assessment**: one public API fetch, no backend, authentication, or real checkout.

## Features

### Product browsing

- Responsive grid: **1** column (mobile), **2** (tablet ≥640px), **3** (desktop ≥1024px)
- Product cards show image (lazy-loaded with SVG fallback), name, formatted price, star rating when `rating` exists, up to four color swatch previews (+N overflow), optional two-line-clamped description, and **View More**
- Result range label in the toolbar (e.g. `Showing 1–24 of 87 products`)
- *(Bonus)* **Best Seller** badge when rating is ≥ 4.5

### Modal details view

- Overlay dialog with larger image, brand, name, category label, rating (when present), price, and description
- Selectable shade swatches when the product has normalized color data
- External **View Product** / **Visit Website** links when the API provides URLs (open in a new tab)
- Close via close button, `Escape`, or backdrop click
- Focus moves to the close button on open and returns to the triggering **View More** button on close
- *(Bonus)* **Add to Cart** with optional **View Cart** after adding

### Filtering

- Checkbox groups: **Categories** (API `product_type`), **Price Range**, **Rating**, **Product colors**
- **OR** logic within a group; **AND** logic across groups
- Filter options are derived from products in the **current nav area** (not the full dataset when an area tab is active)
- Color filter section is omitted when no displayable color names exist in that set
- Color names are normalized for display; hex-like or very short/non-displayable names are excluded from filters

### Sorting

- Dropdown: Featured (default), Price Low → High, Price High → Low, Rating High → Low, Name A–Z
- **Featured** preserves the original API response order (no separate “featured” flag from the API)

### Pagination

- Previous/next controls, numbered pages with ellipsis for long page counts, and `Page X of Y` status
- Operates on the **filtered and sorted** result set
- Resets to page 1 when filters, sort, items-per-page, or nav area changes
- Scrolls the product section into view after page changes and when filters change (if the user has scrolled past the grid); respects reduced motion

### Items-per-page control

- Native `<select>` with **24** (default) and **48** options
- On desktop: inline in the catalog toolbar; on smaller viewports: inside the mobile filter sheet

### Loading / error / empty states

- **Loading:** skeleton sidebar (desktop only) and six skeleton product cards; hidden during retry so existing data stays visible
- **Error:** alert with friendly copy, API error detail, and **Retry** (aborts in-flight requests; failed retry does not clear previously loaded products)
- **Empty:** distinct messages for no filter matches (with **Clear All Filters**), empty category area (with **Browse All Products**), or empty catalog

### Responsive design

- Mobile-first layout, horizontal category tabs under the header, bottom-sheet filters, compact toolbar
- Desktop sticky sidebar filters and inline sort / items-per-page controls

### Accessibility considerations

- Skip link, semantic landmarks, dialog patterns for modal and mobile filter sheet, focus trap, `aria-hidden` on the app shell behind overlays
- Visible `:focus-visible` styles, `aria-live` regions for results and cart feedback, labeled controls
- Minimum touch targets on mobile pagination and filter chips
- `prefers-reduced-motion: reduce` in CSS and programmatic scroll behavior

See [Accessibility](#accessibility) for implemented behavior and known gaps.

### Bonus features

Clearly outside the original assessment brief:

| Feature | Description |
|--------|-------------|
| Category navigation | Header tabs: All, Face, Eyes, Lips, Nails (maps known `product_type` values) |
| Shopping cart | Add from modal; `/cart` route with quantity, remove, clear, subtotal |
| Cart persistence | `localStorage` key `meyer-cart` |
| Best Seller badges | Rating ≥ 4.5 |
| Skeleton loading UI | Filter + card placeholders |
| Scroll-to-results | After filter/page changes |
| Client-side routing | React Router for catalog (`/`) and cart (`/cart`) |

## Requirements From the Assessment

Status key: **Implemented** · **Partially implemented** · **Bonus scope** · **Not implemented**

### Level 1

| Requirement | Status | Notes |
|-------------|--------|-------|
| Product grid | **Implemented** | 1 / 2 / 3 columns by breakpoint |
| Image | **Implemented** | Lazy load; SVG “No image” fallback on missing/broken URL |
| Name | **Implemented** | Falls back to `Unnamed product` |
| Price | **Implemented** | USD via `Intl.NumberFormat`; **N/A** when missing/invalid |
| Star rating | **Implemented** | On card and modal when `rating` exists; omitted on card when absent |
| View More modal | **Implemented** | Accessible `role="dialog"` overlay |
| Product detail content | **Implemented** | Description, rating, price, category, external links |
| Product color display | **Implemented** | Swatch preview on card; selectable shades in modal |

### Level 2

| Requirement | Status | Notes |
|-------------|--------|-------|
| Price filters | **Implemented** | Under $5, $5–$10, $10–$15, $15+ |
| Product type filters | **Implemented** | UI label **Categories** |
| Rating filters | **Implemented** | 4+, 3+, 2+, and **No rating** |
| Color filters | **Implemented** | From normalized displayable color names in current area |
| Active filter chips | **Implemented** | Removable chips + **Clear All** |
| Sorting dropdown | **Implemented** | Five options (see Features) |

### Level 3

| Requirement | Status | Notes |
|-------------|--------|-------|
| Pagination | **Implemented** | On filtered + sorted set; hidden when ≤1 page |
| Filters with pagination | **Implemented** | Page resets on filter/sort/page-size/area change; range reflects filtered count |
| Items-per-page dropdown | **Implemented** | Options **24** and **48** only (no **12** option) |

### Bonus scope (not required by brief)

| Feature | Status | Notes |
|---------|--------|-------|
| Category area navigation | **Bonus scope** | Fixed `product_type` → area map |
| Shopping cart | **Bonus scope** | No checkout |
| Cart persistence | **Bonus scope** | `localStorage` only |
| Bestseller badges | **Bonus scope** | Rating ≥ 4.5 |
| Footer links | **Bonus scope** | Visual labels only (`<span>`, not links) |

## Tech Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 |
| Build tool | Vite 6 |
| Language | TypeScript |
| Routing | React Router DOM 7 (`/` catalog, `/cart` lazy-loaded) |
| Styling | Plain CSS with custom properties (`src/App.css`) |
| Icons | Inline SVG (`src/components/icons/Icons.tsx`) |
| State | React `useState` / `useMemo` / `useCallback`; `CartContext` for cart |
| Data fetching | Native `fetch` + `AbortSignal` |
| Formatting | `Intl.NumberFormat` (USD) |
| Tests | Vitest (utility modules only) |

No UI component library, CSS framework, or global state library.

## Data Source

**Endpoint:** `https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline`

Defined in `src/api/products.ts`. The app fetches this list once on mount (with retry support) via `useProducts` → `fetchProducts()`.

### What the app does with API data

1. Validates HTTP status; throws on failure
2. Maps each `ApiProduct` to a typed `Product` in `normalizeProduct()`
3. Stores the array in React state for client-side filter → sort → paginate

### Normalization

| Field | Handling |
|-------|----------|
| `price` | `parseFloat` from string → `number \| null`; `NaN` → `null` |
| `imageUrl` | `image_link`, else `api_featured_image`; protocol normalized (`//` → `https:`, `http:` → `https:`) |
| `productType` | From `product_type`; missing values appear as **Other** in category filters |
| `colors` | Drops entries without `hex_value`; strips leading `#` from hex |
| `name` | Default `Unnamed product` if missing |
| Links / description | Trimmed strings or `null` |
| `rating` | Passed through as `number \| null` |

### Missing values

| Field | Behavior |
|-------|----------|
| Price | Display **N/A**; sort treats as `0`; excluded from price-range filters when `null` |
| Rating | Hidden on card when absent; **No rating** filter matches `null` ratings |
| Image | SVG placeholder via `ProductImage` |
| Product type | **Other** in category filters |
| Colors | Empty array; color filter group hidden if none are displayable |

## Project Structure

```
src/
├── api/
│   └── products.ts              # Fetch + normalize Makeup API
├── components/
│   ├── icons/Icons.tsx          # Inline SVG icons
│   ├── BestsellerBadge.tsx
│   ├── CatalogToolbar.tsx       # Count, chips, sort, items/page, mobile filter trigger
│   ├── FilterPanel.tsx          # Desktop sidebar + mobile bottom sheet
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductModal.tsx
│   ├── ProductImage.tsx
│   ├── PaginationControls.tsx
│   ├── SortSelect.tsx
│   ├── ItemsPerPageSelect.tsx
│   ├── LoadingState.tsx
│   ├── ErrorState.tsx
│   ├── EmptyState.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── context/
│   └── CartContext.tsx          # Cart + localStorage
├── hooks/
│   ├── useProducts.ts           # Fetch lifecycle + retry
│   ├── useBackgroundAriaHidden.ts
│   └── useDocumentTitle.ts
├── pages/
│   ├── CatalogPage.tsx          # Main orchestration
│   └── CartPage.tsx             # Bonus cart view
├── types/
│   ├── product.ts               # Product model, filters, sort, API types
│   └── cart.ts
├── utils/
│   ├── filterProducts.ts        # Filter logic + active chips
│   ├── sortProducts.ts
│   ├── pagination.ts            # Page number ellipsis
│   ├── productRange.ts          # “Showing X–Y of Z”
│   ├── formatters.ts            # Price, rating, category, color labels
│   ├── imageUrl.ts
│   ├── focusTrap.ts
│   ├── scroll.ts
│   ├── navAreas.ts              # Bonus area mapping
│   └── productBadges.ts
├── App.tsx                      # Routes
├── App.css                      # Design tokens + layout
└── main.tsx                     # Router + CartProvider
```

**Why this layout:** presentational components stay thin; pure logic lives in `utils/`; fetch/normalize in `api/`; catalog orchestration in `CatalogPage.tsx` keeps assessment features easy to trace for reviewers.

## Key UI/UX Decisions

### Maybelline-inspired visual system

Warm neutrals, rose-primary accent (`#825152`), Montserrat headings, and Inter body text (Google Fonts). Brand-adjacent feel without proprietary asset dependencies.

### Typography and spacing

CSS custom properties (`--text-*`, `--space-*`) enforce consistent rhythm across cards, filters, and modal.

### Responsive layout

| Viewport | Grid | Filters | Toolbar |
|----------|------|---------|---------|
| Mobile (&lt;640px) | 1 col | Bottom sheet | Mobile bar + chip row |
| Tablet (640–1023px) | 2 col | Bottom sheet (tablet filter button) | Mobile bar until 1024px |
| Desktop (≥1024px) | 3 col | Sticky sidebar | Inline count, chips, sort, show |

### Product card hierarchy

Image → rating (if any) → name + price → optional description (2-line clamp) → color swatches → **View More**. Scannable above-the-fold information first.

### Modal design

Stacked on small screens; two-column from 768px (image | details). Selected shade name shown under the active swatch.

### Filter organization

`fieldset` / `legend` per group; rating rows use star visuals with visually hidden text for screen readers. Mobile sheet bundles sort and items-per-page so controls stay reachable without a crowded header.

### Loading / error / empty states

Distinct treatments so users know whether data is loading, the API failed, filters eliminated all results, or a category area is empty.

### Mapping to the original brief

| Brief intent | Implementation |
|--------------|----------------|
| Product grid with core fields | `ProductCard` + `ProductGrid` |
| View More / details | `ProductModal` with description, colors, links |
| Filters + active chips | `FilterPanel` + `CatalogToolbar` chips |
| Sort + pagination + page size | `SortSelect`, `PaginationControls`, `ItemsPerPageSelect` |
| Polish beyond minimum | Bonus nav, cart, badges, skeletons, a11y patterns |

## Accessibility

### Implemented

- **Keyboard:** Tab order through controls; skip-to-content link; focus trap in product modal and mobile filter sheet (`handleFocusTrap`)
- **Focus:** `:focus-visible` outlines; modal/sheet close button receives initial focus; focus restored to filter/modal trigger on close
- **Modal:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby` / `aria-describedby`, `Escape` closes, body scroll lock, app shell `aria-hidden` via `useBackgroundAriaHidden`
- **Filter sheet:** Same dialog pattern; `inert` when closed; backdrop dismiss
- **ARIA:** Labels on cart, filters, sort, pagination, shade buttons (`aria-pressed`), filter chip removal, `aria-current` on nav and page buttons
- **Structure:** `header`, `main`, `nav`, `footer`, `article` cards, lists for grid and filters
- **Live regions:** Polite announcements for result range/page, add-to-cart, cart quantity
- **Touch targets:** ~44px minimum on mobile pagination and filter chips (CSS)
- **Reduced motion:** Global CSS disables transitions/animations; `scrollToElement` uses `auto` when `prefers-reduced-motion: reduce`

### Limitations (honest)

- Custom checkbox visuals use native inputs, but the decorative box is `aria-hidden`
- Card color swatches are decorative (`aria-hidden`); group has an `aria-label` summary only—not individually focusable
- Cart quantity is +/- buttons with a live region, not a spinbutton
- **Proceed to Checkout** and footer labels are non-functional presentation
- No dedicated high-contrast theme or full WCAG audit documented

## Responsiveness

| Breakpoint | Grid | Filters | Modal | Navigation | Footer |
|------------|------|---------|-------|------------|--------|
| **&lt;640px** | 1 column | Bottom sheet | Stacked | Horizontal scroll tabs under header | Stacked |
| **640–1023px** | 2 columns | Bottom sheet + tablet filter button | 2 columns from 768px | Same mobile tabs | Side-by-side from 640px |
| **≥1024px** | 3 columns | Sticky sidebar | 2-column layout | Centered header nav | Side-by-side |

**Filter behavior:** Desktop sidebar is `display: none` below 1024px; mobile/tablet use the sheet. Filter options reflect products in the active nav area.

**Pagination:** Compact on mobile (arrows + status + page list); adequate touch targets on small screens.

## State Management

| Concern | Where | Notes |
|---------|-------|-------|
| Product data | `useProducts` | Single fetch; `attempt` counter drives retry |
| Nav area | `CatalogPage` | Bonus pre-filter: All / Face / Eyes / Lips / Nails |
| Filters | `CatalogPage` | `FilterState` with four string arrays |
| Sort | `CatalogPage` | `SortOption` union |
| Pagination | `CatalogPage` | `currentPage`; clamped if filters shrink pages |
| Items per page | `CatalogPage` | Default `24` |
| Modal | `CatalogPage` | `selectedProduct` + trigger ref for focus return |
| Mobile filters open | `CatalogPage` | Sheet open state + trigger ref |
| Loading / error | `useProducts` | `isRetrying` keeps grid visible on retry |
| Active chips | Derived | `getActiveFilterChips(filters)` |
| Cart | `CartContext` | Synced to `localStorage` on change |

**Pipeline (memoized):**

```
products → filterByNavArea → filterProducts → sortProducts → slice(page)
```

## API / Data Handling

### Fetch flow

1. `useProducts` runs `fetchProducts(signal)` on mount or retry
2. `AbortController` cancels on unmount or new attempt
3. Success → `products` state; failure → `error` message (empty products only on initial failure)

### Retry flow

**Retry** increments `attempt`, re-runs fetch with `isRetrying: true`. Loading skeleton is suppressed during retry so the catalog remains usable if products were already loaded.

### Error handling

Non-OK HTTP responses throw `Failed to load products (status)`; network errors surface as generic messages in `ErrorState` (`role="alert"`).

### Image fallback

`normalizeImageUrl` then `ProductImage`: on error or missing URL, swaps to an inline SVG data URI labeled via the product `alt` text.

### Price / rating / color normalization

- **Price:** string → float or `null`; display and filters use null-aware rules
- **Rating:** used as-is; sort descending treats missing as `-1`
- **Colors:** hex without `#`; `formatColorLabel()` cleans names for filters; `isDisplayableColorFilterName()` filters noise

## Implementation Notes

- **Separation of concerns:** Components render UI; `utils/` hold filter/sort/pagination math; `api/` owns HTTP and normalization.
- **Filter + pagination:** All filtering and sorting are client-side on one fetched array (~100 products). Pagination slices the final list—appropriate for the assessment scope.
- **Memoization:** `useMemo` on each pipeline stage avoids recomputation when unrelated state (e.g. modal) changes.
- **Modal accessibility:** Shared `focusTrap` for modal and filter sheet; `useBackgroundAriaHidden` hides `#app-shell-content` from assistive tech while overlays are open.
- **Filter options scope:** `FilterPanel` receives `areaProducts` so category/color options match the active nav tab.
- **Interview tradeoffs:** No URL query sync for filters, no E2E/component tests, no API caching layer—keeps focus on React patterns, data normalization, and UX.

## Known Limitations / Assumptions

- **No backend** — single client fetch; depends on Makeup API availability
- **No authentication**
- **No real checkout** — **Proceed to Checkout** has no handler
- **Cart is local only** — `localStorage` key `meyer-cart`; not shared across devices/browsers
- **No filter/sort URL persistence** — refresh resets catalog controls (cart persists)
- **Items per page** — 24 and 48 only (assessment often implies a dropdown; a third option like 12 is not implemented)
- **Price filters** — products with `null` price are excluded when any price range is selected
- **Featured sort** — preserves API order; not a true “featured” ranking
- **Category nav** — only mapped `product_type` values appear under Face/Eyes/Lips/Nails; others show under **All** only
- **No text search**
- **Footer links** — decorative `<span>` elements, not navigable links
- **Tests** — Vitest covers utilities (`filterProducts`, `sortProducts`, `pagination`, `formatters`, `navAreas`, `productRange`); no component or E2E tests
- **Card description** — full API text may exist but UI clamps to two lines
- **External API** — images and links point to third-party URLs; CORS/network issues are out of app control

## How to Run Locally

### Prerequisites

- Node.js 18+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint (optional)

```bash
npm run lint
```

### Unit tests (optional)

```bash
npm test
```

Runs Vitest on utility modules under `src/utils/*.test.ts`.

## Verification Checklist

Use this when reviewing the submission:

- [ ] App loads without console errors
- [ ] Products render: image, name, price, rating (when API provides it)
- [ ] **View More** opens modal; closes via button, `Escape`, and backdrop
- [ ] Price, category, rating, and color filters narrow results correctly
- [ ] OR within a filter group; AND across groups
- [ ] Active filter chips removable; **Clear All** resets filters
- [ ] Sort dropdown reorders (price, rating, name, featured order)
- [ ] Pagination appears when results exceed page size; page changes update grid
- [ ] Items-per-page switches between 24 and 48; page resets to 1
- [ ] Filters and pagination interact (count and pages reflect filtered set)
- [ ] Loading skeleton on first load
- [ ] Error state on failure; **Retry** recovers (try offline DevTools)
- [ ] Empty state when filters match nothing
- [ ] Layout at mobile, tablet, and desktop breakpoints
- [ ] *(Bonus)* Nav tabs filter by area
- [ ] *(Bonus)* Add to cart; badge updates; `/cart` shows line items
- [ ] `npm run build` succeeds

## Suggested Demo Flow

A short interview walkthrough:

1. **Grid** — card fields, image fallback, responsive columns, optional Best Seller badge.
2. **Filtering** — apply price + color; show chips; remove one chip; **Clear All**.
3. **Modal** — details, shades, external links; close with `Escape`; mention focus return.
4. **Sort & pagination** — change sort and items-per-page; navigate pages; point at result count.
5. **Resilience** — loading skeletons, error + retry, empty filtered state.
6. **Engineering** — normalization in `api/products.ts`, pipeline `area → filter → sort → paginate`, accessible overlays.
7. **Bonus & tradeoffs** — nav areas, cart, no checkout/URL sync/backend.
8. **Future** — query params, component tests, search, image proxy.

## Future Improvements

- Sync filters, sort, page, and area to URL query parameters
- Component and integration tests (modal trap, toolbar chips, filter sheet)
- Text search on name/description
- Virtualized grid if dataset grows beyond a single fetch
- Image CDN or proxy for reliability and sizing
- Persist catalog preferences in `sessionStorage`
- Additional items-per-page options if product count increases
- Service worker or stale-while-revalidate for the product fetch
- Full accessibility audit and high-contrast mode for custom controls

## Credits / Acknowledgments

- **Assessment:** Meyer Distributing frontend developer technical test
- **Product data:** [Makeup API](https://makeup-api.herokuapp.com/) — Maybelline brand endpoint
- **Typography:** [Google Fonts](https://fonts.google.com/) — Inter and Montserrat
