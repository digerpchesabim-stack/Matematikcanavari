// S74: tekrar etmeyen sorular, Güneş Ülkesi sayaçları, paylaşım kartları, zafer sayfası, madalyalar, bekçi hamleleri.
// Kullanım: node test/s74.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');const http=require('http');
const ROOT=path.resolve(__dirname,'..');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
const MT={'.html':'text/html','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json','.mp4':'video/mp4'};
const srv=http.createServer((q,s)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){s.writeHead(404);s.end();return}s.writeHead(200,{'Content-Type':MT[path.extname(f)]||'application/octet-stream'});s.end(d)})});
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});await new Promise(r=>srv.listen(0,r));const U='http://127.0.0.1:'+srv.address().port+'/index.html';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:out?2:1});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(String(e.message||e)));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript(()=>{try{localStorage.setItem('mc_mmus','false');localStorage.setItem('mc_info','1')}catch(e){}});
await p.goto(U);await sleep(900);
const shot=async n=>{if(out)await p.screenshot({path:path.join(out,n+'.png')})};
const E=(f,a)=>p.evaluate(f,a);
await E(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦁 Kral Aslan']));NMS.busy=true;st.profile='🦁 Kral Aslan';
  var a={};a['🦁 Kral Aslan']={c:48,s:{},h:1,t:1,zk:'o'};localStorage.setItem('mc_gu',JSON.stringify(a));go('home');if(st.modal)closeModal();RK.q=[]});
await sleep(300);
// 1) tekrar yok
ok(await E(()=>{var sv=st.g,seen={},rep=0;st.g={op:'add',lv:'k',tb:0,lastTxt:'',seen:{}};try{for(var i=0;i<40;i++){var q=gQ0(),k=gSeenK('add',q.txt);if(seen[k])rep++;seen[k]=1}}finally{st.g=sv}return rep===0}),'Akıldan İşlem: 40 soruda tekrar yok (a+b = b+a)');
ok(await E(()=>{var sv=st.g,n=0;st.g={op:'mul',lv:'k',tb:7,lastTxt:'',seen:{}};try{var s={};for(var i=0;i<9;i++){s[gQ0().txt.replace(/(\d+) × (\d+)/,(m,a,b)=>Math.min(a,b)+'x'+Math.max(a,b))]=1}n=Object.keys(s).length;gQ0()}finally{st.g=sv}return n===9}),'7’ler tablosu: 9 sorunun hepsi farklı, bitince yeniden başlar');
ok(await E(()=>{var a=[],b=[],sv=st.g;function run(arr){RNG=mulb(5);st.g={op:'add',lv:'o',tb:0,lastTxt:''};for(var i=0;i<12;i++)arr.push(gQ0().txt)}try{run(a);run(b)}finally{RNG=null;st.g=sv}return a.join()===b.join()}),'tohumlu dizi (seen yok) aynı kalır');
ok(await E(()=>/seen:\{\}/.test(String(gStart))&&!/seen/.test(String(raceStart||''))),'seen yalnız tek kişilik oyunda');
// 2) durak sayaçları
ok(await E(()=>{var x0=rkGet(st.profile).q||0;guStopOpen(1);GQ.ok=9;GQ.i=10;guStopEnd();var x1=rkGet(st.profile).q||0;guToMap();return x1-x0===9}),'durak doğruları Soru Ustası sayacına (+9)');
// 3) Taş Dev zırhı (Orta)
await E(()=>{guZSet('o');guToMap()});await sleep(200);
await E(()=>{GU.spd=0.2;guDuelOpen(36)});await sleep(1500);await E(()=>guFight());await sleep(400);
ok(await E(()=>GD.arm===1&&/zırh/.test(document.getElementById('gd-m').textContent)),'Taş Dev zırh giydi (mesaj)');
await E(()=>{var i=GD.q.opts.findIndex(o=>o.v===GD.q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])});await sleep(100);
ok(await E(()=>GD.arm===0&&GD.hp===GD.hx),'ilk doğru zırhı kırar, can gitmez');
await shot('01_armor');
await E(()=>{guToMap()});await sleep(300);
// 4) Büyücü karıştırma: doğru şık doğru işaretlenir
await E(()=>{guDuelOpen(47)});await sleep(1500);await E(()=>{guFight();Math.random=(r=>()=>0.1)(Math.random)});await sleep(300);
for(let k=0;k<3;k++){await E(()=>{if(GD.ph==='fight'&&!GD.res){var i=GD.q.opts.findIndex(o=>o.v===GD.q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])}});await sleep(600)}
await sleep(400);
ok(await E(()=>{var a=document.getElementById('gd-a');return !!a}),'büyücü düellosu sürüyor');
ok(await E(()=>{if(!GD||GD.ph!=='fight')return false;var q=GD.q,bs=[...document.querySelectorAll('#gd-a .ani')];var order=bs.map(b=>b.querySelector('.an').textContent).join();var orig=q.opts.map(o=>String(o.v)).join();guShow();var okb=bs.filter(b=>b.classList.contains('ok'));return okb.length===1&&okb[0].querySelector('.an').textContent===String(q.ans)}),'karıştırmadan sonra doğru şık doğru işaretlenir');
await shot('02_wizard');
await E(()=>{guToMap()});await sleep(300);
// 5) Kral öfkesi
await E(()=>{guDuelOpen(49)});await sleep(1500);await E(()=>guFight());await sleep(300);
await E(()=>{GD.hp=Math.floor(GD.hx/2)+1;var i=GD.q.opts.findIndex(o=>o.v===GD.q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])});await sleep(600);
ok(await E(()=>GD.rage>=1),'Sis Kralı yarı canda öfkelenir');
await sleep(800);
ok(await E(()=>/öfkelendi/.test(document.getElementById('gd-m').textContent)),'öfke mesajı');
// 6) zafer → zafer sayfası
await E(()=>{GD.hp=1;var i=GD.q.opts.findIndex(o=>o.v===GD.q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])});await sleep(3000);
ok(await E(()=>GD&&GD.ph==='win'&&!!document.querySelector('[onclick="guEnd()"]')),'Sis Kralı yenildi → Zafer sayfası düğmesi');
await E(()=>guEnd());await sleep(1600);
ok(await E(()=>GD.ph==='end'&&/kurtardın/.test(document.querySelector('.gend-t').textContent)&&/Muhafızı/.test(document.querySelector('.gend-md').textContent)),'zafer sayfası + Orta madalyası');
await shot('03_end');
// 7) kart çizimi
const cards=await E(async()=>{var r={};for(const [k,o] of [['spider',{c:'spider',nm:GUACC.spider,pl:GUP[12],n:12,stars:3,li:3,z:'o',boss:1,nick:'🦁 Kral Aslan'}],['wolf',{c:'wolf',nm:GUACC.wolf,pl:GUP[16],n:16,stars:2,li:2,z:'k',boss:0,nick:'🦁 Kral Aslan'}],['fin',{c:'knight',fin:true,z:'z',nick:'🦁 Kral Aslan',S:{w:15,L:62,s:96}}]]){
  var im=await Promise.all([guImg(o.fin?'mc-trophy.webp':'gu/'+o.c+'.webp'),guImg('mc-k-cheer.webp')]);var cv=document.createElement('canvas');guCardDraw(cv,o,im[0],im[1]);r[k]=cv.toDataURL('image/png')}return r});
for(const k in cards){if(out)fs.writeFileSync(path.join(out,'kart_'+k+'.png'),Buffer.from(cards[k].split(',')[1],'base64'));ok(cards[k].length>200000,'kart çizildi: '+k)}
// 8) madalya kartta
await E(()=>{guToMap();go('kart')});await sleep(600);
ok(await E(()=>!!document.querySelector('.kc-gu .gmd-o')),'karakter kartında Güneş Muhafızı madalyası');
await shot('04_kart');
// 9) paylaş düğmesi yaratık zaferinde
await E(()=>{guZSet('k');go('gumap')});await sleep(300);
await E(()=>{guDuelOpen(4)});await sleep(1500);await E(()=>{guFight()});await sleep(300);await E(()=>{GD.hp=1;var i=GD.q.opts.findIndex(o=>o.v===GD.q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])});await sleep(2600);
ok(await E(()=>GD.ph==='win'&&!!document.querySelector('.gshr')),'yaratık zaferinde Zafer kartını paylaş');
ok(await E(()=>GD.arm===0||GD.arm===undefined),'Kolay’da hamle yok');
await sleep(2500);await shot('05_win');
ok(!errs.length,'sayfa hatası yok '+errs.join(' | '));
console.log(fail?fail+' HATA':'HEPSİ GEÇTİ');await b.close();srv.close();process.exit(fail?1:0)})();
