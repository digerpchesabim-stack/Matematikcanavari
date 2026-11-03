const {chromium}=require('playwright');
const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const b=await chromium.launch();
const S=require(__dirname+'/dsrv.js')({lag:[40,250]});
const mk=async(pid,name)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await S.phone(ctx,pid,U);
  await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));st.profile=n;go('home');go('rooms')},name);return p};
const A=await mk('A','Ali'),B=await mk('B','Ayşe');
const ev=(p,f,a)=>p.evaluate(f,a);
// kur
await ev(A,()=>{rcGo('duel');rcSet('win',10)});
console.log('1 kur ekranı:',(await ev(A,()=>document.body.innerText.replace(/\n+/g,' | '))).slice(0,400));
await A.screenshot({path:'d1.png'});
await ev(A,()=>rcOp('add'));await sleep(800);
const code=await ev(A,()=>RM.code);
console.log('2 lobi:',await ev(A,()=>st.screen+' | '+document.body.innerText.replace(/\n+/g,' | ').slice(0,250)),' oda=',JSON.stringify(S.store['rooms/'+code]));
await A.screenshot({path:'d2.png'});
await B.fill('#r-code',code);await ev(B,()=>rmJoin());
await sleep(1700);
console.log('3 intro:',await ev(A,()=>st.screen),await ev(B,()=>st.screen),'| A:',await ev(A,()=>document.body.innerText.replace(/\n+/g,' ')));
await A.screenshot({path:'d3.png'});
// üçüncü kişi
const C=await mk('C','Can');await C.fill('#r-code',code);await ev(C,()=>rmJoin());await sleep(700);
console.log('4 üçüncü:',await ev(C,()=>st.screen+' | '+document.getElementById('toast').textContent));
// oyun
const waitQ=async(k)=>{for(let i=0;i<300;i++){const a=await ev(A,()=>DU&&[DU.k,DU.ph,st.screen].join()),bb=await ev(B,()=>DU&&[DU.k,DU.ph,st.screen].join());if(a===k+',q,duel'&&bb===k+',q,duel')return true;await sleep(50)}console.log('  bekleme zaman aşımı',k,await ev(A,()=>DU&&[DU.k,DU.ph,st.screen].join()),await ev(B,()=>DU&&[DU.k,DU.ph,st.screen].join()));return false};
const tap=(p,k,d,ok)=>ev(p,([k,d,ok])=>{setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];var i=q.opts.findIndex(o=>(o.v===q.ans)===ok);duAns(i,document.querySelectorAll('#dgrid .ani')[i])}},d)},[k,d,ok]);
// [A gecikme, A doğru, B gecikme, B doğru]  (null = basmaz)
const plan=[[300,1,900,1],[900,1,300,1],[400,0,800,1],[400,0,500,0],[500,1,null,0],[300,1,600,1],[350,1,700,1],[300,1,900,0],[300,1,800,1],[300,1,1200,1],[300,1,700,1],[300,1,1500,1],[300,1,900,1],[300,1,900,1]];
let k=0,shot=false;
for(const [ad,ao,bd,bo] of plan){
  if(!await waitQ(k))break;
  const qa=await ev(A,k=>DU.qs[k].txt,k),qb=await ev(B,k=>DU.qs[k].txt,k);
  if(ad!==null)await tap(A,k,ad,!!ao);
  if(bd!==null)await tap(B,k,bd,!!bo);
  await sleep(Math.max(ad||0,bd||0)+500);
  if(!shot&&k===1){await A.screenshot({path:'d4.png'});shot=true}
  // tur sonucunu bekle
  for(let i=0;i<60;i++){const a=await ev(A,()=>DU&&(DU.ph==='res'||DU.over));const bb=await ev(B,()=>DU&&(DU.ph==='res'||DU.over));if(a&&bb)break;await sleep(100)}
  const sa=await ev(A,()=>DU.sc.join('-')),sb=await ev(B,()=>DU.sc.join('-'));
  console.log(`  tur ${k}: soru A="${qa}" B="${qb}" | skor A:${sa} B:${sb}`,(sa===sb.split('-').reverse().join('-'))?'✓':'✗ UYUMSUZ',await ev(A,()=>{var e=document.querySelector('.gpop');return e?e.innerText.replace(/\n/g,' '):''}));
  if(await ev(A,()=>DU.over))break;
  k++;
}
await sleep(2500);
console.log('5 son:',await ev(A,()=>st.screen+' | '+document.body.innerText.replace(/\n+/g,' | ').slice(0,200)));
console.log('  B:',await ev(B,()=>st.screen+' | '+document.body.innerText.replace(/\n+/g,' | ').slice(0,200)));
await A.screenshot({path:'d5.png'});await B.screenshot({path:'d6.png'});
// rövanş
await ev(B,()=>duRematch());await sleep(800);
console.log('6 B rövanş istedi, A ekranı:',await ev(A,()=>document.getElementById('dre').innerText));
await ev(A,()=>duRematch());await sleep(1500);
console.log('7 rövanş:',await ev(A,()=>st.screen+' m='+DU.m),await ev(B,()=>st.screen+' m='+DU.m));
await sleep(7000);
console.log('8 rövanş başladı:',await ev(A,()=>[st.screen,DU.k,DU.sc.join('-'),DU.qs[0]&&DU.qs[0].txt].join()),await ev(B,()=>[st.screen,DU.k,DU.sc.join('-'),DU.qs[0]&&DU.qs[0].txt].join()));
await waitQ(0);await tap(A,0,300,true);await sleep(1500);
console.log('9 rövanş tur0:',await ev(A,()=>DU.sc.join('-')),await ev(B,()=>DU.sc.join('-')));
// A çıkar
await sleep(1500);await ev(A,()=>rmLeave());await sleep(1500);
console.log('10 A çıktı, B:',await ev(B,()=>st.screen+' | '+document.body.innerText.replace(/\n+/g,' | ').slice(0,160)));
console.log('11 geçmiş A:',await ev(A,()=>{go('rhist');return document.body.innerText.replace(/\n+/g,' | ').slice(-260)}));
console.log('log',S.log);
await b.close();})();
