import {createResizeController} from '/js/components/resize-controller.js';
import {getAdaptiveWorkspace} from '/js/components/adaptive-workspace.js';
import {createSpecDocsStackGraph} from '/js/apps/spec-docs-stack-graph.js';
import {createSpecDocsGraphControls} from '/js/apps/spec-docs-graph-controls.js';
import {createSpecDocsShell} from '/js/apps/spec-docs-shell.js';
import {hydrateIconButtons} from '/js/components/icon-buttons.js';
import {akSvg} from '/js/icons.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Companion document content uses the native Spec Graph Data grammar.
export async function showDocumentGraph(){
 const state=window.screenshotState;
 const definitions=[['OrderController',['placeOrder','findOrder','cancelOrder']],['CheckoutService',['confirm','validateBasket','releaseReservation']],['InventoryService',['reserveStock','findAvailability','releaseStock']],['OrderRepository',['saveOrder','findWithDelivery','markCancelled']]];
 const nodes=definitions.flatMap(([className,methods],c)=>methods.map((method,m)=>`node | id=n${c*3+m+1} | class=com.harbor.commerce.${className} | method=${method} | file=src/main/java/${className}.java | kind=METHOD`));
 const links=[[1,4,'confirm(request)'],[2,11,'findWithDelivery(orderId)'],[3,6,'releaseReservation(orderId)'],[4,5,'validateBasket(request.items)'],[4,7,'reserveStock(items)'],[4,10,'saveOrder(order)'],[5,8,'findAvailability(productIds)'],[6,9,'releaseStock(reservationId)'],[6,12,'markCancelled(orderId)'],[7,8,'findAvailability(productIds)']];
 const content='# Order processing call stack\n\n## Spec Graph Data\n\n```specgraph\n'+nodes.join('\n')+'\n'+links.map(([from,to,call],i)=>`edge | from=n${from} | to=n${to} | call=${call} | order=${i+1}`).join('\n')+'\n```';
 const file=state.sdFiles.find(item=>item.id===101);file.content=content;file.title='Order processing · call stack';state.sdGraphModalZoom=.85;state.sdGraphZoom=.8;state.sdSelectedStackNode='com.harbor.commerce.CheckoutService.confirm';
 const stackGraph=createSpecDocsStackGraph({state,esc,akSvg,api:async(method,path)=>{if(method!=='GET')throw new Error('Screenshot fixtures cannot write');return state.sdFiles.find(item=>item.id===Number(path.split('/').at(-1)));}});
 const shell=createSpecDocsShell({state,stackGraph});
 const graph=createSpecDocsGraphControls({state,stackGraph,ensureContextModalShell:shell.ensureSdContextModalShell});
 Object.assign(App,graph);localStorage.setItem('specDocRightWidth','520');createResizeController({state}).initSpecDocResize();getAdaptiveWorkspace(document.getElementById('sdLayout')).selectPane('details');await App.sdRenderStackGraph();
 hydrateIconButtons(document,{renderIcon:akSvg});
}
