// S76: Güneş Ülkesi'nde alt alta gösterim + talim soruları zorluğa göre.
// Kullanım: node test/s76.js [görüntü klasörü]
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
  var a={};a['🦁 Kral Aslan']={c:3,s:{},h:1,t:1,zk:'o'};localStorage.setItem('mc_gu',JSON.stringify(a));st.vert=false;lsSet('mc_vert',false);go('home');if(st.modal)closeModal();RK.q=[]});
await sleep(300);
// 1) durakta alt alta
await E(()=>guStopOpen(4));await sleep(300);
ok(await E(()=>!!document.getElementById('gfmt')&&!document.querySelector('#gs-q .vert')),'durak: yan yana + Alt alta düğmesi');
await E(()=>document.getElementById('gfmt').click());await sleep(200);
ok(await E(()=>!!document.querySelector('#gs-q .vert')&&st.vert===true&&ls('mc_vert',false)===true&&/Yan yana/.test(document.getElementById('gfmt').textContent)),'Alt alta → soru alt alta, ayar kaydedildi');
await shot('01_stop_vert');
await E(()=>{var q=GQ.q,j=q.opts.findIndex(o=>o.v===q.ans);guStopAns(j,document.querySelectorAll('#gs-a .ani')[j])});await sleep(1400);
ok(await E(()=>!!document.querySelector('#gs-q .vert')),'sonraki soru da alt alta');
await E(()=>guToMap());await sleep(300);
// 2) düelloda alt alta
await E(()=>{GU.spd=0.3;guDuelOpen(4)});await sleep(1500);await E(()=>guFight());await sleep(600);
ok(await E(()=>!!document.querySelector('#gd-q .vert')&&!!document.getElementById('gfmtd')),'düello: alt alta + düğme');
await shot('02_duel_vert');
await E(()=>document.getElementById('gfmtd').click());await sleep(200);
ok(await E(()=>!document.querySelector('#gd-q .vert')&&st.vert===false&&GD.ph==='fight'),'düelloda yan yanaya dönülür, düello sürer');
ok(await E(()=>{st.vert=true;var h=guQH({txt:'48 ÷ 6'});st.vert=false;return !/vert/.test(h)}),'bölme yan yana kalır');
await E(()=>{guToMap()});await sleep(300);
// 3) talim zorluğa göre
const tq=async z=>E(z=>{guZSet(z);var r=[];var sv=GUTB;for(var i=0;i<60;i++){var q=(function(){var d=guD(),n=Math.min(48,d.c+1),qq;qq=guQ('add',{k:'k',o:'o',z:'z'}[z],'',0);return qq})();var m=q.txt.match(/(\d+) \+ (\d+)/);r.push([+m[1],+m[2]])}return r},z);
const k=await tq('k'),o=await tq('o'),zz=await tq('z');
ok(k.every(x=>x[0]<10&&x[1]<10),'Kolay talim: tek basamak');
ok(o.some(x=>x[0]>=10)&&o.every(x=>x[0]<100),'Orta talim: iki basamak');
ok(zz.every(x=>x[0]>=10&&x[1]>=10),'Zor talim: iki basamak + iki basamak');
await E(()=>{guZSet('z');go('gutalim')});await sleep(2500);
ok(await E(()=>st.screen==='gutalim'&&!!document.getElementById('tlcv')),'Zor’da talim açıldı');
await shot('03_talim_z');
await E(()=>{guZSet('o');go('gumap')});await sleep(500);
ok(!errs.length,'sayfa hatası yok '+errs.join(' | '));
console.log(fail?fail+' HATA':'HEPSİ GEÇTİ');await b.close();srv.close();process.exit(fail?1:0)})();
