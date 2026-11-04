const {chromium}=require('playwright');const fs=require('fs');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const errs=[];
const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await p.goto(U);await sleep(800);
await p.evaluate(()=>themeOpen());await sleep(200);await p.screenshot({path:'t_pick.png'});
await p.click('text=📜 Sepya');await sleep(200);console.log('attr:',await p.evaluate(()=>document.documentElement.getAttribute('data-theme')+' kayıt='+localStorage.getItem('mc_theme')+' meta='+document.querySelector('meta[name=theme-color]').content));
await p.click('#mn');
for(const t of ['sepia','dark','ocean','hc']){
  await p.evaluate(t=>{themeSet(t);closeModal();localStorage.setItem('mc_profiles','["Ali"]');st.profile='Ali';go('home')},t);await sleep(300);await p.screenshot({path:'t_home_'+t+'.png'});
  await p.evaluate(()=>{go('gmenu');gStart('add','k',0)});await sleep(6800);await p.screenshot({path:'t_game_'+t+'.png'});await p.evaluate(()=>{st.g.done=true;go('welcome')});await sleep(1500);await p.screenshot({path:'t_wel_'+t+'.png'});
}
// yeniden açınca tema hatırlanıyor mu (ilk boya)
await p.reload();await sleep(300);console.log('yeniden açılış:',await p.evaluate(()=>document.documentElement.getAttribute('data-theme')+' bg='+getComputedStyle(document.body).backgroundColor));
await p.evaluate(()=>themeSet('auto'));console.log('otomatik:',await p.evaluate(()=>document.documentElement.hasAttribute('data-theme')));
// geri tuşu pencereyi kapatır
await p.evaluate(()=>{closeModal();themeOpen()});await p.evaluate(()=>history.back());await sleep(300);console.log('geri tuşu kapattı:',await p.evaluate(()=>!st.modal));
console.log('errs',errs);await b.close()})();
