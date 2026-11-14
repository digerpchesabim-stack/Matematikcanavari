// S62: Online Oyna — açık oda listesi, şifre, çıkarma, botlar (kapışma, muharebe, yarış), takım odası, rütbe yakınlığı, misafir.
// Kullanım: node test/s62.js [görüntü klasörü]
const {chromium}=require('playwright');const path=require('path');const fs=require('fs');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[30,140]});
const mk=async(pid,name,rank)=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:out?2:1});
  await ctx.route(/w\.test/,r=>r.fulfill({status:200,body:'{"ok":true}'}));
  const p=await S.phone(ctx,pid,U);
  if(name)await p.evaluate(([n,rk])=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));NMS.busy=true;st.profile=n;if(rk){var R=rkGet(n);R.r=rk;R.p=RKP[rk];rkPut(n,R)}go('home');return frEnsure()},[name,rank||0]);
  await sleep(1300);
  await p.evaluate(()=>{if(st.modal)closeModal();RK.q=[];PUSH.cfg={u:'https://w.test',k:'K'}});return p};
const A=await mk('A','🦊 Kurnaz Tilki'),B=await mk('B','🐼 Cesur Panda'),C=await mk('C','🌲 Çam'),D=await mk('D','🐯 Kaplan'),E=await mk('E','🦅 Kartal',6),G=await mk('G',null);
const P={A,B,C,D,E,G};const ev=(p,f,a)=>p.evaluate(f,a);
const waitF=async(p,f,a,ms=9000)=>{for(let i=0;i<ms/100;i++){if(await ev(p,f,a))return true;await sleep(100)}return false};
const shot=async(p,n)=>{if(out)await p.screenshot({path:path.join(out,n+'.png')})};
const home=async()=>{for(const p of Object.values(P))await ev(p,()=>{if(st.modal)closeModal();if(RM.code)rmLeave();RK.q=[];go('home')});await sleep(700)};
const code=p=>ev(p,()=>RM.code);
const autoDu=(p,d,wrong)=>ev(p,([d,wrong])=>{clearInterval(window.__au);window.__lk=-1;window.__au=setInterval(()=>{if(DU&&DU.ph==='q'&&DU.k!==window.__lk){window.__lk=DU.k;var k=DU.k;setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];duAns(q.opts.findIndex(o=>wrong?o.v!==q.ans:o.v===q.ans),null)}},d)}},60)},[d,!!wrong]);
const autoRace=(p,d)=>ev(p,d=>{clearInterval(window.__ar);window.__ar=setInterval(()=>{var g=st.g;if(st.screen==='game'&&g&&g.race&&!g.lock&&!g.done){var i=g.q.opts.findIndex(o=>o.v===g.q.ans);var bs=document.querySelectorAll('#agrid .ani');if(bs[i])bs[i].click()}},d)},d);
const stop=p=>ev(p,()=>{clearInterval(window.__au);clearInterval(window.__ar)});

// 1) Oda Kur: 1'e 1, herkese açık, şifresiz → listede görünür
await ev(A,()=>{onOpen()});await sleep(600);
ok(await ev(A,()=>st.screen==='online'&&/Şu an açık oda yok/.test(document.getElementById('on-list').textContent)),'liste boşken "ilk odayı sen aç" yazıyor');
await shot(A,'liste_bos');
await ev(A,()=>{onNew()});await sleep(200);
ok(await ev(A,()=>st.screen==='ocreate'&&document.querySelectorAll('.oct').length===3&&document.querySelectorAll('.ocop').length===5&&/Herkes Tek/.test(document.getElementById('app').textContent)&&!/Muharebe/.test(document.querySelector('.ocg').textContent)),'Oda Kur: 3 oyun türü (1’e 1, Takım, Herkes Tek), 5 işlem karosu');
await ev(A,()=>{ocSet('md','race')});ok(await ev(A,()=>OC.cap===4&&/3 kişi/.test(document.getElementById('app').textContent)&&/10 kişi/.test(document.getElementById('app').textContent)),'Herkes Tek: 3–10 kişi seçenekleri');
await ev(A,()=>{ocSet('md','ta')});ok(await ev(A,()=>/5’e 5/.test(document.getElementById('app').textContent)),'Takım: 5’e 5’e kadar');
await ev(A,()=>{ocSet('md','ta');ocSet('tm',3)});ok(await ev(A,()=>OC.cap===6),'Takım 3’e 3 = 6 kişilik oda');
await ev(A,()=>{ocSet('op','mul')});ok(await ev(A,()=>/Tablo çalış/.test(document.getElementById('app').textContent)),'çarpmada tablo seçeneği');
await shot(A,'oda_kur');
await ev(A,()=>{ocSet('md','duel');ocSet('op','add');ocSet('lv','k');onCreate()});
ok(await waitF(A,()=>st.screen==='lobby'&&!!RM.room&&RM.room.cap===2),'A 1’e 1 odası kurdu');
const c1=await code(A);
ok(S.store['rooms/'+c1].pub===1&&S.store['rooms/'+c1].qv===7&&S.store['rooms/'+c1].n===1,'oda belgesi: pub, qv 7, n 1');
await ev(B,()=>onOpen());
ok(await waitF(B,()=>ON.rows&&ON.rows.length===1),'B listede 1 oda görüyor');
ok(await ev(B,()=>{var r=document.querySelector('.orow');return /1’e 1 Kapışma/.test(r.textContent)&&/1\/2/.test(r.textContent)&&!!r.querySelector('.optile.op-add')&&/Kolay/.test(document.querySelector('.osec').textContent)}),'satır: işlem karosu, tür, 1/2, Kolay başlığı');
await shot(B,'liste');
// rütbesi çok uzak olan görmez; misafir giremez
await ev(E,()=>onOpen());await waitF(E,()=>!!ON.rows&&!ON.busy);
ok(await ev(E,()=>ON.rows.length===0),'Efsane rütbeli oyuncu Çaylak odasını görmüyor');
await ev(G,()=>onOpen());await sleep(300);
ok(await ev(G,()=>/karakterini seç/.test(document.getElementById('app').textContent)&&!document.querySelector('.oquick')),'misafir: liste yok, karakter seç + Kodla Gir');
await ev(G,c=>rmJoinCode(c,null),c1);await sleep(900);
ok(await ev(G,()=>st.screen!=='lobby'),'misafir herkese açık odaya kodla da giremez');
// B girer → kapışma kendiliğinden başlar
await ev(B,()=>document.querySelector('.orow').click());await sleep(200);
ok(await ev(B,()=>st.modal&&/Kurnaz Tilki/.test(document.getElementById('ov').textContent)),'önizleme: kurucu adı');
await ev(B,()=>document.getElementById('my').click());
ok(await waitF(A,()=>st.screen==='dintro'||st.screen==='duel',null,12000)&&await waitF(B,()=>st.screen==='dintro'||st.screen==='duel',null,12000),'iki kişi olunca kapışma başladı');
await home();

// 2) şifreli oda + çıkarma
await ev(A,()=>{OC.md='mm';OC.cap=4;OC.lv='k';OC.op='add';OC.tb=0;OC.win=10;OC.pub=1;OC.pwon=true;OC.pw='4821';onCreate()});
ok(await waitF(A,()=>st.screen==='lobby'&&RM.pwv==='4821'),'A şifreli muharebe odası kurdu (şifre lobide yazıyor)');
const c2=await code(A);
ok(S.store['rooms/'+c2].pw===1&&S.store['rooms/'+c2+'/sec/pw'].p==='4821'&&!('p' in S.store['rooms/'+c2]),'şifre ayrı belgede, oda belgesinde yok');
ok(await ev(B,c=>RM.fb.getDoc(RM.fb.doc(CL.db,'rooms',c,'sec','pw')).then(()=>false,()=>true),c2),'şifre belgesi okunamıyor');
await ev(B,()=>{ON.t=0;go('online');return onLoad(true)});await sleep(300);
ok(await ev(B,()=>!!document.querySelector('.orow .olock')),'listede 🔒 görünüyor');
await ev(B,c=>onJoin(c),c2);
ok(await waitF(B,()=>st.modal&&!!document.getElementById('on-pw')),'şifre penceresi açıldı');
await shot(B,'sifre');
await ev(B,()=>{document.getElementById('on-pw').value='1111';document.getElementById('my').click()});await sleep(700);
ok(await ev(B,()=>st.screen!=='lobby')&&!S.store['rooms/'+c2+'/tk/'+await ev(B,()=>CL.user.uid)],'yanlış şifre: giremedi');
await ev(B,c=>onJoin(c),c2);await waitF(B,()=>st.modal&&!!document.getElementById('on-pw'));
await ev(B,()=>{document.getElementById('on-pw').value='4821';document.getElementById('my').click()});
ok(await waitF(B,()=>st.screen==='lobby'),'doğru şifre: girdi');
ok(await waitF(A,()=>onReal().length===2&&document.querySelectorAll('#lb-list .okick').length===1),'kurucuda "Çıkar" düğmesi');
await sleep(3500);ok(S.store['rooms/'+c2].n===2,'oda belgesinde oyuncu sayısı güncellendi (2)');
const ub=await ev(B,()=>CL.user.uid);
await ev(A,u=>{onKick(u)},ub);await sleep(200);await ev(A,()=>document.getElementById('my').click());
ok(await waitF(B,()=>st.screen!=='lobby'),'B odadan çıkarıldı');
await ev(B,c=>rmJoinCode(c,null),c2);await sleep(1200);
ok(await ev(B,()=>st.screen!=='lobby'),'çıkarılan geri giremiyor');
// 3 yanlış → 1 dk bekleme
for(let i=0;i<3;i++){await ev(C,c=>onJoin(c),c2);await waitF(C,()=>st.modal&&!!document.getElementById('on-pw'));await ev(C,()=>{document.getElementById('on-pw').value='0000';document.getElementById('my').click()});await sleep(600)}
ok(await ev(C,c=>ON.lock[c]>Date.now(),c2),'3 yanlış denemeden sonra 1 dakika kilit');

// 3) muharebe: 1 gerçek + botlar
await ev(A,()=>onBots(99));await sleep(300);
ok(await ev(A,()=>onNb()===3&&/Başlat \(4 kişi\)/.test(document.getElementById('on-go').textContent)),'kalan yerler botla doldu (3 bot)');
await shot(A,'lobi_bot');
await ev(A,()=>onBots(-1));await sleep(200);
await autoDu(A,700);
await ev(A,()=>onStart());
ok(await waitF(A,()=>st.screen==='duel'&&DU&&DU.ids.length===3,null,15000),'muharebe 2 botla başladı (3 oyuncu)');
ok(await ev(A,()=>DU.ids.filter(onIsBot).length===2&&/🤖/.test(DU.nick['~0'])),'botların adı 🤖 ile başlıyor');
ok(await waitF(A,()=>DU&&DU.k>=2,null,20000),'turlar ilerliyor (botlar cevap veriyor)');
await shot(A,'muharebe_bot');
ok(await waitF(A,()=>st.screen==='dover',null,90000),'muharebe bitti');
ok(await ev(A,()=>DU.rkRes==='bots'),'sadece botlara karşı: rütbe puanı yok');
ok(await ev(A,()=>!!document.querySelector('.rmon')),'sonuçta canavar');
await stop(A);await home();

// 4) 1'e 1: Botla Oyna
await ev(A,()=>{OC.md='duel';OC.cap=2;OC.pwon=false;OC.pw='';OC.pub=1;onCreate()});await waitF(A,()=>st.screen==='lobby'&&RM.host);
ok(await ev(A,()=>/Botla Oyna/.test(document.getElementById('on-ctl').textContent)),'1’e 1 lobisinde "Botla Oyna"');
await autoDu(A,600);await ev(A,()=>onBotGo());
ok(await waitF(A,()=>st.screen==='duel'&&DU&&DU.ids.length===2&&onIsBot(DU.oid),null,15000),'botla kapışma başladı');
ok(await waitF(A,()=>st.screen==='dover',null,90000),'botla kapışma bitti');
await stop(A);await home();

// 5) yarış (hız): 2 gerçek + 2 bot; herkes aynı soruyu aynı anda görür, can yok, 3/2/1 puan
await ev(A,()=>{OC.md='race';OC.cap=4;OC.lv='k';OC.op='add';OC.win=10;onCreate()});await waitF(A,()=>st.screen==='lobby'&&RM.host);
const c5=await code(A);ok(S.store['rooms/'+c5].mode==='sr'&&S.store['rooms/'+c5].win===10,'yarış odası hız modunda (sr, 10 soru)');
await ev(B,c=>onJoin(c),c5);ok(await waitF(B,()=>st.screen==='lobby'),'B yarış odasına girdi');
await waitF(A,()=>onReal().length===2);await ev(A,()=>onBots(99));await sleep(300);
ok(await ev(A,()=>onNb()===2),'yarışta 2 boş yer botla doldu');
await autoDu(A,500);await autoDu(B,1400);
await ev(A,()=>onStart());
ok(await waitF(A,()=>st.screen==='duel'&&DU&&DU.sm==='rank',null,20000)&&await waitF(B,()=>st.screen==='duel'&&DU&&DU.sm==='rank',null,20000),'yarış hız motorunda başladı (iki telefon)');
ok(await ev(A,()=>DU.ids.length===4&&DU.ids.filter(onIsBot).length===2),'yarışta 4 oyuncu (2 bot)');
ok(await ev(B,()=>!document.getElementById('g-hp')&&!/❤️/.test(document.getElementById('app').textContent)),'can yok');
await shot(A,'yaris_oyun');
ok(await waitF(A,()=>DU&&DU.k>=2,null,40000),'sorular ilerliyor');
const rp=await ev(A,()=>{var o=DU.rp[0]||{};return Object.values(o).sort().join(',')});
ok(/3/.test(rp)&&/2/.test(rp),'ilk soruda hız sıralı puan verildi: '+rp);
ok(await ev(B,()=>DU.rp[0]&&DU.rp[0][DU.me]===2),'B (daha yavaş doğru) 2. olarak 2 puan aldı');
ok(await waitF(A,()=>st.screen==='dover',null,120000)&&await waitF(B,()=>st.screen==='dover',null,30000),'10 soru bitince yarış sonucu');
ok(await ev(A,()=>DU.k===9&&DU.won===true&&/Oyun bitti/.test(document.querySelector('.top').textContent)),'A en hızlı: kazandı');
ok(await ev(B,()=>DU.won===false&&/oldun/.test(document.getElementById('app').textContent)),'B sıralamasını görüyor');
await shot(A,'yaris_sonuc');
await stop(A);await stop(B);await home();

// 6) takım odası 2'ye 2: 3 gerçek + 1 bot, aynı soru aynı anda, ilk bilen takıma 1 puan
await ev(A,()=>{OC.md='ta';OC.tm=2;OC.cap=4;OC.lv='k';OC.op='add';OC.win=10;onCreate()});await waitF(A,()=>st.screen==='lobby'&&RM.host);
const c6=await code(A);
ok(await waitF(A,()=>st.modal&&document.querySelectorAll('.tpick').length===2),'kurucuya takım seçimi soruldu');
await shot(A,'takim_sec');
await ev(A,()=>document.getElementById('tp-0').click());
for(const k of ['B','C']){await ev(P[k],c=>onJoin(c),c6);await waitF(P[k],()=>st.screen==='lobby');ok(await waitF(P[k],()=>st.modal&&!!document.getElementById('tp-1')),k+' girince takım seçimi soruldu')}
await ev(B,()=>document.getElementById('tp-1').click());await sleep(1500);
ok(await ev(C,()=>{onTeamAsk();return true})&&await waitF(C,()=>{var r=document.getElementById('tp-1');return !!r&&!!document.getElementById('tp-0')}),'C seçim penceresi açık');
await ev(C,()=>document.getElementById('tp-1').click());
ok(await waitF(A,()=>onReal().length===3),'takım odasında 3 kişi');
await sleep(1500);
const sides=await ev(A,()=>onReal().map(p=>p.tk|0).sort().join(''));
ok(sides==='011','herkes kendi seçtiği takımda (Kırmızı 1, Mavi 2): '+sides);
await ev(A,()=>{if(st.modal)closeModal();onTeamAsk()});await sleep(200);
ok(await ev(A,()=>document.getElementById('tp-1').disabled&&/dolu/.test(document.getElementById('tp-1').textContent)),'dolu takım seçilemiyor');
await ev(A,()=>closeModal());
await shot(A,'takim_lobi');
ok(await ev(A,()=>/Kırmızı/.test(document.getElementById('lb-list').textContent)&&/Mavi/.test(document.getElementById('lb-list').textContent)),'lobide Kırmızı / Mavi sütunları');
await autoDu(A,400);await autoDu(B,1500);await autoDu(C,2600);
await ev(A,()=>onStart());
ok(await waitF(A,()=>st.screen==='duel'&&DU&&DU.sm==='team',null,20000)&&await waitF(C,()=>st.screen==='duel'&&DU&&DU.sm==='team',null,20000),'takım oyunu hız motorunda başladı');
const pa=S.store['rooms/'+c6].pa.split(',').map(x=>+x.split(':')[1]).sort().join('');
ok(pa==='001'||pa==='011','eşleşme yazıldı');
ok(await ev(A,()=>{var a=DU.ids.filter(u=>duSide(u)===0).length,b=DU.ids.filter(u=>duSide(u)===1).length;return a===2&&b===2&&DU.ids.filter(onIsBot).length===1}),'takımlar 2’ye 2, eksik yer botla doldu');
ok(await ev(A,()=>!!document.querySelector('.dside.tsd')&&/\/10/.test(document.getElementById('dsc').textContent)),'skor: iki takım + soru sayacı');
await shot(A,'takim_oyun');
ok(await waitF(A,()=>DU&&DU.k>=1,null,30000),'sorular ilerliyor');
ok(await ev(A,()=>{var w=DU.wk[0];return !!w&&DU.ts[duSide(w)]>=1}),'ilk soruda ilk bilenin takımı puan aldı');
const same=await ev(A,()=>JSON.stringify([DU.ts,DU.wk.slice(0,3)])),same2=await ev(C,()=>JSON.stringify([DU.ts,DU.wk.slice(0,3)]));
ok(await waitF(A,()=>st.screen==='dover',null,120000)&&await waitF(C,()=>st.screen==='dover',null,30000),'10 soru bitince takım sonucu');
const ta=await ev(A,()=>DU.ts.join('-')),tc=await ev(C,()=>DU.ts.join('-'));
ok(ta===tc,'iki telefonda takım skoru aynı: '+ta+' / '+tc);
ok(await ev(A,()=>/Takım maçı bitti/.test(document.querySelector('.top').textContent)&&document.querySelectorAll('.tares').length===2),'takım sonuç ekranı: '+(await ev(A,()=>document.querySelector('.pbox').innerText)).replace(/\n+/g,' | '));
await shot(A,'takim_sonuc');
for(const k of ['A','B','C'])await stop(P[k]);await home();

// 7) Hemen Oyna: oda varsa girer, yoksa açar; engellenenin odası görünmez
await ev(D,()=>onOpen());await sleep(400);await ev(D,()=>onQuick());
ok(await waitF(D,()=>st.screen==='lobby'&&RM.host&&RM.room.pub===1&&RM.room.cap===2,null,12000),'Hemen Oyna: oda yokken kendi odasını açtı');
await ev(B,()=>{ON.t=0;go('online');return onQuick()});
ok(await waitF(B,()=>st.screen==='dintro'||st.screen==='duel',null,15000),'Hemen Oyna: açık odaya girdi, kapışma başladı');
await home();
const pd=await ev(D,()=>FR.pid);
await ev(D,()=>{OC.md='duel';OC.cap=2;OC.pwon=false;OC.pub=1;onCreate()});await waitF(D,()=>st.screen==='lobby');
await ev(C,p=>{blkAdd(p,'🐯 Kaplan');ON.t=0;go('online');return onLoad(true)},pd);await sleep(400);
ok(await ev(C,()=>ON.rows.length===0),'engellenen oyuncunun odası listede yok');
// sadece kodla oda listede görünmez ama kodla girilir (misafir de girer)
await home();
await ev(A,()=>{OC.md='race';OC.cap=6;OC.pub=0;OC.pwon=false;onCreate()});await waitF(A,()=>st.screen==='lobby');
const c7=await code(A);
await ev(B,()=>{ON.t=0;go('online');return onLoad(true)});await sleep(300);
ok(await ev(B,()=>ON.rows.length===0),'"sadece kodla" oda listede görünmüyor');
await ev(G,c=>rmJoinCode(c,null),c7);
ok(await waitF(G,()=>st.screen==='lobby'),'misafir kodla özel odaya girebiliyor');
await home();
const errs=S.log.filter(x=>/ ERR /.test(x));ok(errs.length===0,'sayfa hatası yok '+JSON.stringify(errs.slice(0,4)));
await b.close();console.log(fail?'BAŞARISIZ '+fail:'HEPSİ GEÇTİ');process.exit(fail?1:0)})();
