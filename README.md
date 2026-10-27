# Duck Code Apps

Static GitHub Pages site for Duck Code app pages.

## Pages

- `index.html` is the root app catalog.
- `apps/workbench/index.html` is the MCP Workbench product tour, feature gallery, downloads and policy page.
- `apps/veinjournal/index.html` is the VeinJournal scrolling feature page.
- `apps/veinjournal/privacy.html` is the VeinJournal privacy page.
- `apps/veinjournal/licensing.html` is the VeinJournal app license page.
- `apps/veinjournal/support.html` is the VeinJournal support page.
- `apps/colourtrainer/index.html` is the ColourTrainer product page.
- `apps/colourtrainer/privacy.html` is the ColourTrainer privacy policy.
- `apps/colourtrainer/support.html` is the ColourTrainer support page.
- `apps/aipet/index.html` is the AIPet product page (desktop pet for Claude Code, Cowork and Codex sessions); download buttons open the `shreduck/AIPet` Releases page (no direct downloads, so no warning modal) and the licensing section summarises the AIPet license (free use, credit in forks, no reselling without agreement).

VeinJournal is the current public name. The legacy `apps/veintrack/` pages redirect to the corresponding VeinJournal pages so existing privacy, support and policy links keep working.

The site uses the current app icon from the VeinJournal project. Existing screenshots and artwork under `assets/img/veintrack/` are retained historical beta assets; the product page labels the older screenshots. Their original source material came from the VeinTrack page handoff.

## AIPet product page

The AIPet page follows v0.7.0 and its published Windows ZIP, Apple Silicon DMG and Mac ZIP downloads.
It covers the agent network, local logs, context and token readings, prompt navigation and timed approvals.
Codex questions remain read-only in AIPet. Keep this distinction, the download formats, signing notes and
local transcript/privacy wording aligned with the AIPet source and release assets.

## Workbench product tour

The Workbench page follows the current development interface; published release assets may differ.
Download, privacy and licensing links remain part of the existing page. The tour covers:

- Connect, Account, scoped MCP tools, GitHub and Azure DevOps project settings.
- Code Scanner, Code Atlas, Repository Query, Agent Kits and Spec Docs.
- Kanban, Backlog, PR Analysis and Think Trace.
- Browser Automation/QA, Fetch Proxy, Performance Tracker for Browser and JVM, and Test Suite.
- Jobs, administrator AI provider testing, Configuration Assistant, logs, storage and display controls.

Screenshots in `assets/img/workbench/screenshots/` use the current Workbench interface and
populated fictional Harbor/Acme examples. They are demonstration fixtures, not customer data,
real credentials, recorded provider answers or benchmark claims. Source images are 1600 × 1000.
Illustrated workflow conversations on the page are labeled simulations. Keep screenshot alt text,
captions and the visible fixture-data notice in sync when recapturing the UI.

To preview the static site locally, serve this repository root with Python 3:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://localhost:8765/apps/workbench/`. No build step or frontend dependency is required.

Screenshot fixtures and regeneration instructions are in [tools/workbench-screenshots](tools/workbench-screenshots/README.md).
