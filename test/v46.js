// Sürüm 46: emoji oyun adları, eski profillerin otomatik dönüşümü, ad kaydı, misafir
const {chromium}=require('playwright');const path=require('path');
const U=process.env.MC_URL||'file://'+path.resolve(__dirname,'../index.html');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const OUT=process.env.OUT||'.';
(async()=>{const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[30,120]});
const ev=(p,f,a)=>p.evaluate(f,a);const nmKeys=()=>Object.keys(S.store).filter(k=>k.startsWith('nm/')).sort();
const ctx=()=>b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
// B telefonu önce "Cesur Panda" adını alır
const B=await S.phone(await ctx(),'B',U);await sleep(300);
await ev(B,()=>{peOpen(-1);peSet(0)});await sleep(900);
console.log('1 B durum:',await ev(B,()=>document.getElementById('pe-st').textContent));
await B.screenshot({path:OUT+'/n_new.png'});
await ev(B,()=>peSave());await sleep(900);
console.log('2 B profil:',await ev(B,()=>JSON.stringify([profiles(),st.profile,st.screen,nmMap()])),nmKeys());
// A telefonu: eski sürüm verisi (düz adlar) — önce eski verileri kur
const A=await S.phone(await ctx(),'A',U);await sleep(400);
await ev(A,()=>{NMS.busy=true;localStorage.setItem('mc_profiles',JSON.stringify(['Ali','Ayşe']));
  localStorage.setItem('mc_records',JSON.stringify([{p:'Ali',dt:Date.now(),ok:5,fix:0,bad:1},{p:'Ayşe',dt:Date.now(),ok:3,fix:0,bad:0}]));
  localStorage.setItem('mc_best',JSON.stringify({Ali:{add:40},'Ayşe':{sub:12}}));
  localStorage.setItem('mc_rhist',JSON.stringify([{p:'Ali',score:9}]));localStorage.setItem('mc_dhist',JSON.stringify([{p:'Ayşe',w:1}]));
  st.profile='Ali';});
const pidA=await ev(A,()=>frEnsure());await sleep(300);
await ev(A,()=>lbSubmit('solo','add','k',40,40,'Ali'));
await ev(A,()=>{localStorage.setItem('mc_gnick',JSON.stringify('KötüAd'));return lbSubmit('solo','sub','k',7,7,'KötüAd')});
const uidA=await ev(A,()=>CL.user.uid);
console.log('3 eski durum: pl',JSON.stringify(S.store['pl/'+pidA]),' lb',S.store['lbg_add/'+uidA].nick,S.store['lbg_sub/'+uidA].nick);
// yeni sürüm açılır → dönüşüm
await A.reload();await sleep(4000);
const st1=await ev(A,()=>({p:profiles(),nm:nmMap(),q:ls('mc_nmnew',[]),rec:records().map(r=>r.p),best:Object.keys(ls('mc_best',{})),rh:ls('mc_rhist',[]).map(x=>x.p),dh:ls('mc_dhist',[]).map(x=>x.p),pid:Object.keys(ls('mc_pid',{})),g:ls('mc_gnick',null)}));
console.log('4 dönüşüm:',JSON.stringify(st1));
console.log('5 bulut: pl',S.store['pl/'+pidA].nick,' lb_add',S.store['lbg_add/'+uidA].nick,S.store['lbg_add/'+uidA].score,' lb_sub',S.store['lbg_sub/'+uidA].nick,' nm',nmKeys());
await ev(A,()=>go('profiles'));await sleep(300);await A.screenshot({path:OUT+'/n_profiles.png'});
console.log('6 profil ekranı:',await ev(A,()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,260)));
// S53: birden çok karakter → seçim ekranı; seçilen karakterin otomatik verilen adı bir kez değiştirilebilir
await ev(A,()=>migRun(profiles()[0]));for(let i=0;i<60&&!(await ev(A,()=>st.screen==='home'&&st.modal));i++)await sleep(100);
console.log('7 kart:',await ev(A,()=>st.modal&&document.querySelector('#ov p').innerText.replace(/\n+/g,' ')));await A.screenshot({path:OUT+'/n_card.png'});
await A.click('#mn');await sleep(500);
console.log('8 ekran:',await ev(A,()=>st.screen+' ret='+st.pe.ret));
await ev(A,()=>{peSet(0)});await sleep(900);
console.log('9 Cesur Panda durumu:',await ev(A,()=>document.getElementById('pe-st').textContent));
await A.screenshot({path:OUT+'/n_edit_taken.png'});
await ev(A,()=>{peSet(1)});await sleep(900);
console.log('10 Kurnaz Tilki durumu:',await ev(A,()=>document.getElementById('pe-st').textContent));
const before=nmKeys();
await ev(A,()=>peSave());await sleep(300);await A.click('#my');await sleep(1500);
console.log('11 kaydet:',await ev(A,()=>JSON.stringify([st.screen,st.profile,profiles(),Object.keys(ls('mc_best',{})),ls('mc_nmnew',[])])),' nm önce',before,' sonra',nmKeys(),' pl',S.store['pl/'+pidA]&&S.store['pl/'+pidA].nick,' lb',S.store['lbg_add/'+uidA]&&S.store['lbg_add/'+uidA].nick);
await ev(A,()=>{peOpen(-1);peSet(0);peSave()});await sleep(500);
console.log('12 ikinci karakter:',await ev(A,()=>JSON.stringify([profiles(),st.screen,document.getElementById('toast').textContent])));
await ev(A,()=>{nmAsk(st.profile)});await sleep(700);console.log('13 tekrar değiştirme kartı (çıkmamalı):',await ev(A,()=>st.modal));
// misafir
await ev(A,()=>{guest();var g={op:'add',lv:'k',score:15};lbRun(g,'solo',15,lbNick());window.__g=g});await sleep(500);
console.log('14 misafir:',await ev(A,()=>JSON.stringify([rmNick(),window.__g.lb])),' lb_add hâlâ',S.store['lbg_add/'+uidA].nick,S.store['lbg_add/'+uidA].score);
await ev(A,()=>go('rooms'));await sleep(200);console.log('15 yarış odası misafir:',await ev(A,()=>document.body.innerText.slice(0,200).replace(/\n+/g,' | ')));
// kapışma: B (Cesur Panda) vs A (Kurnaz Tilki) adları
await ev(A,()=>{st.profile=profiles()[0];go('home')});
console.log('log',S.log.filter(x=>!/nm taken/.test(x)),' nm taken:',S.log.filter(x=>/nm taken/.test(x)).length);
await b.close()})();
