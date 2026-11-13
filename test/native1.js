// S60: Android paketi (Capacitor) davranışı. Capacitor eklentileri taklit edilir; sayfa yerel http sunucusundan açılır (fcm.json okunabilsin).
// Kullanım: node test/native1.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const http=require('http');
const WEBURL='https://digerpchesabim-stack.github.io/Matematikcanavari/';const out=process.argv[2];const R=path.resolve(__dirname,'..');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
const srv=http.createServer((q,s)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';
  if(u==='/fcm.json'){if(srv.fcm){s.writeHead(200,{'content-type':'application/json'});s.end('{"on":1}')}else{s.writeHead(404);s.end()}return}
  const f=path.join(R,u);if(!f.startsWith(R)||!fs.existsSync(f)){s.writeHead(404);s.end();return}
  const t={'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.mp3':'audio/mpeg'}[path.extname(f)]||'application/octet-stream';
  s.writeHead(200,{'content-type':t});fs.createReadStream(f).pipe(s)});
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});
await new Promise(r=>srv.listen(0,r));const U='http://127.0.0.1:'+srv.address().port+'/';
const b=await chromium.launch();
const CAP=()=>{const L=window.__cap={calls:[],ls:{}};const rec=(n,m)=>function(a){L.calls.push([n,m,a===undefined?null:JSON.parse(JSON.stringify(a))]);return Promise.resolve(m==='getAppUpdateInfo'?(window.__upd||{updateAvailability:1}):m==='performImmediateUpdate'?{code:window.__updCode||0}:m==='writeFile'?{uri:'file:///data/cache/'+a.path}:m==='requestPermissions'||m==='checkPermissions'?{receive:window.__perm||'granted'}:undefined)};
  const pl=(n,ms)=>{const o={addListener:function(e,f){(L.ls[n+'.'+e]=L.ls[n+'.'+e]||[]).push(f);return Promise.resolve({remove(){}})}};ms.forEach(m=>o[m]=rec(n,m));return o};
  window.__emit=(k,x)=>(L.ls[k]||[]).forEach(f=>f(x));
  window.Capacitor={isNativePlatform:()=>true,getPlatform:()=>'android',Plugins:{
    Haptics:pl('Haptics',['vibrate','impact']),Share:pl('Share',['share']),Filesystem:pl('Filesystem',['writeFile']),App:pl('App',['exitApp']),
    TextToSpeech:pl('TextToSpeech',['speak','stop']),AppUpdate:pl('AppUpdate',['getAppUpdateInfo','performImmediateUpdate','openAppStore']),KeepAwake:pl('KeepAwake',['keepAwake','allowSleep']),PushNotifications:pl('PushNotifications',['register','requestPermissions','checkPermissions','createChannel'])}};
  try{localStorage.setItem('mc_mmus','false');Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}};
const open=async()=>{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();p.errs=[];
  p.on('pageerror',e=>p.errs.push(String(e.message||e)));
  await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await p.addInitScript(CAP);await p.goto(U);await sleep(1200);return p};
const calls=(p,n,m)=>p.evaluate(([n,m])=>window.__cap.calls.filter(c=>c[0]===n&&(!m||c[1]===m)),[n,m]);
srv.fcm=true;let p=await open();
ok(await p.evaluate(()=>NATIVE&&document.documentElement.classList.contains('native')),'Android olarak açıldı');
ok(await p.evaluate(()=>!document.querySelector('.vupd')&&/Sürüm \d+/.test(document.body.textContent)),'giriş: sürüm yazıyor, "Güncelle" düğmesi yok');
ok(await p.evaluate(()=>navigator.serviceWorker.getRegistrations().then(r=>r.length===0)),'servis çalışanı kurulmadı');
ok(await p.evaluate(()=>appUrl()===WEBURL&&rmLink().indexOf(WEBURL+'?oda=')===0),'bağlantılar web adresini kullanır');
// titreşim
await p.evaluate(()=>buzz([30,40,60]));await sleep(250);
let v=await calls(p,'Haptics','vibrate');ok(v.length===2&&v[0][2].duration===30&&v[1][2].duration===60,'titreşim deseni Haptics ile: '+JSON.stringify(v.map(x=>x[2])));
// canavara dokununca titreşim (karşılama)
await p.evaluate(()=>{var cv=document.getElementById('mon'),r=cv.getBoundingClientRect();chTap({clientX:r.left+CH.m.x*r.width/CH.W,clientY:r.top+CH.m.y*r.height/CH.H})});await sleep(400);
ok((await calls(p,'Haptics','vibrate')).length>2,'canavara dokununca telefon titredi');
// sesli okuma
await p.evaluate(()=>ttsSay('Ali 😀 3 elma aldı',0));await sleep(100);
let t=await calls(p,'TextToSpeech','speak');ok(t.length===1&&t[0][2].lang==='tr-TR'&&t[0][2].rate===0.9&&t[0][2].text==='Ali 3 elma aldı','sesli okuma TextToSpeech ile (tr-TR, 0.9)');
await p.evaluate(()=>ttsSay('x',1));await sleep(100);t=await calls(p,'TextToSpeech','speak');ok(t[1]&&t[1][2].rate===0.6&&(await calls(p,'TextToSpeech','stop')).length>=1,'🐢 yavaş okuma 0.6, önceki durduruldu');
ok(await p.evaluate(()=>ttsOk()),'ayarlarda sesli okuma destekleniyor görünür');
// paylaşım
await p.evaluate(()=>appShare());await sleep(100);let s=await calls(p,'Share','share');ok(s.length===1&&s[0][2].text.indexOf(WEBURL)>=0,'Uygulamayı Paylaş: Android paylaşım penceresi');
await p.evaluate(()=>{var c=document.createElement('canvas');c.width=c.height=20;shareCanvas(c,'rapor kartı.png')});await sleep(400);
let w=await calls(p,'Filesystem','writeFile');s=await calls(p,'Share','share');
ok(w.length===1&&w[0][2].directory==='CACHE'&&w[0][2].path==='rapor_kart_.png'&&w[0][2].data.length>20&&s[1]&&s[1][2].files[0]==='file:///data/cache/rapor_kart_.png','görsel paylaşımı: önbelleğe yazılıp paylaşılır');
// karakter + arkadaşlar + bildirim
await p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦊 Kurnaz Tilki']));NMS.busy=true;st.profile='🦊 Kurnaz Tilki';go('home');if(st.modal)closeModal()});await sleep(500);
await p.evaluate(()=>frEnsure());await sleep(1200);
ok(await p.evaluate(()=>PUSH.fcm===true&&pushState()==='off'),'FCM paketi: bildirim kapalı başlar');
ok((await calls(p,'PushNotifications','createChannel')).some(c=>c[2].id==='mc'),'bildirim kanalı oluşturuldu');
await p.evaluate(()=>go('friends'));await sleep(600);ok(await p.evaluate(()=>/Bildirimleri aç/.test(document.getElementById('app').textContent)),'Arkadaşlarım: "Bildirimleri aç"');
await p.evaluate(()=>pushOn());await sleep(200);ok((await calls(p,'PushNotifications','register')).length===1,'izin → kayıt');
await p.evaluate(()=>__emit('PushNotifications.registration',{value:'fcm-token-'+'a'.repeat(60)}));await sleep(700);
let ps=await p.evaluate(()=>window.__DB['ps/'+FR.pid]);ok(ps&&ps.f==='fcm-token-'+'a'.repeat(60)&&typeof ps.ts==='number'&&!ps.e,'FCM jetonu ps belgesine yazıldı');
ok(await p.evaluate(()=>pushState()==='on'&&/Bildirimler açık/.test(document.getElementById('app').textContent)),'bildirimler açık görünüyor');
await p.evaluate(()=>{window.__DB['ps/'+FR.pid].ts=1});await p.evaluate(()=>__emit('PushNotifications.registration',{value:'fcm-token-'+'a'.repeat(60)}));await sleep(500);
ok(await p.evaluate(()=>window.__DB['ps/'+FR.pid].ts===1),'aynı jeton yeniden yazılmaz');
// bildirime dokununca
await p.evaluate(()=>go('home'));await sleep(300);
await p.evaluate(()=>__emit('PushNotifications.pushNotificationActionPerformed',{notification:{data:{u:WEBURL+'?fr=1&to='+FR.pid}}}));await sleep(600);
ok(await p.evaluate(()=>st.screen==='friends'),'arkadaşlık bildirimi → Arkadaşlarım');
await p.evaluate(()=>go('home'));await sleep(300);
await p.evaluate(()=>__emit('PushNotifications.pushNotificationActionPerformed',{notification:{data:{u:WEBURL+'?tm=1&to='+FR.pid}}}));await sleep(600);
ok(await p.evaluate(()=>st.screen==='tml'),'takım bildirimi → Takımım');
// geri tuşu
await p.evaluate(()=>go('home'));await sleep(200);await p.evaluate(()=>go('gmenu'));await sleep(300);
await p.evaluate(()=>__emit('App.backButton',{canGoBack:false}));await sleep(300);ok(await p.evaluate(()=>st.screen==='home'),'geri tuşu: oyun menüsü → ana menü');
await p.evaluate(()=>tabGo(3));await sleep(400);await p.evaluate(()=>legalOpen('gizlilik'));await sleep(300);
await p.evaluate(()=>__emit('App.backButton',{}));await sleep(300);ok(await p.evaluate(()=>st.screen==='hesap'),'geri tuşu: gizlilik metni → Ayarlar');
await p.evaluate(()=>modal('Soru?','Evet','Hayır',function(){window.__y=1},null));await sleep(200);
await p.evaluate(()=>__emit('App.backButton',{}));await sleep(300);ok(await p.evaluate(()=>!st.modal&&!window.__y),'geri tuşu: açık pencere "Hayır" sayılır');
await p.evaluate(()=>go('welcome'));await sleep(300);await p.evaluate(()=>__emit('App.backButton',{}));await sleep(300);
ok(await p.evaluate(()=>!!st.modal&&/çıkmak/.test(document.getElementById('ov').textContent)),'karşılamada geri: çıkış sorusu');
await p.evaluate(()=>{var b=[...document.querySelectorAll('#ov button')].find(x=>/Evet/.test(x.textContent));b.click()});await sleep(200);
ok((await calls(p,'App','exitApp')).length===1,'"Evet, çık" → uygulama kapanır');
ok(await p.evaluate(()=>history.length<=2),'geçmiş tamponu kullanılmadı');
// ekran açık kalsın: oyun ekranında keepAwake, menüde allowSleep
await p.evaluate(()=>{st.modal=false;document.getElementById('ov').hidden=true;go('home')});await sleep(200);
await p.evaluate(()=>{st.screen='quiz';kaUpdate()});await sleep(100);await p.evaluate(()=>{st.screen='home';kaUpdate()});await sleep(100);
let ka=(await calls(p,'KeepAwake')).map(c=>c[1]);ok(ka.join()==='keepAwake,allowSleep','oyun ekranında ekran açık kalır, menüde serbest: '+ka.join());
ok((await calls(p,'AppUpdate','getAppUpdateInfo')).length>=1&&await p.evaluate(()=>NUP.av===0),'açılışta güncelleme denetlendi (güncel)');
if(out)await p.screenshot({path:path.join(out,'native.png')});
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));await p.context().close();
// Play'de yeni sürüm var
p=await open();await p.evaluate(()=>{window.__upd={updateAvailability:2,availableVersionCode:61,immediateUpdateAllowed:true};NUP.t=0;return natUpdCheck(true).then(natUpdAsk)});await sleep(400);
ok(await p.evaluate(()=>!!st.modal&&/Yeni sürüm/.test(document.getElementById('ov').textContent)),'yeni sürüm: "Güncelle" penceresi');
await p.evaluate(()=>document.getElementById('my').click());await sleep(200);
ok((await calls(p,'AppUpdate','performImmediateUpdate')).length===1&&(await calls(p,'AppUpdate','openAppStore')).length===0,'Güncelle → Play içi anında güncelleme');
await p.evaluate(()=>{go('welcome')});await sleep(400);ok(await p.evaluate(()=>{var b=document.querySelector('.vupd');return !!b&&/natUpdGo/.test(b.getAttribute('onclick'))}),'girişte "🔄 Güncelle" düğmesi görünür');
await p.evaluate(()=>{window.__updCode=4;natUpdGo()});await sleep(200);ok((await calls(p,'AppUpdate','openAppStore')).length===1,'anında güncelleme olmazsa Play sayfası açılır');
await p.evaluate(()=>{st.modal=false;natUpdAsk()});await sleep(100);ok(await p.evaluate(()=>!st.modal),'aynı sürüm için pencere günde bir kez');
ok(p.errs.length===0,'sayfa hatası yok '+JSON.stringify(p.errs.slice(0,3)));await p.context().close();
// google-services olmadan derlenmiş paket: bildirim kutusu yok, hata yok
srv.fcm=false;p=await open();
await p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦊 Kurnaz Tilki']));NMS.busy=true;st.profile='🦊 Kurnaz Tilki';go('friends');if(st.modal)closeModal()});await sleep(900);
ok(await p.evaluate(()=>pushState()==='no'&&!/Bildirimleri aç/.test(document.getElementById('app').textContent)),'FCM yoksa bildirim düğmesi gösterilmez');
ok((await calls(p,'PushNotifications','register')).length===0,'FCM yoksa kayıt denenmez (çökme olmaz)');
ok(p.errs.length===0,'sayfa hatası yok');await p.context().close();
// web: hiçbir şey değişmedi
const ctx=await b.newContext();const w2=await ctx.newPage();const e2=[];w2.on('pageerror',e=>e2.push(e.message));await w2.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await w2.goto(U);await sleep(1200);
ok(await w2.evaluate(()=>!NATIVE&&!!document.querySelector('.vupd')&&appUrl()===location.origin+location.pathname&&!document.documentElement.classList.contains('native')),'web sürümü aynı (Güncelle düğmesi, kendi adresi)');
ok(await w2.evaluate(()=>navigator.serviceWorker.getRegistrations().then(r=>r.length===1)),'web: servis çalışanı kurulu');
ok(e2.length===0,'web: sayfa hatası yok '+JSON.stringify(e2.slice(0,2)));
await b.close();srv.close();console.log(fail?('BAŞARISIZ '+fail):'HEPSİ GEÇTİ');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
