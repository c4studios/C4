import fs from 'fs/promises';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
async function fetchJson(url){const r=await fetch(url); if(!r.ok) throw new Error(String(r.status)); return r.json();}
async function waitForTarget(){for(let i=0;i<50;i++){try{const list=await fetchJson('http://127.0.0.1:9222/json/list'); const page=list.find(x=>x.type==='page'); if(page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;}catch{} await sleep(250);} throw new Error('no target');}
class CDP{constructor(ws){this.ws=ws;this.id=0;this.pending=new Map(); ws.addEventListener('message',(e)=>{const msg=JSON.parse(e.data); if(msg.id&&this.pending.has(msg.id)){const p=this.pending.get(msg.id); this.pending.delete(msg.id); msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg.result);}});} send(method,params={}){const id=++this.id; const p=new Promise((resolve,reject)=>this.pending.set(id,{resolve,reject})); this.ws.send(JSON.stringify({id,method,params})); return p;}}
(async()=>{ const wsUrl=await waitForTarget(); const ws=new WebSocket(wsUrl); await new Promise((res,rej)=>{ws.addEventListener('open',res,{once:true}); ws.addEventListener('error',rej,{once:true});}); const cdp=new CDP(ws); await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Emulation.setDeviceMetricsOverride',{width:1600,height:1400,deviceScaleFactor:2,mobile:false}); await cdp.send('Page.navigate',{url:'http://127.0.0.1:4173/'}); await sleep(1800); await cdp.send('Runtime.evaluate',{expression:`localStorage.setItem('c4_intro_seen','1'); true`,returnByValue:true}); await cdp.send('Page.reload',{ignoreCache:true}); await sleep(2200);
 const sample = async () => (await cdp.send('Runtime.evaluate',{expression:`(() => Array.from(document.querySelector('[aria-label="C4 Studios"] svg').querySelectorAll('path')).slice(-7).map((p,i)=>({i,d:p.getAttribute('d'),transform:getComputedStyle(p).transform})) )()`,returnByValue:true})).result.value;
 const info=(await cdp.send('Runtime.evaluate',{expression:`(() => { const el=document.querySelector('[aria-label="C4 Studios"]'); const r=el.getBoundingClientRect(); return {cx:r.x+r.width/2,cy:r.y+r.height/2}; })()`,returnByValue:true})).result.value;
 const idle = await sample();
 await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:info.cx,y:info.cy,button:'left',clickCount:1}); await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:info.cx,y:info.cy,button:'left',clickCount:1});
 await sleep(2600);
 const lock = await sample();
 await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:info.cx,y:info.cy,button:'left',clickCount:1}); await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:info.cx,y:info.cy,button:'left',clickCount:1});
 await sleep(2200);
 const reverse = await sample();
 const equality = idle.map((item, index) => ({ index, lockMatchesIdle: lock[index].d === item.d, reverseMatchesIdle: reverse[index].d === item.d, reverseTransformIdentity: reverse[index].transform === 'matrix(1, 0, 0, 1, 0, 0)' }));
 await fs.writeFile('C:/Users/belac/Downloads/C4-main/C4-main/reports/runtime-audit/header-d-equality.json', JSON.stringify({idle, lock, reverse, equality}, null, 2));
 ws.close(); })().catch(e=>{console.error(e); process.exit(1);});
