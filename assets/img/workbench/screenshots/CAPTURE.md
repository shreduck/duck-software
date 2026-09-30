# MCP Workbench screenshot refresh — 2026-09-30

These 34 images show the current Workbench development interface at source commit `955cee2`, using populated fictional Harbor/Acme data. All 24 previous screenshots were recaptured, and 10 views were added. Every PNG is a native 1600 × 1000 browser capture; none is a resized legacy image or an AI-generated UI mockup.

The captures use production HTML/CSS/JavaScript renderers with isolated, in-memory API fixtures. The cooperative-browser image uses a fictional storefront and the actual Workbench annotation overlay. No live provider tokens, MCP keys, customer data, personal browser profiles, private source, provider execution, JVM attachment or recording operation is involved.

## Reproduce

See [the screenshot tooling guide](../../../../tools/workbench-screenshots/README.md). Run from the website repository:

```sh
node tools/workbench-screenshots/capture-all.mjs
node tools/workbench-screenshots/manifest.mjs --check
```

The [manifest](../../../../tools/workbench-screenshots/manifest.json) records source revision, dimensions and SHA-256 hashes. Each capture process closes its temporary server and browser profile. The separately requested static website preview is not a live Workbench instance.

## Page map

| Image | Production view and fictional example |
|---|---|
| `workbench-home.png` | Current grouped application home |
| `workbench-account.png` | Six named keys with distinct tool grants |
| `workbench-connect.png` | Client setup and connection instructions |
| `workbench-github.png` | Fictional provider connections |
| `workbench-azure.png` | Fictional credential setup and saved Azure DevOps connections |
| `workbench-kanban.png` | Release board with 29 cards |
| `workbench-backlog.png` | Versioned work-item proposals with approval actions |
| `workbench-pr-analysis.png` | Review collection with 13 findings |
| `workbench-local-pr-analysis-impact.png` | Focused finding in the current PR Analysis workspace |
| `workbench-agent-kits.png` | Reusable instructions and skills across 18 files |
| `workbench-spec-docs.png` | Specification editor with 24 documents |
| `workbench-spec-docs-graph.png` | Specification and its native Context relationship graph |
| `workbench-code-scanner.png` | Source snapshot and analysis workspace |
| `workbench-call-hierarchy-expanded.png` | Expanded native hierarchy with 20 symbols |
| `workbench-code-scanner-entrypoints.png` | Controller and service entry points |
| `workbench-code-atlas.png` | Treemap of 90 source files with selected file history |
| `workbench-repository-query.png` | Release PRs and associated work-item IDs |
| `workbench-think-trace.png` | Investigation workspace with graph and evidence |
| `workbench-think-trace-expanded.png` | Expanded investigation graph, 18 nodes and 20 edges |
| `workbench-browsers.png` | Six saved browser definitions |
| `workbench-browser-annotation.png` | Delivery-option review on a populated fictional checkout |
| `workbench-fetch-proxy.png` | Nine retained reference-document results |
| `workbench-fetch-proxy-policy.png` | Configured limits, unit hints and network policy |
| `workbench-performance-tracker.png` | Browser recording with 96 samples and populated action/request evidence |
| `workbench-jvm-profiler.png` | JVM playback with 12 sampled thread timelines and thread-dump action |
| `workbench-test-suite.png` | Browser/JVM run overlay with eight saved runs and five profiles |
| `workbench-test-suite-profile.png` | Reusable profile, alias, target and capture settings |
| `workbench-jobs.png` | Native workflow graph and selected node inspector |
| `workbench-ai-testing.png` | Fictional multi-turn provider test with visible composer |
| `workbench-mcp-apis.png` | Representative tool reference |
| `workbench-logs.png` | Fictional operation and audit events |
| `workbench-configuration.png` | Configuration Assistant and reviewable draft settings |
| `workbench-neutral-configuration.png` | Neutral UI policy |
| `workbench-neutral-home.png` | Neutral Home with Display controls open |

## Verification and limits

Every image was visually reviewed and refined for populated content and useful framing. Native capture checks reject page exceptions and horizontal overflow. The site is checked at 1920 × 1080, 960 × 1080, 2560 × 1600, 1280 × 1600, 960 × 650 and 390 × 844, including image loading, internal anchors, enlarged galleries, keyboard navigation and Escape dismissal. Workbench Browser Automation also reviews the static page from Windows Brave.

These are UI fixtures, not live integration checks or measured benchmark results. Some graphs intentionally use the application's native expansion controls or saved pane widths. The JVM image shows sampled thread states, not instrumented method profiling; its existing gallery filename is retained. A Context graph beside a Spec Doc uses the native inline pane, avoiding an observed overlap between the current context modal and topbar.
