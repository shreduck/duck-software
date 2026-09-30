import { initializeTabs } from '/js/components/tabs.js';
import { createCodeScannerFullscreenControls } from '/js/apps/code-scanner-fullscreen.js';
import { createCodeScannerShellWorkflow } from '/js/apps/code-scanner-shell.js';
import { createAgentKitsShell } from '/js/apps/agent-kits-shell.js';
import { createAgentKitsBrowser } from '/js/apps/agent-kits-browser.js';
import { createAgentKitsEditor } from '/js/apps/agent-kits-editor.js';
import { createRepositoryQueryApp } from '/js/apps/repository-query.js';
import { createWorkbenchNavigationController } from '/js/app-navigation.js';
import { createResizeController } from '/js/components/resize-controller.js';
import { createDisplaySettingsController } from '/js/components/display-settings.js';
import { createCodeScannerFileTreeRenderer } from '/js/apps/code-scanner-file-tree-renderer.js';
import { createCodeScannerAnalyzeShell } from '/js/apps/code-scanner-analyze-shell.js';
import { createCodeScannerAnalyzeTabs } from '/js/apps/code-scanner-analyze-tabs.js';
import { createCodeScannerPanelControls } from '/js/apps/code-scanner-panels.js';
import { createCodeScannerSourceRenderer } from '/js/apps/code-scanner-source-renderer.js';
import { createSpecDocsShell } from '/js/apps/spec-docs-shell.js';
import { createSpecDocsBrowser } from '/js/apps/spec-docs-browser.js';
import { createSpecDocsEditor } from '/js/apps/spec-docs-editor.js';
import { createFileViewer } from '/js/file-viewer.js';
import { observeAdaptiveWorkspaces, getAdaptiveWorkspace, focusAdaptivePane, createAdaptiveWorkspace } from '/js/components/adaptive-workspace.js';
import { initializeActionMenus } from '/js/components/action-menu.js';
import { hydrateIconButtons } from '/js/components/icon-buttons.js';
import { loadingDuckHtml } from '/js/components/loading-surfaces.js';
import { akSvg } from '/js/icons.js';
document.getElementById('bootLoadingOverlay')?.remove();
localStorage.setItem('specDocLeftWidth','360');localStorage.setItem('agentKitLeftWidth','360');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const hydrate = root => hydrateIconButtons(root, { renderIcon: akSvg });
const state = { csTarget: { id: 1, displayName: 'Harbor Commerce · main', indexedCommit: '724cd86da1b2', scannerVersion: '2.0.3' }, csFilesWidth: 260, csDetailsWidth: 300,
 csAnalyzeTab: 'source', csHighlightedLine: 8, csSymbols: [], sdProject: 'Harbor Commerce', sdEditing: false, sdWordWrap: true, sdMarkdownPreview: false,
 sdFiles: Array.from({length:24}, (_, i) => ({id:i+1, project:'Harbor Commerce', module: i < 8 ? 'Platform' : i < 16 ? 'Runtime' : 'Workflows', path: `${['architecture','orders','inventory','payments','delivery','refunds','events','operations'][i%8]}.md`, filename:`${['architecture','orders','inventory','payments','delivery','refunds','events','operations'][i%8]}.md`, title: i === 0 ? 'Order processing architecture' : ['Architecture overview','Order lifecycle','Inventory reservations','Payment authorization','Delivery estimates','Refund policy','Event contracts','Operational playbook'][i%8], updatedBy:'Maya Chen', updatedAt:'2026-09-25'})),
 sdHistory: [{ id: 10, version: 3, action: 'Updated', summary: 'Describe adaptive panes', actor: 'Team', createdAt: '2026-09-25' }], sdTree: [] };
state.sdFile = {...state.sdFiles[0], content: '# Workspace architecture\n\nKeep the document central while browsing its files and context.\n\n## Principles\n\n- Navigation never starts a task.\n- Saved preferences survive resizing.\n- Source and document drafts stay in place.\n\n' + Array.from({length:50},(_,i)=>`### Detail ${i+1}\nA practical implementation note for the shared Workbench workspace.\n`).join('\n')};
state.sdFiles[0]=state.sdFile;state.sdFiles.push({...state.sdFile,id:101,path:'architecture.stack.md',filename:'architecture.stack.md',title:'Workspace architecture · Stack',content:'# Workspace stack\n\nController → Service → Repository.'});
let copied = 0, scanned = 0;window.fixtureFileActions=[];
const panelControls = createCodeScannerPanelControls({ state, renderGraph() {} });
const scannerMeta = () => ({ className:'scanner-java', icon:'file', label:'Java', shortLabel:'Java' });
const tabs = createCodeScannerAnalyzeTabs({ state, esc, akSvg, isMavenTarget:()=>false, scannerMeta, scannerViewTargets:()=>[], hydrateIcons:()=>hydrate(document.getElementById('codescanner')) });
state.csScreen='analyze';
const scannerWorkflow=createCodeScannerShellWorkflow({state,analyzeTabs:tabs,ensureAnalyzeShellRendered(){},renderFileTree(){},hierarchySearch:{renderHierarchy(){}},helpTab:{renderHelp(){}}});scannerWorkflow.ensureCodeScannerAppShell();
window.fixtureSetScannerScreen=screen=>{state.csScreen=screen;scannerWorkflow.applyScreens();};

const fullscreenControls=createCodeScannerFullscreenControls({state,hydrateIcons:()=>hydrate(document),refreshVisibleGraphs(){},targetTitle:()=>state.csTarget.displayName});
const scanner = createCodeScannerAnalyzeShell({ state, esc, akSvg, setLoadingOverlay(){}, scannerMeta, targetSourceLine:()=> 'harbor-commerce / main', analyzeTabs:tabs, fullscreenControls, panelControls });
scanner.renderAnalyzeShell(); scanner.renderWorkspaceHeader();scannerWorkflow.applyScreens(); panelControls.initPanelState(); panelControls.applyAnalyzePanelState();
const source = createCodeScannerSourceRenderer({state,esc,akSvg,loadingDuckHtml});
document.getElementById('csSource').innerHTML = source.renderSourceLines('package com.harbor.commerce;\n\npublic final class OrderController {\n    private final OrderService service;\n\n    public Workspace open(String id) {\n        return service.open(id);\n    }\n\n' + Array.from({length:100},(_,i)=>`    // Indexed source line ${i+11}: content keeps its scroll position while panes change.`).join('\n') + '\n}');
document.getElementById('csOutline').innerHTML = source.renderOutline([{id:1,kind:'CLASS',name:'OrderController'}, {id:2,kind:'METHOD',name:'open'}]);
state.csCollapsedFolders=new Set(); state.csCheckedFileIds=new Set();
const sourceFiles=Array.from({length:35},(_,i)=>({id:i+1,path:`src/main/java/${i===0?'OrderController':['OrderService','OrderRepository','CheckoutService','PaymentGateway','InventoryService','ShipmentPlanner','CatalogController','PricingService','CustomerService','BasketController','OrderEvents','RefundService','ShippingPolicy','StockReservation','PaymentReceipt','DeliveryEstimate','CatalogRepository','PromotionService','AddressValidator','Money','OrderStatus','OrderMapper','FulfillmentWorker','ReservationListener','InvoiceService','TaxCalculator','IdempotencyStore','AuditTrail','FeatureFlags','CacheConfiguration','ApiSecurity','WebhooksController','OrderSearch','RateLimiter'][i-1]}.java`}));
const treeRenderer=createCodeScannerFileTreeRenderer({state,esc,akSvg,loadingDuckHtml,isMaven:()=>false,visibleCodeScannerFiles:()=>sourceFiles,fileQuery:()=>'',buildFileTree:files=>({folders:new Map([['src/main/java',{folders:new Map(),files}]]),files:[]}),filesUnderTreeNode:node=>node.files,fileScopeControlsVisible:()=>false});treeRenderer.renderFileTree();
document.getElementById('csGraphDetails').innerHTML = '<h3>OrderController</h3><p class="muted">com.harbor.commerce</p><dl><dt>Kind</dt><dd>Class</dd><dt>References</dt><dd>14 incoming · 8 outgoing</dd></dl><label>Inspect symbol<input id="fixtureSymbolFilter" value="Workspace"/></label>';
document.getElementById('csGraphEdges').innerHTML = '<div class="detail-item">OrderService.open → Workspace</div><div class="detail-item">OrderRepository.find</div>';
const sd = createSpecDocsShell({state,loadingHtml:loadingDuckHtml({label:'Loading documents'})}); sd.ensureSdShell();
document.getElementById('sdProjectsScreen').hidden = true; document.getElementById('sdWorkspaceScreen').hidden = false; document.getElementById('sdLandingHead').hidden = true;
document.getElementById('sd-project-title').textContent='Harbor Commerce'; document.getElementById('sd-project-meta').textContent='24 documents · 3 modules';
const browser = createSpecDocsBrowser({state,esc,fmt:value=>value,akSvg}); browser.renderSdFiles(); browser.renderSdBreadcrumbs();
const fileViewer = createFileViewer({state,esc,hydrateIconButtons:hydrate});
const editor = createSpecDocsEditor({state,api:async()=>{throw new Error('Fixture must not persist data');},alertBox(){},confirmDialog:async()=>false,copyText:async()=>{copied++;},esc,fmt:value=>value,fileViewer,withSpecDocsOverlay:async(label,detail,task)=>task(),sdOpen:async id=>{state.sdFile=state.sdFiles.find(file=>file.id===id);editor.renderSdEditor();browser.renderSdFiles();browser.renderSdBreadcrumbs();},...browser}); editor.renderSdEditor(); editor.renderSdHistory();
document.getElementById('sdStackGraph').innerHTML='<h4>Application context</h4><p class="muted">OrderController → OrderService → OrderRepository</p><svg viewBox="0 0 240 160" aria-label="Context graph"><path d="M120 28V132" stroke="currentColor"/><rect x="35" y="10" width="170" height="36" rx="4" fill="var(--primary-soft)" stroke="var(--primary)"/><rect x="35" y="65" width="170" height="36" rx="4" fill="var(--panel-2)" stroke="var(--border)"/><rect x="35" y="120" width="170" height="36" rx="4" fill="var(--panel-2)" stroke="var(--border)"/><text x="120" y="33" text-anchor="middle" fill="currentColor">Controller</text><text x="120" y="88" text-anchor="middle" fill="currentColor">Service</text><text x="120" y="143" text-anchor="middle" fill="currentColor">Repository</text></svg>';
Object.assign(state, {akEditing:false,akWordWrap:true,akMarkdownPreview:false,akViewedHistoryId:null,
 akFiles:Array.from({length:18},(_,i)=>({id:i+1,project:'Harbor Commerce',kind:i<6?'agent':'skill',type:i<6?'agents':'skills',filename:`${['commerce-engineer','api-reviewer','incident-investigator','release-assistant','schema-designer','browser-explorer','java-conventions','contract-testing','security-review','database-migrations','accessibility','deployment-checklist','performance-analysis','observability','event-contracts','code-review','documentation','test-data'][i]}.md`,path:`${['commerce-engineer','api-reviewer','incident-investigator','release-assistant','schema-designer','browser-explorer','java-conventions','contract-testing','security-review','database-migrations','accessibility','deployment-checklist','performance-analysis','observability','event-contracts','code-review','documentation','test-data'][i]}.md`,title:i===0?'Commerce engineering agent':['Commerce engineering agent','API reviewer','Incident investigator','Release assistant','Schema designer','Browser explorer','Java conventions','Contract testing','Security review','Database migrations','Accessibility checks','Deployment checklist','Performance analysis','Observability','Event contracts','Code review','Documentation','Test data'][i],updatedBy:'Maya Chen',updatedAt:'2026-09-25'})),
 akHistory:[{id:201,version:3,title:'Refine review guidance',createdBy:'Team',createdAt:'2026-09-25',content:'# Repository assistant\nCurrent guidance.'},{id:202,version:2,title:'Document testing workflow',createdBy:'Team',createdAt:'2026-09-24',content:'# Repository assistant\nPrevious guidance.'}],akTree:[]});
state.akFile={...state.akFiles[0],content:'# Repository assistant\n\nInspect the workspace before making changes.\n\n'+Array.from({length:45},(_,i)=>`## Guideline ${i+1}\nPreserve local edits, review focused tests and explain the resulting behavior.\n`).join('\n')};
const ak=createAgentKitsShell({state,loadingHtml:loadingDuckHtml({label:'Loading agent files'})});ak.ensureAkShell();
const akBrowser=createAgentKitsBrowser({state,esc,akSvg});akBrowser.renderAkFiles();
const akEditor=createAgentKitsEditor({state,api:async()=>{throw new Error('Fixture must not persist data');},alertBox(){},confirmDialog:async()=>false,copyText:async()=>{copied++;},esc,fmt:value=>value,val:id=>document.getElementById(id)?.value||'',fileViewer,ensureAkModalShells:ak.ensureAkModalShells,renderAkFiles:akBrowser.renderAkFiles});akEditor.renderAkEditor();akEditor.renderAkHistory();
window.fixtureQueryRequests=[];
const query=createRepositoryQueryApp({esc,fmt:value=>value,hydrateIconButtons:hydrate,alertBox(id,ok,message){const node=document.getElementById(id);node.hidden=false;node.textContent=message;},api:async(method,path,body)=>{
 fixtureQueryRequests.push({method,path,body});
 if(path.includes('search-support'))return {maximumPageSize:100,maximumRangeCommits:1000,aggregations:['STATUS','AUTHOR'],filters:[{key:'status',label:'Status',valueType:'ENUM',allowedValues:['active','completed'],description:'Pull request state.'},{key:'creatorId',label:'Creator',valueType:'USER_ID',description:'Filter by identity.'},{key:'minTime',label:'Updated after',valueType:'INSTANT',description:'Earliest update time.'}]};
 if(path==='/api/azure/projects')return [{name:'Harbor Commerce'}];
 if(path.includes('/repositories'))return [{name:'harbor-commerce',owner:'harbor-team',defaultBranch:'main'}];
 if(path.includes('/branches'))return [{name:'main'},{name:'release/2.0'}];
 if(method==='POST'&&path.endsWith('/pull-requests/search'))return {pullRequests:Array.from({length:12},(_,i)=>({number:120+i,title:['Reserve inventory before confirming checkout','Add idempotency keys to payment authorization','Expose delivery estimates in order detail','Cache catalog category navigation','Handle partial shipment notifications','Improve promotion code validation','Add refund audit trail','Reduce catalog query allocations','Document order event contracts','Upgrade webhook signature validation','Retry stock reservations with bounded backoff','Add order search pagination'][i],repository:'harbor-commerce',author:['Maya Chen','Alex Rivera','Sam Patel','Jordan Lee'][i%4],status:i%2?'completed':'active',sourceBranch:`feature/${['inventory-reservation','payment-idempotency','delivery-estimates','catalog-cache'][i%4]}`,targetBranch:'main',updatedAt:'2026-09-25',url:`https://example.invalid/pull/${120+i}`,matchingCommitIds:['724cd86da1b2'],workItemIds:[321,654]})),nextCursor:body.cursor?null:'page-2'};
 if(method==='POST'&&path.endsWith('/git/history'))return {commits:Array.from({length:9},(_,i)=>({commitId:`724cd86da1b${i}`,subject:`Preserve repository workflow ${i+1}`,authorName:'Engineering team',committedAt:'2026-09-25',parentIds:['abc'],pullRequests:[],url:'https://example.invalid/commit/abc'})),nextCursor:null};
 throw new Error(`Unexpected fixture request ${method} ${path}`);
}});
const resizeController=createResizeController({state});
const displaySettings=createDisplaySettingsController({state});
const navigation=createWorkbenchNavigationController({registry:{resizeController},displaySettings,hydratePortalIcons:hydrate,renderIcon:akSvg,navigateToApp:app=>window.fixtureShow(({specdocs:'docs',agentkits:'agentkits',repositoryquery:'query'})[app]||'scanner')});
window.App = { ...fullscreenControls, ...displaySettings, ...sd, ...editor, ...ak, ...akBrowser, ...akEditor, ...query, akNewProject(){},akNewFolder(){},akNewFile(){},akLoad(){},akOpen(){focusAdaptivePane('akLayout','main');},akRenameFile(){},akDelete(){},akRenameFolder(){},akDeleteFolder(){},akDuplicateFile(){},akDeleteFile(){}, toggleAppSidebar:resizeController.toggleAppSidebar, csTogglePanel:panelControls.csTogglePanel, csLoad(){},csOpenRescanModal(){}, csRefreshStale(){}, csResetProjectFocus(){}, csDeleteTarget(){}, csRunScan(){scanned++;},
 csShowAnalyzeTab(tab){state.csAnalyzeTab=tab;tabs.applyAnalyzeTabChrome();}, csSelectSymbol(){focusAdaptivePane('csAnalyzeLayout','details');},
 csOpenFile(){fixtureFileActions.push('open');focusAdaptivePane('csAnalyzeLayout','main');}, csToggleFolder(){}, csCopyFileName(event,id,format){fixtureFileActions.push(format);event.stopPropagation();}, csToggleFileCopyMenu(){}, csDebugFile(event){fixtureFileActions.push('debug');event.stopPropagation();}, fixtureOpenSource(){focusAdaptivePane('csAnalyzeLayout','main');}, fixtureFullscreen(){document.body.classList.toggle('cs-analyze-fullscreen');},
 sdBackToProjects(){}, sdRenameFile(){}, sdDelete(){}, sdOpenContextModal(){}, sdOpen(){focusAdaptivePane('sdLayout','main');}, sdToggleFolder(){}, sdDeleteModule(){}, sdDeleteFolder(){},
 sdNewFolder(){}, sdNewFile(){}, sdCopy:editor.sdCopy,
 showSub(id,button){const parent=button.parentElement.parentElement;parent.querySelectorAll(':scope > .subview').forEach(view=>view.classList.toggle('active',view.id===id));},
 openFilePreviewModal(){}, csExpandAllFolders(){document.querySelectorAll('#csFiles details').forEach(node=>node.open=true);}, csCollapseAllFolders(){document.querySelectorAll('#csFiles details').forEach(node=>node.open=false);}, csCheckVisibleFiles(){}, csUncheckAllFiles(){} };
await query.loadRepositoryQuery();await query.runRepositoryQuery();
navigation.ensureTopbarShell();navigation.preselectInitialApp();resizeController.initAppSidebarResize();displaySettings.initTheme();displaySettings.initUiScale();displaySettings.initDisplaySettingsDismissal();navigation.bindNavigationEvents();
hydrate(document); initializeActionMenus(); initializeTabs(); const adaptive=observeAdaptiveWorkspaces();resizeController.initAgentKitResize();resizeController.initSpecDocResize();
function updateNavigation(){adaptive.refresh();}
window.fixtureShow = async name => { const app=({docs:'specdocs',scanner:'codescanner',agentkits:'agentkits',query:'repositoryquery'})[name];document.querySelectorAll('section.app').forEach(node=>node.classList.toggle('active',node.id===app));document.querySelectorAll('.sidebar [data-app]').forEach(node=>{node.classList.toggle('active',node.dataset.app===app);if(node.dataset.app===app)node.setAttribute('aria-current','page');else node.removeAttribute('aria-current');});updateNavigation();await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))); return window.fixtureMeasure(name); };
const layoutId=name=>({docs:'sdLayout',scanner:'csAnalyzeLayout',agentkits:'akLayout',query:'repositoryQueryWorkspace'})[name];
window.fixtureMeasure = name => { const layout=document.getElementById(layoutId(name));const main=layout.querySelector('[data-adaptive-role=main]') || (name==='query'?layout:document.getElementById(name==='docs'?'sdEditorPanel':name==='agentkits'?'akEditorPanel':'csCenterPanel'));return {mode:layout.dataset.adaptiveMode,width:layout.clientWidth,height:layout.clientHeight,mainWidth:main.getBoundingClientRect().width,mainHeight:main.getBoundingClientRect().height,pageWidth:document.documentElement.scrollWidth,localWidth:layout.scrollWidth,viewport:innerWidth,visible:[...layout.querySelectorAll(':scope > [data-adaptive-hidden=false]')].map(node=>node.dataset.adaptivePane), draft:document.getElementById(name==='agentkits'?'ak_content':'sd_content').value, copied,scanned};};
window.fixtureController=name=>getAdaptiveWorkspace(document.getElementById(layoutId(name)));
window.fixtureStartEditing=(name='docs')=>{name==='agentkits'?App.akEdit():App.sdEdit();const el=document.getElementById(name==='agentkits'?'ak_content':'sd_content');el.value+='\nUNSAVED-DRAFT';el.setSelectionRange(9,17);el.scrollTop=200;window.fixtureDraft=el;window.fixtureSelection=[el.selectionStart,el.selectionEnd];};
window.fixtureLifecycle = async () => {
 const host=document.createElement('div');host.hidden=true;host.innerHTML='<div class="primary"></div><aside class="secondary"></aside>';document.body.append(host);
 const options={root:host,panes:[{id:'main',selector:'.primary',role:'main'},{id:'details',selector:'.secondary'}]};
 const first=createAdaptiveWorkspace(options);host.innerHTML='<div class="primary"></div><aside class="secondary"></aside>';const second=createAdaptiveWorkspace(options);
 const replaced=first!==second;host.remove();await new Promise(resolve=>requestAnimationFrame(resolve));return {replaced,disposed:!getAdaptiveWorkspace(host)};
};
await window.fixtureShow('scanner'); window.fixtureReady=true;


// All content below is synthetic and stays inside this browser page.
const sampleSource=`package com.harbor.commerce.orders;

import com.harbor.commerce.inventory.StockReservation;
import com.harbor.commerce.payments.PaymentReceipt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public final class OrderController {
    private final OrderService orders;
    private final InventoryService inventory;
    private final PaymentGateway payments;

    public OrderController(OrderService orders,
                           InventoryService inventory,
                           PaymentGateway payments) {
        this.orders = orders;
        this.inventory = inventory;
        this.payments = payments;
    }

    @PostMapping
    public OrderReceipt placeOrder(@RequestBody CheckoutRequest request) {
        StockReservation stock = inventory.reserve(request.items());
        PaymentReceipt payment = payments.authorize(request.payment());
        return orders.confirm(request, stock, payment);
    }

    @GetMapping("/{orderId}")
    public OrderDetail findOrder(@PathVariable String orderId) {
        return orders.findWithDeliveryEstimate(orderId);
    }

    @PostMapping("/{orderId}/cancel")
    public OrderReceipt cancelOrder(@PathVariable String orderId) {
        return orders.cancelAndReleaseInventory(orderId);
    }
}`;
document.getElementById('csSource').innerHTML=source.renderSourceLines(sampleSource);
state.csSymbols=[{id:1,kind:'CLASS',name:'OrderController',lineStart:9},{id:2,kind:'METHOD',name:'placeOrder',lineStart:23},{id:3,kind:'METHOD',name:'findOrder',lineStart:30},{id:4,kind:'METHOD',name:'cancelOrder',lineStart:35}];document.getElementById('csOutline').innerHTML=source.renderOutline(state.csSymbols);
const docContent=`# Order processing architecture

Harbor Commerce accepts orders through a single checkout boundary. Inventory, payment and delivery services coordinate through durable events.

## Request flow

1. Validate the basket and calculate the final price.
2. Reserve stock for each fulfillment location.
3. Authorize payment with the request's idempotency key.
4. Confirm the order and publish an OrderConfirmed event.
5. Build a delivery estimate from warehouse and carrier availability.

## Service responsibilities

| Service | Owns | Contract |
| --- | --- | --- |
| Orders | Checkout lifecycle and order status | /api/orders |
| Inventory | Reservations and stock availability | StockReserved |
| Payments | Authorizations, captures and refunds | PaymentAuthorized |
| Fulfillment | Packing and delivery estimates | ShipmentCreated |

## Failure handling

Reservations expire after fifteen minutes. A declined authorization releases stock immediately. Consumers deduplicate events by event ID before applying changes.

## Operational signals

- Track checkout duration, payment retries and reservation expiry.
- Retain correlation IDs across HTTP requests and event messages.
- Record deployment version alongside every measurement run.

## Related decisions

ADR-014: transactional outbox · ADR-018: idempotent checkout · ADR-023: partial shipments
`;
state.sdFile.content=docContent;editor.renderSdEditor();await editor.sdTogglePreview();
state.sdHistory=[{id:10,version:6,action:'UPDATED',summary:'Describe partial shipment events',actor:'Maya Chen',createdAt:'2026-09-28T11:45:00Z'},{id:9,version:5,action:'UPDATED',summary:'Add idempotency and retry decisions',actor:'Alex Rivera',createdAt:'2026-09-24T09:20:00Z'},{id:8,version:4,action:'UPDATED',summary:'Document reservation expiry',actor:'Sam Patel',createdAt:'2026-09-18T15:10:00Z'}];editor.renderSdHistory();
state.akFile.content=`# Commerce engineering agent

## Mission

Make focused changes to Harbor Commerce while preserving API contracts, order history and operational visibility.

## Before changing code

- Read the order-processing specification and the nearest service README.
- Use Code Scanner to inspect callers, endpoints and data access.
- Identify the affected API contract and event schema.
- Check the current branch and preserve unrelated local work.

## Implementation guidance

### Orders and inventory

Keep reservations explicit. Never confirm an order before stock and payment are ready. Use the existing idempotency store when accepting retries.

### API changes

Prefer additive fields. Update the OpenAPI contract and include examples with fictional customer data.

### Verification

1. Run focused unit and integration tests.
2. Exercise checkout in the browser with the Harbor demo catalog.
3. Capture a Test Suite measurement for performance-sensitive changes.
4. Record findings and source links in Think Trace.

## Review output

Explain the resulting behavior, relevant tests and remaining limitations. Link the implementation to its Backlog proposal.
`;
akEditor.renderAkEditor();await akEditor.akTogglePreview();
window.screenshotState=state;window.screenshotSourceFiles=sourceFiles;
window.captureReady=true;
