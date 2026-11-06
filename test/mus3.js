// S54: iPhone gibi ses seviyesi koddan değişmeyen tarayıcıda menü müziği kapat/aç ve oyun ekranında susma
const {chromium}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const U='file://'+require('path').resolve(__dirname,'../index.html');
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{const b=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
for(const ios of [true,false]){
  const ctx=await b.newContext({viewport:{width:390,height:844}});const p=await ctx.newPage();
  await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
  if(ios)await p.addInitScript(()=>{Object.defineProperty(HTMLMediaElement.prototype,'volume',{get(){return 1},set(v){},configurable:true})});
  await p.goto(U);await sleep(500);await p.click('canvas#mon',{force:true});await sleep(1500);
  const S=()=>p.evaluate(()=>({p:MM.el?MM.el.paused:null,on:MM.on,vol:MM.vol,btn:(document.getElementById('mm-btn')||{}).textContent}));
  const n=ios?'iPhone':'Android';
  let s=await S();console.log(' ',n,JSON.stringify(s));ok(s.p===false,n+': müzik çalıyor');ok(s.vol===!ios,n+': ses seviyesi ayarlanabilir mi = '+!ios);
  await p.click('#mm-btn');await sleep(800);s=await S();ok(s.p===true&&s.on===false&&s.btn==='🔇',n+': 🔇 müziği durdurdu '+JSON.stringify(s));
  await p.click('#mm-btn');await sleep(800);s=await S();ok(s.p===false&&s.on===true&&s.btn==='🎵',n+': 🎵 yeniden çaldı '+JSON.stringify(s));
  await p.click('#mm-btn');await sleep(300);await p.click('#mm-btn');await sleep(800);s=await S();ok(s.p===false&&s.on===true,n+': hızlı kapat-aç sonrası çalıyor');
  await p.evaluate(()=>{st.screen='quiz';mmUpdate()});await sleep(800);s=await S();ok(s.p===true,n+': oyun ekranında sustu');
  await p.evaluate(()=>{st.screen='home';mmUpdate()});await sleep(800);s=await S();ok(s.p===false,n+': menüye dönünce yeniden çaldı');
  await ctx.close();
}
await b.close();console.log(fail?'HATA':'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
