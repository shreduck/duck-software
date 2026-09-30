import { mountWorkspaceFixtureShell } from '/workspace-fixture-shell.js';
import { initializeActionMenus } from '/js/components/action-menu.js';
import { initializeTabs } from '/js/components/tabs.js';
import { getAdaptiveWorkspace } from '/js/components/adaptive-workspace.js';
import { createBacklogApp } from '/js/apps/backlog.js';
import { loadingDuckHtml } from '/js/components/loading-surfaces.js';
import { akSvg } from '/js/icons.js';

initializeActionMenus(); initializeTabs();
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const el = id => document.getElementById(id);
const scale = Number(new URLSearchParams(location.search).get('scale') || 1);
for (const property of ['--ui-scale','--ui-font-scale','--ui-component-scale']) document.documentElement.style.setProperty(property, String(scale));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const paint = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
async function until(predicate, message) {
	const deadline = Date.now() + 4000;
	while (!predicate() && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 10));
	assert(predicate(), message);
}
let actionId = 0;
async function keyboard(key, code, virtualKey) {
	const id = ++actionId;
	await new Promise(resolve => {
		window.fixtureKeyboard = { id, key, code, virtualKey };
		window.fixtureKeyboardComplete = done => { if (done === id) { window.fixtureKeyboard = null; resolve(); } };
	});
	await paint();
}
async function capture(name) {
	const id = ++actionId;
	await new Promise(resolve => {
		window.fixtureCapture = { id, name };
		window.fixtureCaptureComplete = done => { if (done === id) { window.fixtureCapture = null; resolve(); } };
	});
}
const longToken = 'Harbor Commerce';
const titles = ['Make checkout idempotent across payment retries','Reserve inventory before confirming an order','Show delivery estimates for split shipments','Reduce catalog search latency at peak traffic','Prepare the autumn release readiness review','Add an auditable refund workflow','Document fulfillment event contracts','Improve accessibility of the basket summary'];
const conversations = titles.map((title, i) => ({ id: i + 1, title, projectManagementType: i % 2 ? 'GITHUB' : 'AZURE_DEVOPS',
	project: i ? 'Harbor Commerce' : longToken, repositoryScope: 'BRANCH', repository: 'harbor-commerce',
	branchName: 'feature/reliable-checkout', itemState: i % 2 ? 'In review' : 'New', updatedBy: ['Maya Chen','Alex Rivera','Sam Patel'][i%3],
	updatedAt: '2026-09-16T08:30:00Z', workItemCount: 4, testPlanCount: 2, pullRequestCount: 1, branchCount: 2, report: 'Coordinate checkout resilience, fulfillment contracts and the release review.' }));
const changeTypes = ['WORK_ITEM', 'TEST_PLAN', 'PULL_REQUEST'];
const changes = changeTypes.flatMap((changeType, group) => titles.map((title, i) => ({ id: (group + 1) * 100 + i,
	changeType, title: `${changeType === 'WORK_ITEM' ? 'Implement' : changeType === 'TEST_PLAN' ? 'Verify' : 'Review'}: ${title}`,
	provider: i % 2 ? 'GITHUB' : 'AZURE_DEVOPS', operation: i % 2 ? 'UPDATE' : 'CREATE', status: i === 2 ? 'APPROVED' : 'PENDING_APPROVAL',
	syncState: i === 2 ? 'IN_SYNC' : 'LOCAL_ONLY', workItemType: i % 2 ? 'Task' : 'User Story', updatedBy: ['Maya Chen','Alex Rivera','Sam Patel'][i%3],
	updatedAt: '2026-09-16T08:30:00Z', conversationId: [1, 2, 3, null, 1][i], conversationIds: i === 0 ? [1, 2, 2] : [], project: longToken, repository: 'harbor-commerce' })));
const history = [{ id: 1, action: 'PROPOSED', actor: 'reviewer', summary: 'Captured a bounded proposal with explicit scope and approval required.', createdAt: '2026-09-16T08:30:00Z' }];
const links = [{ id: 1, entityKind: 'BRANCH', relationType: 'context', title: 'feature/reliable-checkout', role: 'candidate', metadataJson: JSON.stringify({ reason: 'Checkout resilience implementation' }) }];
function conversationDetail(id) {
	return { conversation: conversations.find(c => c.id === id), changes: changes.slice(0, 3), links, history,
		attachments: [{ id: 1, fileName: 'checkout-contract.md', contentType: 'text/markdown', sizeBytes: 2048, createdBy: 'reviewer', createdAt: '2026-09-16T08:30:00Z' }],
		userContext: 'Make repeated checkout requests safe while preserving the original order and payment authorization.',
		aiContext: 'Preserve the existing approval workflow. Do not execute remote mutations when navigating or reviewing.', conversationTranscript: titles.join('\n\n') };
}
const savedProposals = new Map();
let failProposalSave = false;
function changeDetail(id) {
	const change = changes.find(c => c.id === id);
	return { change, links, history, graph: { nodes: [], edges: [] }, rationale: 'Keep the reviewed change small, reversible, and tied to its original conversation.',
		userContext: 'A retry with the same idempotency key must return the original receipt without reserving stock or authorizing payment again.', aiContext: longToken,
		proposedSnapshot: savedProposals.get(id) || JSON.stringify({ title: change.title, provider: change.provider, project: longToken, repository: 'harbor-commerce',
			sourceBranch: 'feature/reliable-checkout', targetBranch: 'master', description: titles.join('\n\n'), acceptanceCriteria: titles, draft: true }), diffJson: JSON.stringify({ added: titles }) };
}
let allowDiscard = false;
let empty = false, fieldSelections = [], fieldRevision = 'absent', failFieldSave = false, discoveryGate = null;
const calls = [], alerts = [];
async function api(method, url, body) {
	calls.push({ method, url });
	if (method === 'PUT' && /^\/api\/backlog\/changes\/\d+$/.test(url)) {
		if (failProposalSave) throw new Error('Fixture proposal save unavailable');
		const id = Number(url.split('/').at(-1)); savedProposals.set(id, body.proposedSnapshot); return structuredClone(changeDetail(id));
	}
	if (method === 'PUT' && url === '/api/backlog/azure-fields') {
		if (failFieldSave) throw new Error('Fixture save conflict: rediscover fields.');
		assert(body.expectedRevision === fieldRevision && body.expectedOrganizationUrl === 'https://dev.azure.com/fixture', 'Selection save must carry the discovered scope and revision');
		fieldSelections = structuredClone(body.selections); fieldRevision = '1:1';
		return { revision: fieldRevision, selections: fieldSelections };
	}
	assert(method === 'GET', `Layout fixture must never mutate anything: ${method} ${url}`);
	if (url.startsWith('/api/backlog/azure-fields?')) { if (discoveryGate) await discoveryGate; return { project: 'Workbench', organizationUrl: 'https://dev.azure.com/fixture', revision: fieldRevision, selections: fieldSelections, fields: [
		{ workItemType: 'User Story', name: 'Technical description', referenceName: 'Custom.TechnicalDescription', type: 'html' },
		{ workItemType: 'User Story', name: 'Risk', referenceName: 'Custom.Risk', type: 'integer' }
	] }; }
	if (url.startsWith('/api/backlog/azure-work-items?')) return [{ id: 123, title: 'Fixture item', project: 'Workbench', workItemType: 'User Story', selectedFields: [
		{ name: 'Technical description', referenceName: 'Custom.TechnicalDescription', type: 'html', value: '<script>window.fieldAttack=true</script>', available: true }
	] }];
	if (url === '/api/backlog/conversations') return structuredClone(empty ? [] : conversations);
	if (url === '/api/backlog/changes') return structuredClone(empty ? [] : changes);
	if (url === '/api/backlog/conversation-states') return [{ id: 1, name: 'New', defaultState: true }, { id: 2, name: 'In review', defaultState: false }];
	let match = url.match(/^\/api\/backlog\/conversations\/(\d+)$/);
	if (match) return structuredClone(conversationDetail(Number(match[1])));
	match = url.match(/^\/api\/backlog\/changes\/(\d+)$/);
	if (match) return structuredClone(changeDetail(Number(match[1])));
	if (/\/graph$/.test(url)) return { nodes: [], edges: [] };
	throw new Error(`Unexpected fixture request: ${url}`);
}
const state = { user: { role: 'ADMIN' }, backlogTab: 'CONVERSATIONS', backlogSelectedConversationIds: new Set(), backlogGraphCollapsed: true,
	backlogConversations: [], backlogChanges: [], backlogConversationStates: [], backlogLastFetched: {} };
const app = createBacklogApp({ state, api, esc, fmt: value => value ? '16 Sep 2026, 09:30' : '—', akSvg,
	alertBox: (id, ok, message) => { alerts.push({ ok, message }); if (el(id)) { el(id).hidden = false; el(id).textContent = message; } },
	confirmDialog: async () => allowDiscard, loadingDuckHtml,
	updatePortalUrl: () => {}, hydrateIconButtons: () => {}, waitForUiPaint: paint, withScopedLoadingOverlay: async (_id, task) => task() });
window.App = { ...mountWorkspaceFixtureShell({state,app:'backlog',root:el('backlogAppRoot')}), ...app, copyCurrentLink: () => {} };
await App.blLoad();App.blOpenTab('WORK_ITEM');await App.blOpenChange(100);window.captureReady=true;
