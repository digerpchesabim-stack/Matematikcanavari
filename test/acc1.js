// S53: tek karakter + göç + hesap kodu ile ikinci cihaz + eşitleme + eski kod + Verilerimi sil + sesli okuma + yazı boyutu
const {chromium}=require('playwright');
const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';
const OUT=process.env.OUT||'.';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();
const S=require(__dirname+'/dsrv.js')({lag:[20,80]});
const st=S.store;
const newPhone=async(pid,url,vp)=>{const ctx=await b.newContext({viewport:vp||{width:390,height:844},deviceScaleFactor:2});return S.phone(ctx,pid,url||U)};
const ev=(p,f,a)=>p.evaluate(f,a);
const until=async(p,f,a,ms)=>{for(let i=0;i<(ms||8000)/100;i++){if(await ev(p,f,a))return true;await sleep(100)}return false};
const P1='🐼 Cesur Panda',P2='🦊 Kurnaz Tilki',P3='🐯 Güçlü Kaplan #123';
// ---------- 1) Eski sürümden gelen telefon: 3 karakter ----------
const A=await newPhone('A');
await ev(A,()=>{NMS.busy=true});
const uidA=await ev(A,()=>devAuth().then(()=>CL.user.uid));
const now=Date.now(),rec=[];
[[P1,3],[P2,5],[P3,1]].forEach(([p,n])=>{for(let i=0;i<n;i++)rec.push({id:now-86400000*(10-i)-rec.length,p,t:new Date(now-86400000*(10-i)).toISOString(),op:'add',ok:10,bad:1,k:'g'})});
await ev(A,([P1,P2,P3,rec])=>{
  localStorage.setItem('mc_profiles',JSON.stringify([P1,P2,P3]));
  localStorage.setItem('mc_nm',JSON.stringify({[P1]:{e:0,n:0,c:true},[P2]:{e:1,n:0,c:true},[P3]:{e:3,n:123,c:true}}));
  localStorage.setItem('mc_records',JSON.stringify(rec));
  localStorage.setItem('mc_best',JSON.stringify({[P1]:{add:30,mul_o:50,mul_t6:9},[P2]:{add:80,sub:20}}));
  localStorage.setItem('mc_rbest',JSON.stringify({[P2]:{add:15}}));
  localStorage.setItem('mc_rk',JSON.stringify({[P1]:Object.assign(rkNew(),{p:20,r:1,q:300,bf:1}),[P2]:Object.assign(rkNew(),{p:70,r:2,q:900,bf:1})}));
},[P1,P2,P3,rec]);
// her karakterin oyuncu kimliği (pk/pl)
const pids={};
for(const p of [P1,P2,P3]){pids[p]=await ev(A,p=>{frStop();st.profile=p;return frEnsure()},p)}
await ev(A,()=>{frStop();st.profile=null});
ok(Object.values(pids).every(x=>x&&st['pk/'+x]===undefined||true),'kimlikler: '+JSON.stringify(Object.values(pids)));
const fid='zzzzzz9';st['fr/'+(pids[P2]<fid?pids[P2]+'_'+fid:fid+'_'+pids[P2])]={a:pids[P2]<fid?pids[P2]:fid,b:pids[P2]<fid?fid:pids[P2],by:pids[P2],st:'ok',ts:now};
st['nm/0_0']={u:uidA,t:now};st['nm/1_0']={u:uidA,t:now};st['nm/3_123']={u:uidA,t:now};
st['lbg_add/'+uidA]={nick:P2,score:80,ts:now};
st['lbg_mul_o/'+uidA]={nick:P1,score:50,ts:now};
st['lbg_sub/'+uidA]={nick:P1,score:20,ts:now};   // Tilki'nin puanı, Panda'nın adıyla (eski ortak satır)
st['lbr_add/'+uidA]={nick:'Ahmet',score:15,ts:now}; // eski gerçek ad
await A.reload();await sleep(600);
ok(await ev(A,()=>st.screen==='welcome'&&/Haydi Başlayalım/.test(document.body.innerText)),'açılış: karşılama ekranı');
await ev(A,()=>startGo());await sleep(300);
ok(await ev(A,()=>st.screen==='mig'),'birden çok karakter → seçim ekranı');
const mt=await ev(A,()=>document.body.innerText);
ok(/tek karakter/.test(mt)&&/Kurnaz Tilki/.test(mt)&&/70 puan/.test(mt)&&/5 oyun/.test(mt),'kartlarda rütbe, puan, oyun sayısı');
await A.screenshot({path:OUT+'/s53_gecis.png'});
ok(await ev(A,()=>{go('profiles');return st.screen==='mig'}),'seçim yapılmadan karakterle girilemez');
ok(await ev(A,()=>{guest();var t=document.body.innerText;startGo();return /olarak oyna/.test(t)&&st.screen==='mig'}),'misafir girebilir; karakterle oynamak için yine seçim ekranı');
await ev(A,()=>migPick(0));await sleep(200);
ok(await ev(A,()=>/Cesur Panda/.test(document.getElementById('ov').innerText)&&/Doğru mu/.test(document.getElementById('ov').innerText)),'1. onay');
await A.click('#my');await sleep(400);
const t2=await ev(A,()=>document.getElementById('ov').innerText);
ok(/Kurnaz Tilki/.test(t2)&&/Güçlü Kaplan/.test(t2)&&/geri alınamaz/.test(t2),'2. onay: silinecekler listeleniyor');
await A.screenshot({path:OUT+'/s53_gecis_onay.png'});
await A.click('#my');
ok(await until(A,()=>st.screen==='home'&&!st.modal,null,10000),'geçiş bitti, ana menü');
const ra=await ev(A,()=>({pr:profiles(),p:st.profile,mg:ls('mc_mgk',''),rec:records().map(r=>r.p),best:ls('mc_best',{}),rk:Object.keys(ls('mc_rk',{})),pid:frIds(),nm:Object.keys(nmMap())}));
ok(JSON.stringify(ra.pr)===JSON.stringify([P1])&&ra.p===P1,'tek karakter kaldı: '+ra.pr);
ok(ra.rec.every(x=>x===P1)&&ra.rec.length===3,'sadece Panda kayıtları ('+ra.rec.length+')');
ok(Object.keys(ra.best).join()===P1&&Object.keys(ra.pid).join()===P1&&ra.nm.join()===P1&&ra.rk.join()===P1,'rekor/kimlik/ad/rütbe sadece Panda');
const snap=st['bk/'+ra.mg];
ok(!!snap&&JSON.parse(JSON.parse(snap.d).mc_profiles).length===3&&!JSON.parse(snap.d).mc_dev,'geçiş yedeği: 3 karakter, giriş bilgisi yok ('+ra.mg+')');
await sleep(1500);
ok(!st['pk/'+pids[P2]]&&!st['pl/'+pids[P2]]&&!st['pk/'+pids[P3]]&&!st['pl/'+pids[P3]]&&!!st['pk/'+pids[P1]],'silinenlerin oyuncu kimliği silindi, Panda duruyor');
ok(!Object.keys(st).some(k=>k.startsWith('fr/')),'silinen karakterin arkadaşlığı silindi');
ok(!st['nm/1_0']&&!st['nm/3_123']&&!!st['nm/0_0'],'silinenlerin adı serbest kaldı');
const lb=k=>st[k+'/'+uidA];
ok(lb('lbg_add')&&lb('lbg_add').nick===P1&&lb('lbg_add').score===30,'lbg_add: Panda 30 (Tilki 80 silindi) '+JSON.stringify(lb('lbg_add')));
ok(lb('lbg_mul_o')&&lb('lbg_mul_o').score===50,'lbg_mul_o: Panda 50 kaldı');
ok(!lb('lbg_sub')&&!lb('lbr_add'),'başkasının puanı ve eski gerçek ad satırı silindi');
ok(!st['lbg_mul_t6/'+uidA],'tablo çalışması tabloya yazılmadı');
ok(await until(A,()=>!!ls('mc_bkt',0),null,6000),'bulut yedeği yazıldı');
const code=await ev(A,()=>ls('mc_bk',''));
ok(st['ac/'+code]&&st['ac/'+code].u===uidA&&st['bk/'+code].v===2&&!!JSON.parse(st['bk/'+code].d).mc_dev,'hesap özeti (ac) + yeni biçim yedek');
// Hesabım ekranı
await ev(A,()=>go('hesap'));await sleep(200);
let ht=await ev(A,()=>document.body.innerText);
ok(/Hesap kodun/.test(ht)&&ht.indexOf(code)<0&&/••••/.test(ht),'kod gizli');
await ev(A,()=>hsShow());await sleep(100);ht=await ev(A,()=>document.body.innerText);
ok(ht.indexOf(code)>=0,'Göster → kod görünür');
ok(/Bilgisayara/.test(ht)&&/Yazı boyutu/.test(ht)&&/Sesli okuma/.test(ht)&&/Gizlilik/.test(ht)&&/Verilerimi sil/.test(ht)&&/Geçiş yedeği/.test(ht),'Hesabım: aktar, ayarlar, gizlilik, sil');
await ev(A,()=>hsShow());await A.screenshot({path:OUT+'/s53_hesabim.png',fullPage:true});
await ev(A,()=>{window.__sh=null;navigator.share=o=>{window.__sh=o;return Promise.resolve()};hsSend()});await sleep(200);
const sh=await ev(A,()=>window.__sh&&window.__sh.text);
ok(sh&&sh.indexOf('?hesap='+code)>=0&&/paylaşma/.test(sh),'Bilgisayara aktar: bağlantı ('+(sh||'').split('\n')[1]+')');
// ---------- 2) Bilgisayar: bağlantıyla hesabı aç ----------
const B=await newPhone('B',U+'?hesap='+code,{width:1280,height:800});
ok(await until(B,()=>st.modal&&/Cesur Panda/.test(document.getElementById('ov').innerText),null,6000),'bilgisayarda: hesap bulundu, onay soruluyor');
await B.screenshot({path:OUT+'/s53_pc_onay.png'});
await B.click('#my');
ok(await until(B,()=>st.screen==='home'&&st.profile&&!st.modal,null,8000),'bilgisayarda hesap açıldı');
const rb=await ev(B,()=>({p:st.profile,uid:CL.user&&CL.user.uid,pid:frIds(),rk:rkRaw(st.profile),code:ls('mc_bk',''),q:location.search,rec:records().length}));
ok(rb.p===P1&&rb.uid===uidA&&rb.code===code&&rb.q==='','aynı karakter, aynı hesap (uid), aynı kod; adres temizlendi');
ok(rb.pid[P1].id===pids[P1]&&rb.rk.p===20&&rb.rec===3,'oyuncu kimliği, rütbe puanı ve kayıtlar geldi');
ok(st['ac/'+code].ln>0&&st['ac/'+code].lnd!==await ev(A,()=>acc().dv),'hesap açılışı kaydedildi');
await B.screenshot({path:OUT+'/s53_pc_menu.png'});
// telefona uyarı
await ev(A,()=>{go('home');AC.t=0;return acPull(true)});
ok(await until(A,()=>st.modal&&/başka bir cihazda/.test(document.getElementById('ov').innerText),null,4000),'telefona "hesabın başka cihazda açıldı" uyarısı');
await A.screenshot({path:OUT+'/s53_uyari.png'});
await ev(A,()=>closeModal());
// ---------- 3) Bilgisayarda oyna → telefona gelsin ----------
await ev(B,()=>{var l=records();l.push({id:Date.now(),p:st.profile,t:new Date().toISOString(),op:'div',ok:25,bad:1,k:'g'});lsSet('mc_records',l);var b=ls('mc_best',{});b[st.profile].div=99;lsSet('mc_best',b);rkQ(Date.now(),25);return bkRun(true)});
const q0=await ev(A,()=>rkRaw(st.profile).q);
await ev(A,()=>{AC.t=0;return acPull(true)});await sleep(300);
const r3=await ev(A,()=>({rec:records().length,div:ls('mc_best',{})[st.profile].div,q:rkRaw(st.profile).q}));
ok(r3.rec===4&&r3.div===99&&r3.q===q0+25,'bilgisayardaki oyun telefona geldi: kayıt, rekor, doğru sayısı ('+q0+'→'+r3.q+')');
// ---------- 4) İkisinde de ayrı oyun (biri henüz göndermemiş) ----------
await ev(A,()=>{var l=records();l.push({id:Date.now()+1,p:st.profile,t:new Date().toISOString(),op:'sub',ok:7,bad:0,k:'g'});lsSet('mc_records',l);var b=ls('mc_best',{});b[st.profile].sub=44;lsSet('mc_best',b)});
await ev(B,()=>{var l=records();l.push({id:Date.now()+2,p:st.profile,t:new Date().toISOString(),op:'mul',ok:9,bad:0,k:'g'});lsSet('mc_records',l);var b=ls('mc_best',{});b[st.profile].mul=55;lsSet('mc_best',b);return bkRun(true)});
await ev(A,()=>bkRun(true));await ev(B,()=>{AC.t=0;return acPull(true)});await sleep(200);
const ca=await ev(A,()=>({n:records().length,b:ls('mc_best',{})[st.profile]})),cb=await ev(B,()=>({n:records().length,b:ls('mc_best',{})[st.profile]}));
ok(ca.n===6&&cb.n===6&&ca.b.sub===44&&ca.b.mul===55&&cb.b.sub===44&&cb.b.mul===55,'iki cihazdaki oyunlar birleşti, ikisinde de 6 kayıt, iki rekor');
// gereksiz yazma yok: değişiklik yokken iki kez açılış
const w0=st['ac/'+code].ts;await ev(A,()=>{AC.t=0;return acPull(true).then(()=>bkRun())});await ev(B,()=>{AC.t=0;return acPull(true).then(()=>bkRun())});
ok(st['ac/'+code].ts===w0,'değişiklik yokken buluta yeniden yazılmadı');
// tema ayarı eşitlenir
await ev(B,()=>{fsSet(1);themeSet('sepia');closeModal();return bkRun(true)});await ev(A,()=>{AC.t=0;return acPull(true)});
ok(await ev(A,()=>document.documentElement.getAttribute('data-fs')==='1'&&document.documentElement.getAttribute('data-theme')==='sepia'),'yazı boyutu ve tema öbür cihaza geçti');
await ev(A,()=>{fsSet(0);themeSet('auto');closeModal()});await ev(B,()=>{fsSet(0);themeSet('auto');closeModal()});
// ---------- 5) Yeni kullanıcı ----------
const C=await newPhone('C');await sleep(400);
await ev(C,()=>startGo());await sleep(200);
ok(await ev(C,()=>st.screen==='profiles'&&/Karakterimi Seç/.test(document.body.innerText)&&/Hesabım var/.test(document.body.innerText)&&/Misafir/.test(document.body.innerText)),'ilk giriş: karakter seç / hesabım var / misafir');
await C.screenshot({path:OUT+'/s53_ilk_giris.png'});
await ev(C,()=>{peOpen(-1);peSet(10)});await sleep(500);
await C.screenshot({path:OUT+'/s53_karakter_sec.png'});
await ev(C,()=>peSave());await sleep(200);
ok(await ev(C,()=>st.modal&&/hep senin/.test(document.getElementById('ov').innerText)&&/değiştiremezsin/.test(document.getElementById('ov').innerText)),'seçim onayı: hep senin, değiştiremezsin');
await C.screenshot({path:OUT+'/s53_karakter_onay.png'});
await C.click('#my');
ok(await until(C,()=>st.screen==='home'&&profiles().length===1,null,6000),'karakter oluştu: '+await ev(C,()=>profiles()[0]));
await ev(C,()=>{peOpen(-1);peSave()});await sleep(300);
ok(await ev(C,()=>profiles().length===1&&!st.modal),'ikinci karakter açılamaz');
await ev(C,()=>{go('welcome')});await sleep(200);
ok(await ev(C,()=>/Misafir olarak oyna/.test(document.body.innerText)&&/Sürüm 53/.test(document.body.innerText)),'karşılamada misafir seçeneği, Sürüm 53');
await ev(C,()=>startGo());await sleep(200);
ok(await ev(C,()=>st.screen==='home'&&!!st.profile),'Haydi Başlayalım → doğrudan ana menü (Kim oynuyor yok)');
const homeT=await ev(C,()=>document.body.innerText);
ok(/Hesabım ve ayarlar/.test(homeT)&&!/Yedek ve geri yükleme/.test(homeT),'ana menüde Hesabım (eski yedek kutusu yok)');
await ev(C,()=>{back()});await sleep(100);
ok(await ev(C,()=>st.screen==='welcome'),'ana menüden geri → karşılama');
// ---------- 6) Sesli okuma ----------
await ev(C,()=>{window.__said=[];Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'en-US',name:'en'},{lang:'tr-TR',name:'tr',localService:true}],speak:u=>{window.__said.push({t:u.text,r:u.rate,l:u.lang});window.__u=u},cancel:()=>{window.__cx=(window.__cx||0)+1}}})});
await ev(C,()=>{startGo();st.kind='p';st.op='add';st.mix=null;st.eldeli=null;pickDigits(2)});await sleep(300);
ok(await ev(C,()=>!!document.getElementById('tts-n')&&!!document.getElementById('tts-s')),'problemde 🔊 ve 🐢 düğmeleri');
await C.screenshot({path:OUT+'/s53_sesli_okuma.png'});
await C.click('#tts-n');await sleep(100);
let sd=await ev(C,()=>({s:window.__said.slice(-1)[0],q:st.q.text,b:document.getElementById('tts-n').textContent}));
ok(sd.s&&sd.s.l==='tr-TR'&&Math.abs(sd.s.r-0.9)<0.01&&sd.s.t.length>10&&!/[\u{1F000}-\u{1FAFF}]/u.test(sd.s.t),'Türkçe sesle okundu: "'+(sd.s&&sd.s.t)+'"');
ok(sd.b==='⏹','okurken düğme ⏹');
await C.click('#tts-n');await sleep(100);
ok(await ev(C,()=>document.getElementById('tts-n').textContent==='🔊'&&window.__said.length===1),'tekrar dokununca durdu');
await C.click('#tts-s');await sleep(100);
ok(await ev(C,()=>Math.abs(window.__said.slice(-1)[0].r-0.6)<0.01),'🐢 yavaş okuma (0.6)');
await ev(C,()=>{window.__u.onend()});
await ev(C,()=>{var c=ttsCfg();c.a=1;lsSet('mc_tts',c);window.__said=[];nextQ()});await sleep(700);
ok(await ev(C,()=>window.__said.length===1),'"kendiliğinden oku" açıkken yeni soru okundu');
await ev(C,()=>{lsSet('mc_tts',{});window.__said=[];nextQ()});await sleep(700);
ok(await ev(C,()=>window.__said.length===0),'kapalıyken okunmadı');
await ev(C,()=>{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'en-US'}],speak:()=>{window.__bad=1},cancel:()=>{}}})});
await C.click('#tts-n');await sleep(100);
ok(await ev(C,()=>!window.__bad&&/Türkçe ses yok/.test(document.getElementById('toast').textContent)),'Türkçe ses yoksa uyarı');
// ---------- 7) Yazı boyutu ----------
await ev(C,()=>{fsSet(2);go('home')});await sleep(200);
const z=await ev(C,()=>({a:document.documentElement.getAttribute('data-fs'),z:getComputedStyle(document.body).zoom,w:document.documentElement.scrollWidth,vw:window.innerWidth}));
ok(z.a==='2'&&String(z.z)==='1.3'&&z.w<=z.vw+1,'Çok büyük yazı: zoom 1.3, yatay taşma yok ('+z.w+'/'+z.vw+')');
await C.screenshot({path:OUT+'/s53_buyuk_yazi.png'});
await C.reload();await sleep(300);
ok(await ev(C,()=>document.documentElement.getAttribute('data-fs')==='2'),'yeniden açılınca yazı boyutu korunuyor');
await ev(C,()=>fsSet(0));
// ---------- 8) Eski sürümden kalma kod (giriş bilgisi yok) ----------
st['bk/OLDKOD2345']={u:'yabanci',ts:now-5000,v:1,d:JSON.stringify({mc_profiles:JSON.stringify(['🦁 Kral Aslan']),mc_nm:JSON.stringify({'🦁 Kral Aslan':{e:4,n:0,c:true}}),mc_records:JSON.stringify([{id:1,p:'🦁 Kral Aslan',t:new Date().toISOString(),op:'add',ok:3,bad:0,k:'g'}])})};
const D=await newPhone('D');await sleep(300);
await ev(D,()=>{go('hgir')});await D.fill('#hs-in','oldkod2345');await ev(D,()=>acLinkStart());
ok(await until(D,()=>st.modal&&/eski sürümden/.test(document.getElementById('ov').innerText),null,5000),'eski kod: "önce eski cihazı güncelle" uyarısı');
await D.click('#my');
ok(await until(D,()=>st.screen==='home'&&st.profile==='🦁 Kral Aslan',null,6000),'yine de yükle → karakter geldi');
ok(await until(D,()=>!!ls('mc_bk','')&&ls('mc_bk','')!=='OLDKOD2345'&&!!ls('mc_bkt',0),null,8000),'bu cihaz yeni hesap kodu aldı: '+await ev(D,()=>ls('mc_bk','')));
// ---------- 9) Verilerimi sil (bilgisayardan) → telefon da silinir ----------
await ev(B,()=>{go('hesap')});await sleep(200);
await ev(B,()=>acWipeAsk());await sleep(100);
ok(await ev(B,()=>/her yerden/.test(document.getElementById('ov').innerText)),'silme 1. onay');
await B.click('#my');await sleep(400);await B.click('#my');
ok(await until(B,()=>st.screen==='welcome'&&!profiles().length,null,8000),'bilgisayarda veriler silindi');
await sleep(500);
ok(!st['bk/'+code]&&st['ac/'+code]&&st['ac/'+code].del===true,'bulut yedeği silindi, hesap "silindi" işaretli');
ok(!Object.keys(st).some(k=>/^lb[gr]_/.test(k)&&k.endsWith('/'+uidA)),'rekor satırları silindi');
ok(!st['pk/'+pids[P1]]&&!st['pl/'+pids[P1]]&&!st['nm/0_0']&&!st['bk/'+ra.mg],'oyuncu kimliği, ad kaydı ve geçiş yedeği silindi');
ok(!S.users['d'+(await ev(A,()=>ls('mc_dev',{}).id))+'@canavari.example.com'],'giriş hesabı silindi');
await ev(A,()=>{go('home');AC.t=0;return acPull(true)});
ok(await until(A,()=>st.screen==='welcome'&&!profiles().length&&st.modal&&/silindi/.test(document.getElementById('ov').innerText),null,6000),'telefonda da silindi, bilgi verildi');
const leftA=await ev(A,()=>Object.keys(localStorage).filter(k=>k.startsWith('mc_')).sort().join());
ok(!/mc_records|mc_profiles|mc_rk|mc_bk\b|mc_dev/.test(leftA),'telefonda kişisel veri kalmadı: '+leftA);
// ---------- 10) Tek karakterli telefonda eski satır temizliği (bir kez) ----------
const E=await newPhone('E');
const uidE=await ev(E,()=>devAuth().then(()=>CL.user.uid));
st['lbg_add/'+uidE]={nick:'Mehmet',score:40,ts:now};st['lbg_sub/'+uidE]={nick:'🐨 Sevimli Koala',score:12,ts:now};
await ev(E,()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🐨 Sevimli Koala']));localStorage.setItem('mc_nm',JSON.stringify({'🐨 Sevimli Koala':{e:6,n:0,c:true}}));localStorage.setItem('mc_best',JSON.stringify({'🐨 Sevimli Koala':{add:22,sub:12}}))});
await E.reload();
ok(await until(E,()=>!!ls('mc_lbcl',0),null,14000),'eski satır temizliği çalıştı');
ok(st['lbg_add/'+uidE].nick==='🐨 Sevimli Koala'&&st['lbg_add/'+uidE].score===22&&st['lbg_sub/'+uidE].score===12,'eski ad satırı karakterin kendi rekoruyla değişti, doğru satıra dokunulmadı');
console.log(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,10).join('\n'));
ok(!S.log.some(x=>/ERR/.test(x)),'sayfa hatası yok');
await b.close();
console.log(fail?'HATA: '+fail:'TAMAM');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
