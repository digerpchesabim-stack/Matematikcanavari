// S48: rekor tablosunda rütbe, dokununca rütbe+madalya kartı, Soru Ustası sayımı
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const OUT=process.env.OUT||'.';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[20,80]});
S.store['lbg_add/zz9']={nick:'🐼 Cesur Panda',score:480,ts:1,pid:'PANDA77',rk:5};
S.store['pl/PANDA77']={nick:'🐼 Cesur Panda',seen:1,v:1,rk:5,md:'737121'};
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await S.phone(ctx,'A',U);
const ev=(f,a)=>p.evaluate(f,a);
await ev(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['Ali']));NMS.busy=true;st.profile='Ali';go('home')});await sleep(2500);
await ev(()=>{if(st.modal)closeModal();RK.q=[]});
// Soru Ustası: aynı oturum iki kez kaydedilir → fark sayılır
const q=await ev(()=>{rkQ(111,12);rkQ(111,20);rkQ(222,5);var x=rkRaw(st.profile);return [x.q,x.dq].join()});
ok(q==='25,25','aynı oturum tekrar sayılmaz: '+q);
await ev(()=>{var x=rkRaw(st.profile);x.p=160;x.r=3;rkPut(st.profile,x)});
await ev(()=>lbSubmit('solo','add','k',30,30,st.profile));await sleep(800);
const mine=Object.keys(S.store).filter(k=>k.startsWith('lbg_add/')&&k!=='lbg_add/zz9').map(k=>S.store[k]);
console.log('  benim satırım:',JSON.stringify(mine));
ok(mine.length===1&&mine[0].rk===3,'rekor satırına rütbe yazıldı');
await ev(()=>{LBC={};lbOpen('solo','add','k')});await sleep(1500);
await p.screenshot({path:OUT+'/rk_lb.png'});
const rows=await ev(()=>document.querySelectorAll('#lb-body .rkmini').length);ok(rows===2,'tabloda 2 mini rozet: '+rows);
await ev(()=>lbTap(0));await sleep(1200);
const card=await ev(()=>({t:document.getElementById('ov').innerText.replace(/\n+/g,' | '),m:document.querySelectorAll('#lt-md svg').length}));
console.log('  kart:',card.t);ok(/Şampiyon/.test(card.t)&&card.m===6,'kartta Şampiyon ve 6 madalya');
await p.screenshot({path:OUT+'/rk_lbtap.png'});
console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,6)));
await b.close();console.log(fail?'HATA '+fail:'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
