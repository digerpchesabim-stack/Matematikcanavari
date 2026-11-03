const {chromium}=require('playwright');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[80,200]});
const mk=async(pid,name)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await S.phone(ctx,pid,U);await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));st.profile=n;go('home');go('rooms')},name);return p};
const A=await mk('A','Ali'),B=await mk('B','Ayşe');const ev=(p,f,a)=>p.evaluate(f,a);
await ev(A,()=>{rcGo('duel');rcOp('add')});await sleep(700);const code=await ev(A,()=>RM.code);await B.fill('#r-code',code);await ev(B,()=>rmJoin());
const waitQ=async(k)=>{for(let i=0;i<300;i++){const a=await ev(A,()=>DU&&[DU.k,DU.ph].join()),bb=await ev(B,()=>DU&&[DU.k,DU.ph].join());if(a===k+',q'&&bb===k+',q')return;await sleep(50)}};
const tap=(p,k,d,ok)=>ev(p,([k,d,ok])=>{setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];var i=q.opts.findIndex(o=>(o.v===q.ans)===ok);duAns(i,document.querySelectorAll('#dgrid .ani')[i])}},d)},[k,d,ok]);
const st2=async(p)=>ev(p,()=>{var e=document.querySelector('.gpop');return DU.ph+' | msg="'+document.getElementById('dmsg').textContent+'" | pop="'+(e?e.innerText.replace(/\n/g,' '):'')+'"'});
// Tur 0: A 300ms doğru, B hiç basmıyor
await waitQ(0);await tap(A,0,300,true);await sleep(380);
console.log('T0 A bastıktan hemen sonra A:',await st2(A));await sleep(250);
console.log('T0 ~0,25 sn sonra B:',await st2(B));await B.screenshot({path:'e1.png'});await sleep(150);
console.log('T0 A:',await st2(A));await A.screenshot({path:'e2.png'});
// Tur 1: A 300 doğru, B 700 doğru (B'ye mesaj gelmeden basıyor)
await waitQ(1);await tap(A,1,300,true);await tap(B,1,330,true);await sleep(400);
console.log('T1 B bastı:',await st2(B));await sleep(600);console.log('T1 B sonuç:',await st2(B));console.log('T1 A sonuç:',await st2(A));await B.screenshot({path:'e3.png'});
// Tur 2: B yanlış, A doğru
await waitQ(2);await tap(B,2,200,false);await tap(A,2,600,true);await sleep(1200);
console.log('T2 A:',await st2(A),' B:',await st2(B));
console.log('log',S.log);await b.close()})();
