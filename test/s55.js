// S55: 📣 Herkesi çağır (çevrim içi arkadaşlar, ilk gelen, geri çekme, başka daveti olan atlanır, 3 dk sınır) + 💬 hazır mesajlar
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[40,200]});
const pushes=[];
const mk=async(pid,name)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});
  await ctx.route(/w\.test/,r=>{try{const j=JSON.parse(r.request().postData()||'{}');pushes.push({p:pid,k:j.k,to:j.to})}catch(e){}r.fulfill({status:200,body:'{"ok":true}'})});
  const p=await S.phone(ctx,pid,U);
  await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));NMS.busy=true;st.profile=n;go('home');return frEnsure()},name);await sleep(1500);
  await p.evaluate(()=>{if(st.modal)closeModal();RK.q=[];PUSH.cfg={u:'https://w.test',k:'K'}});return p};
const A=await mk('A','🦊 Kurnaz Tilki'),B=await mk('B','🐼 Cesur Panda'),C=await mk('C','🦁 Aslan'),D=await mk('D','🐯 Kaplan'),E=await mk('E','🐨 Koala');
const P={A,B,C,D,E};const ev=(p,f,a)=>p.evaluate(f,a);
const pid={};for(const k in P)pid[k]=await ev(P[k],()=>FR.pid);
const fr=async(x,y)=>{await ev(P[x],c=>frAddId(c),pid[y]);await sleep(500);await ev(P[y],c=>frAccept(c),pid[x]);await sleep(400)};
for(const k of ['B','C','D','E'])await fr('A',k);
await fr('B','D');
await sleep(1500);
for(const p of Object.values(P))await ev(p,()=>{if(st.modal)closeModal();go('home');frNicks(null,FR.list)});
await sleep(1500);
const txt=p=>ev(p,()=>document.getElementById('ov').hidden?'':document.getElementById('ov').innerText.replace(/\n+/g,' | '));
const waitF=async(p,f,a,ms=8000)=>{for(let i=0;i<ms/100;i++){if(await ev(p,f,a))return true;await sleep(100)}return false};

// hazırlık: E çevrim dışı; D'nin B'den açık daveti var
await ev(A,e=>{FR.seen[e]=Date.now()-600000},pid.E);
await ev(B,d=>{frCall(d)},pid.D);await sleep(200);await ev(B,()=>frCallGo('sub'));
await waitF(D,()=>st.modal&&!!document.getElementById('m3-2'));
await ev(A,()=>go('friends'));await sleep(600);
ok(await ev(A,()=>/Çevrim içi herkesi çağır/.test(document.getElementById('app').innerText)),'Arkadaşlarım\'da "Çevrim içi herkesi çağır"');
const hl=await ev(A,()=>{go('home');return document.getElementById('fr-live').innerText});
ok(/Hepsini çağır/.test(hl),'ana menü kutusunda "Hepsini çağır"');
// 1) 1'e 1 toplu
await ev(A,()=>frAllOpen());await sleep(300);
const fc=await ev(A,()=>document.getElementById('app').innerText);
ok(/Herkesi çağır/.test(fc)&&/1’e 1/.test(fc)&&/Muharebe/.test(fc)&&/Yarış/.test(fc),'çağırma ekranında oyun türü seçimi');
await A.screenshot({path:__dirname+'/s55_cagir.png'});
await ev(A,()=>frCallGo('add'));
await waitF(A,()=>st.screen==='lobby'&&RM.ivg);await sleep(1500);
const sent=await ev(A,()=>Object.keys(RM.ivs).filter(k=>RM.ivs[k].g));
console.log('  çağrılan:',sent.length,'toast:',await ev(A,()=>document.getElementById('toast').textContent));
ok(sent.includes(pid.B)&&sent.includes(pid.C)&&!sent.includes(pid.D)&&!sent.includes(pid.E),'çevrim içi B ve C çağrıldı; başka daveti olan D ve çevrim dışı E atlandı');
ok(S.store['iv/'+pid.D].from===pid.B,'D\'nin B\'den gelen daveti bozulmadı');
await waitF(C,()=>st.modal&&!!document.getElementById('m3-1'));
const tc=await txt(C);console.log('  C davet:',tc);
ok(/herkesi/.test(tc)&&/Katıl/.test(tc)&&/Meşgulüm/.test(tc)&&!/Daha sonra/.test(tc),'toplu davette sadece Katıl / Meşgulüm');
await C.screenshot({path:__dirname+'/s55_davet.png'});
ok(/çağrıldı/.test(await ev(A,()=>document.getElementById('iv-sum').innerText)),'lobide toplu durum');
await A.screenshot({path:__dirname+'/s55_lobi.png'});
await ev(C,()=>document.getElementById('m3-0').click());
ok(await waitF(A,()=>st.screen==='dintro'||st.screen==='duel',null,10000),'ilk kabul edenle kapışma başladı');
await sleep(1500);
ok(!S.store['iv/'+pid.B],'başlayınca diğer cevapsız davet geri çekildi');
ok(pushes.filter(x=>x.p==='A'&&x.k==='iv').length>=2,'toplu davet bildirimleri');
for(const k of ['A','C'])await ev(P[k],()=>{if(DU)DU.quit=true;rmReset();go('home')});
await ev(B,()=>{rmLeave();go('home')});await ev(D,()=>{if(st.modal)closeModal();go('home')});await sleep(800);

// 2) 3 dk sınırı
await ev(A,()=>{RC.mode='race';rmCreate('add',0)});await waitF(A,()=>st.screen==='lobby');
await ev(A,()=>frInvAll());await sleep(300);
ok(/dakika bekle/.test(await ev(A,()=>document.getElementById('toast').textContent)),'3 dakika dolmadan tekrar toplu çağırma yok');
// 3) yarış: kabul eden herkes
await ev(A,()=>{FR.allT=0;for(var k in FR.seen)FR.seen[k]=Date.now()});
await ev(A,e=>{FR.seen[e]=Date.now()-600000},pid.E);
await ev(A,()=>frInvAll());await sleep(1500);
for(const k of ['B','C','D']){await waitF(P[k],()=>st.modal&&!!document.getElementById('m3-0'));await ev(P[k],()=>document.getElementById('m3-0').click());await sleep(500)}
ok(await waitF(A,()=>RM.players.length===4),'yarışa kabul eden herkes girdi (4 kişi)');
console.log('  özet:',(await ev(A,()=>document.getElementById('iv-sum').innerText)).replace(/\n+/g,' | '));
for(const p of [A,B,C,D])await ev(p,()=>{rmLeave();go('home')});await sleep(800);

// 4) mesajlar
await ev(A,b=>msgOpen(b),pid.B);await sleep(300);
const mp=await txt(A);ok(/Merhaba/.test(mp)&&/Oyun/.test(mp)&&/Tebrik/.test(mp)&&/Cevap/.test(mp),'mesaj seçici: 4 sekme + emoji');
await A.screenshot({path:__dirname+'/s55_mesaj.png'});
await ev(A,()=>msgTab(1));await sleep(100);
ok(/Hadi oynayalım/.test(await txt(A)),'Oyun sekmesi');
await ev(A,()=>msgSend(5));await sleep(800);
ok(S.store['ms/'+pid.A+'_'+pid.B]&&S.store['ms/'+pid.A+'_'+pid.B].m===5,'buluta sadece numara gitti');
ok(pushes.some(x=>x.p==='A'&&x.k==='ms'&&x.to===pid.B),'oyun mesajı bildirimi');
ok(await waitF(B,()=>st.modal&&/Hadi oynayalım/.test(document.getElementById('ov').innerText)),'alıcıda mesaj kutusu');
const tb=await txt(B);console.log('  B mesaj:',tb);ok(/Çağır/.test(tb)&&/Cevap ver/.test(tb),'oyun mesajında Çağır / Cevap ver');
await B.screenshot({path:__dirname+'/s55_gelen.png'});
await ev(B,()=>document.getElementById('m3-1').click());await sleep(300);
await ev(B,()=>msgSend(24));await sleep(1200);
ok(await waitF(A,()=>st.modal&&/👏/.test(document.getElementById('ov').innerText)),'emoji cevabı geldi');
await ev(A,()=>closeModal());
await ev(A,b=>msSend(b,1),pid.B);await sleep(200);
ok(/30 saniyede/.test(await ev(A,()=>document.getElementById('toast').textContent)),'aynı kişiye 30 sn sınırı');
ok(!S.store['ms/'+pid.A+'_'+pid.B]||S.store['ms/'+pid.A+'_'+pid.B].m===5,'sınırda gönderilmedi');
await ev(A,()=>{go('friends');frUi()});await sleep(500);
ok(/💬 👏/.test(await ev(A,()=>document.getElementById('app').innerText)),'arkadaş listesinde son mesaj');
await ev(C,b=>msgOpen(b),pid.B);await sleep(200);
ok(/sadece arkadaşlara/.test(await ev(C,()=>document.getElementById('toast').textContent)),'arkadaş olmayana mesaj yok');
const r=await ev(C,b=>devAuth().then(fb=>fb.setDoc(fb.doc(CL.db,'ms',FR.pid+'_'+b),{from:FR.pid,to:b,m:5,ts:Date.now(),nick:'x'})).then(()=>'yazıldı',e=>'red'),pid.B);
ok(r==='red','kurallar: arkadaş olmayana mesaj reddedildi');
const r2=await ev(A,b=>devAuth().then(fb=>fb.setDoc(fb.doc(CL.db,'ms',FR.pid+'_'+b),{from:FR.pid,to:b,m:5,ts:Date.now(),nick:'x',t:'kötü söz'})).then(()=>'yazıldı',e=>'red'),pid.B);
ok(r2==='red','kurallar: serbest yazı reddedildi');

console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,10)));
ok(!S.log.some(x=>/ERR/.test(x)),'sayfa hatası yok');
await b.close();console.log(fail?'HATA '+fail:'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
