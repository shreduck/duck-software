import {withCapture,shellHtml} from './capture.mjs';
const selected=process.argv[2]||'all';
if(selected==='all'||selected==='adaptive') await withCapture({fixture:'code-adaptive.js'},async({evaluate,waitFor,capture})=>{
 await waitFor('window.captureReady');
 for(const [view,name] of [['scanner','code-scanner'],['docs','spec-docs'],['agentkits','agent-kits'],['query','repository-query']]){
  await evaluate(`fixtureShow('${view}')`);await capture('workbench-'+name);if(view==='docs'){await evaluate("import('/code-docs-graph.js').then(m=>m.showDocumentGraph())");await capture('workbench-spec-docs-graph');await evaluate('App.sdCloseContextModal()');}
 }
 await evaluate("fixtureShow('scanner')");await evaluate("import('/code-graphs.js').then(m=>m.showEntrypoints())");await capture('workbench-code-scanner-entrypoints');await evaluate("import('/code-graphs.js').then(m=>m.showHierarchy())");await capture('workbench-call-hierarchy-expanded');
});
if(selected==='all'||selected==='atlas')await withCapture({fixture:'code-atlas.js',html:await shellHtml('<div class="layout"><main id="atlasFixtureRoot" class="view"><section id="code-atlas" class="app active"><div id="codeAtlasRoot" class="ui-render-root ui-workspace"></div></section></main></div>')},async({waitFor,capture})=>{await waitFor('window.captureReady');await capture('workbench-code-atlas');});
if(selected==='all'||selected==='backlog')await withCapture({fixture:'planning-backlog.js',html:await shellHtml('<div id="backlogAppRoot" class="ui-render-root ui-workspace"></div>')},async({waitFor,capture})=>{await waitFor('window.captureReady');await capture('workbench-backlog');});
if(selected==='all'||selected==='pr')await withCapture({fixture:'planning-pr.js',html:await shellHtml('<div id="prAnalysisWorkspaceRoot" class="ui-render-root ui-workspace"></div>')},async({evaluate,waitFor,capture})=>{await waitFor('window.captureReady');await capture('workbench-pr-analysis');await evaluate('App.prOpenItem(1)');await capture('workbench-local-pr-analysis-impact');});
if(selected==='all'||selected==='runtime')for(const mode of ['kanban','thinktrace'])await withCapture({fixture:'planning-runtime.js',path:'?mode='+mode,html:await shellHtml('<div id="runtimeFixtureRoot" class="ui-render-root ui-workspace"></div>')},async({evaluate,waitFor,capture})=>{await waitFor('window.captureReady');await capture('workbench-'+(mode==='thinktrace'?'think-trace':mode));if(mode==='thinktrace'){await evaluate("App.ttToggleFullscreen('graph');App.ttGraphZoom(.2)");await capture('workbench-think-trace-expanded');}});
