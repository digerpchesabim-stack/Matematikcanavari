// S60: yeni ana menü (karakter şeridi, büyük Oyna, 4 kare), alt sekme çubuğu, engelleme, konfeti, NaN.
// Kullanım: node test/s60.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();
const open=async(vp,theme)=>{const ctx=await b.newContext({viewport:vp||{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();p.errs=[];
  p.on('pageerror',e=>p.errs.push(String(e.message||e)));
  await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
  await p.addInitScript((t)=>{try{localStorage.setItem('mc_mmus','false');localStorage.setItem('mc_theme',JSON.stringify(t||'light'));Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}},theme);
  await p.goto(U);await sleep(900);return p};
const shot=async(p,n,full)=>{if(out)await p.screenshot({path:path.join(out,n+'.png'),fullPage:!!full})};
const prof=p=>p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦊 Kurnaz Tilki']));NMS.busy=true;st.profile='🦊 Kurnaz Tilki';var R=rkGet(st.profile);R.p=70;R.r=2;rkPut(st.profile,R);go('home');if(st.modal)closeModal();RK.q=[]});
let p=await open();await prof(p);await sleep(700);await p.evaluate(()=>{if(st.modal)closeModal()});
ok(await p.evaluate(()=>!!document.querySelector('.hstrip')&&!!document.querySelector('.hplay')&&document.querySelectorAll('#app .hgrid .btn').length===4),'ana menü: şerit + Oyna + 4 kare');
ok(await p.evaluate(()=>{var t=document.getElementById('tabs');return t&&!t.hidden&&t.children[0].classList.contains('on')}),'alt sekme çubuğu görünür, Oyna seçili');
ok(await p.evaluate(()=>/Akıldan İşlem Oyunu/.test(document.querySelector('.hplay').textContent)),'ilk açılışta Oyna → Akıldan İşlem');
await sleep(500);
ok(await p.evaluate(()=>{var c=document.getElementById('hpm').getContext('2d').getImageData(0,0,208,208).data,n=0;for(var i=3;i<c.length;i+=4)if(c[i]>200)n++;return n>3000}),'Oyna düğmesinde canavar çizildi');
await shot(p,'01_ana_menu');
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'taşma yok');
await p.evaluate(()=>homePlay());await sleep(300);ok(await p.evaluate(()=>st.screen==='gmenu'&&document.getElementById('tabs').hidden),'Oyna (ilk) → oyun menüsü, sekmeler gizli');
await p.evaluate(()=>{gStart('mul','o',0)});await sleep(300);await p.evaluate(()=>{go('home')});await sleep(300);
ok(await p.evaluate(()=>/Kaldığın yer: Çarpma · Orta/.test(document.querySelector('.hplay').textContent)),'Kaldığın yer: Çarpma · Orta');
await p.evaluate(()=>homePlay());await sleep(300);ok(await p.evaluate(()=>st.g&&st.g.op==='mul'&&st.g.lv==='o'),'Oyna son oyunu başlatır');
await p.evaluate(()=>go('home'));await sleep(300);
await p.evaluate(()=>tabGo(1));await sleep(600);ok(await p.evaluate(()=>st.screen==='friends'&&!!document.getElementById('tm-home')&&document.getElementById('tabs').children[1].classList.contains('on')),'Arkadaşlar sekmesi + Takımım');await shot(p,'02_arkadaslar');
await p.evaluate(()=>tabGo(2));await sleep(600);ok(await p.evaluate(()=>st.screen==='kart'&&/Skorlarım/.test(document.getElementById('app').textContent)),'Kartım sekmesi + Skorlarım');
ok(await p.evaluate(()=>!/NaN/.test(document.getElementById('app').textContent)),'kartta NaN yok');
await p.evaluate(()=>{var R=rkGet(st.profile);R.sw=12;rkPut(st.profile,R);render()});ok(await p.evaluate(()=>!/NaN/.test(document.getElementById('app').textContent)),'bozuk sayaçta da NaN yok');
await p.evaluate(()=>tabGo(3));await sleep(400);ok(await p.evaluate(()=>st.screen==='hesap'&&/Kılavuz/.test(document.getElementById('app').textContent)&&/Paylaş/.test(document.getElementById('app').textContent)),'Ayarlar sekmesi: Kılavuz, Paylaş');
await p.evaluate(()=>back());await sleep(300);ok(await p.evaluate(()=>st.screen==='home'),'Ayarlar ← ana menü');
// engelle
await p.evaluate(()=>{FR.list=['BBBBBBB'];FR.nick.BBBBBBB='🐼 Panda';FR.inc=['CCCCCCC'];FR.nick.CCCCCCC='🐯 Kaplan';tabBadge()});
ok(await p.evaluate(()=>document.getElementById('tab-frb').textContent==='1'),'arkadaşlık isteği rozeti sekmede');
await p.evaluate(()=>{st.fp='BBBBBBB';go('fprof')});await sleep(300);ok(await p.evaluate(()=>/Engelle/.test(document.getElementById('app').textContent)),'arkadaş profilinde Engelle');
await p.evaluate(()=>blkAsk('BBBBBBB'));await sleep(200);await shot(p,'03_engelle');await p.evaluate(()=>{document.getElementById('my').click()});await sleep(400);
ok(await p.evaluate(()=>blkHas('BBBBBBB')&&FR.list.indexOf('BBBBBBB')<0&&st.screen==='friends'),'engellendi, arkadaşlıktan çıktı');
await p.evaluate(()=>{st.kc={pid:'BBBBBBB',nick:'🐼 Panda',d:{}};});ok(await p.evaluate(()=>/Engeli kaldır/.test(rkFrBtns('BBBBBBB'))),'kartta "engeli kaldır"');
await p.evaluate(()=>{st.kc=null;go('hesap')});await sleep(300);ok(await p.evaluate(()=>/Engellediklerim/.test(document.getElementById('app').textContent)),'Hesabım: Engellediklerim');await shot(p,'04_hesap',true);
await p.evaluate(()=>blkDel('BBBBBBB'));ok(await p.evaluate(()=>!blkHas('BBBBBBB')),'engel kaldırıldı');
ok(await p.evaluate(()=>BKK.indexOf('mc_blk')>=0),'engel listesi yedekte');
// konfeti
await p.evaluate(()=>{go('home');confetti(true)});await sleep(700);ok(await p.evaluate(()=>[...document.querySelectorAll('body>canvas')].length>0),'konfeti başladı');
await p.evaluate(()=>go('rooms'));await sleep(300);ok(await p.evaluate(()=>[...document.querySelectorAll('body>canvas')].length===0),'ekran değişince konfeti durdu');
await p.evaluate(()=>{go('home');confetti(true);go('gover')}).catch(()=>{});await sleep(800);
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));await p.context().close();
// misafir, küçük ekran, gece
p=await open({width:320,height:568},'dark');await p.evaluate(()=>{guest()});await sleep(500);
ok(await p.evaluate(()=>document.getElementById('tabs').hidden&&!document.querySelector('.hstrip')&&/Ayarlar/.test(document.getElementById('app').textContent)),'misafir: sekme yok, Ayarlar düğmesi var');await shot(p,'05_misafir_320');
await prof(p);await sleep(700);await p.evaluate(()=>{if(st.modal)closeModal()});ok(await p.evaluate(()=>document.documentElement.scrollWidth<=320),'320 px taşma yok');await shot(p,'06_gece_320');
const ov=await p.evaluate(()=>{var t=document.getElementById('tabs').getBoundingClientRect(),l=[...document.querySelectorAll('#app button')].pop();window.scrollTo(0,1e5);var r=l.getBoundingClientRect();return r.bottom<=t.top+1});ok(ov,'son düğme sekme çubuğunun altında kalmıyor');
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));await p.context().close();
// yasal sayfalar ve Verilerimi sil → takımdan çıkma
p=await open();await prof(p);await sleep(600);await p.evaluate(()=>{if(st.modal)closeModal()});
await p.evaluate(()=>tabGo(3));await sleep(300);
ok(await p.evaluate(()=>/Gizlilik Politikası/.test(document.getElementById('app').textContent)&&/KVKK Aydınlatma/.test(document.getElementById('app').textContent)),'Ayarlar: yasal metin düğmeleri');
await p.evaluate(()=>legalOpen('gizlilik'));await sleep(300);
ok(await p.evaluate(()=>st.screen==='legal'&&document.querySelectorAll('.lgl section').length>=10&&/Hangi bilgileri/.test(document.getElementById('app').textContent)),'Gizlilik Politikası uygulamada');await shot(p,'08_gizlilik',true);
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=390),'yasal ekranda taşma yok');
await p.evaluate(()=>{[...document.querySelectorAll('.lgl a')].find(a=>/veri-silme|silme sayfas/i.test(a.textContent)||/veri-silme/.test(a.getAttribute('onclick')||'')).click()});await sleep(300);
ok(await p.evaluate(()=>st.lg==='veri-silme'&&/Neler silinir/.test(document.getElementById('app').textContent)),'sayfalar arası bağlantı');
await p.evaluate(()=>legalOpen('aydinlatma'));await sleep(200);ok(await p.evaluate(()=>/KVKK m\. 11/.test(document.getElementById('app').textContent)),'aydınlatma metni');
await p.evaluate(()=>back());await sleep(300);ok(await p.evaluate(()=>st.screen==='hesap'),'geri → Ayarlar');
const tw=await p.evaluate(async()=>{await frEnsure();var me=(frIds()[st.profile]||{}).id;var fb=await devAuth();await fb.setDoc(fb.doc(CL.db,'tm','7'),{m:[me,'ZZZZZZZ'],cap:me,by:me,w:0,l:0,ts:Date.now(),v:60});tmSetKey(7);return me});
await p.evaluate(()=>acWipe());await sleep(2500);
ok(await p.evaluate(async()=>{var fb=await devAuth();var s=await fb.getDoc(fb.doc(CL.db,'tm','7'));return s.exists()&&s.data().m.length===1&&s.data().m[0]==='ZZZZZZZ'&&s.data().cap==='ZZZZZZZ'}),'Verilerimi sil takımdan da çıkarır');
ok(await p.evaluate(()=>st.screen==='welcome'),'silme sonrası karşılama');
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));await p.context().close();
// ilk açılış bilgilendirme kartı
{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const q=await ctx.newPage();q.errs=[];q.on('pageerror',e=>q.errs.push(String(e.message||e)));
 await q.addInitScript(()=>{window.__INFO0=1;try{localStorage.setItem('mc_mmus','false')}catch(e){}});await q.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await q.goto(U);await sleep(800);
 await q.evaluate(()=>startGo());await sleep(300);ok(await q.evaluate(()=>st.screen==='info'&&/hangi bilgileri/.test(document.getElementById('app').textContent)),'ilk açılışta bilgilendirme kartı');await shot(q,'07_bilgilendirme');
 await q.evaluate(()=>infoFull());await sleep(200);ok(await q.evaluate(()=>st.screen==='legal'&&st.lg==='gizlilik'),'veliler için tam metin');await q.evaluate(()=>back());await sleep(200);ok(await q.evaluate(()=>st.screen==='info'),'yasal → bilgilendirme kartına dönüş');
 await q.evaluate(()=>back());await sleep(200);ok(await q.evaluate(()=>st.screen==='welcome'),'geri → karşılama');
 await q.evaluate(()=>startGo());await sleep(200);await q.evaluate(()=>infoOk());await sleep(300);ok(await q.evaluate(()=>st.screen==='profiles'),'Anladım → karakter seçimi');
 await q.evaluate(()=>go('welcome'));await q.evaluate(()=>startGo());await sleep(300);ok(await q.evaluate(()=>st.screen==='profiles'),'ikinci kez çıkmıyor');
 await q.evaluate(()=>{localStorage.removeItem('mc_info');localStorage.setItem('mc_profiles',JSON.stringify(['🦊 Kurnaz Tilki']));st.profile='🦊 Kurnaz Tilki';go('home')});await sleep(300);ok(await q.evaluate(()=>st.screen==='info'),'mevcut kullanıcı da bir kez görür');
 await q.evaluate(()=>infoOk());await sleep(300);ok(await q.evaluate(()=>st.screen==='home'),'sonra ana menü');
 ok(q.errs.length===0,'sayfa hatası yok '+JSON.stringify(q.errs.slice(0,3)));await ctx.close()}
await b.close();console.log(fail?'BAŞARISIZ '+fail:'HEPSİ GEÇTİ');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
