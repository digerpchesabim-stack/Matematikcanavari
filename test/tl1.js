// Talim Alanı: hikâye → talim → harita; 🎯 ile yeniden; 5 doğruda biter
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const http=require('http');
const ROOT=path.resolve(__dirname,'..');
const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html':f.endsWith('.webp')?'image/webp':f.endsWith('.mp4')?'video/mp4':'application/octet-stream'});r.end(d)})}).listen(8799);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let ok=1;const T=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)ok=0};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));await p.addInitScript(()=>{localStorage.setItem('mc_mmus','false');localStorage.setItem('mc_info','1')});
await p.goto('http://localhost:8799/index.html');await sleep(800);
await p.evaluate(()=>{guest&&guest()});await sleep(500);
await p.evaluate(()=>guOpen());await sleep(600);T(await p.evaluate(()=>st.screen)==='guintro','ilk girişte hikâye');
await p.evaluate(()=>guIntroEnd());await sleep(900);T(await p.evaluate(()=>st.screen)==='gutalim','hikâyeden sonra talim');
T(await p.evaluate(()=>!!window.__TL&&__TL.Q.p.length===3),'3 hedef kalktı');
for(let i=0;i<14&&await p.evaluate(()=>__TL.Q.n)<5;i++){await sleep(1800);await p.evaluate(()=>__TL.hit(true));console.log('  n=',await p.evaluate(()=>[__TL.Q.n,__TL.Q.wait,__TL.Q.p.map(x=>x.st+':'+x.ok).join(' ')]))}
await sleep(3500);T(await p.evaluate(()=>document.getElementById('tl-end').classList.contains('on')),'5 doğruda bitiş kartı');
await p.screenshot({path:'/tmp/claude-0/-home-claude/9becbd04-1c45-5b9d-a585-070fb6122bc2/scratchpad/tl_app.png'});
await p.click('#tl-go');await sleep(800);T(await p.evaluate(()=>st.screen)==='gumap','haritaya geçti');
T(await p.evaluate(()=>guD().t===1),'talim bayrağı kaydedildi');
await p.evaluate(()=>guOpen());await sleep(500);T(await p.evaluate(()=>st.screen)==='gumap','ikinci girişte doğrudan harita');
await p.click('button[aria-label="Talim alanı"]');await sleep(600);T(await p.evaluate(()=>st.screen)==='gutalim','🎯 talime açar');
await p.evaluate(()=>back());await sleep(500);T(await p.evaluate(()=>st.screen)==='gumap','geri → harita');
T(await p.evaluate(()=>roomIco('duel').indexOf('<svg')>=0&&RKA.emblem(2).indexOf('NaN')<0),'oda ve rütbe simgeleri bozulmadı');
T(errs.length===0,'sayfa hatası yok '+JSON.stringify(errs));
console.log(ok?'HEPSİ GEÇTİ':'HATA VAR');await b.close();srv.close()})();
