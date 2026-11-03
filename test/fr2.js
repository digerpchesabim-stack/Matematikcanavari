const {chromium}=require('playwright');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[40,150]});
const mk=async(pid,n)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await S.phone(ctx,pid,U);await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));pickProfile(0)},n);return p};
const ev=(p,f,a)=>p.evaluate(f,a);
const A=await mk('A','Ali'),B=await mk('B','Ayşe');await sleep(1200);
await ev(A,()=>{go('rooms');rcGo('duel');rcOp('add')});await sleep(1200);const code=await ev(A,()=>RM.code);
await ev(B,()=>go('rooms'));await B.fill('#r-code',code);await ev(B,()=>rmJoin());await sleep(9500);
console.log('1 oyuncu belgeleri pid:',Object.keys(S.store).filter(k=>k.startsWith('rooms/'+code+'/players')).map(k=>S.store[k].pid).join(','));
await ev(A,()=>{DU.sc=[10,4];duEnd()});await ev(B,()=>{DU.sc=[4,10];duEnd()});await sleep(1500);
const dre=p=>ev(p,()=>document.getElementById('dre').innerText.replace(/\n/g,' | '));
console.log('2 sonuç A:',await dre(A),' || B:',await dre(B));await A.screenshot({path:'f2_a.png',fullPage:true});
await ev(A,()=>{var b=[...document.querySelectorAll('#dre button')].find(x=>/arkadaş ekle/.test(x.textContent));b.click()});await sleep(1200);
console.log('3 istek sonrası A:',await dre(A),' || B:',await dre(B));
await ev(B,()=>{var b=[...document.querySelectorAll('#dre button')].find(x=>/kabul/.test(x.textContent));b.click()});await sleep(1500);
console.log('4 kabul sonrası A:',await dre(A),' || B:',await dre(B),' liste:',await ev(A,()=>JSON.stringify(FR.list)));
// yarış: 3 kişi
const C=await mk('C','Can');await sleep(1000);
for(const p of [A,B])await ev(p,()=>rmLeave());await sleep(500);
await ev(A,()=>{rcGo('race');rcOp('add')});await sleep(1200);const c2=await ev(A,()=>RM.code);
for(const P of [B,C]){await ev(P,()=>go('rooms'));await P.fill('#r-code',c2);await ev(P,()=>rmJoin());}await sleep(1200);
await ev(A,()=>rmStart());await sleep(6800);
for(const P of [A,B,C])await ev(P,()=>{st.g.score=Math.floor(Math.random()*30)+5;st.g.hearts=0;st.g.log=[{s:1}];endGame()});await sleep(2500);
console.log('5 yarış sonu A:',await ev(A,()=>document.getElementById('r-list').innerHTML.match(/frAddId|frAccept|⏳/g)),await ev(A,()=>document.getElementById('r-list').innerText.replace(/\n/g,' ')));
console.log('   C:',await ev(C,()=>document.getElementById('r-list').innerText.replace(/\n/g,' ')),(await ev(C,()=>document.getElementById('r-list').innerHTML.match(/frAddId/g)||[])).length,'buton');
await C.screenshot({path:'f2_c.png',fullPage:true});
// misafir: buton yok
console.log('log',S.log);await b.close()})();
