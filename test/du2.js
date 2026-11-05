// Kapışma: arkadaş daveti ile, iki profil (rütbeli), sırayla kazanma; iki telefonun skoru aynı olmalı
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[60,400]});
const mk=async(pid,name)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await S.phone(ctx,pid,U);
  await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));NMS.busy=true;st.profile=n;go('home');return frEnsure()},name);await sleep(2500);await p.evaluate(()=>{if(st.modal&&document.getElementById('mn'))document.getElementById('mn').click()});return p};
const A=await mk('A','Ali'),B=await mk('B','Ayşe');
const ev=(p,f,a)=>p.evaluate(f,a);
const pa=await ev(A,()=>FR.pid),pb=await ev(B,()=>FR.pid);
await ev(A,c=>frAddId(c),pb);await sleep(1200);await ev(B,c=>frAccept(c),pa);await sleep(1500);
await ev(A,()=>{go('rooms');rcGo('duel');rcSet('win',10)});await ev(A,()=>rcOp('add'));await sleep(1200);
const code=await ev(A,()=>RM.code);await ev(B,()=>go('rooms'));await B.fill('#r-code',code);await ev(B,()=>rmJoin());
for(let i=0;i<100&&(await ev(A,()=>st.screen))!=='duel';i++)await sleep(100);
const st2=async p=>ev(p,()=>DU&&[DU.k,DU.ph,st.screen].join());
const waitQ=async k=>{for(let i=0;i<300;i++){if((await st2(A))===k+',q,duel'&&(await st2(B))===k+',q,duel')return true;if(await ev(A,()=>DU&&DU.over))return false;await sleep(50)}console.log('  bekleme',k,await st2(A),await st2(B));return false};
const tap=(p,k,d,okk)=>ev(p,([k,d,okk])=>{setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];var i=q.opts.findIndex(o=>(o.v===q.ans)===okk);duAns(i,document.querySelectorAll('#dgrid .ani')[i])}},d)},[k,d,okk]);
for(let k=0;k<30;k++){
  if(!await waitQ(k))break;
  const aw=k%2===0;await tap(A,k,aw?300:1200,true);await tap(B,k,aw?1200:300,true);
  for(let i=0;i<80;i++){if(await ev(A,()=>DU&&(DU.ph==='res'||DU.over))&&await ev(B,()=>DU&&(DU.ph==='res'||DU.over)))break;await sleep(100)}
  const sa=await ev(A,()=>DU.sc.join('-')),sb=await ev(B,()=>DU.sc.join('-'));
  console.log('  tur',k,'A',sa,'B',sb,sa===sb.split('-').reverse().join('-')?'✓':'✗');
  if(await ev(A,()=>DU.over))break;
}
await sleep(3000);
const ea=await ev(A,()=>[DU.sc.join('-'),DU.won]),eb=await ev(B,()=>[DU.sc.join('-'),DU.won]);
console.log('  son A',ea,'B',eb);ok(ea[1]!==eb[1],'tek kazanan');
console.log('  log:',JSON.stringify(S.log.filter(x=>/DENY|ERR/.test(x)).slice(0,8)));
await b.close();console.log(fail?'HATA':'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
