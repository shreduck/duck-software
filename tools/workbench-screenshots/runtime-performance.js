// Fictional Harbor checkout evidence. Real production controllers; no recorder is started.
import { mountWorkspaceFixtureShell } from '/workspace-fixture-shell.js';
import { createPerformanceRunsApp } from '/js/apps/performance-runs.js';
import { hydrateIconButtons } from '/js/components/icon-buttons.js';
import { akSvg } from '/js/icons.js';
import { initializeActionMenus } from '/js/components/action-menu.js';
import { loadingDuckHtml } from '/js/components/loading-surfaces.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fmt=value=>value?new Date(value).toLocaleString('en-GB',{timeZone:'UTC'}):'';
const startDate=Date.parse('2026-09-30T14:20:00Z'), duration=95000;
const timing={preparedAt:'2026-09-30T14:19:58Z',captureStartedAt:'2026-09-30T14:20:00Z',finishedAt:'2026-09-30T14:21:35Z',elapsedMillis:duration,activeMillis:duration,pausedMillis:0,observedMillis:duration};
const storage={telemetryBytes:294912,artifactBytes:0,indexBytes:0,totalBytes:294912,telemetryBytesPerSecond:3104,measurement:'Attributed bytes, not database disk usage.'};
const record=(id,runtime,name)=>({id,groupId:runtime==='JVM'?22:11,runtime,contextId:runtime==='JVM'?'harbor-api-process':'harbor-checkout-tab',name,state:'COMPLETED',locked:false,revision:1,lastSequence:96,eventCount:runtime==='JVM'?192:141,startMonotonicMillis:0,lastMonotonicMillis:duration,startedAt:timing.captureStartedAt,updatedAt:timing.finishedAt,timing,storage});
const browserRecord=record(101,'BROWSER','Harbor checkout · shipping and payment · run 04');
const jvmRecord=record(201,'JVM','Harbor API · checkout calculation · run 04');
const group=runtime=>({id:runtime==='JVM'?22:11,runtime,sessionId:runtime==='JVM'?undefined:'harbor-qa-browser',targetId:7,targetName:runtime==='JVM'?'Harbor API':'Harbor checkout QA',state:'COMPLETED',timing,options:{mode:'ALL_TABS',intervalMillis:1000,captureHtml:false,captureNetwork:false},recordings:[runtime==='JVM'?jvmRecord:browserRecord]});
const stamp=i=>new Date(startDate+i*1000).toISOString();
const browserSamples=Array.from({length:96},(_,i)=>({kind:'SAMPLE',contextId:'harbor-checkout-tab',monotonicMillis:i*1000,capturedAt:stamp(i),data:{taskBusyPercent:Math.round(12+Math.abs(Math.sin(i*.17))*22+(i>38&&i<52?27:0)+(i>70&&i<80?18:0)),threadCpuPercent:Math.round(7+Math.abs(Math.sin(i*.23))*16+(i>38&&i<52?19:0)),jsHeapUsedBytes:Math.round((31+i*.14+(i%20)*.34)*1048576),nodes:924+Math.floor(i/12)*18,visible:true,focused:true,intervalMillis:1000}}));
const actionSpecs=[['Open checkout',1000,428],['Choose delivery address',9000,184],['Apply HARBOR10 promotion',19000,612],['Select express shipping',31000,294],['Recalculate order totals',43000,1284],['Add a gift message',57000,168],['Choose saved payment method',71000,463],['Review order summary',87000,328]];
const browserEvents=[...browserSamples,{kind:'NAVIGATION',monotonicMillis:1000,capturedAt:stamp(1),data:{url:'https://shop.harbor-labs.example.invalid/checkout',title:'Harbor · Checkout'}}];
actionSpecs.forEach(([name,time,durationMillis],i)=>{const id='action-'+i;browserEvents.push({kind:'ACTION_START',monotonicMillis:time,data:{id,name}},{kind:'ACTION_END',monotonicMillis:time+durationMillis,data:{id,name,durationMillis,success:true}});});
Array.from({length:28},(_,i)=>{const time=1000+i*3200,durationMillis=84+(i%5)*31;browserEvents.push({kind:'NETWORK',monotonicMillis:time,capturedAt:new Date(startDate+time).toISOString(),data:{id:'request-'+i,method:i%4===0?'POST':'GET',url:'https://shop.harbor-labs.example.invalid/'+['api/cart','api/shipping/options','api/catalog/recommendations','api/checkout/totals','assets/checkout.js'][i%5],state:'responseCompleted',durationMillis,status:200}});});
browserEvents.sort((a,b)=>a.monotonicMillis-b.monotonicMillis);
const threadNames=['http-nio-8080-exec-1','http-nio-8080-exec-2','http-nio-8080-exec-3','http-nio-8080-exec-4','http-nio-8080-exec-5','http-nio-8080-exec-6','checkout-worker-1','checkout-worker-2','checkout-worker-3','checkout-worker-4','HikariPool-1 housekeeper','scheduling-1'];
const jvmEvents=Array.from({length:96},(_,i)=>[
 {kind:'JVM_METRIC',contextId:'harbor-api-process',monotonicMillis:i*1000,capturedAt:stamp(i),data:{processCpuPercent:10+Math.round(Math.abs(Math.sin(i*.14))*23)+(i>37&&i<52?22:0),heapUsedBytes:Math.round((188+(i%24)*3.1)*1048576),heapCommittedBytes:536870912,nonHeapUsedBytes:Math.round((82+i*.018)*1048576),platformThreadCount:42+Math.floor(i/24),daemonThreadCount:30,loadedClasses:12524+Math.floor(i/8),unloadedClasses:34,availableProcessors:8,uptimeMillis:882000+i*1000,sampleDurationMillis:1000,gcCollectionMillis:128+Math.floor(i/24)*17,gcCollectionCount:5+Math.floor(i/24),memoryPools:[{name:'G1 Eden Space',usedBytes:73400320,committedBytes:134217728,maxBytes:-1},{name:'G1 Old Gen',usedBytes:146800640,committedBytes:402653184,maxBytes:1073741824},{name:'Metaspace',usedBytes:77594624,committedBytes:79691776,maxBytes:-1}],garbageCollectors:[{name:'G1 Young Generation',count:5+Math.floor(i/24),collectionMillis:128+Math.floor(i/24)*17},{name:'G1 Old Generation',count:0,collectionMillis:0}]}},
 {kind:'JVM_THREADS',contextId:'harbor-api-process',monotonicMillis:i*1000,capturedAt:stamp(i),data:{threads:threadNames.map((name,n)=>({id:31+n,name,state:n>9?'TIMED_WAITING':n>5?(i+n)%13<7?'RUNNABLE':'WAITING':(i+n*3)%18<9?'RUNNABLE':(i+n)%27===0?'BLOCKED':'WAITING',cpuNanos:(i+1)*(n<6?11000000:4500000),stack:n<6?['com.harbor.checkout.CheckoutService.calculateTotal(CheckoutService.java:142)','com.harbor.checkout.CheckoutController.preview(CheckoutController.java:68)','org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:63)']:['java.util.concurrent.ThreadPoolExecutor.getTask(ThreadPoolExecutor.java:1062)']})),virtualThreadCoverage:'UNAVAILABLE'}}
]).flat();
const target={id:7,name:'Harbor API',kind:'LOCAL',pid:24186,processStartedAt:'2026-09-30T14:05:18Z',enabled:true,connected:false,granted:true,followRestarts:true,threadPoolPrefixes:{'http-nio-8080-exec-':'HTTP request workers','checkout-worker-':'Checkout tasks'}};
const distribution=values=>{const sorted=[...values].sort((a,b)=>a-b),n=sorted.length,p=q=>sorted[Math.min(n-1,Math.floor((n-1)*q))];return {state:'AVAILABLE',sampleCount:n,min:sorted[0],mean:values.reduce((a,b)=>a+b,0)/n,p50:p(.5),p90:p(.9),p95:p(.95),p99:p(.99),max:sorted.at(-1)};};
const analytics={metrics:Object.fromEntries(['taskBusyPercent','threadCpuPercent','jsHeapUsedBytes','nodes'].map(key=>[key,distribution(browserSamples.map(e=>e.data[key]))])),sampleCount:96,gapCount:0,counterResetCount:0,droppedEventCount:0,omittedNetworkEventCount:0,heapStartBytes:browserSamples[0].data.jsHeapUsedBytes,heapEndBytes:browserSamples.at(-1).data.jsHeapUsedBytes,heapGrowthBytes:browserSamples.at(-1).data.jsHeapUsedBytes-browserSamples[0].data.jsHeapUsedBytes,observedMillis:duration,actions:distribution(actionSpecs.map(a=>a[2])),requests:distribution(browserEvents.filter(e=>e.kind==='NETWORK').map(e=>e.data.durationMillis)),saturation:{taskBusyPercent:{thresholdPercent:95,estimatedMillisAbove:0,longestObservedStreakMillis:0}},slowestActions:actionSpecs.map(([name,time,durationMillis],i)=>({id:'action-'+i,name,durationMillis})).sort((a,b)=>b.durationMillis-a.durationMillis)};
window.performanceFixtureRequests=[];
const api=async(method,path)=>{
 performanceFixtureRequests.push({method,path});
 if(method!=='GET')throw new Error('Website demonstration: operations are disabled.');
 const url=new URL(path,location.href),route=url.pathname.replace('/api/performance-runs','');
 const jvm=route.startsWith('/jvm'),events=jvm?jvmEvents:browserEvents,row=jvm?jvmRecord:browserRecord;
 if(route==='/resolve'){const runtime=Number(url.searchParams.get('recordingId'))===201?'JVM':'BROWSER';return {runtime,id:runtime==='JVM'?201:101,groupId:runtime==='JVM'?22:11};}
 if(route==='/sessions')return [{sessionId:'harbor-qa-browser',configurationName:'Harbor checkout · Chrome'}];
 if(route.endsWith('/artifact-cleanups'))return [];
 if(route==='/jvm/discovery')return {host:'harbor-demo-host',osUser:'harbor-demo',candidates:[],limitations:['Saved playback does not attach to a JVM.'],administrator:false};
 if(route==='/jvm/targets')return [target];
 if(route==='/jvm/targets/7')return target;
 if(route.endsWith('/profiler/capabilities'))return {installed:false,message:'Method instrumentation was not enabled for this measurement.'};
 if(route==='/tracking'||route==='/jvm/tracking')return [group(jvm?'JVM':'BROWSER')];
 if(/^\/(?:jvm\/)?tracking\/\d+$/.test(route))return group(jvm?'JVM':'BROWSER');
 if(route==='/recordings')return [browserRecord,{...browserRecord,id:102,name:'Harbor checkout · baseline · run 03',groupId:12}];
 if(/^\/(?:jvm\/)?recordings\/\d+$/.test(route))return row;
 if(route.endsWith('/operations')||route.endsWith('/artifacts'))return [];
 if(route.endsWith('/analytics'))return jvm?{metrics:{},sampleCount:96}:analytics;
 if(route.endsWith('/overview'))return {recordingId:row.id,snapshotSequence:96,sourceResolutionMillis:1000,buckets:events.filter(e=>['SAMPLE','JVM_METRIC'].includes(e.kind)).map(e=>({fromMillis:e.monotonicMillis,toMillis:e.monotonicMillis+1000,missing:false,boundary:false,metrics:Object.fromEntries(Object.entries(e.data).filter(([,v])=>typeof v==='number').map(([key,v])=>[key,{min:v,max:v,mean:v,count:1}]))}))};
 if(route.endsWith('/events')||route.endsWith('/window')){const from=Number(url.searchParams.get('fromMillis')||0),to=Number(url.searchParams.get('toMillis')||duration);return {recordingId:row.id,snapshotSequence:96,nextSequence:96,hasMore:false,events:events.filter(e=>e.monotonicMillis>=from&&e.monotonicMillis<=to)};}
 if(route==='/capabilities')return {supported:true,metricScope:'Renderer scope',capture:{html:{available:false,reason:'Payload capture was not enabled.'}},limitations:['Renderer metrics are not whole-browser totals.']};
 throw new Error('Unexpected fictional Performance API '+path);
};
initializeActionMenus();
const app=createPerformanceRunsApp({api,esc,fmt,loadingDuckHtml,hydrateIconButtons:root=>hydrateIconButtons(root,{renderIcon:akSvg}),confirmDialog:async()=>false,alertBox:(_id,ok,message)=>{if(!ok)throw new Error(message);},updatePortalUrl:()=>{}});
const shell=mountWorkspaceFixtureShell({state:{user:{id:1,username:'harbor-demo',role:'ADMIN'}},app:'performance-runs',root:document.getElementById('performanceRunsRoot')});
window.App={...app,...shell};
await app.performanceRunsLoad();
window.performanceWebsite={
 async open(runtime){
  await app.performanceRunsOpenLocation({runtime,recording:runtime==='jvm'?201:101});
  await new Promise(resolve=>setTimeout(resolve,200));
  if(runtime==='jvm')document.getElementById('jvmWorkspaceTab-threads').click();
  return {runtime,requests:performanceFixtureRequests,charts:document.querySelectorAll('svg[data-performance-chart], [data-performance-chart]').length};
 }
};
window.performanceWebsiteReady=true;
