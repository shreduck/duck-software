// Real portal renderers/controllers with explicit in-memory responses. No production API is contacted.
import { state } from '/js/state.js';
import { createWorkbenchNavigationController } from '/js/app-navigation.js';
import { createWorkbenchHomeController } from '/js/app-home.js';
import { createResizeController } from '/js/components/resize-controller.js';
import { createDisplaySettingsController } from '/js/components/display-settings.js';
import { DISPLAY_APPEARANCE_THEME_OPTIONS, DISPLAY_COLOUR_THEME_OPTIONS, DISPLAY_VISION_THEME_OPTIONS } from '/js/components/display-settings-options.js';
import { initializeActionMenus, renderActionMenu } from '/js/components/action-menu.js';
import { hydrateIconButtons } from '/js/components/icon-buttons.js';
import { loadingDuckHtml, loadingPlaceholderHtml } from '/js/components/loading-surfaces.js';
import { akSvg } from '/js/icons.js';
import { createAccountApp } from '/js/apps/account.js';
import { createConnectApp } from '/js/apps/connect.js';
import { createConfigurationApp } from '/js/apps/configuration.js';
import { createMcpApiDocsApp } from '/js/apps/mcp-api-docs.js';
import { createLogsApp } from '/js/apps/logs.js';
import { createAzureDevOpsApp } from '/js/apps/azure-devops.js';
import { createGitHubApp } from '/js/apps/github.js';

// Fictional Harbor Labs demonstration. Production controllers and renderers, local data only.
window.fixtureErrors = [];
window.fixtureRequests = [];
addEventListener('error', event => fixtureErrors.push(event.message));
addEventListener('unhandledrejection', event => fixtureErrors.push(String(event.reason)));
document.getElementById('bootLoadingOverlay')?.remove();
const paint = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
const fmt = value => value ? new Date(value).toLocaleString('en-GB', { timeZone: 'UTC' }) : '';
const val = id => document.getElementById(id)?.value?.trim() || '';
const hydrate = root => hydrateIconButtons(root, { renderIcon: akSvg });
const alertBox = (id, ok, message) => { const box = document.getElementById(id); if (box) { box.hidden = false; box.className = 'alert ' + (ok ? 'ok' : 'error'); box.textContent = message; } };
const user = { id: 1, username: 'harbor-demo', role: 'ADMIN', enabled: true, mustChangePassword: false };
const accesses = [
  ['CODE_SCANNER','Code Scanner'], ['SPEC_DOCS','Spec Docs'], ['AGENT_KITS','Agent Kits'], ['BACKLOG','Backlog'],
  ['PR_ANALYSIS','PR Analysis'], ['KANBAN','Kanban'], ['THINK_TRACE','Think Trace'], ['CONFIGURATION_READ','Configuration Read'],
  ['PERFORMANCE_RUNS','Performance Tracker'], ['TEST_SUITE','Test Suite'], ['BROWSER_AUTOMATION','Browser Automation'],
  ['BROWSER_QA','Browser QA'], ['JVM_MONITORING','JVM_MONITORING'], ['FETCH_PROXY','Fetch Proxy'], ['DEVOPS','Azure DevOps'], ['GITHUB','GitHub']
].map(([key,label]) => ({key,label,defaultSelected:!['TEST_SUITE','JVM_MONITORING'].includes(key)}));
const keys = [
 ['Harbor code assistant',['CODE_SCANNER','SPEC_DOCS','AGENT_KITS','GITHUB']],
 ['Release review assistant',['CODE_SCANNER','PR_ANALYSIS','DEVOPS']],
 ['Checkout measurements',['TEST_SUITE','PERFORMANCE_RUNS','BROWSER_AUTOMATION','BROWSER_QA','JVM_MONITORING']],
 ['Planning companion',['BACKLOG','KANBAN','THINK_TRACE']],
 ['Documentation publisher',['SPEC_DOCS','AGENT_KITS']],
 ['Retired sandbox agent',['CODE_SCANNER']]
].map(([label,toolAccesses],i)=>({id:i+1,label,toolAccesses,enabled:i<5,allowImmediateRemoteWrites:false,lastUsedAt:`2026-09-30T${String(14-i).padStart(2,'0')}:24:00Z`}));
const tools = [
 {name:'startMeasurement',accessKey:'TEST_SUITE',accessLabel:'Test Suite',beanType:'TestSuiteTools',description:'Start a reusable browser and JVM measurement from a saved profile. Returns a durable run ID and readiness state.',parameters:[{name:'profileIdOrAlias',type:'string',required:true,description:'Saved profile ID or owner-scoped alias.'},{name:'requestId',type:'string',required:true,description:'Idempotency key for this measurement.'},{name:'metadata',type:'object',required:false}],requestExample:{profileIdOrAlias:'Harbor#checkout',requestId:'checkout-demo-004',metadata:{commit:'demo-42b7e9',dataset:'200 products'}},responseExample:{id:104,runId:104,state:'RECORDING',readyForInteraction:true}},
 {name:'stopMeasurement',accessKey:'TEST_SUITE',accessLabel:'Test Suite',beanType:'TestSuiteTools',description:'Stop every collector for a measurement and retain its evidence. The browser and JVM remain open.',parameters:[{name:'runId',type:'integer',required:true}],requestExample:{runId:104},responseExample:{id:104,runId:104,state:'COMPLETED'}},
 {name:'searchCodeSymbols',accessKey:'CODE_SCANNER',accessLabel:'Code Scanner',beanType:'CodeScannerTools',description:'Find classes, methods and fields across an indexed repository.',parameters:[{name:'targetId',type:'integer',required:true,description:'Code scan target id.'},{name:'query',type:'string',required:true,description:'Symbol query.'},{name:'kinds',type:'array',required:false,description:'Optional symbol kinds.'}],requestExample:{targetId:7,query:'CheckoutService'},responseExample:[{name:'calculateTotal',kind:'METHOD'}]},
 {name:'getSpecDocFile',accessKey:'SPEC_DOCS',accessLabel:'Spec Docs',beanType:'SpecDocTools',description:'Read a document and its current revision.',parameters:[{name:'fileId',type:'integer',required:true}],requestExample:{fileId:42},responseExample:{title:'Checkout architecture',revision:7}},
 {name:'getBrowserSnapshot',accessKey:'BROWSER_AUTOMATION',accessLabel:'Browser Automation',beanType:'BrowserTools',description:'Inspect a browser tab using structured, actionable element references.',parameters:[{name:'sessionId',type:'string',required:true}],requestExample:{sessionId:'harbor-demo-browser'}},
 {name:'getPullRequest',accessKey:'DEVOPS',accessLabel:'Azure DevOps',beanType:'AzurePullRequestTools',description:'Read pull request details, reviewers and associated work-item IDs.',parameters:[{name:'pullRequestId',type:'integer',required:true}],requestExample:{pullRequestId:148}}
];
const docs={toolCount:tools.length,generatedAt:'2026-09-30T14:30:00Z',tools,groups:[...new Set(tools.map(t=>t.accessKey))].map(key=>({accessKey:key,accessLabel:tools.find(t=>t.accessKey===key).accessLabel,toolCount:tools.filter(t=>t.accessKey===key).length}))};
const displayFields = [
 ['appearanceTheme','Appearance','Light or dark workspace surfaces.',['light','dark']],
 ['colourTheme','Colour palette','Accent colours for the workspace.',DISPLAY_COLOUR_THEME_OPTIONS.map(option=>option.value)],
 ['visionTheme','Vision setting','Adjust contrast and colour perception.',DISPLAY_VISION_THEME_OPTIONS.map(option=>option.value)],
 ['uiDensity','Density','Spacing around controls and list rows.',['comfortable','compact']],
 ['uiScale','Interface scale','Scale workspace controls and typography.',['90','100','110','120']],
 ['uiFontScale','Font scale','Adjust reading size independently.',['90','100','110','120']]
].map(([name,label,description,values])=>({name,label,description,valueType:'STRING',classification:'PREFERENCE',constraints:{enum:values}}));
const projectConfigs=[
 {id:1,project:'Harbor Commerce',enabled:true,allowForcePush:true,ancestorWorkItemIds:[4200,4250],mcpKeyIds:[4],allowPullRequestWrites:true,pullRequestTargetBranches:['main','release/3.2'],pullRequestMcpKeyIds:[2],fields:[
 {referenceName:'Custom.ReleaseStream',displayName:'Release stream',workItemType:'User Story',valueType:'STRING',enabled:true,allowedValues:['Checkout','Catalog','Fulfilment'],allowFreeForm:false,required:true},
 {referenceName:'Custom.Impact.CustomerFacing',displayName:'Customer-facing change',workItemType:'Bug',valueType:'BOOLEAN',enabled:true,allowedValues:['true','false'],allowFreeForm:false},
 {referenceName:'Custom.RiskLevel',displayName:'Risk level',workItemType:'Task',valueType:'STRING',enabled:true,allowedValues:['Low','Medium','High'],allowFreeForm:false}]},
 {id:2,project:'Harbor Platform',enabled:true,allowForcePush:false,ancestorWorkItemIds:[5100],mcpKeyIds:[],allowPullRequestWrites:true,pullRequestTargetBranches:['main'],pullRequestMcpKeyIds:[2],fields:[]},
 {id:3,project:'Harbor Documentation',enabled:true,allowForcePush:false,ancestorWorkItemIds:[],mcpKeyIds:[],allowPullRequestWrites:false,pullRequestTargetBranches:[],pullRequestMcpKeyIds:[],fields:[]}
];
const runtimeRows=[
 ['Server port','SERVER_PORT','9999','Environment','HTTP/HTTPS port used by the Workbench server.'],
 ['Portal session timeout','APP_SESSION_TIMEOUT','1d','Application/default','Authenticated portal session lifetime.'],
 ['MCP server version','MCP_SERVER_VERSION','2.0.3','Environment','Version reported by the MCP protocol server.'],
 ['Application data directory','APP_DATA_DIR','/srv/harbor/workbench/data','Environment','Database, generated encryption key, logs and runtime data.'],
 ['Database JDBC URL','APP_DATABASE_URL','jdbc:postgresql://db.harbor-labs.example.invalid:5432/workbench','Environment','Primary Workbench database. H2 and PostgreSQL are supported.'],
 ['Database username','APP_DATABASE_USERNAME','harbor_workbench','Environment','Username used by the primary database connection.'],
 ['Database password','APP_DATABASE_PASSWORD','Configured (hidden)','Environment','Password used by the primary database connection.'],
 ['Public base URL','APP_PUBLIC_BASE_URL','https://workbench.harbor-labs.example.invalid','Environment','Base URL used by MCP tools for portal links.'],
 ['Browser global session limit','APP_BROWSER_MAX_GLOBAL_SESSIONS','8','Application/default','Maximum active browser sessions across all MCP keys.'],
 ['Browser sessions per key','APP_BROWSER_MAX_SESSIONS_PER_KEY','4','Application/default','Maximum active browser sessions for one MCP key.'],
 ['Fetch Proxy result lifetime','APP_FETCH_PROXY_TTL','5m','Application/default','Time completed Fetch Proxy results remain available.'],
 ['Neutral UI default','APP_NO_FUN_ALLOWED','false','Application/default','Enables neutral presentation by default.']
].map(([label,source,value,origin,description])=>({label,source,value,origin,description}));
const logMessages=[
 ['INFO','TestSuiteCoordinator','Measurement Harbor#checkout completed; browser and JVM evidence retained.'],
 ['INFO','BrowserTrackingService','Browser recorder stopped: 4 tabs, 128 requests, 241 metric observations.'],
 ['INFO','JvmTrackingService','JVM recorder stopped for Harbor API; recording group 206 retained.'],
 ['INFO','TestSuiteCoordinator','Initial navigation complete: https://shop.harbor-labs.example.invalid/checkout'],
 ['INFO','BrowserResetService','Configured-origin reset completed; cache and application storage cleared.'],
 ['INFO','TestSuiteCoordinator','Measurement Harbor#checkout preparing: browser and JVM selected.'],
 ['INFO','CodeScannerService','Index refreshed for harbor-api: 248 files, 1872 symbols, 64 routes.'],
 ['INFO','RepositoryQueryService','Release query completed: 18 pull requests and 42 associated work items.'],
 ['INFO','SpecDocService','Saved Checkout architecture revision 7.'],
 ['INFO','JobExecutionService','Nightly documentation inventory completed in 4.2 seconds.'],
 ['WARN','CodeScannerService','Generated sources excluded by the configured scan filters.'],
 ['INFO','PullRequestAnalysisService','Review package assembled for harbor-api pull request 148.'],
 ['INFO','KanbanService','Updated Harbor release board: 24 cards across 5 columns.'],
 ['INFO','FetchProxyService','Response stored: application/json, 18244 bytes, HTTP 200.'],
 ['INFO','BrowserSessionService','Reused profile-owned browser session for Harbor checkout QA.'],
 ['INFO','ConfigurationService','Configuration readiness check completed; no pending actions.'],
 ['INFO','AzureDevOpsCredentialService','Harbor Commerce connection validated.'],
 ['INFO','GithubCredentialService','harbor-labs / storefront connection validated.']
];
async function api(method,path){
 fixtureRequests.push({method,path});
 if(method!=='GET')throw new Error('This fictional screenshot fixture does not execute or save changes.');
 const endpoint=path.split('?')[0];
 if(endpoint==='/api/account')return user;
 if(endpoint==='/api/status')return {adminUser:'harbor-demo',mcpToolCalls:12846,hardening:{hardened:true,recommendations:[{state:'OK',label:'MCP authentication',detail:'Dedicated keys protect agent connections.'},{state:'OK',label:'Encrypted transport',detail:'HTTPS and secure WebSockets are enabled.'}]},components:[{label:'MCP server',state:'OK',detail:'Streamable HTTP ready · dedicated agent keys'},{label:'Database',state:'OK',detail:'PostgreSQL · migrations up to date'},{label:'Azure DevOps',state:'OK',detail:'Harbor Commerce · connection verified'},{label:'GitHub',state:'OK',detail:'harbor-labs / storefront · connection verified'},{label:'Code Scanner',state:'OK',detail:'3 indexed targets · 1,872 symbols available'},{label:'Browser Automation',state:'OK',detail:'Chrome and Brave definitions available'},{label:'Performance Tracker',state:'OK',detail:'Browser and JVM monitoring ready'}]};
 if(endpoint==='/api/account/users')return [user,{id:2,username:'alex.harbor',role:'USER',enabled:true},{id:3,username:'sam.harbor',role:'USER',enabled:true}];
 if(endpoint==='/api/account/mcp-tool-accesses')return accesses;
 if(endpoint==='/api/account/mcp-keys')return keys;
 if(endpoint==='/api/configuration-assistance/catalog')return {data:{domains:[{type:'preferences.display',label:'Display preferences',resources:[{id:'1',label:'Harbor demo account'}],fields:displayFields}]}};
 if(endpoint==='/api/configuration-assistance/resources/preferences.display/1')return {outcome:'READ',readiness:'READY',data:{type:'preferences.display',resourceId:'1',revision:'demo-7',fields:displayFields,values:{appearanceTheme:'light',colourTheme:'duck-squirrel-song',visionTheme:'standard',uiDensity:'comfortable',uiScale:'100',uiFontScale:'100'}}};
 if(endpoint==='/api/configuration-assistance/drafts')return {data:{drafts:[{id:'demo-draft-1',type:'preferences.display',operation:'update',resourceId:'1',revision:2,createdAt:'2026-09-30T12:10:00Z',updatedAt:'2026-09-30T12:15:00Z',title:'Compact display for review sessions',status:'DRAFT'}]}};
 if(endpoint==='/api/configuration')return runtimeRows;
 if(endpoint==='/api/configuration/transport')return {tlsEnabled:true,generatedCertificate:false,restartNotice:'Changes apply after restart.',source:'DATABASE'};
 if(endpoint==='/api/configuration/ui-policy')return {adminDefault:false,adminForced:false,userConfigurable:true};
 if(endpoint==='/api/configuration/app-data/scopes')return [{id:'logs',label:'Logs',description:'Clear retained application logs.'},{id:'test-suite',label:'Test Suite',description:'Reset measurement profiles and run manifests.'}];
 if(endpoint==='/api/mcp-api-docs')return docs;
 if(endpoint==='/api/credentials')return ['Harbor Commerce','Harbor Platform','Harbor Documentation','Harbor Sandbox'].map((project,i)=>({id:i+1,label:project,organizationUrl:'https://dev.azure.com/harbor-labs-demo',defaultProject:project,enabled:i===0,authType:i===0?'OAUTH':'PAT',lastValidationOk:true,lastValidationMessage:'Connection verified'}));
 if(endpoint==='/api/credentials/project-configurations')return projectConfigs;
 if(endpoint==='/api/azure/projects')return projectConfigs.map(c=>({id:'project-'+c.id,name:c.project}));
 if(endpoint==='/api/azure/work-items')return [{id:4200,title:'Checkout experience',workItemType:'Epic',state:'Active'},{id:4250,title:'Release 3.2 readiness',workItemType:'Feature',state:'Active'}];
 if(endpoint==='/api/credentials/oauth/config')return {browserSignInConfigured:true,redirectUri:'https://workbench.harbor-labs.example.invalid/oauth/azure-devops/callback'};
 if(endpoint==='/api/github-credentials')return ['storefront','harbor-api','design-system','developer-docs'].map((repo,i)=>({id:i+1,label:['Harbor storefront','Commerce services','Design system','Developer handbook'][i],defaultOwner:'harbor-labs-demo',defaultRepository:repo,enabled:i===0,authType:i===0?'OAUTH':'PAT',githubLogin:i===0?'harbor-demo':null,lastValidationOk:true,lastValidationMessage:'Repository access verified'}));
 if(endpoint==='/api/github-credentials/oauth/config')return {browserSignInConfigured:true,deviceSignInConfigured:true};
 if(endpoint==='/api/logs')return [...logMessages,...logMessages.slice(5)].map(([level,logger,message],i)=>({epochMillis:1790778600000-i*23100,level,logger:'com.duck.mcp.'+logger,message}));
 if(endpoint==='/api/logs/audit')return {entries:logMessages.slice(0,12).map((_,i)=>({createdAt:new Date(1790778600000-i*25100).toISOString(),method:'GET',path:['/api/test-suite/runs/demo-run-004','/api/performance/tracking-groups/206','/api/code-scanner/targets','/api/repository-query/pull-requests'][i%4],status:200,actor:'harbor-demo',durationMillis:28+i*3,responseContentType:'application/json'})),page:0,totalPages:3,totalElements:54,size:20};
 throw new Error(`Unexpected fictional setup request: ${method} ${path}`);
}
let navigation, navigationGuard = null;
const showApp = async app => {
	if (navigationGuard && !await navigationGuard(app)) return false;
	return navigation.showApp(app);
};
const showSub = (sub, button) => navigation.showSub(sub, button);
const options = { state, api, alertBox, confirmDialog: async () => false, esc, fmt, val, hydrateIconButtons: hydrate, loadingDuckHtml, akSvg, showSub, openExternalLink: () => {} };
const registry = {
	resizeController: createResizeController({ state }),
	accountApp: createAccountApp(options),
	connectApp: createConnectApp(options),
	configurationApp: createConfigurationApp({ ...options, loadUiPolicy: async () => {} }),
	mcpApiDocsApp: createMcpApiDocsApp(options),
	logsApp: createLogsApp(options),
	azureDevOpsApp: createAzureDevOpsApp(options),
	githubApp: createGitHubApp(options)
};
const displaySettings = createDisplaySettingsController({ state });
const home = createWorkbenchHomeController({ ...options, loadingPlaceholderHtml, renderIcon: akSvg, hydrateIcons: hydrate, uiBuildVersion: '2.0.3', hardeningOverlay: { bind() {} } });
navigation = createWorkbenchNavigationController({ registry, homeController: home, displaySettings, hydratePortalIcons: hydrate, renderIcon: akSvg, navigateToApp: showApp });
window.App = { ...displaySettings, ...registry.accountApp, ...registry.connectApp, ...registry.configurationApp, ...registry.mcpApiDocsApp, ...registry.logsApp, ...registry.azureDevOpsApp, ...registry.githubApp, showApp, showSub, toggleAppSidebar: registry.resizeController.toggleAppSidebar };
navigation.ensureTopbarShell();
home.renderUiVersion();
navigation.preselectInitialApp();
registry.resizeController.initAppSidebarResize();
displaySettings.initTheme();
displaySettings.initUiScale();
displaySettings.initDisplaySettingsDismissal();
initializeActionMenus();
navigation.bindNavigationEvents();


state.noFunAllowedUserConfigurable=true;
window.websiteSetup = {
 async open(scene){
  const neutral=scene.startsWith('neutral-');
  const app=scene.replace('neutral-','').replace('mcp-apis','mcpdocs').replace('azure-project-config','azure');
  displaySettings.setAppearanceTheme('light');
  displaySettings.setNoFunAllowed(neutral);
  await showApp(app); await new Promise(resolve=>setTimeout(resolve,120));
  if(scene==='configuration')App.showConfigurationTab('config-assistant',document.querySelector('[data-configuration-tab="config-assistant"]'));
  if(scene==='neutral-configuration')App.showConfigurationTab('config-runtime',document.querySelector('[data-configuration-tab="config-runtime"]'));
  if(scene==='azure'||scene==='github'){
   document.querySelector(`#${app}-setup .ui-setup-disclosure`).open=true;
   if(scene==='azure'){
    document.getElementById('c_label').value='Harbor analytics';
    document.getElementById('c_project').value='Harbor Analytics';
    document.getElementById('c_org').value='https://dev.azure.com/harbor-labs-demo';
   }else{
    document.getElementById('gh_label').value='Harbor mobile';
    document.getElementById('gh_owner').value='harbor-labs-demo';
    document.getElementById('gh_repo').value='mobile-checkout';
    document.getElementById('gh_api').value='https://api.github.com';
   }
  }
  if(scene==='azure-project-config'){
   const tab=document.querySelector('[data-sub="azure-automation"]');App.showSub('azure-automation',tab);
   const card=document.querySelector('#azRepositoryConfigs details');card.open=true;
   await paint();card.scrollIntoView({block:'start'});
  }
  if(scene==='account')document.getElementById('mcp_key_label').value='Harbor release assistant';
  if(scene==='connect'){
   App.showConnectTab('connect-claude-code',document.querySelector('[data-connect-tab="connect-claude-code"]'));
   // Substitute a reserved fictional deployment hostname in generated examples.
   document.querySelectorAll('#connect pre code').forEach(node=>node.textContent=node.textContent.replaceAll(location.origin,'https://workbench.harbor-labs.example.invalid'));
  }
  if(scene==='neutral-home')displaySettings.toggleDisplaySettings();
  else displaySettings.closeDisplaySettings();
  hydrate(document);await paint();
  if(scene!=='azure-project-config'){document.querySelector('.view').scrollTop=0;document.querySelector('.app.active').scrollTop=0;}
  return {scene,errors:[...fixtureErrors],width:innerWidth,documentWidth:document.documentElement.scrollWidth,requests:fixtureRequests.length};
 }
};
await websiteSetup.open('home');
window.websiteSetupReady = true;
