# Refreshing the MCP Workbench screenshots

These images document product stories, not a real user installation. Always capture them from a disposable Workbench data directory with synthetic users, keys, provider records, boards, traces, proposals, and browser sessions.

## Capture contract

- Build the current MCP Workbench branch and start it with a temporary `APP_DATA_DIR`.
- Use a fresh browser configuration at `1920 × 1080`. The browser chrome leaves a `1920 × 937` page capture.
- Capture the headed annotation story with the same `1920 × 1080` browser configuration so its `1920 × 937` PNG matches the portal screenshots. Verify the PNG header after capture instead of trusting the session dimensions.
- Recapture at the smaller viewport; do not resize a legacy 1440p PNG. The narrower composition is what makes labels, controls, annotations, and graph nodes readable in the page carousel.
- Use a temporary administrator and a temporary MCP key limited to Browser Automation and Fetch Proxy.
- Never populate real provider tokens, personal browser profiles, passwords, customer data, private repository content, or raw source excerpts.
- For Code Scanner, index a sanitized temporary copy. Prefer architecture names, entry-point metadata, and graphs over source panes.
- Wait at least seven seconds after a full portal navigation. The bootstrap gate can still cover a hydrated page during shorter waits.
- Inspect every PNG visually before replacing site assets.
- Delete the temporary MCP key, close browser sessions, stop the demo server, and remove disposable data when finished.

## Required synthetic stories

1. A populated release Kanban board.
2. A cooperative-browser Backlog conversation with two approval-first proposals.
3. A PR Analysis workspace with several findings and one focused impact card.
4. Agent Kits with browser, scanner, trace, planning, and documentation skills.
5. Spec Docs explaining direct browser execution and the remote proxy/helper path.
6. A sanitized local Java scan with Analysis, a `BrowserSessionManager` hierarchy, and Entry points.
7. An accounting-dashboard Think Trace with two failure branches, a reviewer comment, a local repair, and a final response.
8. Browser and Fetch Proxy configuration pages with no secrets.
9. A headed cooperative browser on `https://example.com/` with annotation mode enabled. Attach this synthetic note to `h1`, focus it so the editor is expanded, and capture the viewport:
   `Please change this heading to “A calmer place to test integrations” and add a short sentence below it explaining that no customer data is used on this page.`

## Page map

Capture the following portal routes and interaction states:

| File | Route or state |
|---|---|
| `workbench-home.png` | Home |
| `workbench-account.png` | User Account → MCP keys |
| `workbench-connect.png` | Connect tutorial |
| `workbench-github.png` | GitHub setup |
| `workbench-azure.png` | Azure DevOps setup |
| `workbench-kanban.png` | Populated board |
| `workbench-backlog.png` | Cooperative-browser conversation |
| `workbench-pr-analysis.png` | Populated analysis |
| `workbench-local-pr-analysis-impact.png` | Focused analysis card |
| `workbench-agent-kits.png` | Populated Agent Kits workspace |
| `workbench-spec-docs.png` | Isolated cooperative browser document |
| `workbench-code-scanner.png` | Sanitized Java Analyze tab |
| `workbench-call-hierarchy-expanded.png` | Hierarchy search after its animation settles |
| `workbench-code-scanner-entrypoints.png` | Analyze → Entry points |
| `workbench-think-trace.png` | Accounting repair trace |
| `workbench-think-trace-expanded.png` | Fullscreen accounting trace graph |
| `workbench-mcp-apis.png` | MCP APIs |
| `workbench-logs.png` | Logs |
| `workbench-configuration.png` | Configuration → App data |
| `workbench-browsers.png` | Browsers |
| `workbench-browser-annotation.png` | Neutral public page with an expanded `h1` change request |
| `workbench-fetch-proxy.png` | Fetch Proxy |
| `workbench-neutral-configuration.png` | Configuration → UI policy with Neutral UI enabled and forced |
| `workbench-neutral-home.png` | Neutral Home with Display settings open and the policy shown as admin-controlled |

After capture, verify that every referenced image exists and that HTML image dimensions remain `1920 × 937`.
