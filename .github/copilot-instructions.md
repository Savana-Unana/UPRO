## Copilot / AI contributor instructions — UPRO (short, actionable)

This repo is a static website (HTML/CSS/JS) containing many content pages and JSON data used by the pages.
Keep changes minimal and consistent with existing patterns. Below are the most important facts and examples to be productive quickly.

1) Big picture
- The site is a collection of folders with paired `.html` and `.js` files (e.g., `Catalog/catalog.html` + `Catalog/script.js`, `Map/map.html` + `Map/mapscript.js`).
- Content-driven pages read JSON from `Catalog/data/*.json` (notably `sacred.json`, `base.json`, `moves.json`, etc.). If you change JSON shapes, update the page script that reads it.
- Images live in several folders: `images/`, `lostimages/`, `lostlostimages/`, `otherimages/`. Pages use relative paths (e.g., `../lostlostimages/Elixion.png`). Preserve those relative paths when editing data entries.

2) Developer workflow (how to test changes locally)
- No build system: preview the site in a browser. Recommended quick ways:
  - Use VS Code Live Server (open the workspace root and run Live Server).
  - Or run a simple static server from the repo root: `python -m http.server 8000` (PowerShell) and open `http://localhost:8000/Index/index.html`.
- After editing JSON or JS, refresh the page in the browser to verify results.

3) Data shape & project-specific conventions (use these exactly)
- JSON entries in `Catalog/data/sacred.json` follow this shape:
  - id (number), name (string), types (array of strings), paraTypes (array), dexEntries (object with keys: Discovered, First Caught, Experienced, Reverence), evolvesTo (array of {name, level}), sacredForme ({name, quest}), abilities (array), moves (array), image (relative path), description (string).
  - Example: see `Catalog/data/sacred.json` — id 101 "Sacred Elixion" uses: `"image":"../lostlostimages/Elixion.png"`.
- Keep JSON valid (no trailing commas, proper quoting). Edit with a JSON-aware editor or validator.

4) Known gotchas and repo idiosyncrasies (watch for these)
- Duplicate IDs: there are duplicate id=90 entries across `base.json` and `sacred.json` (and duplicate lines in `base.json`). Check for duplicate `id` values before adding new entries.
- Strange/concatenated filenames: some entries (id=116) have long concatenated filenames (e.g., `TwoMew.png.jpeg.gif.webp...`). Avoid creating similarly malformed names — prefer a single extension and consistent folder (`images/` or `lostimages/`).
- Image folder inconsistency: images are scattered across `images/`, `lostimages/`, `lostlostimages/`. When adding files, prefer `images/` for canonical images and update references accordingly; but preserve existing relative paths when only editing JSON.

5) When you modify data files
- Keep existing keys and types intact. If adding a new sacred entry, follow the same keys and provide an `image` path relative to the page that will use it.
- Run a quick JSON lint (editor or online) and preview the relevant page (e.g., `Catalog/catalog.html`) to ensure it loads correctly.

6) Where to look for logic that consumes data
- `Catalog/catalog.html` + `Catalog/script.js` (data-driven catalog rendering).
- `Catalog/data/sacred.json` and `Catalog/data/base.json` are primary data sources for creature entries.

7) Example tasks and phrasing for AI
- Add a new sacred entry: "Add id=117 to `Catalog/data/sacred.json` with name 'Example', types ['Water'], a valid `image` in `images/`, and empty dexEntries. Keep other objects unchanged and lint the JSON." Provide the exact object you will add and a one-line summary of verification steps.
- Fix duplicate id: "I will rename the second id=90 entry in `Catalog/data/sacred.json` to 121 and update any references in consumer JS. I'll validate by opening `Catalog/catalog.html` and ensuring no duplicates in rendered list."

8) Tests / CI
- There are no automated tests or build steps currently. Validate changes manually by previewing pages.

9) Commit messages and PRs
- Keep commits small and focused (one logical change per commit). The repo README uses informal messages; keep commit messages understandable (e.g., `catalog: add Sacred Example entry (id 117)`).

10) If unsure, do this first
- Inspect the relevant HTML/JS that reads the JSON (e.g., `Catalog/script.js`). Confirm the expected data keys.
- Run the site locally and verify the page that uses the changed file.

If any of these sections are unclear or you want the agent to perform safe automated fixes (e.g., renumber duplicate ids, normalize image folders), tell me which policy to follow (conservative: only surface possible fixes; aggressive: apply fixes automatically and run a local preview). Ready to iterate on this file if you'd like changes or extra examples.
