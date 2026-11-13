// S61: pastel tasarım, 3 tema, hazır kare canavar (menü, soru ekranı, bekleme, sonuç).
// Kullanım: node test/s61.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const open=async(theme,vp)=>{const ctx=await b.newContext({viewport:vp||{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();p.errs=[];
  p.on('pageerror',e=>p.errs.push(String(e.message||e)));
  await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
  await p.addInitScript((t)=>{try{localStorage.setItem('mc_mmus','false');if(!localStorage.getItem('mc_theme'))localStorage.setItem('mc_theme',JSON.stringify(t||'light'));Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}},theme);
  await p.goto(U);await sleep(900);return p};
const prof=p=>p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦊 Kurnaz Tilki']));NMS.busy=true;st.profile='🦊 Kurnaz Tilki';go('home');if(st.modal)closeModal();RK.q=[]});
// eski tema → Açık
let p=await open('sepia');
ok(await p.evaluate(()=>document.documentElement.getAttribute('data-theme')==='light'&&themeGet()==='light'),'eski Kum teması Açık oldu');
ok(await p.evaluate(()=>THEMES.length===4&&THEMES.map(t=>t[0]).join()==='auto,light,dark,hc'),'3 tema + otomatik');
ok(await p.evaluate(()=>getComputedStyle(document.body).backgroundColor==='rgb(245, 243, 251)'),'pastel zemin');
await p.evaluate(()=>themeSet('dark'));ok(await p.evaluate(()=>getComputedStyle(document.body).backgroundColor==='rgb(27, 26, 43)'),'gece teması koyu pastel');
await p.evaluate(()=>{themeSet('light');closeModal()});
// karşılama: canavar hazır karelerle (sabit çözünürlük)
await sleep(1200);
ok(await p.evaluate(()=>{var k=Object.keys(M3S.c);return M3.st<0||(k.length>0&&k.every(x=>/\|(416|288|320)\|/.test(x)))}),'karşılama canavarı hazır karelerle çiziliyor: '+await p.evaluate(()=>Object.keys(M3S.c).slice(0,2).join(' ')));
await prof(p);await sleep(300);
ok(await p.evaluate(()=>{var i=document.querySelector('.hplay img');return !!i&&i.complete&&i.naturalWidth>=300}),'ana menü: Oyna düğmesinde canavar');
ok(await p.evaluate(()=>{var t=document.getElementById('tabs'),c=getComputedStyle(t);return !t.hidden&&parseFloat(c.borderRadius)>=20&&/blur/.test(c.backdropFilter||c.webkitBackdropFilter||'')}),'alt sekme çubuğu yüzen cam');
if(out)await p.screenshot({path:path.join(out,'home.png')});
// menü: üst başlıkta küçük canavar
await p.evaluate(()=>go('gmenu'));await sleep(200);
ok(await p.evaluate(()=>{var i=document.querySelector('.top .tmon');return !!i&&i.complete&&i.naturalWidth>0}),'oyun menüsü başlığında küçük canavar');
ok(await p.evaluate(()=>!!document.querySelector('.big.op-add')&&getComputedStyle(document.querySelector('.big.op-add')).backgroundColor==='rgb(217, 242, 227)'),'işlem karoları kendi renginde (toplama yeşil)');
// soru ekranı: tepki
await p.evaluate(()=>{GS.lv='k';gStart('add',0)});await sleep(300);
await p.evaluate(()=>{if(RM.cd){clearInterval(RM.cd);RM.cd=null}if(st.screen==='gcount'){var w=document.querySelector('.wmon');window.__w=!!w}});
ok(await p.evaluate(()=>window.__w===true),'geri sayımda bekleyen canavar');
await p.evaluate(()=>{if(st.screen!=='game'){go('game')}});await sleep(200);
ok(await p.evaluate(()=>{var q=document.querySelector('.qm .qmon');return !!q&&/mc-look/.test(q.getAttribute('src'))&&!document.querySelector('.top .tmon')}),'soru kartının köşesinde canavar (başlıkta yok)');
ok(await p.evaluate(()=>{var q=document.querySelector('.qmon').getBoundingClientRect(),a=document.getElementById('agrid').getBoundingClientRect();return q.bottom<=a.top+1}),'canavar cevap kutularına değmiyor');
await p.evaluate(()=>{var g=st.g,i=g.q.opts.findIndex(o=>o.v===g.q.ans);document.querySelectorAll('#agrid .ani')[i].click()});await sleep(120);
ok(await p.evaluate(()=>/mc-happy/.test(document.querySelector('.qmon').getAttribute('src'))),'doğru cevapta sevinir');
await sleep(700);ok(await p.evaluate(()=>/mc-look/.test(document.querySelector('.qmon').getAttribute('src'))),'yarım saniye sonra eski hâline döner');
if(out)await p.screenshot({path:path.join(out,'soru.png')});
await sleep(900);await p.evaluate(()=>{var g=st.g,i=g.q.opts.findIndex(o=>o.v!==g.q.ans);document.querySelectorAll('#agrid .ani')[i].click()});await sleep(120);
ok(await p.evaluate(()=>/mc-wait/.test(document.querySelector('.qmon').getAttribute('src'))),'yanlışta sakin bakar (gülmez)');
// sonuç
await p.evaluate(()=>{endGame()});await sleep(400);
ok(await p.evaluate(()=>{var r=document.querySelector('.rhero');return st.screen==='gover'&&!!r&&!!r.querySelector('img.rmon')&&/puan/.test(r.textContent)}),'sonuç sayfasında canavar ve özet: '+await p.evaluate(()=>(document.querySelector('.rhero')||{}).textContent));
if(out)await p.screenshot({path:path.join(out,'sonuc.png')});
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));
await p.context().close();
// 320 px ve çok büyük yazı: taşma yok
p=await open('light',{width:320,height:568});await prof(p);await p.evaluate(()=>fsSet(2));await sleep(300);
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'320 px + çok büyük yazı: ana menü taşmıyor');
await p.context().close();
p=await open('light');await prof(p);await p.evaluate(()=>fsSet(2));await sleep(200);
await p.evaluate(()=>{GS.lv='z';gStart('mul',0);if(RM.cd){clearInterval(RM.cd);RM.cd=null}go('game')});await sleep(300);
ok(await p.evaluate(()=>{var a=document.querySelectorAll('#agrid .ani'),l=a[a.length-1].getBoundingClientRect();return l.bottom<=window.innerHeight+1&&document.documentElement.scrollWidth<=window.innerWidth+1}),'çok büyük yazı: cevaplar ekrana sığıyor');
if(out)await p.screenshot({path:path.join(out,'soru_fs2.png')});
ok(p.errs.length===0,'sayfa hatası yok (320) '+JSON.stringify(p.errs.slice(0,3)));
await b.close();console.log(fail?'BAŞARISIZ '+fail:'HEPSİ GEÇTİ');process.exit(fail?1:0)})();
