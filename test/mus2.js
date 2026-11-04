const {chromium,devices}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();
const ctx=await b.newContext({...devices['Pixel 7'],serviceWorkers:'block'});let n=0;
await ctx.route(/menu\.mp3/,r=>{n++;if(n<=2)return r.abort('failed');return r.continue()});
const p=await ctx.newPage();await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.goto(''+(process.env.MC_URL||'http://localhost:8767/index.html')+'');await sleep(500);await p.tap('canvas#mon');
for(let i=0;i<8;i++){await sleep(1000);const s=await p.evaluate(()=>MM.el?('paused='+MM.el.paused+' t='+MM.el.currentTime.toFixed(1)+' tries='+MM.tries+' err='+(MM.el.error&&MM.el.error.code)):'el yok tries='+MM.tries);console.log((i+1)+' sn:',s,'istek='+n)}
await b.close()})();
