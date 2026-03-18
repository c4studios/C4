import fs from 'fs/promises';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function fetchJson(url){const r=await fetch(url); if(!r.ok) throw new Error(String(r.status)); return r.json();}
async function waitForTarget(){for(let i=0;i<60;i++){try{const list=await fetchJson('http://127.0.0.1:9222/json/list'); const page=list.find(x=>x.type==='page'); if(page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;}catch{} await sleep(250);} throw new Error('no target');}
class CDP{constructor(ws){this.ws=ws;this.id=0;this.pending=new Map();ws.addEventListener('message',(e)=>{const msg=JSON.parse(e.data); if(msg.id&&this.pending.has(msg.id)){const p=this.pending.get(msg.id); this.pending.delete(msg.id); msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg.result);}});} send(method,params={}){const id=++this.id; const p=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject})); this.ws.send(JSON.stringify({id,method,params})); return p;}}
async function connect(){const wsUrl=await waitForTarget(); const ws=new WebSocket(wsUrl); await new Promise((res,rej)=>{ws.addEventListener('open',res,{once:true});ws.addEventListener('error',rej,{once:true});}); const cdp=new CDP(ws); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1400,deviceScaleFactor:2,mobile:false}); return cdp;}
async function evalValue(cdp,expression){const r=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true}); return r.result?.value;}
async function move(cdp,x,y){await cdp.send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y,button:'none'});}
async function capture(cdp,name,outDir){const r=await cdp.send('Page.captureScreenshot',{format:'png'}); await fs.writeFile(`${outDir}/${name}.png`, Buffer.from(r.data,'base64'));}
(async()=>{const outDir=process.argv[2]; const cdp=await connect(); await cdp.send('Page.navigate',{url:'http://127.0.0.1:4173/'}); await sleep(1800); await evalValue(cdp,`localStorage.setItem('c4_intro_seen','1'); true`); await cdp.send('Page.reload',{ignoreCache:true}); await sleep(2200); await evalValue(cdp,`(() => { document.querySelectorAll('[aria-label="C4 Studios"]')[1].scrollIntoView({block:'center'}); return true; })()`); await sleep(1000); const footer=await evalValue(cdp,`(() => { const footer=document.querySelectorAll('[aria-label="C4 Studios"]')[1]; const r=footer.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2,scrollY:window.scrollY, logoCount: document.querySelectorAll('[aria-label="C4 Studios"]').length}; })()`);
 const sampleLetters=async()=>await evalValue(cdp,`(() => { const footer=document.querySelectorAll('[aria-label="C4 Studios"]')[1]; const letters=Array.from(footer.querySelector('svg').querySelectorAll('path')).slice(-7); return letters.map((p,i)=>({i,dLength:(p.getAttribute('d')||'').length,transform:getComputedStyle(p).transform,opacity:getComputedStyle(p).opacity})); })()`);
 const idleMetrics=await sampleLetters();
 await capture(cdp,'footer_idle',outDir);
 await move(cdp, footer.cx, footer.cy); await sleep(250);
 await capture(cdp,'footer_hover',outDir);
 await evalValue(cdp,`(() => { document.querySelectorAll('[aria-label="C4 Studios"]')[1].click(); return true; })()`); await sleep(600);
 await capture(cdp,'footer_build',outDir);
 await sleep(900);
 await capture(cdp,'footer_impact',outDir);
 await sleep(1200);
 const lockMetrics=await sampleLetters();
 await capture(cdp,'footer_lock',outDir);
 await evalValue(cdp,`(() => { document.querySelectorAll('[aria-label="C4 Studios"]')[1].click(); return true; })()`); await sleep(2400);
 const reverseMetrics=await sampleLetters();
 await capture(cdp,'footer_reverse',outDir);
 const report={footer,idleMetrics,lockMetrics,reverseMetrics};
 await fs.writeFile(`${outDir}/footer-proof-report.json`, JSON.stringify(report,null,2));
 cdp.ws.close(); })().catch(e=>{console.error(e); process.exit(1);});
