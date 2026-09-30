import {withCapture,shellHtml} from './capture.mjs';
await withCapture({fixture:'runtime-performance.js',html:await shellHtml('<div id="performanceRunsRoot" class="ui-render-root ui-workspace" style="min-width:0"></div>')},async({waitFor,evaluate,capture})=>{
 await waitFor('window.performanceWebsiteReady');
 await evaluate("performanceWebsite.open('browser')");
 await waitFor("document.querySelector('#performanceCharts svg')");
 await capture('workbench-performance-tracker');
 await evaluate("performanceWebsite.open('jvm')");
 await waitFor("document.querySelector('#jvmThreads .performance-thread-lane')");
 await capture('workbench-jvm-profiler');
});
