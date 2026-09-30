// Native Chromium screenshots of current Workbench modules with synthetic API data.
// No npm dependencies. WORKBENCH_ROOT may point at another checkout.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
export const here = dirname(fileURLToPath(import.meta.url));
export const websiteRoot = resolve(here, '../..');
export const workbenchRoot = resolve(process.env.WORKBENCH_ROOT || join(websiteRoot, '../mcp'));
export const staticRoot = join(workbenchRoot, 'mcp-management/src/main/resources/static');
export const smokeRoot = join(workbenchRoot, 'mcp-management/src/test/resources/ui-smoke');
export const outputRoot = join(websiteRoot, 'assets/img/workbench/screenshots');
export const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function portalHtml() {
	return (await readFile(join(staticRoot, 'index.html'), 'utf8')).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
}
export async function shellHtml(body) {
	const portal = await portalHtml();
	const styles = [...portal.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map(m => m[0]).join('\n');
	return `<!doctype html><html lang="en" data-appearance="light" data-vision="normal"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${styles}</head><body>${body}</body></html>`;
}
const types = {js:'text/javascript',mjs:'text/javascript',css:'text/css',html:'text/html',json:'application/json',png:'image/png',gif:'image/gif',svg:'image/svg+xml',woff2:'font/woff2'};
export async function fixtureServer(options = {}) {
	const fixture = options.fixture || 'setup-fixture.js';
	const html = options.html || await portalHtml();
	const server = createServer(async (req,res) => {
		try {
			const url = new URL(req.url, 'http://fixture');
			if (options.route && await options.route(req,res,url)) return;
			if (req.method !== 'GET') { res.writeHead(405); res.end('Read-only screenshot fixture'); return; }
			if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
			if(url.pathname==='/api/ui-policy'){res.setHeader('Content-Type','application/json');res.end('{"noFunAllowedEnabled":false,"userConfigurable":true}');return;}
			if(url.pathname==='/') {
				res.setHeader('Content-Type','text/html; charset=utf-8');
				res.end(html.replace('</body>', `<script>window.captureErrors=[];addEventListener('error',e=>captureErrors.push(e.message));addEventListener('unhandledrejection',e=>captureErrors.push(String(e.reason)));</script><script type="module" src="/${fixture}"></script></body>`));return;
			}
			const relative = decodeURIComponent(url.pathname).slice(1);
			const bases = [here,staticRoot,smokeRoot];
			for(const base of bases) {
				const path=resolve(base,relative);
				if(!path.startsWith(base+sep))continue;
				try{const body=await readFile(path);res.setHeader('Content-Type',types[path.split('.').at(-1)]||'application/octet-stream');res.end(body);return;}catch{}
			}
			res.writeHead(404);res.end('Unknown fixture asset');
		}catch(error){res.writeHead(500);res.end(String(error));}
	});
	await new Promise((ok,fail)=>{server.once('error',fail);server.listen(options.port||0,'127.0.0.1',ok);});
	return { server, url:`http://127.0.0.1:${server.address().port}/`, close:()=>new Promise(ok=>server.close(ok)) };
}
export async function withCapture(options, callback) {
	const fixture = options.url ? null : await fixtureServer(options);
	const baseUrl = options.url || fixture.url;
	const profile = await mkdtemp(join(tmpdir(),'workbench-website-'));
	const browser = spawn(process.env.BROWSER_SMOKE_CHROMIUM||'/usr/bin/chromium',[
		'--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run',
		'--disable-background-networking','--remote-debugging-pipe','--force-device-scale-factor=1',`--user-data-dir=${profile}`,'about:blank'
	],{stdio:['ignore','ignore','pipe','pipe','pipe']});
	let seq=0, buffered='',stderr='';const pending=new Map(),events=[];
	const fail=error=>{for(const task of pending.values())task.reject(error);pending.clear();};
	browser.stderr.on('data',data=>stderr=(stderr+data).slice(-3000));browser.once('error',fail);
	const closed=new Promise(ok=>browser.once('close',code=>{fail(new Error(`Chromium closed ${code}: ${stderr}`));ok();}));
	browser.stdio[4].on('data',data=>{buffered+=data;let end;while((end=buffered.indexOf('\0'))>=0){const message=JSON.parse(buffered.slice(0,end));buffered=buffered.slice(end+1);const task=pending.get(message.id);if(task){pending.delete(message.id);message.error?task.reject(new Error(message.error.message)):task.resolve(message.result);}else if(message.method==='Runtime.exceptionThrown')events.push(message.params.exceptionDetails);}});
	const send=(method,params={},sessionId)=>new Promise((ok,bad)=>{const id=++seq;pending.set(id,{resolve:ok,reject:bad});browser.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});
	const timeout=setTimeout(()=>{fail(new Error('Screenshot capture timed out'));browser.kill();},options.timeout||180000);
	try{
		const {targetId}=await send('Target.createTarget',{url:'about:blank'});
		const {sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});
		const command=(method,params={})=>send(method,params,sessionId);
		const evaluate=async expression=>{const result=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;};
		const waitFor=async expression=>{for(let i=0;i<400;i++){try{if(await evaluate(expression))return;}catch(error){if(!/context|navigat/i.test(error.message))throw error;}await pause(40);}throw new Error(`Timed out: ${expression}\n${await evaluate('JSON.stringify({errors:window.captureErrors,body:document.body?.innerText.slice(-2500)})')}`);};
		const resize=async(width,height)=>{await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});await pause(160);};
		const navigate=async(path='')=>{await command('Page.navigate',{url:new URL(path,baseUrl).href});await waitFor('document.readyState === "complete"');};
		const capture=async(name)=>{
			await evaluate('document.fonts.ready');await pause(350);
			const metrics=await evaluate('({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,errors:window.captureErrors||[]})');
			if(metrics.errors.length)throw new Error(JSON.stringify(metrics.errors));
			if(metrics.scrollWidth>metrics.width+1)throw new Error(`Horizontal overflow in ${name}: ${JSON.stringify(metrics)}`);
			await mkdir(outputRoot,{recursive:true});
			const path=name.startsWith('/')?name:join(outputRoot,name.endsWith('.png')?name:name+'.png');
			const shot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path,Buffer.from(shot.data,'base64'));
			console.log(`Captured ${path} (${metrics.width}×${metrics.height})`);return path;
		};
		await command('Page.enable');await command('Runtime.enable');
		await command('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
		await resize(options.width||1600,options.height||1000);await navigate(options.path||'');
		return await callback({evaluate,waitFor,resize,navigate,capture,command,url:baseUrl,events});
	}finally{clearTimeout(timeout);browser.kill();await closed;await fixture?.close();await rm(profile,{recursive:true,force:true});}
}
