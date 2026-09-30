import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {websiteRoot,workbenchRoot,outputRoot,here} from './capture.mjs';
const html=await readFile(join(websiteRoot,'apps/workbench/index.html'),'utf8');
const names=[...new Set([...html.matchAll(/screenshots\/(workbench-[a-z-]+\.png)/g)].map(m=>m[1]))].sort();
const images=[];
for(const name of names){
 const bytes=await readFile(join(outputRoot,name));
 if(!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error(`${name} is not PNG`);
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 if(width!==1600||height!==1000)throw new Error(`${name}: unexpected ${width}×${height}`);
 images.push({file:name,width,height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const unused=(await readdir(outputRoot)).filter(name=>name.endsWith('.png')&&!names.includes(name));
if(unused.length)throw new Error('Unreferenced screenshots: '+unused.join(', '));
const manifest={workbenchCommit:execFileSync('git',['-C',workbenchRoot,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),data:'Fictional Harbor/Acme examples; no live credentials, customers, provider calls, JVM attachment or captures.',renderer:'Production Workbench HTML/CSS/JavaScript and annotation overlay; native Chromium via CDP',images};
const path=join(here,'manifest.json');
if(process.argv.includes('--check')){
 const saved=JSON.parse(await readFile(path,'utf8'));
 if(JSON.stringify(saved)!==JSON.stringify(manifest))throw new Error('Screenshot manifest is stale; rerun manifest.mjs after reviewing new captures.');
}else await writeFile(path,JSON.stringify(manifest,null,2)+'\n');
console.log(`${images.length} populated screenshots verified at 1600×1000; source ${manifest.workbenchCommit.slice(0,7)}.`);
