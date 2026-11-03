const {chromium}=require('playwright');const fs=require('fs');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const errs=[];
const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.setOffline(false);
const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await p.goto(U);
const ev=(f,a)=>p.evaluate(f,a);
await ev(()=>{localStorage.setItem('mc_profiles','["Ali"]');st.profile='Ali';go('home');go('rooms')});
console.log('1 rooms:',await ev(()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,420)));
await ctx.setOffline(true);
await p.click('text=Canavara Karşı Savaş');console.log('2',await ev(()=>document.body.innerText.replace(/\n+/g,' | ')));await p.screenshot({path:'b1.png'});
await p.click('text=Dev Canavar');console.log('3',await ev(()=>document.body.innerText.replace(/\n+/g,' | ')));await p.screenshot({path:'b2.png'});
await ev(()=>{botSet('lv','o');botSet('win',10)});await p.click('text=Toplama');await sleep(1600);
console.log('4 intro:',await ev(()=>st.screen+' | '+document.body.innerText.replace(/\n+/g,' ')));await p.screenshot({path:'b3.png'});
await sleep(6400);console.log('5',await ev(()=>[st.screen,DU.k,DU.ph,DU.lim,DU.qs[0].txt].join()));
// çocuk her soruda belirli sürede doğru basar; canavar planına bakarak sonucu doğrula
let ok=0,bad=0;
for(let k=0;k<40;k++){
  const r=await ev(()=>DU&&[DU.k,DU.ph,DU.over].join());
  if(!r||r.endsWith('true'))break;
  for(let i=0;i<200;i++){if(await ev(k=>DU.k===k&&DU.ph==='q'||DU.over,k))break;await sleep(50)}
  if(await ev(()=>DU.over))break;
  const delay=[1200,2500,4000,800][k%4],corr=k%5!==3;
  const plan=await ev(()=>JSON.stringify(DU.bp));
  await ev(([d,c])=>{var k=DU.k;setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];var i=q.opts.findIndex(o=>(o.v===q.ans)===c);duAns(i,document.querySelectorAll('#dgrid .ani')[i])}},d)},[delay,corr]);
  for(let i=0;i<300;i++){if(await ev(()=>DU.ph==='res'||DU.over))break;await sleep(50)}
  const res=await ev(()=>[DU.myR[DU.k],DU.botR[DU.k],DU.sc.join('-'),(document.querySelector('.gpop')||{innerText:''}).innerText.replace(/\n/g,' ')].join(' | '));
  const P=JSON.parse(plan);const exp=(corr&&(!P.ok||delay<P.t))?'çocuk':((P.ok&&(!corr||P.t<=delay))?'canavar':'kimse');
  const got=/Bu tur senin/.test(res)?'çocuk':(/bildi/.test(res)?'canavar':'kimse');
  if(exp===got)ok++;else{bad++;console.log('  ✗ beklenen',exp,'gelen',got,plan,delay,corr,res)}
  if(k<6)console.log(`  tur ${k}: plan ${plan} çocuk ${delay}ms ${corr?'doğru':'yanlış'} → ${res}`);
}
await sleep(2500);console.log('6 tur kontrol: doğru',ok,'hatalı',bad);
console.log('7 son:',await ev(()=>st.screen+' | '+document.body.innerText.replace(/\n+/g,' | ').slice(0,300)));await p.screenshot({path:'b4.png'});
await ev(()=>botAgain());await sleep(8200);console.log('8 rövanş:',await ev(()=>[st.screen,DU.m,DU.onick,DU.sc.join('-')].join()));
await ev(()=>back());await ev(()=>document.getElementById('my').click());await sleep(300);
console.log('9 çık:',await ev(()=>st.screen+' DU='+DU+' BOT.on='+BOT.on));
await ev(()=>go('rhist'));console.log('10 geçmiş:',await ev(()=>document.body.innerText.replace(/\n+/g,' | ').slice(-300)));
// Yavru, Zor, çarpma tablo 6
await ev(()=>{go('bpick');botPick('y');botSet('lv','z')});await ev(()=>botOp('mul'));console.log('11 btb:',await ev(()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,200)));
await ev(()=>botGo('mul',6));await sleep(8000);console.log('12',await ev(()=>[st.screen,DU.qg.tb,DU.lim,DU.qs[0].txt,JSON.stringify(DU.bp)].join(' ')));
// Zor seviye faktör
await ev(()=>{duStop();DU=null;BOT.tb=0;BOT.lv='z';BOT.b='d';BOT.op='add';duStart(0)});await sleep(8000);
const ts=[];for(let i=0;i<30;i++){ts.push(await ev(()=>{botPlan(0);return DU.bp.t}))}console.log('13 Dev+Zor süreler (ms) min/max:',Math.min(...ts),Math.max(...ts));
console.log('errs',errs);await b.close()})();
