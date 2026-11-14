// S63: sonuç sayfasında tek, hareketli canavar; sayfadaki kartta canavar yok, paylaşılan resimde var; kazanınca konfeti.
// Kullanım: node test/s63.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:out?2:1});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(String(e.message||e)));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript(()=>{try{localStorage.setItem('mc_mmus','false');Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}});
await p.goto(U);await sleep(900);
await p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦁 Kral Aslan']));NMS.busy=true;st.profile='🦁 Kral Aslan';go('home');if(st.modal)closeModal();RK.q=[];
  window.__cf=0;var o=confetti;confetti=function(b){window.__cf++;o(b)}});
const monCount=()=>p.evaluate(()=>{var n=0;document.querySelectorAll('#app img').forEach(i=>{if(/mc-[a-z]+\.webp/.test(i.getAttribute('src')||''))n++});return n});
// Canavara karşı (internetsiz) maç: kapışma sonuç ekranı aynı
const duel=async(win)=>{
  await p.evaluate(()=>{BOT.b='y';BOT.lv='k';BOT.win=10;botGo('add',0)});
  await p.evaluate((win)=>{clearInterval(window.__au);window.__lk=-1;window.__au=setInterval(()=>{if(DU&&DU.ph==='q'&&DU.k!==window.__lk){window.__lk=DU.k;var k=DU.k;setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];duAns(q.opts.findIndex(o=>win?o.v===q.ans:o.v!==q.ans),null)}},win?150:300)}},50)},win);
  for(let i=0;i<1500;i++){if(await p.evaluate(()=>st.screen==='dover'))break;await sleep(100)}
  await p.evaluate(()=>clearInterval(window.__au));
};
const strip=async(name,times)=>{if(!out)return;let t0=Date.now();for(const t of times){const w=t-(Date.now()-t0);if(w>0)await sleep(w);await p.screenshot({path:path.join(out,name+'_'+String(t).padStart(4,'0')+'.png'),clip:{x:0,y:60,width:390,height:420}})}};
await duel(true);
ok(await p.evaluate(()=>st.screen==='dover'&&DU.won===true),'canavara karşı kazandı');
await sleep(100);
ok(await p.evaluate(()=>window.__cf===1),'kazanınca konfeti');
ok(await monCount()===1,'sayfada tek canavar: '+await monCount());
ok(await p.evaluate(()=>!document.querySelector('.top .tmon')),'başlıkta canavar yok');
ok(await p.evaluate(()=>{var e=document.querySelector('img.rmon');return e.getAttribute('data-mk')==='win'&&e.classList.contains('mwin')}),'kazanma hareketi başladı');
await strip('kazan',[0,250,500,800,1100,1400,1800,2600]);
const seenW=await p.evaluate(()=>new Promise(r=>{var e=document.querySelector('img.rmon'),s=new Set();var t=setInterval(()=>s.add(e.getAttribute('src')),60);setTimeout(()=>{clearInterval(t);r([...s])},2400)}));
ok(seenW.some(x=>/happy/.test(x))&&seenW.some(x=>/cheer/.test(x)),'kazanınca sevinç kareleri değişiyor: '+seenW.join(' '));
// sayfadaki kart canavarsız, paylaşırken canavarlı
const cardPix=()=>p.evaluate(()=>{var c=document.getElementById('dcard'),d=c.getContext('2d').getImageData(c.width/2-60,90,120,120).data,n=0;for(var i=0;i<d.length;i+=4)if(d[i+2]>150&&d[i]>90&&d[i]<190&&d[i+1]<120)n++;return n});
const before=await cardPix();
await p.evaluate(()=>{window.__px=null;var c=document.getElementById('dcard');var o=c.toBlob.bind(c);c.toBlob=function(cb,t){var d=c.getContext('2d').getImageData(c.width/2-60,90,120,120).data,n=0;for(var i=0;i<d.length;i+=4)if(d[i+2]>150&&d[i]>90&&d[i]<190&&d[i+1]<120)n++;window.__px=n;return o(function(){},t)};shareCanvas(c,'x.png')});
await sleep(200);
const during=await p.evaluate(()=>window.__px);await sleep(1500);const after=await cardPix();
ok(before<200&&during>800&&after<200,'kart: sayfada canavarsız ('+before+'), paylaşılan resimde canavarlı ('+during+'), sonra yine canavarsız ('+after+')');
if(out)await p.screenshot({path:path.join(out,'kazan_tam.png'),fullPage:true});
// kaybetme
await p.evaluate(()=>{duExit();go('home')});await sleep(400);await p.evaluate(()=>{window.__cf=0});
await duel(false);
ok(await p.evaluate(()=>st.screen==='dover'&&DU.won===false),'canavara karşı kaybetti');
ok(await p.evaluate(()=>window.__cf===0),'kaybedince konfeti yok');
ok(await monCount()===1,'kaybedince de tek canavar');
await strip('kaybet',[0,500,1200,1700,2300,2900,3600]);
const seenL=await p.evaluate(()=>{var e=document.querySelector('img.rmon');return [e.getAttribute('data-mk'),e.className]});
ok(seenL[0]==='lose'&&/mlose/.test(seenL[1]),'kaybetme hareketi');
// Akıldan İşlem sonucu ve İşlemler raporu: tek canavar
await p.evaluate(()=>{duExit();GS.lv='k';gStart('add',0);if(RM.cd){clearInterval(RM.cd);RM.cd=null}go('game')});await sleep(300);
await p.evaluate(()=>endGame());await sleep(500);
ok(await p.evaluate(()=>st.screen==='gover')&&await monCount()===1,'Akıldan İşlem sonucu: tek canavar');
if(out)await p.screenshot({path:path.join(out,'gover.png'),fullPage:true});
ok(errs.length===0,'sayfa hatası yok '+JSON.stringify(errs.slice(0,3)));
await b.close();console.log(fail?'BAŞARISIZ '+fail:'HEPSİ GEÇTİ');process.exit(fail?1:0)})();
