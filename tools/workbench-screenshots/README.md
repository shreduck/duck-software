# Workbench website screenshots

These captures render the actual Workbench frontend from a sibling `mcp` checkout. API responses are local, fictional Harbor/Acme datasets. The storefront annotation example uses a fictional checkout and the production annotation overlay. No live Workbench database, credentials, external provider, browser target or JVM is accessed.

The tour includes the complete app shell, expanded native graphs, source and document editors, populated planning boards, repeated measurement charts, thread timelines and a simulated AI transcript. It describes the development UI; downloaded releases may differ.

## Regenerate

Requires Node.js 18+, local Chromium, and a Workbench source checkout. No npm installation is needed.

```sh
node tools/workbench-screenshots/capture-all.mjs
```

Set `WORKBENCH_ROOT` if the source is not at `../mcp`, and `BROWSER_SMOKE_CHROMIUM` if Chromium is not `/usr/bin/chromium`. Each capture uses a temporary loopback fixture server and disposable Chromium profile, then closes both. The public website contains only the resulting PNGs, not a running Workbench.

Individual groups can be recaptured with `capture-setup.mjs`, `capture-code.mjs`, `capture-runtime.mjs`, `capture-suite.mjs`, `capture-performance.mjs`, or `capture-annotation.mjs`. The `capture-code.mjs` groups are `adaptive`, `atlas`, `backlog`, `pr`, and `runtime`; `capture-runtime.mjs` accepts `jobs`, `chat`, `browsers`, or `fetch-proxy`.

After inspecting replacements, run `node tools/workbench-screenshots/manifest.mjs` to record source commit, dimensions and SHA-256 hashes. `manifest.mjs --check` verifies every screenshot referenced by the product page and rejects stale or unreferenced images. All captures are 1600 × 1000 CSS pixels.

## Review before publishing

- Inspect each screenshot for meaningful content, readable labels, useful graph framing, clipping and accidental test error messages.
- Keep the fictional-data disclosure, image descriptions and captions aligned with the visible view.
- Review the website at full and half desktop widths, reduced height and a narrow mobile viewport.
- Exercise screenshot arrows, enlarged galleries and Escape dismissal. Verify all images load and local links resolve.
- Fixture screenshots demonstrate UI behavior and presentation; they do not validate a live provider integration or represent real benchmark results.
