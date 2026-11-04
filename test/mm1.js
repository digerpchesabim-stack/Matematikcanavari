// Sürüm 47: Meydan Muharebesi (4 telefon), kopan oyuncu, rövanş; arkadaş profili; rekor tablosundan istek
const {chromium}=require('playwright');
const U=process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html');
const OUT=process.env.OUT||'.';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[40,250]});
const ev=(p,f,a)=>p.evaluate(f,a);const txt=p=>ev(p,()=>document.body.innerText.replace(/\n+/g,' | '));
const mk=async(pid,e)=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await S.phone(ctx,pid,U);
  await sleep(300);await ev(p,e=>{peOpen(-1);peSet(e)},e);await sleep(500);await ev(p,()=>peSave());await sleep(900);await ev(p,()=>go('rooms'));return p};
const A=await mk('A',1),B=await mk('B',0),C=await mk('C',3),D=await mk('D',2);
const P=[A,B,C,D];
console.log('0 adlar:',await Promise.all(P.map(p=>ev(p,()=>st.profile))));
await ev(A,()=>{rcGo('mm');rcSet('win',10)});await A.screenshot({path:OUT+'/m_create.png'});
await ev(A,()=>rcOp('add'));await sleep(900);
const code=await ev(A,()=>RM.code);
console.log('1 oda:',JSON.stringify(S.store['rooms/'+code]));
for(const p of [B,C]){await p.fill('#r-code',code);await ev(p,()=>rmJoin());await sleep(500)}
await sleep(700);
console.log('2 A lobi (3 kişi):',(await txt(A)).slice(0,330));
await A.screenshot({path:OUT+'/m_lobby.png'});
await D.fill('#r-code',code);await ev(D,()=>rmJoin());await sleep(900);
const E=await mk('E',4);await E.fill('#r-code',code);await ev(E,()=>rmJoin());await sleep(800);
console.log('3 beşinci kişi:',await ev(E,()=>st.screen+' | '+document.getElementById('toast').textContent));
console.log('  düğme:',await ev(A,()=>document.getElementById('mm-go').textContent));
await ev(A,()=>rmStart());await sleep(1600);
console.log('4 intro:',await Promise.all(P.map(p=>ev(p,()=>st.screen+' '+(DU&&DU.ids.length)))));
await A.screenshot({path:OUT+'/m_intro.png'});
// otomatik oyuncular: her telefon kendi hızında; D 3. turdan sonra uygulamayı kapatıyor (sinyal yok)
const bot=(p,mn,mx,pc)=>ev(p,([mn,mx,pc])=>{window.__ap=setInterval(()=>{if(DU&&st.screen==='duel'&&DU.ph==='q'&&DU.__k!==DU.k){DU.__k=DU.k;var k=DU.k,d=mn+Math.random()*(mx-mn),ok=Math.random()<pc;setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];var i=q.opts.findIndex(o=>(o.v===q.ans)===ok);duAns(i,document.querySelectorAll('#dgrid .ani')[i])}},d)}},50)},[mn,mx,pc]);
await bot(A,600,2600,0.85);await bot(B,600,2600,0.85);await bot(C,700,3000,0.8);await bot(D,800,3000,0.8);
await sleep(9000);await A.screenshot({path:OUT+'/m_game.png'});
console.log('5 oyunda:',await Promise.all(P.map(p=>ev(p,()=>DU.k+' '+JSON.stringify(DU.pts)))));
// D telefonu kapanır (sayfa kapatılır, done yazılmaz) → 45 sn sonra "ayrıldı"
await D.close();
for(let i=0;i<300;i++){const s=await Promise.all([A,B,C].map(p=>ev(p,()=>st.screen)));if(s.every(x=>x==='dover'))break;await sleep(1000)}
const res=await Promise.all([A,B,C].map(p=>ev(p,()=>JSON.stringify({s:st.screen,pts:DU.pts,gone:Object.keys(DU.gone),rk:DU.rank,won:DU.won,wk:DU.wk.length}))));
console.log('6 sonuç:',res.join('\n   '));
const pts=[A,B,C].map((p,i)=>JSON.parse(res[i]).pts);console.log('  puanlar aynı mı:',JSON.stringify(pts[0])===JSON.stringify(pts[1])&&JSON.stringify(pts[1])===JSON.stringify(pts[2]),' kazanan sayısı:',res.filter(x=>JSON.parse(x).won).length);
await A.screenshot({path:OUT+'/m_over.png',fullPage:true});
console.log('7 A sonuç ekranı:',(await txt(A)).slice(0,300));
// rövanş: A, B, C basar
for(const p of [A,B,C]){await ev(p,()=>duRematch());await sleep(300)}
await sleep(2500);
console.log('8 rövanş:',await Promise.all([A,B,C].map(p=>ev(p,()=>st.screen+' m='+DU.m+' n='+DU.ids.length))));
// C muharebeden çıkar (bayrak) → A ve B devam
await sleep(6000);await ev(C,()=>rmLeave());
for(let i=0;i<90;i++){const s=await Promise.all([A,B].map(p=>ev(p,()=>st.screen)));if(s.every(x=>x==='dover'))break;await sleep(1000)}
console.log('9 C çıktı, son:',await Promise.all([A,B].map(p=>ev(p,()=>st.screen+' '+JSON.stringify(DU.pts)+' gone='+Object.keys(DU.gone).length+' won='+DU.won))));
console.log('10 geçmiş A:',await ev(A,()=>JSON.stringify(ls('mc_dhist',[]).slice(0,2).map(x=>[x.mm,x.rk,x.n,x.o,x.w]))));
await ev(A,()=>{clearInterval(window.__ap);go('rhist')});await sleep(300);console.log('11 Kapışmalarım:',(await txt(A)).match(/Kapışmalarım.{0,220}/)[0]);
await ev(A,()=>rmLeave());await ev(B,()=>{clearInterval(window.__ap);rmLeave()});await sleep(500);
// 1'e 1: A-B iki maç, rakip pid kaydı
await ev(A,()=>{rcGo('duel');rcSet('win',10);rcOp('add')});await sleep(900);const c2=await ev(A,()=>RM.code);
await B.fill('#r-code',c2);await ev(B,()=>rmJoin());await sleep(800);
await bot(A,500,1500,0.9);await bot(B,700,2500,0.8);
for(let i=0;i<120;i++){const s=await Promise.all([A,B].map(p=>ev(p,()=>st.screen)));if(s.every(x=>x==='dover'))break;await sleep(1000)}
console.log('12 1e1 kayıt:',await ev(A,()=>JSON.stringify(ls('mc_dhist',[])[0])));
// arkadaş ol: A, B'yi sonuç ekranından ekler, B kabul eder
const bp=await ev(B,()=>FR.pid);await ev(A,p=>frAddId(p),bp);await sleep(1000);await ev(B,()=>frAccept(FR.inc[0]));await sleep(1500);
await ev(A,()=>{clearInterval(window.__ap);rmLeave()});await ev(B,()=>{clearInterval(window.__ap);rmLeave()});await sleep(500);
await ev(A,()=>frOpen());await sleep(1200);console.log('13 arkadaşlar:',(await txt(A)).slice(-200));
await ev(A,p=>frProf(p),bp);await sleep(400);await A.screenshot({path:OUT+'/m_fprof.png',fullPage:true});
console.log('14 profil:',(await txt(A)).slice(0,400));
// rekor tablosu: C, A'nın satırına dokunur
await ev(A,()=>lbSubmit('solo','add','k',55,55,st.profile));await ev(B,()=>lbSubmit('solo','add','k',33,33,st.profile));await sleep(500);
console.log('15 lb satırları:',JSON.stringify(Object.keys(S.store).filter(k=>k.startsWith('lbg_add/')).map(k=>S.store[k])));
await ev(C,()=>{LBC={};lbOpen('solo','add','k')});await sleep(1200);await C.screenshot({path:OUT+'/m_lb.png'});
await ev(C,()=>lbTap(0));await sleep(300);console.log('16 kart:',await ev(C,()=>document.querySelector('#ov .box').innerText.replace(/\n+/g,' | ')));
await C.screenshot({path:OUT+'/m_lbcard.png'});
await C.click('#lt4');await sleep(1200);
console.log('17 istek:',await ev(A,()=>JSON.stringify(FR.inc)),'=',await ev(C,()=>FR.pid));
console.log('log',S.log.filter(x=>!/nm taken/.test(x)));
await b.close()})();
