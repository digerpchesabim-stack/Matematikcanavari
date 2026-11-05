// S52: bildirime dokunma → ?kap=KOD&to=OYUNCU ile açılış → doğrudan kapışma; uygulama açıkken SW mesajı; paylaş düğmesi
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const OUT=process.env.OUT||'.';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[40,200]});
const mk=async(pid,name,prof)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await S.phone(ctx,pid,U);
  await p.evaluate(([n,pr])=>{localStorage.setItem('mc_profiles',JSON.stringify(pr));var nm={};pr.forEach((x,i)=>nm[x]={e:i,n:0,c:1});localStorage.setItem('mc_nm',JSON.stringify(nm));NMS.busy=true;st.profile=n;go('home');return frEnsure()},[name,prof]);await sleep(2000);await p.evaluate(()=>{if(st.modal)closeModal();RK.q=[]});return p};
const A=await mk('A','Ali',['Ali']),B=await mk('B','Ayşe',['Ayşe']);
const ev=(p,f,a)=>p.evaluate(f,a);
const pa=await ev(A,()=>FR.pid),pb=await ev(B,()=>FR.pid);
await ev(A,c=>frAddId(c),pb);await sleep(1200);await ev(B,c=>frAccept(c),pa);await sleep(1500);
// B uygulamayı kapattı
await B.goto('about:blank');
await ev(A,c=>{if(st.modal)closeModal();frCall(c)},pb);await sleep(300);await ev(A,()=>frCallGo('add'));await sleep(2500);
const code=await ev(A,()=>RM.code);ok(!!S.store['iv/'+pb],'davet yazıldı, oda '+code);
// bildirime dokundu: uygulama kapışma adresiyle açılır (S53: tek karakter)
await B.goto(U+'?kap='+code+'&to='+pb);
for(let i=0;i<80&&(await ev(A,()=>st.screen))!=='dintro'&&(await ev(A,()=>st.screen))!=='duel';i++)await sleep(150);
for(let i=0;i<60&&!['dintro','duel'].includes(await ev(B,()=>st.screen));i++)await sleep(150);
const sB=await ev(B,()=>({t:(document.getElementById('toast')||{}).textContent,rm:RM.code,s:st.screen,p:st.profile,q:location.search,m:st.modal,ids:DU&&DU.ids.length}));
console.log('  B:',JSON.stringify(sB));
ok((sB.s==='dintro'||sB.s==='duel')&&sB.p==='Ayşe'&&sB.ids===2&&sB.q==='','B doğrudan kapışmaya girdi (Ayşe profiliyle, iki oyuncu)');
ok(!sB.m,'davet kutusu ayrıca çıkmadı');
await B.screenshot({path:OUT+'/deep_giris.png'});
await sleep(4000);ok(!S.store['iv/'+pb],'davet temizlendi');
// uygulama açıkken bildirim (SW mesajı)
await ev(A,()=>{duStop&&duStop();rmReset();go('home')});await ev(B,()=>{duStop&&duStop();rmReset();go('kart')});await sleep(500);
await ev(A,c=>{frCall(c)},pb);await sleep(300);await ev(A,()=>frCallGo('add'));await sleep(2500);
const code2=await ev(A,()=>RM.code);
await ev(B,([c,t])=>{DEEP=deepParse('?kap='+c+'&to='+t);deepRun()},[code2,pb]);
for(let i=0;i<80&&!['dintro','duel'].includes(await ev(B,()=>st.screen));i++)await sleep(150);
ok(['dintro','duel'].includes(await ev(B,()=>st.screen)),'açık uygulamada da doğrudan kapışma');
// paylaş
await ev(A,()=>{rmReset();go('home');window.__sh=null;navigator.share=o=>{window.__sh=o;return Promise.resolve()}});await sleep(300);
ok(await ev(A,()=>/Uygulamayı Paylaş/.test(document.body.innerText)),'ana menüde Uygulamayı Paylaş');
await ev(A,()=>appShare());await sleep(200);
const sh=await ev(A,()=>window.__sh&&window.__sh.text);console.log('  paylaşılan:',JSON.stringify(sh));
ok(/Matematik Canavarı/.test(sh)&&/Ana ekrana ekle/.test(sh)&&/https?:|file:/.test(sh),'paylaşım metni (link + ana ekrana ekle)');
await ev(A,()=>go('welcome'));await sleep(300);ok(await ev(A,()=>/Uygulamayı Paylaş/.test(document.body.innerText)&&/Sürüm 53/.test(document.body.innerText)),'giriş ekranında da var, Sürüm 53');
await A.screenshot({path:OUT+'/paylas_giris.png'});
console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,6)));
await b.close();console.log(fail?'HATA':'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
