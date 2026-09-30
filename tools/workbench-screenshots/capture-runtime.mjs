import { withCapture, shellHtml } from './capture.mjs';
const selected=new Set(process.argv.slice(2));
for(const [mode,name] of [['jobs','workbench-jobs'],['chat','workbench-ai-testing'],['browsers','workbench-browsers'],['fetch-proxy','workbench-fetch-proxy']]){
 if(selected.size&&!selected.has(mode))continue;
 await withCapture({fixture:'runtime-tools.js',html:await shellHtml('<div id="runtimeFixtureRoot"></div>'),path:`?mode=${mode}`},async({waitFor,capture,evaluate})=>{
  await waitFor('window.runtimeReady');
  console.log(await evaluate('document.querySelector(".app.active").innerText.slice(0,450)'));
  await capture(name);
  if(mode==='fetch-proxy'){await evaluate("App.showFetchProxyTab('fetch-policy')");await capture('workbench-fetch-proxy-policy');}
 });
}
