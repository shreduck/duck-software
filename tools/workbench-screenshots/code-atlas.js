import { createCodeAtlasApp } from '/js/apps/code-atlas.js';
import { mountWorkspaceFixtureShell } from '/workspace-fixture-shell.js';
import { initializeActionMenus } from '/js/components/action-menu.js';
import { hydrateIconButtons } from '/js/components/icon-buttons.js';
import { loadingDuckHtml, loadingPlaceholderHtml } from '/js/components/loading-surfaces.js';
import { akSvg } from '/js/icons.js';
const check = (value, message) => { if (!value) throw new Error(message); };
const pause = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const scale = Number(new URLSearchParams(location.search).get('scale') || 1);
for (const property of ['--ui-font-scale', '--ui-component-scale']) document.documentElement.style.setProperty(property, String(scale));
check(['--ui-font-scale', '--ui-component-scale'].every(property => Number(getComputedStyle(document.documentElement).getPropertyValue(property)) === scale), 'Requested125% scale applies to text and controls');
const state = { user: { id: 1, role: 'ADMIN', username: 'Maya Chen' } }, calls = [];
const targets = [{ id: 1, provider: 'LOCAL', displayName: 'Harbor Commerce', repository:'harbor-commerce',localPath: '/workspace/harbor-commerce', branch: 'main', indexedCommit: 'c41a9de7' }];
const modules=['orders','inventory','payments','fulfillment','catalog','customers'];
const names=['Controller','Service','Repository','Mapper','Validator','Events','Configuration','Policy','Cache','Metrics','Listener','Request','Response','Exception','IntegrationTest'];
const files=modules.flatMap((module,m)=>names.map((name,n)=>({path:`${module}/${module[0].toUpperCase()+module.slice(1)}${name}.java`,lineCount:55+((m*211+n*137)%840),sizeBytes:2400+((m*527+n*1943)%28000),language:'java',category:'SOURCE',lastCommitId:'c41a9de7',authorName:['Maya Chen','Alex Rivera','Sam Patel'][n%3],workingTreeStatus:'CLEAN',lastCommittedAt:new Date(Date.UTC(2026,8,29)-(3+((m*31+n*13)%300))*86400000).toISOString()})));
const inventory = { snapshotToken: 'c41a9de7', indexedCommit: 'c41a9de7', files, modules: [], historyStatus: 'COMPLETE', scannedAt: '2026-09-28T00:00:00Z' };
const groups = modules.map((path, index) => ({ path, name: path, commitCount: index + 1, contributorCount: 2, additions: 50, deletions: 12, pullRequestCount: 1 }));
let deferDetails = false, releaseDetails;
const history = { snapshotToken: 'c41a9de7', historyStatus: 'COMPLETE', items: [{ subject: 'Reserve inventory before order confirmation', commitId: 'c41a9de7', authorName: 'Maya Chen', committedAt: '2026-09-28T00:00:00Z' }] };
const api = async (method, path) => {
	calls.push({ method, path }); check(method === 'GET', `Viewing Atlas cannot mutate: ${method} ${path}`);
	if (path === '/api/code-atlas/targets') return targets;
	if (path.includes('/inventory')) return inventory;
	if (path.includes('/activity/details')) return deferDetails ? new Promise(resolve => { releaseDetails = resolve; }) : history;
	if (path.includes('/activity')) return { snapshotToken: 'c41a9de7', historyStatus: 'COMPLETE', prStatus: 'COMPLETE', groups, totals: {} };
	throw new Error(`Unexpected Atlas fixture read ${path}`);
};
const app = createCodeAtlasApp({ state, api, esc, fmt: value => value || '', loadingDuckHtml, loadingPlaceholderHtml,
	hydrateIconButtons: root => hydrateIconButtons(root, { renderIcon: akSvg }), updatePortalUrl: () => {}, waitForUiPaint: pause,
	alertBox: (_id, ok, message) => { if (!ok) throw new Error(message); }, confirmDialog: async () => false, copyText: async () => {} });
window.App = { ...app, ...mountWorkspaceFixtureShell({ state, app: 'code-atlas', root: document.getElementById('atlasFixtureRoot') }) };
initializeActionMenus();
await App.codeAtlasLoad();await pause();
document.querySelector('[data-insight-action="table"]').click();await pause();document.querySelector('[data-insight-action="select"]').click();await pause();document.querySelector('[data-insight-action="table"]').click();await pause();window.captureReady=true;window.screenshotState=state;
