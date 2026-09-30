// Fictional Harbor engineering workspace. No live services or credentials.
import { mountWorkspaceFixtureShell } from '/workspace-fixture-shell.js';
import { createJobsApp } from '/js/apps/jobs.js';
import { createBrowsersApp } from '/js/apps/browsers.js';
import { createFetchProxyApp } from '/js/apps/fetch-proxy.js';
import { createFileViewer } from '/js/file-viewer.js';
import { initializeActionMenus } from '/js/components/action-menu.js';
import { hydrateIconButtons } from '/js/components/icon-buttons.js';
import { loadingDuckHtml, loadingPlaceholderHtml } from '/js/components/loading-surfaces.js';
import { akSvg } from '/js/icons.js';
const mode = new URLSearchParams(location.search).get('mode') || 'jobs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clone=value=>structuredClone(value),state={user:{id:1,username:'maya.harbor',role:'ADMIN'}},hydrate=root=>hydrateIconButtons(root,{renderIcon:akSvg});
const browserNames=['Harbor · checkout review','Harbor · catalogue performance','Partner API documentation','Account accessibility review','Release smoke · Firefox','Mobile layout · Chrome'];
const configurations=browserNames.map((name,i)=>({id:i+1,name,browserType:['BRAVE','CHROME','CHROMIUM','BRAVE','FIREFOX','CHROME'][i],executablePath:['/usr/bin/brave','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/brave','/usr/bin/firefox','/usr/bin/google-chrome'][i],headlessDefault:i!==0,enabled:true,seleniumManagerEnabled:true,persistentProfile:i===0,viewportWidth:i===5?390:1440,viewportHeight:i===5?844:1000,operationTimeoutSeconds:30,idleTimeoutSeconds:600,maxLifetimeSeconds:3600,maxSessionsPerKey:3,hostWhitelist:['*.harbor.example.invalid','docs.example.invalid'],hostBlacklist:[],arguments:['--lang=en-GB'],environment:{}}));
const providers=[{provider:'CODEX',enabled:true,executablePath:'/usr/local/bin/codex',models:['team-review-model'],efforts:['low','medium','high'],revision:4,healthCode:'AVAILABLE',healthMessage:'Configured CLI is available',capabilities:['text-output']},{provider:'CLAUDE',enabled:true,executablePath:'/usr/local/bin/claude',models:['team-analysis-model'],efforts:['low','high'],revision:2,healthCode:'AVAILABLE',healthMessage:'Configured CLI is available',capabilities:['text-output']}];
const jobs=['Morning repository review','Checkout diagnostics capture','Refresh architecture notes','Release candidate summary','Dependency review','PR evidence digest','Weekly backlog triage'].map((name,i)=>({id:i+1,name,enabled:true,owner:'maya.harbor',schedule:i%3?'Manual':'0 0 9 * * MON-FRI',timezone:'Europe/Lisbon',lastStatus:i===2?'FAILED':'SUCCESS',nextFireAt:'2026-09-30 09:00',lastFinishedAt:'2026-09-29 09:02',revision:3}));
const graph={version:1,name:'Morning repository review',timezone:'Europe/Lisbon',report:{enabled:true,format:'markdown'},nodes:{
 schedule:{type:'trigger',label:'Weekdays · 09:00',trigger:{kind:'cron',expression:'0 0 9 ? * MON-FRI'},next:'scan'},
 scan:{type:'action',label:'Refresh code index',uses:'scan.target',args:{targetId:1},next:'review'},
 review:{type:'action',label:'Review checkout',uses:'agent.run',args:{provider:'CODEX',access:'READ_ONLY',model:'team-review-model',threadMode:'NEW',targetDirectory:'/srv/harbor/checkout',prompt:'Summarize changed APIs and their affected callers. Read only; cite source paths.'},next:'check'},
 check:{type:'if',label:'Review completed?',condition:{node:'review',field:'status',operator:'eq',value:'SUCCESS'},true:'report',false:'attention'},
 report:{type:'action',label:'Summarize evidence',uses:'agent.run',args:{provider:'CODEX',access:'READ_ONLY',targetDirectory:'/srv/harbor/checkout',prompt:'Summarize the review evidence for the daily report.'},next:'done'},
 attention:{type:'end',label:'Needs attention',status:'FAILED',code:'REVIEW_INCOMPLETE'},done:{type:'end',label:'Review ready',status:'SUCCESS',code:'JOB_COMPLETED'}
}};
graph.layout={schedule:{x:20,y:40},scan:{x:280,y:40},review:{x:540,y:40},check:{x:540,y:230},attention:{x:540,y:430},report:{x:280,y:430},done:{x:20,y:430}};
const catalog={providers,actions:[{id:'scan.target',name:'Scan source target',description:'Refresh the source index.'},{key:'agent.run',label:'Run terminal agent',description:'Run the saved review provider.',fields:[{key:'provider',label:'Provider',type:'enum',options:['CODEX','CLAUDE'],required:true},{key:'prompt',label:'Prompt',type:'text',required:true},{key:'targetDirectory',label:'Target directory',type:'path',required:true},{key:'access',label:'Access',type:'enum',options:['READ_ONLY','READ_WRITE'],required:true}]}]};
let chat;
const api=async(method,path,body)=>{
 const url=new URL(path,location.href),p=url.pathname;
 if(p==='/api/account')return clone(state.user);
 if(p==='/api/jobs/catalog')return clone(catalog);
 if(p==='/api/jobs')return clone(jobs);
 if(p==='/api/jobs/1')return {...jobs[0],graph};
 if(p==='/api/jobs/admin/providers')return clone(providers);
 if(p==='/api/jobs/admin/providers/discover')return {candidates:providers.map(p=>({...p,installed:true,version:'team-configured',configuredExecutable:true}))};
 if(p==='/api/jobs/admin/instructions')return [{id:1,name:'Harbor read-only review',provider:'CODEX',mandatory:true,enabled:true,revision:3}];
 if(p.endsWith('/test-sessions')){chat={id:'harbor-demo-chat',provider:'CODEX',providerRevision:4,model:'team-review-model',effort:'high',targetDirectory:'/srv/harbor/checkout',state:'IDLE',revision:1,messages:[],createdAt:'2026-09-30T09:00:00Z'};return clone(chat);}
 if(p.includes('/provider-test-sessions/')){
  if(p.endsWith('/messages'))chat.messages=[
   {id:'m1',role:'USER',content:'Find the code path used when a customer applies a delivery discount.'},
   {id:'m2',role:'ASSISTANT',state:'COMPLETED',durationMillis:3100,content:'The request enters `CheckoutController.applyDiscount`, validates the coupon in `DiscountService`, and recalculates delivery in `ShippingQuoteService`.\n\nThe three callers share the same `PricingContext`; I found no writes outside the existing checkout transaction.'},
   {id:'m3',role:'USER',content:'Which cases should we cover before changing the sort order?'},
   {id:'m4',role:'ASSISTANT',state:'COMPLETED',durationMillis:4200,content:'I would cover these four cases:\n\n- Equal-priced shipping options retain their carrier priority.\n- A free-delivery coupon keeps the selected service eligible.\n- Unavailable pickup points are excluded before sorting.\n- A repeated request produces the same option order.\n\nRelevant files: `ShippingQuoteService.java`, `DeliveryOptionComparator.java`, and `CheckoutPricingTest.java`. I have only inspected the approved folder.'}
  ];return clone(chat);
 }
 if(p==='/api/code-scanner/targets')return [{id:1,name:'Harbor checkout service',sourceType:'LOCAL',localPath:'/srv/harbor/checkout',enabled:true}];
 if(p==='/api/browsers/network-policy')return {enforcedHostWhitelist:['*.harbor.example.invalid','docs.example.invalid'],enforcedHostBlacklist:[]};
 if(p==='/api/browsers/configurations')return clone(configurations);
 if(p.endsWith('/profile'))return {configurationId:1,persistent:true,active:false,hasStoredData:true,storedBytes:14387200};
 if(p==='/api/browsers/detected')return configurations.slice(0,3).map(p=>({browserType:p.browserType,executablePath:p.executablePath,available:true,version:'Configured installation'}));
 if(p==='/api/browsers/sessions')return [];
 if(p==='/api/fetch-proxy/settings')return {maxActivePerKey:3,maxRetainedPerKey:40,resultTtlSeconds:1800,activeJobTimeoutSeconds:180,maxWireBytes:8388608,maxResultBytes:16777216,maxBytesPerKey:67108864,maxGlobalBytes:536870912,maxRedirects:5,connectTimeoutSeconds:10,toolWhitelist:['getPullRequest','getCodeImpactAnalysis','getThinkTrace'],toolBlacklist:[],hostWhitelist:['docs.example.invalid','*.harbor.example.invalid'],hostBlacklist:['internal-admin.harbor.example.invalid'],allowLocalhost:false};
 if(p==='/api/fetch-proxy/jobs')return ['docs/shipping-api','guides/release-2.4','reference/payment-events','docs/rate-limits','guides/accessibility','openapi/checkout','docs/migration','reference/webhooks','guides/authentication'].map((page,i)=>({mcpKeyId:3+i%3,result:{resultId:`harbor-result-${i}`,sourceType:'HTTP',source:`https://docs.example.invalid/${page}`,status:'COMPLETED',sizeBytes:18672+i*23741,expiresAt:`2026-09-30 10:${String(30+i).padStart(2,'0')} UTC`}}));
 if(p==='/api/fetch-proxy/keys')return [{id:3,owner:'maya.harbor',label:'Checkout review'},{id:4,owner:'leo.harbor',label:'Release assistant'},{id:5,owner:'sam.harbor',label:'Docs explorer'}];
 throw new Error(`Unmapped synthetic request ${method} ${path}`);
};
const appName=mode==='chat'?'jobs':mode==='fetch-proxy'?'fetchproxy':mode;
const rootId=appName==='jobs'?'jobsAppRoot':appName==='browsers'?'browsersWorkspaceRoot':'fetchProxyWorkspaceRoot';
const host=document.getElementById('runtimeFixtureRoot');host.id=rootId;host.className='ui-render-root ui-workspace';
const shell=mountWorkspaceFixtureShell({state,app:appName,root:host});
initializeActionMenus();
const deps={state,api,esc,fmt:v=>v||'—',alertBox:(_id,ok,message)=>{if(!ok)throw new Error(message);},confirmDialog:async()=>false,copyText:async()=>{},loadingDuckHtml,loadingPlaceholderHtml,akSvg,hydrateIconButtons:hydrate,updatePortalUrl:()=>{},waitForUiPaint:async()=>{},withScopedLoadingOverlay:async(_root,task)=>task(),fileViewer:createFileViewer({state,esc,hydrateIconButtons:hydrate})};
if(mode==='jobs'||mode==='chat'){
 window.App={...shell,...createJobsApp(deps)};await App.jobsLoad();
 if(mode==='jobs'){await App.jobsEditJob(1);App.jobsSetGraphZoom('editor',-.1);App.jobsSelectEditorNode('review');}
 else {await App.jobsOpenProviderConfiguration();App.jobsOpenProviderTab('TEST','CODEX');await new Promise(r=>setTimeout(r,50));
  for(const [id,value] of [['jobsProviderChatTarget','/srv/harbor/checkout'],['jobsProviderChatPrompt','Review delivery pricing and sorting.']]){const el=document.getElementById(id);el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));}
  document.getElementById('jobsProviderChatForm').requestSubmit();
  for(let i=0;i<100&&!document.getElementById('jobsProviderChatTranscript').textContent.includes('pickup');i++)await new Promise(r=>setTimeout(r,20));
  document.getElementById('jobsProviderChatSetup').open=false;document.getElementById('jobsProviderChatTranscript').scrollTop=document.getElementById('jobsProviderChatTranscript').scrollHeight;const draft=document.getElementById('jobsProviderChatPrompt');draft.value='Compare these cases with the current test coverage.';draft.dispatchEvent(new Event('input',{bubbles:true}));
 }
}else if(mode==='browsers'){window.App={...shell,...createBrowsersApp(deps)};await App.loadBrowsers();}
else{window.App={...shell,...createFetchProxyApp(deps)};await App.loadFetchProxy();App.showFetchProxyTab('fetch-results');}
hydrate(document);document.activeElement?.blur();window.runtimeReady=true;
