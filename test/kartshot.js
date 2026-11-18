// Karakter kartı görüntüsü: node test/kartshot.js klasör [tema]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];const th=process.argv[3]||'light';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({args:['--allow-file-access-from-files']});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(String(e.message||e)));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript(t=>{try{localStorage.setItem('mc_mmus','false');localStorage.setItem('mc_info','1');localStorage.setItem('mc_theme',JSON.stringify(t));Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}},th);
await p.goto(U);await sleep(900);
await p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦁 Kral Aslan']));NMS.busy=true;st.profile='🦁 Kral Aslan';go('kart');if(st.modal)closeModal();RK.q=[]});
await sleep(1500);
await p.screenshot({path:path.join(out,'kart_'+th+'.png'),fullPage:true});
console.log('hata',errs);await b.close()})();
