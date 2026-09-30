import { mountWorkspaceFixtureShell } from '/workspace-fixture-shell.js';
import { initializeActionMenus } from '/js/components/action-menu.js';
import { createPrAnalysisApp } from '/js/apps/pr-analysis.js';
import { createFileViewer } from '/js/file-viewer.js';
import { akSvg } from '/js/icons.js';
import { hydrateIconButtons } from '/js/components/icon-buttons.js';
import { loadingPlaceholderHtml } from '/js/components/loading-surfaces.js';
import { initExternalLinkHandling, closeExternalRedirectModal, confirmExternalRedirect } from '/js/components/shared-modals.js';

const assert = (value, message) => { if (!value) throw new Error(message); };
const el = id => document.getElementById(id);
const scale = Number(new URLSearchParams(location.search).get('scale') || 1);
for (const property of ['--ui-scale','--ui-font-scale','--ui-component-scale']) document.documentElement.style.setProperty(property, String(scale));
const tick = () => new Promise(resolve => requestAnimationFrame(resolve));
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const body='**Payment retries must preserve the original authorization.**\n\nThe checkout handler retries a gateway timeout with a new request identifier. A delayed success response could then create a second authorization.\n\n```java\npayments.authorize(order.idempotencyKey(), request);\n```\n\nUse the persisted checkout key across every retry and return the existing receipt when the request was already accepted.';
const item={id:1,analysisId:41,category:'Correctness',title:'Reuse the checkout key when retrying payment authorization',severity:'High',status:'Open',body,filePath:'orders/src/main/java/com/harbor/orders/CheckoutService.java',lineStart:84,lineEnd:102,sourceUrl:'https://github.com/harbor-example/commerce/pull/142',recommendation:'Persist the request key before calling the gateway. Add a delayed-success integration test to verify exactly one authorization.'};
const categories=['Correctness','Performance','Maintainability','Security'];
const titles=[['Reuse the checkout key when retrying payment authorization','Release reserved stock after a declined payment','Handle duplicate OrderConfirmed events','Preserve currency rounding at the API boundary'],['Batch stock availability reads','Bound the delivery-estimate cache','Avoid repeated customer lookups'],['Extract the checkout transition policy','Share the order event schema','Document partial shipment handling'],['Validate webhook signatures before parsing','Redact payment tokens in retry logs','Limit order lookups to the current customer']];
const detail={analysis:{id:41,provider:'GITHUB',project:'Harbor Commerce',repository:'harbor-commerce',pullRequestId:142,title:'Reliable checkout and inventory reservations',prCreatedBy:'Maya Chen',webUrl:'https://github.com/harbor-example/commerce/pull/142'},categories,itemsByCategory:Object.fromEntries(categories.map((category,c)=>[category,titles[c].map((title,i)=>({...item,id:c*10+i+1,category,title,severity:i===0?'High':i===1?'Medium':'Low',status:i===2?'Resolved':'Open',body:c===0&&i===0?body:['This finding affects the checkout and fulfillment boundary. Review the affected callers before applying the proposed change.','The current implementation performs this operation for each basket line. The shared service can accept the complete batch.','Keep this behavior explicit and cover it with a focused contract test.'][i%3]}))]))};
const itemDetail={item,comments:[{id:3,body:'The gateway already supports an idempotency key. Reuse the stored checkout identifier here.',createdBy:'Alex Rivera',createdAt:'2026-09-28T14:30:00Z'},{id:4,body:'Added a delayed-success scenario to the integration test plan.',createdBy:'Sam Patel',createdAt:'2026-09-28T15:10:00Z'}],history:[{action:'create',summary:'Recorded during checkout review',actor:'Maya Chen',createdAt:'2026-09-28T11:00:00Z'},{action:'edit',summary:'Clarified the retry recommendation',actor:'Alex Rivera',createdAt:'2026-09-28T14:30:00Z'}]};
const state = { prAnalysis: null, prAnalyses: [detail.analysis], prCategories: detail.categories, prLastFetched: {}, prSyncedItemIds: new Set(), prSyncedAnalysisIds: new Set() };
const calls = [];
let overlays=0;
const fileViewer = createFileViewer({ state, esc, hydrateIconButtons: root => hydrateIconButtons(root, { renderIcon: akSvg }) });
const app = createPrAnalysisApp({ state, esc, akSvg, fileViewer, loadingPlaceholderHtml,
	hydrateIconButtons: root => hydrateIconButtons(root, { renderIcon: akSvg }),
	fmt: value => value || '', val: id => el(id)?.value || '', updatePortalUrl() {}, initSidePanelResize() {}, waitForUiPaint: tick,
	withScopedLoadingOverlay: async (_root, action) => { overlays++; return action(); }, confirmDialog: async () => true, alertBox() {}, copyText: async () => {},
	api: async (method, path) => { calls.push({ method, path }); assert(method === 'GET', 'Read modes must not mutate'); return structuredClone(path.includes('/items/') ? itemDetail : detail); } });
window.App = { ...mountWorkspaceFixtureShell({state,app:'pranalysis',root:el('prAnalysisWorkspaceRoot')}), ...app, closeExternalRedirectModal, confirmExternalRedirect }; initExternalLinkHandling(); initializeActionMenus();
app.initPrAnalysisState(); await app.prOpenAnalysis(41); await tick(); await tick();
window.captureReady=true;
