// S59: 3B maskot. WebGL ile çizim, karşılama sahnesi, paylaşım kartı, WebGL yokken 2B'ye dönüş, yavaş cihazda kademeli düşüş, bağlam kaybı.
// Kullanım: node test/m3d.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;
const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
if(out)fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const open=async(init,vp,extra)=>{const ctx=await b.newContext(Object.assign({viewport:vp||{width:390,height:844},deviceScaleFactor:2},extra||{}));const p=await ctx.newPage();p.errs=[];
  p.on('pageerror',e=>p.errs.push(String(e.message||e)));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::ERR/.test(m.text()))p.errs.push('console: '+m.text())});
  await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await p.addInitScript(()=>{try{localStorage.setItem('mc_mmus','false');Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}});
  if(init)await p.addInitScript(init);await p.goto(U);await sleep(1500);return p};
// opak piksel sayısı, sarı (boynuz) ve beyaz (göz) piksel sayısı, içerik özeti
const probe=(p,o)=>p.evaluate((o)=>{var cv=document.createElement('canvas');cv.width=cv.height=300;var c=cv.getContext('2d');drawMonster(c,150,150,85,o);
  var d=c.getImageData(0,0,300,300).data,n=0,y=0,w=0,s=0;for(var i=0;i<d.length;i+=4){if(d[i+3]>200){n++;s+=d[i]*3+d[i+1]*5+d[i+2];if(d[i]>200&&d[i+1]>150&&d[i+2]<110)y++;if(d[i]>235&&d[i+1]>235&&d[i+2]>235)w++}}return {n:n,y:y,w:w,s:s,st:M3.st}},o||null);
let p=await open();
ok(await p.evaluate(()=>M3.st===2),'WebGL modeli hazır (M3.st=2)');
ok(await p.evaluate(()=>{var cv=document.getElementById('mon');return cv.width>480&&cv.height/cv.width===440/480}),'karşılama tuvali ekran çözünürlüğünde: '+await p.evaluate(()=>document.getElementById('mon').width));
let a=await probe(p);ok(a.n>15000&&a.y>300&&a.w>500,'3B çizim dolu: '+JSON.stringify(a));
let f=await probe(p,{flat:true});ok(f.n>15000&&f.s!==a.s,'2B çizim hâlâ çalışıyor ve 3B\'den farklı');
let m1=await probe(p,{yaw:0,m:1}),m0=await probe(p,{yaw:0,m:0});ok(m1.s!==m0.s,'ağız açılınca görüntü değişiyor');
let y1=await probe(p,{yaw:1.2});ok(y1.s!==m0.s,'dönünce görüntü değişiyor');
// sahne: canavar hareket ediyor, dokununca zıplıyor
const pos=()=>p.evaluate(()=>[CH.m.x,CH.m.y,CH.m.yaw,CH.m.hop]);
const moves=async()=>{let a=await pos();for(let i=0;i<8;i++){await sleep(450);let b=await pos();if(Math.hypot(b[0]-a[0],b[1]-a[1])>5)return true}return false};
ok(await moves(),'canavar koşuyor');
await p.evaluate(()=>{CH.it.forEach(function(it){if(Math.hypot(it.x-CH.m.x,it.y-CH.m.y)<140){it.x=CH.m.x<240?440:40}});var cv=document.getElementById('mon'),r=cv.getBoundingClientRect();chTap({clientX:r.left+CH.m.x*r.width/CH.W,clientY:r.top+CH.m.y*r.height/CH.H})});await sleep(150);
ok((await pos())[3]>0,'dokununca zıplıyor');await sleep(1100);ok((await pos())[3]===0,'zıplama bitiyor');
if(out){await p.screenshot({path:path.join(out,'karsilama1.png')});await sleep(1300);await p.screenshot({path:path.join(out,'karsilama2.png')})}
// yavaş cihaz: kademeli düşüş, sonra canlı sahnede 2B
let q=await p.evaluate(()=>{go('profiles');M3.q=1;M3.live=true;M3.fc=0;M3.ft=0;M3.slow=0;var r=[];for(var k=0;k<5;k++){for(var i=0;i<(k?30:45);i++)m3dPerf(40);r.push(M3.q+':'+M3.live)}return r});
ok(q.join(',')==='0.7:true,0.52:true,0.4:true,0.4:true,0.4:false','yavaş karelerde çözünürlük düşer, sonra 2B: '+q.join(' '));
ok(await p.evaluate(()=>{var v=JSON.parse(localStorage.getItem('mc_m3'));return v&&v.l===0}),'tercih cihazda saklanır');
await sleep(400);ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));
// bağlam kaybı: 2B'ye düşer, hata vermez; geri gelince yine 3B
await p.evaluate(()=>{go('welcome');M3.live=true;M3.q=1;var e=M3.gl.getExtension('WEBGL_lose_context');window.__lc=e;e.loseContext()});await sleep(500);
let l=await probe(p,{live:true});ok(l.st!==2&&l.n>15000,'bağlam kaybında 2B çizilir (st='+l.st+')');
await p.evaluate(()=>window.__lc.restoreContext());await sleep(900);let l2=await probe(p);ok(l2.st===2&&Math.abs(l2.s-a.s)<a.s*0.001,'bağlam geri gelince yine 3B');
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));await p.context().close();
// WebGL yok
p=await open(()=>{var g=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t){if(/webgl/.test(t))return null;return g.apply(this,arguments)}});
let n=await probe(p);ok(n.st===-1&&n.n>15000&&n.s===f.s,'WebGL yokken 2B çizim (st='+n.st+')');
ok(await moves(),'WebGL yokken sahne çalışıyor');
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));if(out)await p.screenshot({path:path.join(out,'karsilama_2b.png')});await p.context().close();
// sade mod (hareketi azalt): sahne 2B, kartlar 3B
p=await open(null,null,{reducedMotion:'reduce'});
ok(await p.evaluate(()=>LITE&&document.documentElement.classList.contains('lite')),'sade mod açık');
let s1=await probe(p);ok(s1.st===2&&Math.abs(s1.s-a.s)<a.s*0.001,'sade modda da canavar 3B');ok(p.errs.length===0,'sayfa hatası yok');await p.context().close();
// 320 px
p=await open(null,{width:320,height:568});ok(await p.evaluate(()=>M3.st===2&&document.documentElement.scrollWidth<=320),'320 px: taşma yok');if(out)await p.screenshot({path:path.join(out,'karsilama_320.png')});await p.context().close();
await b.close();console.log(fail?('BAŞARISIZ '+fail):'HEPSİ GEÇTİ');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
