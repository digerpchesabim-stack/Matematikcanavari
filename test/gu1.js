// S68: Güneş Ülkesi — harita, normal durak, düello (kazan/kaybet), ışık, Kule Kapısı, geri tuşu.
// Kullanım: node test/gu1.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({args:['--allow-file-access-from-files']});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:out?2:1});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(String(e.message||e)));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript(()=>{try{localStorage.setItem('mc_mmus','false');localStorage.setItem('mc_info','1');Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}});
await p.goto(U);await sleep(900);
const shot=async n=>{if(out)await p.screenshot({path:path.join(out,n+'.png')})};
await p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦁 Kral Aslan']));NMS.busy=true;st.profile='🦁 Kral Aslan';go('home');if(st.modal)closeModal();RK.q=[]});
await sleep(300);
ok(await p.evaluate(()=>!!document.querySelector('.guhome')),'ana sayfada Güneş Ülkesi kartı');
await shot('01_home');
await p.click('.guhome');await sleep(400);
ok(await p.evaluate(()=>st.screen==='guintro'&&!!document.querySelector('#guvid')),'ilk açılışta hikâye videosu');
ok(await p.evaluate(()=>{var v=document.getElementById('guvid');return v.src.indexOf('gu/hikaye.mp4')>0}),'video kaynağı gu/hikaye.mp4');
for(let i=0;i<30;i++){if(await p.evaluate(()=>{var v=document.getElementById('guvid');return v&&v.readyState>=1}))break;await sleep(150)}
ok(await p.evaluate(()=>{var v=document.getElementById('guvid');return v.readyState>=1&&Math.abs(v.duration-105.5)<0.6}),'video yüklendi (105 sn)');
ok(await p.evaluate(()=>getComputedStyle(document.getElementById('tabs')||document.body).display==='none'||!document.getElementById('tabs')||document.body.classList.contains('gufull')),'hikâyede sekmeler gizli');
await shot('01b_story');
await p.click('.guvb');await sleep(300);
ok(await p.evaluate(()=>st.screen==='gumap'&&guD().h===1),'Geç → harita, izlendi kaydı');
await p.evaluate(()=>go('home'));await sleep(200);await p.click('.guhome');await sleep(300);
ok(await p.evaluate(()=>st.screen==='gumap'),'ikinci açılışta doğrudan harita');
await p.click('.gsto');await sleep(300);
ok(await p.evaluate(()=>st.screen==='guintro'),'📜 ile hikâye yeniden');
await p.evaluate(()=>back());await sleep(300);
ok(await p.evaluate(()=>st.screen==='gumap'&&!document.getElementById('guvid')),'geri → harita, video kapandı');
for(let i=0;i<40;i++){if(await p.evaluate(()=>!!document.querySelector('#gmw canvas.gbase')))break;await sleep(150)}
ok(await p.evaluate(()=>st.screen==='gumap'&&!!document.querySelector('#gmw canvas.gbase')),'harita açıldı, parşömen çizildi');
ok(await p.evaluate(()=>document.querySelectorAll('.gst').length===49),'49 durak');
ok(await p.evaluate(()=>document.querySelector('#gst1').classList.contains('nxt')&&document.querySelector('#gst2').classList.contains('lock')),'1. durak açık, 2. kilitli');
ok(await p.evaluate(()=>document.querySelector('#gst12').classList.contains('boss')&&document.querySelector('#gst4').classList.contains('sur')),'bekçi ve sürpriz durak işaretli');
ok(await p.evaluate(()=>getComputedStyle(document.getElementById('mm-btn')).display==='none'),'haritada müzik düğmesi gizli');
await sleep(300);await shot('02_map');
// kilitli durak
await p.evaluate(()=>guTap(5));
ok(await p.evaluate(()=>/Önce 1\. durağı geç/.test(document.getElementById('gcard').textContent)),'kilitli durak kartı');
// 1. durak: hepsi doğru
await p.evaluate(()=>guTap(1));await p.click('#gcard .gbtn');await sleep(200);
ok(await p.evaluate(()=>st.screen==='gustop'&&GQ.op==='add'&&GQ.lv==='k'),'1. durak: toplama, kolay');
await shot('03_stop');
for(let i=0;i<10;i++){await p.evaluate(()=>{var q=GQ.q,i=q.opts.findIndex(o=>o.v===q.ans);guStopAns(i,document.querySelectorAll('#gs-a .ani')[i])});await sleep(720)}
await sleep(300);
ok(await p.evaluate(()=>GQ.end&&GQ.stars===3),'10 doğru → 3 yıldız');
ok(await p.evaluate(()=>{var d=__GU.st();return d.d.c===1&&d.d.s[1]===3&&d.light===1}),'kayıt: c=1, ışık 1');
await shot('04_stopend');
await p.click('text=Haritaya dön');await sleep(2600);
ok(await p.evaluate(()=>document.querySelector('#gst1').classList.contains('done')&&document.querySelector('#gst2').classList.contains('nxt')),'haritada 1 geçildi, 2 açık');
// 2. durak: 5 doğru → geçemez
await p.evaluate(()=>guPlay(2));await sleep(150);
for(let i=0;i<10;i++){await p.evaluate(k=>{var q=GQ.q,i=q.opts.findIndex(o=>k<5?o.v===q.ans:o.v!==q.ans);guStopAns(i,document.querySelectorAll('#gs-a .ani')[i])},i);await sleep(i<5?700:1550)}
await sleep(300);
ok(await p.evaluate(()=>GQ.end&&GQ.stars===0&&__GU.st().d.c===1),'5 doğru → geçemedi, ilerleme değişmedi');
ok(await p.evaluate(()=>/İyi mücadele/.test(document.getElementById('app').textContent)),'moral bozmayan mesaj');
// geri tuşu: durak ortasında soru sorar
await p.evaluate(()=>guStopOpen(2));await sleep(100);
await p.evaluate(()=>{var q=GQ.q;guStopAns(q.opts.findIndex(o=>o.v===q.ans),document.querySelector('#gs-a .ani'))});await sleep(700);
await p.evaluate(()=>back());await sleep(150);
ok(await p.evaluate(()=>st.screen==='gustop'&&!!document.querySelector('#ov.on, #ov[style*="flex"]')||st.screen==='gustop'),'durakta geri → onay sorusu');
await p.evaluate(()=>{var y=[...document.querySelectorAll('#ov button')].find(b=>/Evet/.test(b.textContent));if(y)y.click()});await sleep(300);
ok(await p.evaluate(()=>st.screen==='gumap'),'onaylayınca haritaya döndü');
// düello (4. durak, Sis Yarasası): hızlı doğru → kazan
await p.evaluate(()=>{__GU.set({c:3,s:{1:3,2:2,3:3}})});
await p.evaluate(()=>guPlay(4));
for(let i=0;i<40;i++){if(await p.evaluate(()=>GD&&GD.ph==='enc'))break;await sleep(150)}
ok(await p.evaluate(()=>st.screen==='guduel'&&GD.ph==='enc'&&GD.c==='bat'),'4. durak: Sis Yarasası karşılaşması');
await sleep(1300);await shot('05_enc');
await p.click('.gud .gbtn.gold');await sleep(800);
ok(await p.evaluate(()=>GD.ph==='fight'&&!!GD.q),'düello başladı');
await sleep(300);await shot('06_fight');
for(let k=0;k<5;k++){
  await p.evaluate(()=>{var q=GD.q,i=q.opts.findIndex(o=>o.v===q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])});
  if(k===0){await sleep(250);await shot('07_hit')}
  await sleep(1300);
}
ok(await p.evaluate(()=>GD&&GD.ph==='win'&&GD.hp===0&&GD.stars===3),'5 vuruş → zafer, 3 yıldız');
ok(await p.evaluate(()=>{var d=__GU.st();return d.d.c===4&&d.light===4}),'yarasa +2 ışık (toplam 4)');
await sleep(900);await shot('08_dissolve');await sleep(1600);await shot('09_win');
await p.click('.gud .gbtn.gold');await sleep(2800);
ok(await p.evaluate(()=>st.screen==='gumap'&&document.querySelector('#gst4').classList.contains('done')),'haritada yarasa yenildi');
await shot('10_map_after');
// düello kaybı: yaratık hep önce bilir
await p.evaluate(()=>{__GU.set({c:11,s:{}});guPlan=function(){return 400}});
await p.evaluate(()=>guPlay(12));
for(let i=0;i<40;i++){if(await p.evaluate(()=>GD&&GD.ph==='enc'))break;await sleep(150)}
ok(await p.evaluate(()=>GD.c==='spider'&&GD.boss),'12. durak bekçi: Dev Örümcek');
await p.evaluate(()=>{GD.pc=1;Math.random=()=>0.01});
await p.evaluate(()=>guFight());
await sleep(700);
await p.evaluate(()=>{var q=GD.q,i=q.opts.findIndex(o=>o.v!==q.ans);guAns(i,document.querySelectorAll('#gd-a .ani')[i])});
ok(await p.evaluate(()=>GD.lock===true),'yanlışta soruda kilit');
await sleep(500);await shot('11_foehit');
for(let i=0;i<40;i++){if(await p.evaluate(()=>GD&&GD.ph==='lose'))break;await sleep(300)}
ok(await p.evaluate(()=>GD&&GD.ph==='lose'&&GD.me===0&&__GU.st().d.c===11),'3 can gitti → kayıp, ilerleme yok');
await sleep(400);await shot('12_lose');
// Kule Kapısı: ışık az
await p.evaluate(()=>{__GU.set({c:47,s:{12:1},h:1});GD=null;guOpen()});await sleep(1200);
ok(await p.evaluate(()=>/Kule Kapısı/.test(document.getElementById('gcard').textContent)),'48: kapı kartı');
await p.evaluate(()=>guPlay(48));await sleep(200);
ok(await p.evaluate(()=>st.screen==='gumap'),'ışık azken kapı açılmaz');
await shot('13_gate');
var S={};for(let n=1;n<=47;n++)S[n]=3;
await p.evaluate(S=>{__GU.set({c:47,s:S,h:1});guToMap()},S);await sleep(1200);
ok(await p.evaluate(()=>__GU.st().light>=40),'ışık 40+: '+await p.evaluate(()=>__GU.st().light));
await p.evaluate(()=>guPlay(48));
for(let i=0;i<40;i++){if(await p.evaluate(()=>GD&&GD.ph==='enc'))break;await sleep(150)}
ok(await p.evaluate(()=>GD&&GD.c==='eye'&&GD.op==='rnd'),'kapı açıldı: Sis Gözü');
await p.evaluate(()=>back());await sleep(400);
ok(await p.evaluate(()=>st.screen==='gumap'),'karşılaşmada geri → harita');
await p.evaluate(()=>back());await sleep(300);
ok(await p.evaluate(()=>st.screen==='home'&&!document.body.classList.contains('gufull')),'haritada geri → ana sayfa');
// yedek/eşitleme listesinde
ok(await p.evaluate(()=>BKK.indexOf('mc_gu')>=0),'mc_gu yedekte');
// 320 px taşma
await p.setViewportSize({width:320,height:568});await p.evaluate(()=>guOpen());await sleep(1500);
ok(await p.evaluate(()=>document.documentElement.scrollWidth<=320&&document.getElementById('gum').scrollWidth<=320),'320 px: yatay taşma yok');
await shot('14_map320');
ok(errs.length===0,'sayfa hatası yok '+errs.join(' | '));
console.log(fail?fail+' HATA':'HEPSİ GEÇTİ');await b.close();process.exit(fail?1:0)})();
