// S56: takım kur/katıl/ayrıl, ad benzersiz, kaptanlık maçı, eşleşmeli takım kapışması (bot tamamlar), canavar takımı, rütbe, takım w/l
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
await fr('A','B');await fr('C','D');await fr('C','E');await sleep(1200);
for(const p of Object.values(P))await ev(p,()=>{if(st.modal)closeModal();RK.q=[];go('home')});
const txt=p=>ev(p,()=>document.getElementById('ov').hidden?'':document.getElementById('ov').innerText.replace(/\n+/g,' | '));
const waitF=async(p,f,a,ms=8000)=>{for(let i=0;i<ms/100;i++){if(await ev(p,f,a))return true;await sleep(100)}return false};
const clean=async()=>{for(const p of Object.values(P))await ev(p,()=>{if(st.modal)closeModal();RK.q=[]})};

// 1) takım kur
await ev(A,()=>tmOpen());await sleep(600);
ok(/Henüz bir takımın yok/.test(await ev(A,()=>document.getElementById('app').innerText)),'takımsız ekran');
await ev(A,()=>tmNewOpen());await sleep(200);await ev(A,()=>tmPick(0));await sleep(800);
ok(/boş/.test(await ev(A,()=>document.getElementById('tm-st').innerText)),'ad boş görünüyor');
await A.screenshot({path:__dirname+'/s56_ad.png'});
await ev(A,()=>tmCreate());await sleep(1200);
ok(S.store['tm/0']&&S.store['tm/0'].m[0]===pid.A&&S.store['tm/0'].cap===pid.A,'🦅 Kartallar kuruldu, kuran kaptan');
ok(await ev(A,()=>tmKey()===0&&st.screen==='tml'),'takım ekranı');
await ev(C,()=>{tmNewOpen();tmPick(0)});await sleep(800);
ok(/başka bir takımın/.test(await ev(C,()=>document.getElementById('tm-st').innerText)),'aynı ad ikinci kez alınamaz');
await ev(C,()=>tmPick(1));await sleep(800);await ev(C,()=>tmCreate());await sleep(1200);
ok(S.store['tm/1']&&S.store['tm/1'].cap===pid.C,'⚡ Şimşekler kuruldu');
// 2) takıma çağır / katıl
await ev(A,b=>tmInv(b),pid.B);await sleep(400);
ok(pushes.some(x=>x.p==='A'&&x.k==='tv'),'takıma davet bildirimi');
ok(await waitF(B,()=>st.modal&&/takımına çağırıyor/.test(document.getElementById('ov').innerText)),'B\'ye takım daveti');
await ev(B,()=>document.getElementById('m3-0').click());await sleep(1500);
ok(JSON.stringify(S.store['tm/0'].m)===JSON.stringify([pid.A,pid.B]),'B takıma katıldı');
for(const k of ['D','E']){await ev(C,x=>tmInv(x),pid[k]);await waitF(P[k],()=>st.modal&&!!document.getElementById('m3-0'));await ev(P[k],()=>document.getElementById('m3-0').click());await sleep(1200)}
ok(S.store['tm/1'].m.length===3,'Şimşekler 3 kişi');
const bad=await ev(B,([a,k])=>devAuth().then(fb=>fb.updateDoc(fb.doc(CL.db,'tm','0'),{m:[FR.pid],by:FR.pid,cap:FR.pid,ts:Date.now()})).then(()=>'yazıldı',()=>'red'),[pid.A]);
ok(bad==='red','kimse başkasını takımdan çıkaramaz');
await ev(A,()=>{go('tml');tmLoadPl()});await sleep(800);await A.screenshot({path:__dirname+'/s56_takim.png'});
console.log('  takım ekranı:',(await ev(A,()=>document.getElementById('tm-body').innerText)).replace(/\n+/g,' | ').slice(0,260));

// 3) kaptanlık maçı (A ile B, 1'e 1); B kazanır
await clean();
const p0=await ev(B,()=>rkRaw(st.profile).p);
await ev(A,()=>tmCapGo());await waitF(A,()=>st.screen==='lobby');
ok(S.store['ti/0']&&S.store['ti/0'].cm===1,'kaptanlık maçı çağrısı');
ok(await waitF(B,()=>st.modal&&/Kaptanlık Maçı/.test(document.getElementById('ov').innerText)),'B\'ye kaptanlık maçı daveti');
await ev(B,()=>document.getElementById('m3-0').click());
const auto=(p,d)=>ev(p,d=>{clearInterval(window.__au);window.__lk=-1;window.__au=setInterval(()=>{if(DU&&DU.ph==='q'&&DU.k!==window.__lk){window.__lk=DU.k;var k=DU.k;setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];duAns(q.opts.findIndex(o=>o.v===q.ans),null)}},d)}},80)},d);
await auto(A,1500);await auto(B,300);
ok(await waitF(A,()=>st.screen==='dover',null,90000),'kaptanlık maçı bitti');
await sleep(2000);
ok(S.store['tm/0'].cap===pid.B&&S.store['tm/0'].ct>0,'kazanan B kaptan oldu');
ok((await ev(B,()=>rkRaw(st.profile).p))===p0,'kaptanlık maçı rütbe puanı vermedi');
for(const p of [A,B])await ev(p,()=>{clearInterval(window.__au);rmLeave();go('home')});
await sleep(800);await clean();

// 4) takım kapışması: Kartallar (2) ⚔️ Şimşekler (3) → Kartallar'a 1 canavar
const rk0={};for(const k of ['A','B','C','D','E'])rk0[k]=await ev(P[k],()=>rkRaw(st.profile).p);
await ev(A,()=>twOpen());await waitF(A,()=>TM.list&&TM.list.length>0);
ok(await ev(A,()=>/Şimşekler/.test(document.getElementById('app').innerText)),'rakip takım listesi');
await ev(A,()=>{twPick(1);twSet('nq',10)});await sleep(200);await A.screenshot({path:__dirname+'/s56_ayar.png'});
await ev(A,()=>twCreate('add'));await waitF(A,()=>st.screen==='lobby');await sleep(800);
ok(S.store['ti/0']&&S.store['ti/1']&&S.store['ti/1'].a===0,'iki takıma da çağrı');
ok(pushes.some(x=>x.p==='A'&&x.k==='ti'&&x.to==='1'),'rakip takıma bildirim');
for(const k of ['B','C','D','E']){ok(await waitF(P[k],()=>st.modal&&/(meydan okuyor|takım kapışması kurdu)/.test(document.getElementById('ov').innerText)),k+' çağrıyı gördü');await ev(P[k],()=>document.getElementById('m3-0').click());await sleep(700)}
await waitF(A,()=>RM.players.length===5);await sleep(800);
const lv=await ev(A,()=>document.getElementById('app').innerText);console.log('  lobi:',lv.replace(/\n+/g,' | ').slice(0,300));
ok(/Takım Canavarı/.test(lv)&&/Hazır/.test(lv),'lobide eksik yer canavarla dolu, hazır');
await A.screenshot({path:__dirname+'/s56_lobi.png'});
await ev(A,()=>rmStart());
ok(await waitF(E,()=>st.screen==='dintro'||st.screen==='duel',null,15000),'kapışma başladı');
await waitF(A,()=>!!(RM.room&&RM.room.pa));const pa=await ev(A,()=>RM.room.pa);console.log('  eşleşme:',pa);
ok(pa.split(',').length===3&&(pa.match(/~/g)||[]).length===1,'3 çift, 1 canavar');
await sleep(4000);await E.screenshot({path:__dirname+'/s56_duel.png'});
for(const [k,d] of [['A',1800],['B',1800],['C',400],['D',400],['E',400]])await auto(P[k],d);
let done=false;for(let i=0;i<120&&!done;i++){await sleep(1000);done=true;for(const p of Object.values(P))if(!(await ev(p,()=>!!(DU&&DU.twf))))done=false}
ok(done,'bütün çiftler bitti, sonuç her telefonda');
const res={};for(const k in P)res[k]=await ev(P[k],()=>JSON.stringify(DU.twf.S)+'|'+DU.tww);
console.log('  sonuç:',JSON.stringify(res));
ok(new Set(Object.values(res).map(x=>x.split('|')[0])).size===1,'takım skoru her telefonda aynı');
ok(res.C.endsWith('|1')&&res.A.endsWith('|-1'),'Şimşekler kazandı');
await sleep(1500);await C.screenshot({path:__dirname+'/s56_sonuc.png'});
console.log('  C sonuç:',(await ev(C,()=>document.getElementById('app').innerText)).replace(/\n+/g,' | ').slice(0,300));
const rk1={};for(const k of ['A','B','C','D','E'])rk1[k]=await ev(P[k],()=>rkRaw(st.profile).p);
console.log('  rütbe puanı önce',JSON.stringify(rk0),'sonra',JSON.stringify(rk1));
ok(rk1.A===rk0.A&&rk1.B===rk0.B,'kaybeden takımdan puan gitmedi/gelmedi');
let gains=['C','D','E'].map(k=>rk1[k]-rk0[k]);
ok(gains.every(g=>g>=1)&&gains.some(g=>g>=2),'kazananlara takım bonusu (+1), gerçek rakibini yenenlere ayrıca +1: '+gains.join(','));
await sleep(1500);
ok(S.store['tm/1'].w===1&&S.store['tm/0'].l===1,'takım kartlarına galibiyet/yenilgi bir kez yazıldı');
ok(await ev(C,()=>ls('mc_dhist',[])[0].tw===1),'kapışma geçmişine yazıldı');
for(const p of Object.values(P))await ev(p,()=>{clearInterval(window.__au);rmLeave();go('home')});
await sleep(800);await clean();

// 5) canavar takımına karşı (C, D) — puan yok
const c0=await ev(C,()=>rkRaw(st.profile).p);
await ev(C,()=>{twBotOpen();twSet('nq',10)});await sleep(200);await ev(C,()=>twCreate('sub'));await waitF(C,()=>st.screen==='lobby');
for(const k of ['D']){await waitF(P[k],()=>st.modal&&!!document.getElementById('m3-0'));await ev(P[k],()=>document.getElementById('m3-0').click());await sleep(700)}
await waitF(C,()=>RM.players.length===2);await sleep(600);
await ev(E,()=>{if(st.modal)closeModal()});
await ev(C,()=>rmStart());
ok(await waitF(C,()=>st.screen==='dintro'||st.screen==='duel',null,15000),'canavar takımına karşı başladı');
ok((await ev(C,()=>RM.room.pa)).split(',').every(x=>x.endsWith(':~')),'bütün rakipler canavar');
for(const [k,d] of [['C',500],['D',500]])await auto(P[k],d);
let d2=false;for(let i=0;i<90&&!d2;i++){await sleep(1000);d2=(await ev(C,()=>!!(DU&&DU.twf)))&&(await ev(D,()=>!!(DU&&DU.twf)))}
ok(d2,'canavar maçı bitti');
ok((await ev(C,()=>rkRaw(st.profile).p))===c0,'canavar takımı maçı puan vermedi');
for(const p of [C,D])await ev(p,()=>{clearInterval(window.__au);rmLeave();go('home')});
await sleep(600);

// 6) ayrılma: kaptan B ayrılır → A kaptan
await ev(B,()=>{tmOpen()});await sleep(800);await ev(B,()=>tmLeave());await sleep(200);await ev(B,()=>document.getElementById('my').click());await sleep(1500);
ok(JSON.stringify(S.store['tm/0'].m)===JSON.stringify([pid.A])&&S.store['tm/0'].cap===pid.A,'B ayrıldı, kaptanlık A\'ya geçti');
ok(await ev(B,()=>tmKey()===null),'B\'nin takımı yok');
await ev(A,()=>{go('tml');tmLeave()});await sleep(200);await ev(A,()=>document.getElementById('my').click());await sleep(1500);
ok(!S.store['tm/0'],'son kişi ayrılınca takım silindi');

console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,12)));
ok(!S.log.some(x=>/ERR/.test(x)),'sayfa hatası yok');
await b.close();console.log(fail?'HATA '+fail:'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
