const {chromium}=require('playwright');const fs=require('fs');const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();
const bk=async p=>{try{await p.evaluate(()=>history.back())}catch(e){}await sleep(400)};
const scen=async(name,reloads)=>{const p=await (await b.newContext({viewport:{width:390,height:844}})).newPage();await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
  await p.goto('about:blank');await p.goto(U);
  for(let r=0;r<=reloads;r++){await p.click('text=Haydi Başlayalım!');await sleep(200);await p.evaluate(()=>{localStorage.setItem('mc_profiles','["Ali"]');pickProfile(0)});await p.click('text=Problemler');await sleep(150);if(r<reloads){await p.evaluate(()=>location.reload());await sleep(800)}}
  console.log(name,'geçmiş uzunluğu:',await p.evaluate(()=>history.length));
  for(let i=0;i<6;i++){const sc=await p.evaluate(()=>st.screen+(st.modal?'+soru':''));if(sc==='welcome+soru')break;await bk(p)}
  console.log('  çıkış sorusu:',await p.evaluate(()=>st.modal&&document.querySelector('#ov p').innerText));
  await p.click('#my');await sleep(1500);
  console.log('  Evet sonrası adres:',p.url().slice(0,30));
};
await scen('A tek oturum',0);await scen('B 2 kez yenilenmiş',2);
// C: Hayır → kal; tekrar geri → yine sorar
const p=await (await b.newContext()).newPage();await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await p.goto('about:blank');await p.goto(U);await p.mouse.click(200,300);await sleep(200);
await bk(p);console.log('C soru:',await p.evaluate(()=>st.modal));await p.click('#mn');await sleep(300);console.log('  Hayır → ',p.url().slice(0,20),await p.evaluate(()=>st.screen));
await bk(p);console.log('  tekrar geri soru:',await p.evaluate(()=>st.modal));
await b.close()})();
