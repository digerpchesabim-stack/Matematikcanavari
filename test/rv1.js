// S54: davet cevabı (Kabul / Meşgulüm / Daha sonra) + ⏰ Zamanlı Oyun (1'e 1 ve muharebe) + iptal + muharebe doluluğu
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[40,200]});
const pushes=[];
const mk=async(pid,name)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});
  await ctx.route(/push\.json/,r=>r.fulfill({status:200,contentType:'application/json',body:'{"u":"https://w.test","k":"K"}'}));
  await ctx.route(/w\.test/,r=>{try{const j=JSON.parse(r.request().postData()||'{}');pushes.push({p:pid,k:j.k,to:j.to,r:j.r})}catch(e){}r.fulfill({status:200,body:'{"ok":true}'})});
  const p=await S.phone(ctx,pid,U);
  await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));NMS.busy=true;st.profile=n;go('home');return frEnsure()},name);await sleep(1500);
  await p.evaluate(()=>{if(st.modal)closeModal();RK.q=[];PUSH.cfg={u:'https://w.test',k:'K'}});return p};
const A=await mk('A','🦊 Kurnaz Tilki'),B=await mk('B','🐼 Cesur Panda'),C=await mk('C','🦁 Aslan'),D=await mk('D','🐯 Kaplan'),E=await mk('E','🐨 Koala');
const ev=(p,f,a)=>p.evaluate(f,a);
const pid={};for(const [k,p] of Object.entries({A,B,C,D,E}))pid[k]=await ev(p,()=>FR.pid);
for(const k of ['B','C','D','E']){await ev(A,c=>frAddId(c),pid[k]);await sleep(500);await ev({A,B,C,D,E}[k],c=>frAccept(c),pid.A);await sleep(400)}
await sleep(1500);
for(const p of [A,B,C,D,E])await ev(p,()=>{if(st.modal)closeModal();RK.q=[];go('home')});
ok((await ev(A,()=>FR.list.length))===4,'A\'nın 4 arkadaşı var');
const txt=p=>ev(p,()=>document.getElementById('ov').hidden?'':document.getElementById('ov').innerText.replace(/\n+/g,' | '));
const waitF=async(p,f,a,ms=8000)=>{for(let i=0;i<ms/100;i++){if(await ev(p,f,a))return true;await sleep(100)}return false};

// 1) Meşgulüm
await ev(A,c=>{frCall(c)},pid.B);await sleep(200);await ev(A,()=>frCallGo('add'));
await waitF(B,()=>st.modal&&!!document.getElementById('m3-2'));
const t1=await txt(B);console.log('  B davet:',t1);
ok(/Kabul et/.test(t1)&&/Meşgulüm/.test(t1)&&/Daha sonra oynayalım/.test(t1),'alıcıda 3 seçenek');
ok(await waitF(A,()=>/gördü/.test((document.getElementById('iv-st')||{}).innerText||'')),'gönderen "gördü" görüyor');
await ev(B,()=>document.getElementById('m3-1').click());
ok(await waitF(A,()=>st.modal&&/şu an meşgul/.test(document.getElementById('ov').innerText)),'gönderene "şu an meşgul" penceresi');
await sleep(300);ok(pushes.some(x=>x.p==='B'&&x.k==='rs'&&x.to===pid.A),'meşgul bildirimi gönderildi');
await ev(A,()=>document.getElementById('my').click());await sleep(400);
ok((await ev(A,()=>st.screen+'|'+RM.code))==='home|null','Tamam → oda kapandı, ana menü');

// 2) 2 dk cevapsız
await ev(A,c=>{frCall(c)},pid.C);await sleep(200);await ev(A,()=>frCallGo('sub'));
await waitF(A,()=>RM.ivs&&Object.keys(RM.ivs).length>0);
await ev(C,()=>{if(st.modal)closeModal()});
await ev(A,()=>{var o=RM.ivs[RM.inv.to];o.t-=130000;rmRefresh()});
const t2=await ev(A,()=>document.getElementById('iv-st').innerText);
ok(/cevap gelmedi/.test(t2)&&/Bekle/.test(t2)&&/Vazgeç/.test(t2),'2 dk cevapsız: Bekle / Vazgeç');
await ev(A,()=>rmLeave());await sleep(300);await ev(A,()=>go('home'));
await sleep(800);ok(!S.store['iv/'+pid.C],'gönderen çıkınca cevapsız davet geri çekildi');

// 3) Daha sonra → zamanlı oyun (B kurar, A kabul eder)
for(const p of [A,B])await ev(p,()=>{if(st.modal)closeModal();go('home')});
await ev(A,c=>{frCall(c)},pid.B);await sleep(200);await ev(A,()=>{RC.lv='o';RC.win=15;frCallGo('mul')});
await waitF(B,()=>st.modal&&!!document.getElementById('m3-2'));
await ev(B,()=>document.getElementById('m3-2').click());await sleep(300);
const rn=await ev(B,()=>JSON.stringify({s:st.screen,to:RVN.to,op:RVN.op,lv:RVN.lv,win:RVN.win,md:RVN.md}));
console.log('  B kurma:',rn);
ok(/"s":"rvn"/.test(rn)&&rn.includes(pid.A)&&/"op":"mul"/.test(rn)&&/"lv":"o"/.test(rn)&&/"win":15/.test(rn),'Daha sonra → kurma ekranı, rakip ve ayarlar hazır');
const sc=await ev(B,()=>document.getElementById('app').innerText);
ok(/15 dk sonra/.test(sc)&&/30 dk sonra/.test(sc)&&/45 dk sonra/.test(sc)&&/60 dk sonra/.test(sc),'15/30/45/60 dk seçenekleri');
await B.screenshot({path:__dirname+'/rv_kur.png'});
await ev(B,()=>{rvSet('dt',30);rvAt=function(){return Date.now()+25000};rvSend()});
ok(await waitF(A,()=>st.modal&&/şimdi oynayamıyor/.test(document.getElementById('ov').innerText)),'gönderene "Daha sonra … Olur mu?" sorusu');
console.log('  A soru:',await txt(A));
await waitF(B,()=>Object.keys(RV.out).length>0);const room=await ev(B,()=>Object.values(RV.out)[0].room);
ok(!!S.store['rooms/'+room]&&typeof S.store['rooms/'+room].at==='number','oda önceden kuruldu (at)');
ok(S.store['iv/'+pid.B].rs==='later'&&S.store['iv/'+pid.B].rr===room,'davette cevap: later + oda');
ok(pushes.some(x=>x.p==='B'&&x.k==='rv'&&x.to===pid.A&&x.r===room),'randevu isteği bildirimi');
await ev(A,()=>document.getElementById('m3-0').click());
ok(await waitF(A,()=>st.screen==='rvl'),'A Olur → Zamanlı Oyun ekranı');
await sleep(800);
ok(S.store['rv/'+room+'_'+pid.A].st==='ok','randevu kabul edildi');
ok(pushes.some(x=>x.p==='A'&&x.k==='rva'&&x.r===room),'kabul bildirimi (hatırlatma kaydı)');
await A.screenshot({path:__dirname+'/rv_liste.png'});
await ev(A,()=>go('home'));await ev(B,()=>go('home'));await sleep(500);
const hb=await ev(B,()=>{var e=document.getElementById('rv-box');return e&&e.style.display!=='none'?e.innerText:''});
console.log('  B ana menü:',hb.replace(/\n+/g,' | '));
ok(/Zamanlı oyunların/.test(hb)&&/Gir/.test(hb),'ana menüde yaklaşan oyun + Gir');
await B.screenshot({path:__dirname+'/rv_home.png'});
// iki taraf da girer; saat gelmeden başlamaz
await ev(B,r=>rvEnter(r),room);await sleep(1200);await ev(A,r=>rvEnter(r),room);
await waitF(A,()=>st.screen==='lobby');await sleep(1500);
const lb=await ev(A,()=>st.screen+' | '+document.getElementById('rv-lcd').innerText);
console.log('  lobi:',lb,'node',Date.now(),'page',await ev(A,()=>Date.now()+' at '+RM.room.at));const T0=Date.now();ok(/^lobby/.test(lb)&&/kaldı/.test(lb),'lobide geri sayım, erken başlamadı');
await A.screenshot({path:__dirname+'/rv_lobi.png'});
const okS=await waitF(A,()=>st.screen==='dintro'||st.screen==='duel',null,30000);
if(!okS)console.log('  geçen',Date.now()-T0,'node',Date.now(),'  DBG B',await ev(B,()=>JSON.stringify({s:st.screen,host:RM.host,ast:RM.ast,due:rvDue(),at:RM.room&&RM.room.at,now:Date.now(),st:RM.room&&RM.room.status,pl:RM.players.map(p=>p.uid),pv:duPvOld().length})),'A',await ev(A,()=>JSON.stringify({s:st.screen,host:RM.host,code:RM.code,st:RM.room&&RM.room.status})));
ok(okS,'saat gelince kapışma kendiliğinden başladı');
ok(await waitF(B,()=>st.screen==='dintro'||st.screen==='duel',null,5000),'iki telefonda da');
await sleep(1500);
ok(S.store['rv/'+room+'_'+pid.A].st==='d','randevu "başladı" işaretlendi');
for(const p of [A,B])await ev(p,()=>{if(DU){DU.quit=true}rmReset();go('home')});
await sleep(500);

// 4) iptal
await ev(A,c=>{rvNew();rvTo(c);rvSend()},pid.C);await sleep(1500);
const r2=await ev(A,c=>{for(var k in RV.out)if(RV.out[k].to===c&&RV.out[k].st==='req')return RV.out[k].room;return ''},pid.C);
ok(!!r2,'1’e 1 zamanlı oyun isteği gönderildi');
ok(await waitF(C,()=>st.modal&&/Olur, gelirim/.test(document.getElementById('ov').innerText)),'alıcıya randevu isteği penceresi');
console.log('  C istek:',await txt(C));
await ev(C,()=>document.getElementById('m3-2').click());
await ev(A,r=>rvCancel(r),r2);await sleep(200);await ev(A,()=>document.getElementById('my').click());await sleep(1200);
ok(S.store['rv/'+r2+'_'+pid.C].st==='x'&&!S.store['rooms/'+r2],'iptal: randevu x, oda silindi');
ok(pushes.some(x=>x.k==='rvc'&&x.to===pid.C),'iptal bildirimi');
ok((await ev(C,r=>rvGroups().some(x=>x.room===r),r2))===false,'davetlinin listesinden kalktı');

// 5) muharebe: 3'ten az seçilemez; 4 davetli, 3 kabul, 4. "doldu"
await ev(A,([b,c])=>{rvNew();rvSet('md','mm');rvTo(b);rvTo(c);rvSend()},[pid.B,pid.C]);await sleep(300);
ok((await ev(A,()=>document.getElementById('toast').textContent)).includes('en az 3'),'muharebede 3’ten az kişi reddedildi');
await ev(A,([d,e])=>{rvTo(d);rvTo(e);rvAt=function(){return Date.now()+20000};rvSend()},[pid.D,pid.E]);await sleep(1500);
const r3=await ev(A,()=>{for(var k in RV.out)if(RV.out[k].md==='mm'&&RV.out[k].st==='req')return RV.out[k].room;return ''});
ok(!!r3&&[pid.B,pid.C,pid.D,pid.E].every(x=>S.store['rv/'+r3+'_'+x]),'4 kişiye muharebe randevusu');
for(const p of [B,C,D,E])await ev(p,()=>{if(st.modal)closeModal()});
for(const [p,k] of [[B,'B'],[C,'C'],[D,'D']]){await ev(p,id=>rvAns(id,'ok'),r3+'_'+pid[k]);await sleep(700)}
await ev(E,id=>rvAns(id,'ok'),r3+'_'+pid.E);await sleep(800);
ok(['B','C','D'].every(k=>S.store['rv/'+r3+'_'+pid[k]].st==='ok')&&S.store['rv/'+r3+'_'+pid.E].st==='no','3 kabul, 4. kişi "doldu" (en çok 4 kişi)');
await ev(A,r=>rvEnter(r),r3);await sleep(600);for(const p of [B,C,D]){await ev(p,r=>rvEnter(r),r3);await sleep(400)}
await waitF(A,()=>st.screen==='lobby'&&RM.players.length===4);
const mb=await ev(A,()=>{var b=document.getElementById('mm-go');return b?b.disabled+' '+b.textContent:''});
console.log('  muharebe düğmesi:',mb);ok(/^true/.test(mb)&&/olunca başlar/.test(mb),'saat gelmeden başlatılamaz');
await A.screenshot({path:__dirname+'/rv_mm.png'});
ok(await waitF(A,()=>st.screen==='dintro'||st.screen==='duel',null,30000),'saat gelince 4 kişiyle muharebe kendiliğinden başladı');
ok(await waitF(D,()=>(st.screen==='dintro'||st.screen==='duel')&&DU&&DU.ids.length===4,null,6000),'muharebe 4 kişi');
for(const p of [A,B,C,D])await ev(p,()=>{if(DU)DU.quit=true;rmReset();go('home')});

// 6) eski davet: kabul doğrudan girer
await ev(A,c=>{frCall(c)},pid.D);await sleep(200);await ev(A,()=>frCallGo('add'));
await waitF(D,()=>st.modal&&!!document.getElementById('m3-0'));
await ev(D,()=>document.getElementById('m3-0').click());
ok(await waitF(A,()=>st.screen==='dintro'||st.screen==='duel',null,10000),'Kabul et → kapışma başladı');
await sleep(500);ok(S.store['iv/'+pid.D].rs==='ok','davette cevap: ok');

const bad=S.log.filter(x=>/DENY|ERR/.test(x));console.log('  log:',JSON.stringify(bad.slice(0,10)));
ok(!S.log.some(x=>/ERR/.test(x)),'sayfa hatası yok');
await b.close();console.log(fail?'HATA '+fail:'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
