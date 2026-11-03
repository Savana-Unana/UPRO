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

## Asks and Responses

The main menu's Asks button follows Skip. `/asks` submits questions to the configured Google Apps Script web app, in an **Asks** sheet with ID, timestamp, character, time, optional name, and the exact question. `/responses` reads the current asks directly from Sheets when opened and every 30 seconds while visible. It merges dialogue from `data/ask.json`; unanswered questions are gray and disabled, and answered questions open their dialogue response.

### Activate Google Sheets collection

1. Replace the code in the existing spreadsheet's bound Apps Script project with `vote-sheet.example.gs`. This retains voting and History responses and adds Asks.
2. Update the existing web app deployment to a new version, running as the owner and accessible to anyone. Keep its existing `/exec` URL. If using a different web app, set `VITE_ASK_SCRIPT_URL` before building.
3. Reload the spreadsheet to see the **Asks → Download asks for website** menu. Submit a test ask and verify the Asks sheet before announcing the page.

The website only confirms success when Apps Script returns the saved ask ID and `sheet: "Asks"`. The previous deployed script will reject asks until it is updated. No server or credentials are needed in the website.

### Automatically import new asks

The **Sync asks from Sheets** GitHub workflow checks for new questions hourly, at minute 17, and commits them to `data/ask.json` on `main`. Scheduled runs may be delayed by GitHub. It preserves existing questions and responses by ID, and creates no commit if there are no new asks. The **Run workflow** button lets you sync immediately.

One-time setup:

1. In the spreadsheet's **Extensions → Apps Script**, replace the code with the latest `vote-sheet.example.gs` and save.
2. In Apps Script **Project Settings → Script properties**, add `ASK_SYNC_TOKEN` with a long random value (for example, a password manager's generated password). This is a shared secret, not a Google or GitHub access token.
3. In **Deploy → Manage deployments**, edit the existing web app, select **New version**, and deploy. Keep the existing URL.
4. In the GitHub repository **Settings → Secrets and variables → Actions → Secrets → New repository secret**, add `ASK_SYNC_TOKEN` with exactly the same value. Keep this value out of source files and `VITE_` variables.
5. Commit and push the new workflow and scripts to `main`. In **Actions → Sync asks from Sheets**, select **Run workflow** to test. After it succeeds, new questions appear in `data/ask.json`. Pull the latest changes before editing responses locally.

The sync uses the Asks web app URL already configured in this project. If the URL changes, set the repository Actions **variable** `ASK_SCRIPT_URL` to the new `/exec` URL and update the form's `VITE_ASK_SCRIPT_URL` for its next build. If repository rules block bot pushes to `main`, the sync run will fail until those rules permit this workflow. It never force-pushes; if someone pushes during a sync, the next run retries from the latest `main`.

The export endpoint requires the sync key; imported questions become part of this repository and its public site data, as with manual imports. After committing new asks, the sync explicitly starts the Pages deployment so unanswered questions appear in the inbox automatically. Your response commits also publish through the existing deployment workflow.

Manual downloads remain available as a fallback: download `ask-inbox.json` from the spreadsheet's Asks menu, then run `npm run asks:import -- "C:/path/to/ask-inbox.json"`. You can also run `npm run asks:sync` locally with `ASK_SYNC_TOKEN` set in your environment.

### Publish a response

Pull the latest repository changes, find the question in `data/ask.json` under `characters → character name → time`, and fill its `response` array. Each entry uses the same card fields as the Chat builder: `speaker`, `text`, box sprite/crop, and icon sprite/frame. Example:

```json
{
  "id": "ID from the spreadsheet",
  "name": "",
  "question": "How are you?",
  "date": "2026-11-03T14:00:00.000Z",
  "response": [
    {
      "speaker": "Skip",
      "text": "Doing well!",
      "boxSrc": "assets/images/dialogue/Dialogue_Panel.png",
      "boxX": 0,
      "boxY": 0,
      "boxWidth": 256,
      "boxHeight": 100,
      "boxSheetWidth": 512,
      "boxSheetHeight": 700,
      "boxKind": "dialogue",
      "iconSrc": "assets/images/dialogue/Skip_Icon_Amused.png",
      "iconFrame": 0,
      "iconCols": 2,
      "iconRows": 1
    }
  ]
}
```

Box crops and available icon sheets are listed in `data/dialogue/boxes.json` and `data/dialogue/icons.json`. Multiple response cards appear in order, using the Chat layout. Empty names display as Anonymous. Commit `data/ask.json` to `main`; the existing Pages deployment publishes the response automatically.

Run `node --test scripts/asks.test.mjs` to check collection validation, export authorization, automatic syncing, importing, and response visibility without sending live submissions.
