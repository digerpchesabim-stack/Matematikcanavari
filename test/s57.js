// S57: cevap vermeyen (arka plandaki) oyuncu muharebeyi kilitlemez + Kaptanlık Maçı sadece takım üyeleri
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[40,200]});
const mk=async(pid,name)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});
  await ctx.route(/w\.test/,r=>r.fulfill({status:200,body:'{"ok":true}'}));
  const p=await S.phone(ctx,pid,U);
  await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));NMS.busy=true;st.profile=n;go('home');return frEnsure()},name);await sleep(1500);
  await p.evaluate(()=>{if(st.modal)closeModal();RK.q=[];PUSH.cfg={u:'https://w.test',k:'K'}});return p};
const A=await mk('A','🦊 Kurnaz Tilki'),B=await mk('B','🐼 Cesur Panda'),C=await mk('C','🌲 Çam'),D=await mk('D','🐯 Kaplan');
const P={A,B,C,D};const ev=(p,f,a)=>p.evaluate(f,a);
const pid={};for(const k in P)pid[k]=await ev(P[k],()=>FR.pid);
const fr=async(x,y)=>{await ev(P[x],c=>frAddId(c),pid[y]);await sleep(500);await ev(P[y],c=>frAccept(c),pid[x]);await sleep(400)};
await fr('A','B');await fr('A','C');await fr('A','D');await sleep(1200);
for(const p of Object.values(P))await ev(p,()=>{if(st.modal)closeModal();RK.q=[];go('home')});
const waitF=async(p,f,a,ms=8000)=>{for(let i=0;i<ms/100;i++){if(await ev(p,f,a))return true;await sleep(100)}return false};
const auto=(p,d)=>ev(p,d=>{clearInterval(window.__au);window.__lk=-1;window.__au=setInterval(()=>{if(DU&&DU.ph==='q'&&DU.k!==window.__lk){window.__lk=DU.k;var k=DU.k;setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];duAns(q.opts.findIndex(o=>o.v===q.ans),null)}},d)}},80)},d);

// 1) takım + kaptanlık maçı lobisi
await ev(A,()=>{tmNewOpen();tmPick(5)});await sleep(800);await ev(A,()=>tmCreate());await sleep(1200);
for(const k of ['B','C']){await ev(A,x=>tmInv(x),pid[k]);await waitF(P[k],()=>st.modal&&!!document.getElementById('m3-0'));await ev(P[k],()=>document.getElementById('m3-0').click());await sleep(1200)}
ok(S.store['tm/5'].m.length===3,'takım 3 kişi');
await ev(A,()=>{go('tml');tmLoadPl()});await sleep(600);
await ev(A,()=>tmCapGo());await waitF(A,()=>st.screen==='lobby');await sleep(800);
const lt=await ev(A,()=>document.getElementById('app').innerText);
console.log('  kaptanlık lobisi:',lt.replace(/\n+/g,' | ').slice(0,320));
ok(/takım üyeleri/.test(lt)&&/Takımı yeniden çağır/.test(lt),'lobide sadece takım üyeleri');
ok(!/herkesi çağır/i.test(lt)&&!/Davet linki/.test(lt)&&!/Arkadaşlarını çağır/.test(lt),'herkesi çağır, arkadaş listesi ve davet linki yok');
ok(/Çık/.test(lt),'çık düğmesi var');
await A.screenshot({path:__dirname+'/s57_kaptan.png'});
const code=await ev(A,()=>RM.code);
await ev(D,c=>rmJoinCode(c,null),code);await sleep(800);
ok(/sadece takım üyeleri/.test(await ev(D,()=>document.getElementById('toast').textContent))&&(await ev(D,()=>st.screen))!=='lobby','takım dışı oyuncu giremedi');
for(const k of ['B','C']){await waitF(P[k],()=>st.modal&&/Kaptanlık Maçı/.test(document.getElementById('ov').innerText));await ev(P[k],()=>document.getElementById('m3-0').click());await sleep(800)}
await waitF(A,()=>RM.players.length===3);
ok(/✓ odada/.test(await ev(A,()=>document.getElementById('mm-inv').innerText)),'gelenler "odada" görünüyor');
// 2) C arka planda kalır: cevap yazmaz ama sinyal gönderir
await ev(A,()=>rmStart());
ok(await waitF(C,()=>st.screen==='dintro'||st.screen==='duel',null,15000),'muharebe başladı');
await auto(A,500);await auto(B,900);
await sleep(9000);
await ev(C,()=>{window.duTick=function(){};window.duAns=function(){};if(DU&&DU.tm){clearInterval(DU.tm);DU.tm=null}});
const k0=await ev(A,()=>DU.k);console.log('  C durduğunda tur:',k0);
ok(await waitF(A,k=>DU&&DU.k>=k+2,k0,60000),'C cevap vermese de turlar ilerliyor');
ok(await waitF(A,()=>DU&&DU.gone[Object.keys(DU.nick).find(u=>/Çam/.test(DU.nick[u]))],null,60000),'2 tur cevapsız C oyundan düştü');
ok(await waitF(A,()=>st.screen==='dover',null,120000),'muharebe bitti, kilitlenmedi');
ok(await waitF(B,()=>st.screen==='dover',null,20000),'B de bitirdi');
console.log('  A sonuç:',(await ev(A,()=>document.getElementById('app').innerText)).replace(/\n+/g,' | ').slice(0,160));
console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,10)));
ok(!S.log.some(x=>/ERR/.test(x)),'sayfa hatası yok');
await b.close();console.log(fail?'HATA '+fail:'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
