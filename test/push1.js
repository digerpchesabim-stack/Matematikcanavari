// S49: bildirim aç (taklit push servisi) → ps belgesi; davet ve arkadaşlık isteğinde sunucuya haber
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const OUT=process.env.OUT||'.';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[20,80]});
const stub=()=>{
  window.__sent=[];
  Object.defineProperty(window,'Notification',{value:{permission:'default',requestPermission(){this.permission='granted';return Promise.resolve('granted')}},configurable:true});
  window.PushManager=function(){};
  const sub={endpoint:'https://fcm.googleapis.com/fcm/send/TEST123',toJSON(){return {endpoint:this.endpoint,keys:{p256dh:'BPk',auth:'AU'}}},unsubscribe(){return Promise.resolve(true)}};
  let has=null;
  Object.defineProperty(navigator,'serviceWorker',{value:{ready:Promise.resolve({pushManager:{getSubscription:()=>Promise.resolve(has),subscribe:o=>{window.__ask=o;has=sub;return Promise.resolve(sub)}}}),register(){return Promise.resolve({})},addEventListener(){},controller:null},configurable:true});
  const of=window.fetch;window.fetch=function(u,o){u=String(u);if(u.indexOf('push.json')===0)return Promise.resolve(new Response(JSON.stringify({u:'https://mc-push.x.workers.dev',k:'BHHvzJF6C50RJjDSAmsVfGKEwEQYPYGvbzpqm80eow92mraYI0-Z54mwvBAuil3Y7dzRh4JR9YuTEVwUgEE4ag0'})));if(u.indexOf('https://mc-push')===0){window.__sent.push(JSON.parse(o.body));return Promise.resolve(new Response('{"ok":true}'))}return of.apply(this,arguments)};
};
const mk=async(pid,name)=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});await ctx.addInitScript(stub);const p=await S.phone(ctx,pid,U);
  await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));NMS.busy=true;st.profile=n;go('home');return frEnsure()},name);return p};
const A=await mk('A','Ali'),B=await mk('B','Ayşe');
for(let i=0;i<60&&!(await A.evaluate(()=>FR.ready&&!!FR.pid)&&await B.evaluate(()=>FR.ready&&!!FR.pid));i++)await sleep(200);
const pa=await A.evaluate(()=>FR.pid),pb=await B.evaluate(()=>FR.pid);
await B.evaluate(()=>{if(st.modal)closeModal();RK.q=[];go('friends')});await sleep(400);
ok(await B.evaluate(()=>/Bildirimleri aç/.test(document.body.innerText)),'Arkadaşlarım: Bildirimleri aç düğmesi');
await B.screenshot({path:OUT+'/push_kapali.png'});
await B.evaluate(()=>pushOn());await sleep(1500);
const ps=S.store['ps/'+pb];ok(ps&&ps.e==='https://fcm.googleapis.com/fcm/send/TEST123'&&ps.k==='BPk','ps belgesi yazıldı: '+JSON.stringify(ps));
ok(await B.evaluate(()=>/Bildirimler açık/.test(document.body.innerText)&&window.__ask&&window.__ask.userVisibleOnly&&window.__ask.applicationServerKey.length===65),'açık durumu ve VAPID anahtarı (65 bayt)');
await B.screenshot({path:OUT+'/push_acik.png'});
// A, B'ye arkadaşlık isteği → sunucuya 'fr'
await A.evaluate(c=>{if(st.modal)closeModal();frAddId(c)},pb);await sleep(1500);
const sa=await A.evaluate(()=>window.__sent);console.log('  A gönderdi:',JSON.stringify(sa.map(x=>({k:x.k,from:x.from,to:x.to,t:!!x.t}))));
ok(sa.length===1&&sa[0].k==='fr'&&sa[0].from===pa&&sa[0].to===pb&&sa[0].t,'arkadaşlık isteğinde bildirim çağrısı');
// B kabul eder, A çağırır → 'iv'
await B.evaluate(c=>frAccept(c),pa);await sleep(1500);
await A.evaluate(c=>{if(st.modal)closeModal();frCall(c)},pb);await sleep(400);
await A.evaluate(()=>frCallGo&&frCallGo('add'));await sleep(2500);
const sa2=await A.evaluate(()=>window.__sent);console.log('  A gönderdi:',JSON.stringify(sa2.map(x=>x.k)));
ok(sa2.some(x=>x.k==='iv'&&x.to===pb),'davette bildirim çağrısı');
console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,6)));
await b.close();console.log(fail?'HATA '+fail:'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
