const {chromium}=require('playwright');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[30,120]});
const mk=async(pid)=>{const ctx=await b.newContext({viewport:{width:360,height:740}});return S.phone(ctx,pid,U)};
const ev=(p,f,a)=>p.evaluate(f,a);
// 1) yedek
const A=await mk('A');
await ev(A,()=>{localStorage.setItem('mc_profiles','["Ali","Veli"]');var r=[];for(var i=0;i<260;i++)r.push({id:i,p:i%5?'Ali':'Veli',t:new Date().toISOString(),op:'add',s:i,ok:1,bad:0,qs:[{q:'1+1',a:2,ok:true,s:1}],k:'g'});localStorage.setItem('mc_records',JSON.stringify(r));localStorage.setItem('mc_best',JSON.stringify({Ali:{add:55}}))});
await ev(A,()=>{st.profile='Ali';st.g={op:'add',sid:999,t:new Date().toISOString(),score:7,ok:1,bad:0,log:[],race:null};gSave()});
console.log('1 kırpma:',await ev(A,()=>{var r=records();return 'toplam='+r.length+' Ali='+r.filter(x=>x.p==='Ali').length+' Veli='+r.filter(x=>x.p==='Veli').length+' son='+r[r.length-1].id}));
await ev(A,()=>bkRun(true));await sleep(800);
const code=await ev(A,()=>ls('mc_bk',''));const key='bk/'+code;
console.log('2 yedek:',code,!!S.store[key],'boyut',S.store[key]&&S.store[key].d.length);
await ev(A,()=>go('profiles'));console.log('3 profil ekranı:',await ev(A,()=>document.body.innerText.replace(/\n+/g,' | ').slice(-330)));await A.screenshot({path:'v1.png',fullPage:true});
// 2. kez: değişiklik yok → yazma yok
const ts1=S.store[key].ts;await ev(A,()=>bkRun());await sleep(500);console.log('4 değişmeden tekrar yazdı mı:',S.store[key].ts!==ts1);
// gSave sonrası otomatik (15 sn)
await ev(A,()=>{st.g={op:'add',sid:1000,t:new Date().toISOString(),score:9,ok:1,bad:0,log:[],race:null};gSave()});await sleep(16000);
console.log('5 oyundan sonra otomatik yedek:',S.store[key].ts!==ts1);
// geri yükleme B
const B=await mk('B');await ev(B,()=>go('profiles'));
console.log('6 B profil (boş):',await ev(B,()=>document.body.innerText.replace(/\n+/g,' | ')));
await ev(B,()=>go('bkr'));await B.fill('#bk-in',code.slice(0,4).toLowerCase()+'-'+code.slice(4,8)+' '+code.slice(8));await ev(B,()=>bkRestore());await sleep(600);
console.log('7 bulundu:',await ev(B,()=>document.querySelector('#ov p')&&document.querySelector('#ov p').innerText));
await B.click('#my');await sleep(1200);
console.log('8 geri yüklendi:',await ev(B,()=>JSON.stringify([profiles(),records().length,ls('mc_best',{})])));
const codeB=await ev(B,()=>ls('mc_bk',''));console.log('9 B yeni kod:',codeB,codeB!==code,!!S.store['bk/'+codeB]);
// A eski kodla yazmaya devam edebilir; B eski koda yazamaz
await ev(B,c=>{lsSet('mc_bk',c);localStorage.removeItem('mc_bkh')},code);await ev(B,()=>bkRun(true));await sleep(600);
console.log('10 B eski koda yazmayı denedi → kod sıfırlandı:',await ev(B,()=>ls('mc_bk','')),S.log.filter(x=>/bk/.test(x)));
// yanlış kod
await ev(B,()=>go('bkr'));await B.fill('#bk-in','ABCD-EFGH-ZZ');await ev(B,()=>bkRestore());await sleep(600);console.log('11 yanlış kod:',await ev(B,()=>document.getElementById('toast').textContent));
// 3) canavar menüsü
await ev(A,()=>{st.profile='Ali';go('home');go('gmenu')});console.log('12 gmenu:',await ev(A,()=>document.body.innerText.replace(/\n+/g,' | ').slice(-160)));
await ev(A,()=>botOpen('gmenu'));await ev(A,()=>back());console.log('13 geri →',await ev(A,()=>st.screen));
await ev(A,()=>{botOpen('gmenu');botPick('y');botGo('add',0)});await sleep(8000);await ev(A,()=>back());await ev(A,()=>document.getElementById('my').click());await sleep(300);console.log('14 canavardan çıkış →',await ev(A,()=>st.screen));
await ev(A,()=>{go('home')});console.log('15 home kart:',await ev(A,()=>document.body.innerText.match(/Yarış Odası[^|]*\|?[^|]*/)[0].replace(/\n/g,' ')));
await ev(A,()=>go('rooms'));console.log('16 rooms:',await ev(A,()=>document.querySelector('.sub').innerText));
await A.screenshot({path:'v2.png',fullPage:true});
await ev(A,()=>gPick('mul'));await A.screenshot({path:'v3.png',fullPage:true});
console.log('log',S.log);await b.close()})();
