// A fictional storefront being reviewed through the real Browser annotation overlay.
const source=await(await fetch('/annotation-source')).text();
const now='2026-09-30T09:00:00Z';
const notes=[
 {id:'delivery-order',note:'Keep free collection first, then sort delivery services by price. Preserve carrier priority when two services cost the same.',selector:'#delivery-options',summary:'Delivery options'},
 {id:'address-help',note:'Add an example postcode below this field and keep the validation message next to it.',selector:'#postcode',summary:'Delivery postcode'},
 {id:'order-summary',note:'The summary should update immediately when a different delivery option is selected.',selector:'#order-summary',summary:'Order summary'},
 {id:'privacy-copy',note:'Confirmed: this checkout uses only fictional customers and products.',selector:'#demo-note',summary:'Fictional data notice',resolved:true}
].map(n=>({id:n.id,pageUrl:location.href,note:n.note,author:'Maya · design review',resolved:!!n.resolved,target:{kind:'ELEMENT',selector:n.selector,summary:n.summary},createdAt:now,updatedAt:now}));
new Function(source)({enabled:true,annotations:notes});
window.__mcpWorkbenchAnnotationApi.focus('delivery-order');
window.annotationReady=true;
