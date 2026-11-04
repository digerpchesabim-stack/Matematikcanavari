// S48: rekor tablosunda rütbe, dokununca rütbe+madalya kartı, Soru Ustası sayımı
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const OUT=process.env.OUT||'.';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[20,80]});
S.store['lbg_add/zz9']={nick:'🐼 Cesur Panda',score:480,ts:1,pid:'PANDA77',rk:5};
S.store['pl/PANDA77']={nick:'🐼 Cesur Panda',seen:1,v:1,rk:5,md:'737121',st:'640.58.120.31.9.8200.77.25'};
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
const card=await ev(()=>({s:st.screen,t:document.getElementById('app')?document.body.innerText.replace(/\n+/g,' | '):'',m:document.querySelectorAll('.kc-m svg').length,k:document.querySelectorAll('.kc-s div').length}));
console.log('  kart:',card.s,card.t.slice(0,300));ok(card.s==='kart'&&/Şampiyon/.test(card.t)&&card.m===6&&card.k===6&&/8\.200/.test(card.t),'dokununca karakter kartı: Şampiyon, 6 madalya, 6 istatistik');
await p.screenshot({path:OUT+'/kc_baskasi.png',fullPage:true});
await ev(()=>back());await sleep(300);ok(await ev(()=>st.screen)==='lb','geri → rekorlar tablosu');
// kendi kartı + paylaşım
await ev(()=>rkMyCard());await sleep(500);ok(await ev(()=>st.screen)==='kart','kendi kartım');
await p.screenshot({path:OUT+'/kc_kendi.png',fullPage:true});
await ev(()=>{window.__shot=null;shareCanvas=function(cv){window.__shot=cv.toDataURL('image/png')};rkCardShare()});
for(let i=0;i<40&&!await ev(()=>!!window.__shot);i++)await sleep(100);
const png=await ev(()=>window.__shot);ok(!!png,'kart fotoğrafı oluştu');if(png)require('fs').writeFileSync(OUT+'/kc_paylas.png',Buffer.from(png.split(',')[1],'base64'));
// eski rekor satırına rütbe
S.store['lbg_sub/'+await ev(()=>CL.user.uid)]={nick:'Ali',score:12,ts:1};
await ev(()=>{localStorage.removeItem('mc_lbrk');rkLbSync(st.profile)});await sleep(1500);
const ro=S.store['lbg_sub/'+await ev(()=>CL.user.uid)];ok(ro&&ro.rk===3&&ro.score===12,'eski satıra rütbe yazıldı: '+JSON.stringify(ro));
console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,6)));
await b.close();console.log(fail?'HATA '+fail:'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
