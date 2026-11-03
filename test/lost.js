const {chromium}=require('playwright');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')();
const mk=async(pid,n)=>{const ctx=await b.newContext();const p=await S.phone(ctx,pid,U);await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));st.profile=n;go('home');go('rooms')},n);return p};
const A=await mk('A','Ali'),B=await mk('B','Ayşe'),C=await mk('C','Can');const ev=(p,f,a)=>p.evaluate(f,a);
await ev(A,()=>{rcGo('race');rcOp('add')});await sleep(700);const code=await ev(A,()=>RM.code);
for(const P of [B,C]){await P.fill('#r-code',code);await ev(P,()=>rmJoin());}await sleep(800);
// C lobide kopar
await C.close();console.log('lobi 3 kişi; C kapandı');
await sleep(33000);console.log('1 lobi A:',await ev(A,()=>document.getElementById('lb-list').innerText.replace(/\n/g,' | ')));
await ev(A,()=>rmStart());await sleep(6500);await ev(A,()=>{st.g.hearts=99});
// B oyunda 2 soru cevaplayıp kopar
console.log('2 oyun:',await ev(A,()=>st.screen),await ev(B,()=>st.screen));
await B.close();
// A kaybedip bitirsin
await sleep(31000);console.log('3 A sıralama:',await ev(A,()=>document.getElementById('g-rank').innerText.replace(/\n/g,' | ')));
await ev(A,()=>{st.g.score=20;st.g.hearts=0;st.g.log=[{s:1}];endGame()});await sleep(1500);
console.log('4 rover hemen:',await ev(A,()=>document.getElementById('r-st').textContent+' | '+document.getElementById('r-list').innerText.replace(/\n/g,' ')));
await sleep(16000);console.log('5 rover 45 sn sonra:',await ev(A,()=>document.getElementById('r-st').textContent+' | '+document.getElementById('r-list').innerText.replace(/\n/g,' ')));
console.log('log',S.log);await b.close()})();
