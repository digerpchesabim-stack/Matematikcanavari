const {chromium}=require('playwright');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[40,150]});
const mk=async(pid,n)=>{const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await S.phone(ctx,pid,U);await p.evaluate(n=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));pickProfile(0)},n);return p};
const ev=(p,f,a)=>p.evaluate(f,a);const txt=p=>ev(p,()=>document.body.innerText.replace(/\n+/g,' | '));
const A=await mk('A','Ali'),B=await mk('B','Ayşe'),C=await mk('C','Can');await sleep(1200);
const ca=await ev(A,()=>FR.pid),cb=await ev(B,()=>FR.pid);console.log('1 kodlar:',ca,cb,!!S.store['pk/'+ca],JSON.stringify(S.store['pl/'+ca]));
await ev(A,()=>frOpen());await sleep(500);console.log('2 A arkadaş ekranı:',(await txt(A)).slice(0,330));await A.screenshot({path:'f_a1.png',fullPage:true});
await A.fill('#fr-code','zzz-zzzz');await ev(A,()=>frAdd());await sleep(500);console.log('3 yanlış kod:',await ev(A,()=>document.getElementById('toast').textContent));
await A.fill('#fr-code',cb.slice(0,3).toLowerCase()+'-'+cb.slice(3));await ev(A,()=>frAdd());await sleep(800);
console.log('4 A giden:',await ev(A,()=>JSON.stringify(FR.out)),' B home:',(await txt(B)).match(/Arkadaşlarım[^|]*\|[^|]*/)[0]);
await ev(B,()=>frOpen());await sleep(500);await B.screenshot({path:'f_b1.png',fullPage:true});
await ev(B,o=>frAccept(o),ca);await sleep(1200);
console.log('5 arkadaş:',await ev(A,()=>document.getElementById('fr-body').innerText.replace(/\n+/g,' | ').slice(-120)),' || B:',await ev(B,()=>JSON.stringify(FR.list)));
// C arkadaş değilken A'ya davet yazamaz
console.log('6 C izinsiz davet:',await ev(C,a=>devAuth().then(fb=>fb.setDoc(fb.doc(CL.db,'iv',a),{from:FR.pid,nick:'Can',room:'XXXX',op:'add',lv:'k',win:10,ts:Date.now()})).then(()=>'YAZDI',e=>'reddedildi'),ca));
// B oyunda: davet bekler
await ev(B,()=>{go('home');go('gmenu');gStart('add','k',0)});await sleep(300);
await ev(A,o=>frCall(o),cb);console.log('7 A çağır ekranı:',(await txt(A)).slice(0,200));await A.screenshot({path:'f_a2.png',fullPage:true});
await ev(A,()=>frCallGo('add'));await sleep(1500);
console.log('8 A lobi:',(await txt(A)).slice(0,330),' iv:',JSON.stringify(S.store['iv/'+cb]));
console.log('9 B oyunda modal yok:',await ev(B,()=>st.screen+' modal='+st.modal));
await ev(B,()=>{st.g.done=true;go('home')});await sleep(700);
console.log('10 B menüde davet:',await ev(B,()=>st.modal&&document.querySelector('#ov p').innerText.replace(/\n/g,' ')));await B.screenshot({path:'f_b2.png'});
await B.click('#my');await sleep(3500);
console.log('11 kapışma:',await ev(A,()=>st.screen+' '+(DU&&DU.onick)),await ev(B,()=>st.screen+' '+(DU&&DU.onick)),' iv silindi:',!S.store['iv/'+cb]);
await sleep(7000);console.log('12 oyun:',await ev(A,()=>st.screen),await ev(B,()=>st.screen));
// çıkış
await ev(A,()=>rmLeave());await ev(B,()=>{duExit()});await sleep(800);
// yedek: A yedekle → D telefonda geri yükle → kimlik taşınır
await ev(A,()=>bkRun(true));await sleep(800);const code=await ev(A,()=>ls('mc_bk',''));
const ctxD=await b.newContext();const D=await S.phone(ctxD,'D',U);await ev(D,()=>go('bkr'));await D.fill('#bk-in',code);await ev(D,()=>bkRestore());await sleep(800);await D.click('#my');await sleep(800);
await ev(D,()=>pickProfile(0));await sleep(1500);
console.log('13 D kimlik:',await ev(D,()=>FR.pid),'=',ca,' pk sahibi D?',S.store['pk/'+ca].u.startsWith('D_'),' D arkadaşlar:',await ev(D,()=>JSON.stringify(FR.list)));
// A eski telefon artık kimliği yazamaz (pl)
console.log('14 A eski telefon yazma:',await ev(A,a=>devAuth().then(fb=>fb.setDoc(fb.doc(CL.db,'pl',a),{nick:'Ali',seen:Date.now(),v:1})).then(()=>'YAZDI',()=>'reddedildi'),ca));
// profil silme + arkadaşlıkları sil (B)
await ev(B,()=>{go('profiles');askDelProfile(0)});await sleep(200);await B.click('#my');await sleep(700);
console.log('15 ikinci soru:',await ev(B,()=>document.querySelector('#ov p')&&document.querySelector('#ov p').innerText.replace(/\n/g,' ')));
await B.click('#my');await sleep(1500);
console.log('16 silindi:',!S.store['pl/'+cb],!S.store['pk/'+cb],Object.keys(S.store).filter(k=>k.startsWith('fr/')).length,' D arkadaşlar:',await ev(D,()=>JSON.stringify(FR.list)));
console.log('log',S.log);await b.close()})();
