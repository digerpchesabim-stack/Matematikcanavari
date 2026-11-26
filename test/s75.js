// S75: problemlerde eşya–kap uyumu, Skorlarım listesi, yatay uyarı, ana sayfa adları, ana sayfada geri = çıkış,
// mühürlü sandık, Kılıç Bileme, Gölge Kargası, Kalkan Refleksi, Sis Gözü, Canavar Kitabı, Orta toplamada onluk payı.
// Kullanım: node test/s75.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const http=require('http');
const ROOT=path.resolve(__dirname,'..');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
const MT={'.html':'text/html','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json','.mp4':'video/mp4'};
const srv=http.createServer((q,s)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'Content-Type':MT[path.extname(f)]||'application/octet-stream'});s.end(d)})});
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});await new Promise(r=>srv.listen(0,r));const U='http://127.0.0.1:'+srv.address().port+'/index.html';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:out?2:1});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(String(e.message||e)));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript(()=>{try{localStorage.setItem('mc_mmus','false');localStorage.setItem('mc_info','1')}catch(e){}});
await p.goto(U);await sleep(900);
const shot=async n=>{if(out)await p.screenshot({path:path.join(out,n+'.png')})};
const E=(f,a)=>p.evaluate(f,a);
await E(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦁 Kral Aslan']));NMS.busy=true;st.profile='🦁 Kral Aslan';
  var a={};a['🦁 Kral Aslan']={c:12,s:{12:2},h:1,t:1,zk:'o'};localStorage.setItem('mc_gu',JSON.stringify(a));go('home');if(st.modal)closeModal();RK.q=[]});
await sleep(300);
// 1) kaplar
ok(await E(()=>{var bad=[];for(var d=1;d<=4;d++)for(var i=0;i<300;i++){var it=pickItem(d),c=pickC(it,d);var L=CTI[it.n];if(it.money){if(CTM.indexOf(c)<0)bad.push(it.n)}else if(L&&L[0].concat(L[1]).map(k=>CC[k]).indexOf(c)<0)bad.push(it.n+'/'+c.n)}return bad.length===0}),'her eşya yalnız uygun kaba konur');
ok(await E(()=>{for(var i=0;i<400;i++){var it={n:'boncuk'},c=pickC(it,3);if(/palet|çuval|el arabası/.test(c.n))return false}return true}),'boncuk palete/çuvala konmaz');
ok(await E(()=>{var s=0;st.op='mul';st.d=1;for(var i=0;i<60;i++){var q=genProblem();if(/undefined|NaN/.test(q.text))s++}st.op='div';for(i=0;i<60;i++){q=genProblem();if(/undefined|NaN/.test(q.text))s++}return s===0}),'problem metinlerinde boşluk/undefined yok');
// 2) Orta toplamada onluk payı (yalnız Güneş Ülkesi)
ok(await E(()=>{var t=0;for(var i=0;i<400;i++){var q=guQ('add','o','',8);var m=q.txt.match(/(\d+) \+ (\d+)/);if(m&&+m[1]%10===0&&+m[2]%10===0)t++}return t<400*0.36}),'Güneş Ülkesi Orta toplamada onluk+onluk payı azaldı');
// 3) ana sayfa adları + geri = çıkış sorusu
ok(await E(()=>/Hızlı Oyun/.test(document.querySelector('.hm-play .hm-t').textContent)&&/Oyna ▶/.test(document.querySelector('.hm-play .hm-go').textContent)&&/Arkadaşlarla Oyna/.test(document.querySelector('.hm-g').textContent)),'ana sayfa: Hızlı Oyun, Oyna ▶, Arkadaşlarla Oyna');
await shot('01_home');
await E(()=>{history.pushState({mc:1},'');NAV.d=1});await E(()=>history.back());await sleep(400);
ok(await E(()=>st.screen==='home'&&!!st.modal&&/çıkmak/i.test(document.getElementById('modal')?document.getElementById('modal').textContent:document.body.textContent)),'ana sayfada geri tuşu → çıkış sorusu');
await E(()=>{if(st.modal)closeModal()});
// 4) Skorlarım listesi
await E(()=>{var r=ls('mc_records',{});r['🦁 Kral Aslan']=[{t:new Date().toISOString(),op:'add',d:1,ok:8,fix:1,bad:1,s:12,ts:[2000,3000]}];lsSet('mc_records',r);go('history')});await sleep(500);
ok(await E(()=>!!document.querySelector('.hday')||/Henüz kayıtlı skor yok/.test(document.body.textContent)),'Skorlarım ekranda liste olarak');
ok(await E(()=>getComputedStyle(document.getElementById('hist')).display==='none'),'Skorlarım resmi ekranda gizli (paylaşım için)');
await shot('02_hist');
// 5) mühürlü sandık
await E(()=>{guOpen()});await sleep(1200);
ok(await E(()=>document.querySelectorAll('.gsd').length===4&&document.querySelectorAll('.gsd.open').length===1),'haritada 4 sandık, 1’i açık (bekçi 12 yenildi)');
ok(await E(()=>{for(var r=0;r<4;r++){var q=guSidePos(r);for(var j=0;j<GUM.ST.length;j++)if(Math.hypot(GUM.ST[j][0]-q[0],GUM.ST[j][1]-q[1])<44)return false}return true}),'sandıklar duraklarla çakışmaz');
ok(await E(()=>{var a=document.querySelector('.gsd.lock');a.click();return /bekçisi yenilince/.test(document.getElementById('toast').textContent)}),'kilitli sandık uyarısı');
await E(()=>{guSideOpen(0)});await sleep(300);
ok(await E(()=>st.screen==='gustop'&&GQ.side===1&&/3/.test(document.getElementById('gs-i').textContent)),'sandık: 3 soru');
for(let i=0;i<3;i++){await E(()=>{var q=GQ.q,j=q.opts.findIndex(o=>o.v===q.ans);guStopAns(j,document.querySelectorAll('#gs-a .ani')[j])});await sleep(800)}
await sleep(400);
ok(await E(()=>GQ.end&&GQ.win&&guD().y[1]===1),'sandık açıldı (y kaydı)');
ok(await E(()=>{var d=guD();return guLight(d)>=5}),'sandık ışığı ışık toplamına eklendi');
await shot('03_side');
// 6) Kılıç Bileme + bekçide çift vuruş
await E(()=>{guRootSet(r=>{r.w=[{t:'7 + 8',a:15,o:'add'},{t:'9 + 6',a:15,o:'add'},{t:'14 − 6',a:8,o:'sub'}]});guToMap()});await sleep(600);
await E(()=>{var d=guD();d.c=23;guPut(d);render();guSel(24,guD())});await sleep(300);
ok(await E(()=>!!document.querySelector('.gkbb')),'bekçi kartında Kılıcını bile');
await E(()=>guKbOpen());await sleep(300);
ok(await E(()=>st.screen==='gustop'&&GQ.kb&&GQ.N===3),'Kılıç Bileme açıldı (3 yanlış)');
for(let i=0;i<3;i++){await E(()=>{var q=GQ.q,j=q.opts.findIndex(o=>o.v===q.ans);guStopAns(j,document.querySelectorAll('#gs-a .ani')[j])});await sleep(800)}
await sleep(300);
ok(await E(()=>guRaw().kb===1&&(guRaw().w||[]).length===0),'kılıç keskin, çalışılan yanlışlar defterden düştü');
await E(()=>{guToMap();GU.spd=0.2;guDuelOpen(24)});await sleep(1500);await E(()=>guFight());await sleep(400);
await E(()=>{var i=GD.q.opts.findIndex(o=>o.v===GD.q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])});await sleep(200);
ok(await E(()=>GD.hx-GD.hp===2&&!guRaw().kb),'bekçiye ilk vuruş çift, kılıç harcandı');
// 7) Kalkan Refleksi
await sleep(600);
await E(()=>{GU.spd=1;GD.T=1;GD.pc=true});await sleep(300);
ok(await E(()=>GD.sub==='shield'&&!!document.getElementById('gd-shb')),'yaratık önce davranınca kalkan düğmesi');
await shot('04_shield');
const me0=await E(()=>GD.me);
await E(()=>guShield());await sleep(300);
const shr=await E(()=>JSON.stringify({me:GD.me,sh:GD.sh,sub:GD.sub}));ok(JSON.parse(shr).me===me0&&JSON.parse(shr).sh===1,'kalkanla saldırı durdu, can gitmedi '+shr+' me0='+me0);
await E(()=>{guToMap()});await sleep(400);
// 8) Sis Gözü (Zor)
await E(()=>{guZSet('z');guDuelOpen(48)});await sleep(1500);await E(()=>guFight());await sleep(3600);
ok(await E(()=>{var e=document.getElementById('gd-q');return e.classList.contains('geye')&&e.classList.contains('full')}),'Sis Gözü soruyu örttü (Zor)');
await E(()=>guPeek());await sleep(100);
ok(await E(()=>!document.getElementById('gd-q').classList.contains('full')),'dokununca bir an görünür');
await E(()=>{guToMap();guZSet('o')});await sleep(400);
// 9) Gölge Kargası
await E(()=>{GU.crowP=1;guStopOpen(13);GQ.ok=10;GQ.i=10;guStopEnd()});await sleep(300);
ok(await E(()=>!!document.getElementById('gcrow')),'durak sonunda Gölge Kargası');
const cr0=await E(()=>guRaw().cr|0);
await E(()=>{var q=GQ.crow.q,j=q.opts.findIndex(o=>o.v===q.ans);guCrowAns(j)});await sleep(200);
ok(await E(c=>(guRaw().cr|0)===c+1&&/Kuzgun tüyü/.test(document.body.textContent),cr0),'doğru cevap → Kuzgun tüyü');
await shot('05_crow');
await E(()=>{GU.crowP=0;guToMap()});await sleep(500);
// 10) Canavar Kitabı
await E(()=>guBookOpen());await sleep(300);
ok(await E(()=>document.querySelectorAll('.gbki').length===15&&document.querySelectorAll('.gbki:not(.unk)').length>=1),'Canavar Kitabı: 15 yaratık, yenilenler açık');
await shot('06_book');
await E(()=>back());await sleep(200);
ok(await E(()=>st.screen==='gumap'&&!GU.book),'geri → kitap kapanır');
// 11) yatay uyarı
await E(()=>{guStopOpen(13)});await sleep(300);
await p.setViewportSize({width:844,height:390});await sleep(400);
ok(await E(()=>document.body.classList.contains('gland')&&GQ.hr===1),'yatayda "Telefonu dik tut" ve süre durdu');
await p.setViewportSize({width:390,height:844});await sleep(400);
ok(await E(()=>!document.body.classList.contains('gland')&&!GQ.hr),'dik → devam');
await E(()=>guToMap());await sleep(300);
// 12) 320 px
await p.setViewportSize({width:320,height:568});await E(()=>{go('home')});await sleep(500);
ok(await E(()=>document.documentElement.scrollWidth<=320),'320 px ana sayfa taşmıyor');
await E(()=>{guOpen()});await sleep(1200);await E(()=>guBookOpen());await sleep(300);
ok(await E(()=>document.documentElement.scrollWidth<=320&&document.querySelector('.gbk2').getBoundingClientRect().bottom<=568),'320 px Canavar Kitabı sığar');
await shot('07_small');
// 13) eşitleme: sandık ve tüy birleşir
ok(await E(()=>{var k='🦁 Kral Aslan',B={};B[k]={c:1,s:{},y:{2:1},cr:9,x:{c:0,s:{},y:{3:1}}};acMerge({mc_gu:JSON.stringify(B),mc_profiles:JSON.stringify([k])},true);var r=ls('mc_gu',{})[k];return r.y[1]===1&&r.y[2]===1&&r.cr===9&&r.x.y[3]===1}),'eşitleme: sandıklar ve tüyler birleşir');
ok(!errs.length,'sayfa hatası yok '+errs.join(' | '));
console.log(fail?fail+' HATA':'HEPSİ GEÇTİ');await b.close();srv.close();process.exit(fail?1:0)})();
