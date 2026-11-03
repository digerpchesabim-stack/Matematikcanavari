const {chromium}=require('playwright');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});const S=require(__dirname+'/dsrv.js')({lag:[30,100]});
const mk=async(pid,profs,vp)=>{const ctx=await b.newContext({viewport:vp||{width:390,height:844}});const p=await S.phone(ctx,pid,U);p.on('pageerror',e=>S.log.push(pid+' ERR '+e.message));if(profs)await p.evaluate(n=>localStorage.setItem('mc_profiles',JSON.stringify(n)),profs);return p};
const ev=(p,f,a)=>p.evaluate(f,a);
const A=await mk('A',['Ali','Veli']);await sleep(1500);await A.screenshot({path:'w1.png'});await sleep(1700);await A.screenshot({path:'w2.png'});
console.log('1 karşılama:',await ev(A,()=>JSON.stringify({it:CH.it.length,m:[Math.round(CH.m.x),Math.round(CH.m.y)],raf:!!CH.raf})));
// dokununca hedef
await A.mouse.click(200,200);await sleep(200);console.log('2 dokunma hedef:',await ev(A,()=>!!CH.tgt));
await sleep(6000);console.log('3 yenen sonrası sembol sayısı:',await ev(A,()=>CH.it.length+' kırıntı '+CH.cr.length));
console.log('4 müzik (karşılama):',await ev(A,()=>MM.el?('çalıyor='+!MM.el.paused+' ses='+MM.el.volume.toFixed(2)):'yok'));
// B ve C arkadaş kurulumu
const B=await mk('B',['Ayşe']),C=await mk('C',['Can']);
for(const P of [B,C])await ev(P,()=>pickProfile(0));await ev(A,()=>pickProfile(0));await sleep(1500);
const ca=await ev(A,()=>FR.pid);for(const P of [B,C]){await ev(P,c=>{FR.list.length;},ca);await ev(P,c=>devAuth().then(fb=>{var a=FR.pid<c?FR.pid:c,b2=FR.pid<c?c:FR.pid;return fb.setDoc(fb.doc(CL.db,'fr',frKey(FR.pid,c)),{a:a,b:b2,by:FR.pid,st:'req',ts:Date.now()})}),ca)}
await sleep(800);for(const o of await ev(A,()=>FR.inc))await ev(A,o=>frAccept(o),o);await sleep(1200);
await ev(C,()=>{CL.user=CL.user;FR.seen={}});
// C çevrim dışı yapalım: pl.seen eski
S.store['pl/'+await ev(C,()=>FR.pid)].seen=Date.now()-3600e3;
await ev(A,()=>{go('home');frNicks(null,FR.list)});await sleep(1000);
console.log('5 ana menü pano:',await ev(A,()=>document.getElementById('fr-live').innerText.replace(/\n/g,' | ')));
await A.screenshot({path:'h1.png'});await ev(A,()=>{document.querySelector('.bkd').open=true});await sleep(200);await A.screenshot({path:'h2.png',fullPage:true});
console.log('6 yedek kutusu:',await ev(A,()=>document.querySelector('.bkd').innerText.replace(/\n+/g,' | ').slice(0,200)));
// profil sayfası rozetleri
await ev(A,()=>{PRO.t=0;go('profiles')});await sleep(1500);console.log('7 profiller:',await ev(A,()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,200)));await A.screenshot({path:'p1.png'});
// müzik oyunda durur, menüde döner
await ev(A,()=>{pickProfile(0);go('gmenu');gStart('add','k',0)});await sleep(1500);console.log('8 oyunda müzik:',await ev(A,()=>st.screen+' paused='+MM.el.paused+' btn='+document.getElementById('mm-btn').style.display));
await ev(A,()=>{st.g.done=true;go('gmenu')});await sleep(1200);console.log('9 menüde müzik:',await ev(A,()=>'paused='+MM.el.paused+' vol='+MM.el.volume.toFixed(2)));
await ev(A,()=>mmToggle());await sleep(1000);console.log('10 kapatınca:',await ev(A,()=>'paused='+MM.el.paused+' kayıt='+localStorage.getItem('mc_mmus')+' btn='+document.getElementById('mm-btn').textContent));
await ev(A,()=>mmToggle());
// misafir: geri yükleme ana menüde
const D=await mk('D',null);await ev(D,()=>{guest()});console.log('11 misafir ana menü yedek:',await ev(D,()=>document.querySelector('.bkd').innerText.replace(/\n+/g,' | '))," pano gizli:",await ev(D,()=>document.getElementById('fr-live').style.display));
await ev(D,()=>{document.querySelector('.bkd').open=true;go('bkr')});await ev(D,()=>back());console.log('12 bkr geri →',await ev(D,()=>st.screen));
// dar ve geniş ekran karşılama
const E=await mk('E',null,{width:360,height:640});await sleep(1200);await E.screenshot({path:'w3.png'});console.log('13 küçük ekran kaydırma:',await ev(E,()=>document.documentElement.scrollHeight+'/'+innerHeight));
console.log('log',S.log);await b.close()})();
