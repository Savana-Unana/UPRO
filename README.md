# UPRO

React/Vite version of the UPRO site.

## Project Layout

- `src/main.jsx` - React entry point.
- `src/app/` - app shell, routes, and legacy route redirects.
- `src/pages/` - React pages, grouped by feature.
- `src/styles/` - React/global wrapper styles.
- `assets/` - public images, audio, fonts, and legacy/global CSS used by the site.
- `data/` - public JSON data loaded by pages.
- `data/unused/` - data that is kept around but not part of the main app flow.
- `archive/legacy-out/` - leftover legacy files kept for reference.
- `public/` - Vite public assets such as icons.

## Commands

```powershell
npm run dev
npm run lint
npm run build
```
