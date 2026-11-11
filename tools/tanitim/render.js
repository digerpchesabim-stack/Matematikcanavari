// Kullanım: node render.js <ilk kare> <son kare> [adım=1] [klasör=frames] [jpg|png]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const R='/home/claude/matematikcanavari';const D=__dirname;
const a=process.argv,from=+a[2]||0,to=+a[3]||899,step=+a[4]||1,out=path.resolve(D,a[5]||'frames'),fmt=a[6]||'png';
(async()=>{fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1,locale:'tr-TR'});const p=await ctx.newPage();
p.on('pageerror',e=>console.log('PAGEERR',e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load|net::ERR/.test(m.text()))console.log('CONSOLE',m.text())});
await p.addInitScript(fs.readFileSync(R+'/test/mockfb.js','utf8'));
await p.addInitScript(()=>{try{localStorage.setItem('mc_mmus','false');Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}});
await p.goto('file://'+R+'/index.html');await p.waitForTimeout(1200);
await p.evaluate(()=>{try{go('guide')}catch(e){}});
await p.evaluate(([c,m])=>{window.__PV_CLIPS=c;window.__PV_MARKS=m},['file://'+D+'/clips/',JSON.parse(fs.readFileSync(D+'/clips/marks.json'))]);
await p.addScriptTag({path:D+'/stage.js'});
console.log('M3',await p.evaluate(()=>PV.init()));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
const t0=Date.now();let n=0;
for(let i=from;i<=to;i+=step){await p.evaluate(t=>PV.render(t),i/30);
  await p.screenshot({path:path.join(out,'f'+String(i).padStart(5,'0')+'.'+fmt),type:fmt==='jpg'?'jpeg':'png',...(fmt==='jpg'?{quality:88}:{})});n++}
console.log(n,'kare',((Date.now()-t0)/1000).toFixed(0)+' sn');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
