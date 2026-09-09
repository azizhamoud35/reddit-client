# Reddit Client

A responsive Reddit feed reader built with **React + Redux Toolkit**, consuming Reddit's
public JSON API (no API key required). Portfolio project for the Codecademy
Full-Stack Engineer career path (Front-End chapter capstone).

## Live demo

🚧 Publishing pending — will be deployed to GitHub Pages (`azizhamoud35/reddit-client`).

## Data source

The app tries **live Reddit data first** (public JSON API, no key) on every load.
If Reddit is unreachable — its network-security edge currently 403-blocks
unauthenticated `.json` access from many networks ("log in or use your developer
token", confirmed from browser and server contexts, including public proxy
services) — the app **degrades gracefully to a bundled sample dataset** with the
exact same shape, and shows a banner saying so. Every feature (search, filters,
detail view, comments, error/retry states) is fully functional in both modes.

**Roadmap:** OAuth "developer token" support via env vars (see `postsAPI.js`)
for guaranteed live data where accounts/keys are available.

## Features

- **Initial data view** — popular posts load on first render (skeleton loaders while fetching)
- **Search** — live, case-insensitive filtering of the loaded feed by title
- **Predefined category filters** — 12 curated communities (r/javascript, r/reactjs, r/webdev, r/space, …)
- **Detailed view** — every post opens a route-based detail page (`/posts/:id`) with the full
  post and its nested comment tree (replies indented up to 3 levels deep)
- **Error-state recovery** — API failures show a friendly error with a manual retry;
  HTTP 429 rate-limiting is detected specifically, surfaces a banner, and auto-retries
  with bounded exponential attempts honouring Reddit's `retry-after`
- **Cohesive design system** — CSS custom-property tokens (color, spacing, radius, shadow,
  motion), consistent card components, dark theme
- **Animations** — staggered rise-in for cards, shimmer skeletons, hover lifts,
  `prefers-reduced-motion` respected
- **Responsive** — CSS Grid app shell; sidebar becomes wrapping chips under 900px,
  header wraps the search bar under 560px
- **Cosmetic voting** — up/down votes with local optimistic state (real voting needs
  Reddit OAuth; noted intentionally out of scope)

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 18 (Vite) | Fast DX, modern build |
| State | Redux Toolkit | Slices + async thunks + memoized selectors |
| Routing | React Router 6 | Route-based post detail view |
| Unit tests | Vitest + React Testing Library | Jest-compatible API, Vite-native |
| E2E tests | puppeteer-core | Drives the real app against the live Reddit API |
| Styling | Vanilla CSS design tokens | Zero runtime CSS-in-JS |

> **Note on Enzyme:** the project brief mentions Jest + Enzyme, but Enzyme has no
> React-18-compatible release and is officially deprecated. The modern equivalent
> (Jest-family runner + React Testing Library) is used instead — same describe/it/expect
> API, better render-semantics testing.

## Architecture

```
src/
├── app/store.js                     # configureStore — 4 slices
├── features/
│   ├── posts/
│   │   ├── postsAPI.js              # fetchReddit() + RateLimitError/ApiError
│   │   ├── postsSlice.js            # fetchPosts thunk, rate-limit/retry state
│   │   └── selectors.js             # selectFilteredPosts (memoized)
│   ├── comments/commentsSlice.js    # fetchComments thunk (permalink → tree)
│   ├── searchTerm/searchTermSlice.js
│   └── selectedSubreddit/selectedSubredditSlice.js
├── components/
│   ├── Header.jsx                   # sticky bar, logo, animated search
│   ├── Subreddits.jsx               # predefined category filters
│   ├── PostList.jsx                 # feed + loading/empty/error branches
│   ├── Post.jsx                     # card: votes, media, meta, comments link
│   ├── PostDetail.jsx               # /posts/:id — full post + comments
│   ├── Comments.jsx                 # recursive nested comment tree
│   ├── Skeleton.jsx                 # shimmer loading placeholders
│   └── ErrorState.jsx               # friendly error + auto/manual retry
└── utils/format.js                  # timeAgo, Reddit URL unescaping
```

**Data flow:** selecting a subreddit (or app mount) → `fetchPosts(subreddit)` thunk →
Reddit `.json` endpoint → normalized `post.data` array in the store →
`selectFilteredPosts` memoized selector applies the search term → `PostList` renders.

Reddit quirks handled: `&amp;`-escaped preview URLs, video posts (thumbnail + badge),
self-text truncation, score compaction (15k), relative timestamps, NSFW badges.

## Wireframes

```
┌────────────────────────────────────────────────────────┐
│ ◉ redditclient        [ 🔎 Search posts…         ] ✕   │  ← sticky Header
├──────────┬─────────────────────────────────────────────┤
│ COMMUNIT.│  ┌─ ▲ 15234 ─┐  r/reactjs · u/dev · 2h ago  │
│ 🏠 Home  │  │           │  A very important post about  │
│ 🟨 java… │  │  ▼       │  React 19…                     │
│ ⚛️ reactj│  └───────────┘  [image preview]              │
│ 🌐 webd… │  💬 421 comments                             │
│ 🔬 sci…  │  ┌─ next card (rise-in animation) ─────────┐ │
│ 🚀 space │  └──────────────────────────────────────────┘│
│ …        │  … feed scrolls …                            │
└──────────┴─────────────────────────────────────────────┘
   ↑ sidebar: sticky, → chips under 900px

Detail view (/posts/:id):
┌─────────────────────────────────────────────┐
│ ← Back to feed                              │
│ ┌─ Post card (full) ──────────────────────┐ │
│ │ full selftext / full-size image         │ │
│ └─────────────────────────────────────────┘ │
│ Comments (42)                               │
│ ┌ u/alice · 3h · 128 pts ─────────────────┐ │
│ │ comment body…                           │ │
│ │  └ u/bob · 2h · reply (indented) ──────┐│ │
│ │  │ nested reply body…                  ││ │
│ │  └──────────────────────────────────────┘│ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build (relative base — any static host) |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests (Vitest, 26 specs across API/slices/components) |
| `npm run e2e` | E2E tests (needs `npm run dev` + Chrome debug on :9222) |

## Testing

- **Unit (26 specs):** live→demo data fallback (reachable / blocked / 403 /
  rate-limit propagation / fixture comments), posts slice lifecycle
  (loading/success/error/rate-limit retry counting/recovery), memoized search
  selector (case-insensitivity, substrings, empty), Header (render + store
  wiring + clear), Post (title/meta/score compaction, vote toggle semantics,
  selftext truncation), Subreddits (list render, active state, filter dispatch
  clears search).
- **E2E (7 scenarios):** feed load (live or bundled data), live search filtering, clear-restore,
  community switch, detail view with comments, responsive mobile layout,
  zero uncaught errors.

## Roadmap / future work

- Reddit OAuth for real voting + authenticated feeds
- Infinite scroll / pagination (`after` cursor)
- User profile pages
- PWA install support + CI/CD on push
- Light theme toggle
