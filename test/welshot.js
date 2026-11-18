// Karşılama sahnesi görüntüleri: node test/welshot.js klasör
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});
const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript(()=>{localStorage.setItem('mc_mmus','false');Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})});
await p.goto(U);for(let i=0;i<5;i++){await sleep(900);await p.screenshot({path:out+'/w'+i+'.png'})}
await p.mouse.click(195,420);await sleep(250);await p.screenshot({path:out+'/w_tk.png'});await sleep(500);await p.screenshot({path:out+'/w_hop.png'});
console.log('hata',errs);await b.close()})();
