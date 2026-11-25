// S72 karşılama: tam ekran sahne, taşma/çakışma, gıdıklama, Haydi Başlayalım. node test/wel2.js [klasör]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2]||'/tmp/wel2';fs.mkdirSync(out,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});
for(const [w,h,th] of [[390,844,''],[320,568,''],[390,844,'dark'],[320,568,'hc'],[844,390,'']]){
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:2});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
  await p.addInitScript(t=>{localStorage.setItem('mc_mmus','false');if(t)localStorage.setItem('mc_theme',t)},th);
  await p.goto(U);await sleep(1500);
  if(th)await p.evaluate(t=>{try{document.documentElement.setAttribute('data-theme',t)}catch(e){}},th);
  const tag=w+'x'+h+(th?'-'+th:'');
  await p.screenshot({path:out+'/w-'+tag+'.png'});
  const g=await p.evaluate(()=>{const R=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right,w:r.width,h:r.height}};
    return {h1:R('.wsc .wh'),cv:R('#mon'),go:R('.wgo'),ln:R('.wln'),th:R('.thbtn'),mm:R('#mm-btn'),sc:R('.wsc'),CHH:CH.H,cw:document.getElementById('mon').width,ch:document.getElementById('mon').height,
      sw:document.documentElement.scrollWidth,iw:innerWidth,ih:innerHeight,welc:document.body.classList.contains('welc'),mmsvg:!!document.querySelector('#mm-btn svg'),font:document.fonts.check('800 40px MCB')}});
  ok(g.welc&&g.sc.t===0&&g.sc.h===g.ih&&g.sc.w===g.iw,tag+' tam ekran sahne');
  ok(g.sw<=g.iw,tag+' yatay taşma yok');
  ok(g.cv.t>=g.h1.b-1&&g.cv.b<=g.go.t+1,tag+' tuval başlık ile düğme arasında');
  ok(g.ln.b<=g.ih,tag+' bağlantılar ekranda');
  ok(g.th.b<g.h1.t+30&&g.mm.b<g.h1.t+30&&g.mmsvg,tag+' köşe düğmeleri (svg)');
  ok(Math.abs(g.CHH/480-g.cv.h/g.cv.w)<0.01&&Math.abs(g.ch/g.cw-g.cv.h/g.cv.w)<0.01,tag+' CH.H oranı '+g.CHH);
  ok(g.font,tag+' MCB yazı tipi');
  if(!th&&w<h){
    const c=await p.evaluate(()=>{const r=document.getElementById('mon').getBoundingClientRect(),m=CH.m;return {x:r.left+m.x*r.width/CH.W,y:r.top+m.y*r.height/CH.H}});
    await p.mouse.click(c.x,c.y);await sleep(150);ok(await p.evaluate(()=>CH.m.tk>0||CH.m.hop>0),tag+' canavar gıdıklandı');
    await p.screenshot({path:out+'/w-'+tag+'-tk.png'});await sleep(900);
    await p.click('text=Haydi Başlayalım!');await sleep(400);
    ok(await p.evaluate(()=>['profiles','info'].indexOf(st.screen)>=0&&!document.body.classList.contains('welc')&&!document.querySelector('#mm-btn svg')),tag+' Haydi Başlayalım → '+await p.evaluate(()=>st.screen));
    if(await p.evaluate(()=>st.screen==='info')){await p.evaluate(()=>infoOk());await sleep(300);ok(await p.evaluate(()=>st.screen==='profiles'),tag+' → profiles')}
    await p.evaluate(()=>back());await sleep(500);ok(await p.evaluate(()=>st.screen==='welcome'&&!!CH.raf&&document.body.classList.contains('welc')),tag+' geri → karşılama, sahne çalışıyor');
  }
  if(w>h){await p.setViewportSize({width:390,height:844});await sleep(400);const r=await p.evaluate(()=>({H:CH.H,a:document.getElementById('mon').getBoundingClientRect()}));ok(Math.abs(r.H/480-r.a.height/r.a.width)<0.01,'döndürme sonrası CH.H '+r.H);await p.screenshot({path:out+'/w-rot.png'})}
  ok(!errs.length,tag+' sayfa hatası yok '+errs.join('|'));
  await p.close();
}
await b.close();console.log(fail?fail+' HATA':'HEPSİ GEÇTİ');process.exit(fail?1:0)})();
