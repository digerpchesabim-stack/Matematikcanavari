// S74: Güneş Ülkesi zorluk kademeleri — seçim kartı, ayrı ilerleme, parametreler, alt kademe önerisi, eşitleme birleşmesi.
// Kullanım: node test/zk1.js [görüntü klasörü]
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');const out=process.argv[2];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{if(out)fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({args:['--allow-file-access-from-files']});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:out?2:1});const p=await ctx.newPage();const errs=[];
p.on('pageerror',e=>errs.push(String(e.message||e)));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript(()=>{try{localStorage.setItem('mc_mmus','false');localStorage.setItem('mc_info','1')}catch(e){}});
await p.goto(U);await sleep(900);
const shot=async n=>{if(out)await p.screenshot({path:path.join(out,n+'.png')})};
const E=f=>p.evaluate(f);
await E(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦁 Kral Aslan']));NMS.busy=true;st.profile='🦁 Kral Aslan';
  var a={};a['🦁 Kral Aslan']={c:20,s:{1:3,2:3},h:1,t:1,f:{24:1}};localStorage.setItem('mc_gu',JSON.stringify(a));go('home');if(st.modal)closeModal();RK.q=[]});
await sleep(300);
// eski kayıt: seçim kartı bir kez, ilerleme Orta'da
await E(()=>guOpen());await sleep(500);
ok(await E(()=>st.screen==='gumap'&&!!document.querySelector('.gzov')&&!document.querySelector('.gzp .ghost3')),'eski kullanıcıya seçim kartı (Vazgeç yok)');
ok(await E(()=>/21/.test(document.querySelector('.gzc.gz-o small').textContent)&&/Yeni/.test(document.querySelector('.gzc.gz-k small').textContent)),'Orta mevcut ilerlemeyi gösterir, Kolay yeni yol');
await shot('01_pick');
await p.click('.gzc.gz-k');await sleep(300);
ok(await E(()=>guZ()==='k'&&guD().c===0&&guD().h===1&&guRaw().c===20),'Kolay: ayrı yol, Orta ilerlemesi korunur');
await E(()=>guPass(1,3));
ok(await E(()=>guRaw().e.c===1&&guRaw().c===20&&guRaw().s[2]===3),'Kolay ilerlemesi e içinde');
ok(await E(()=>guLv(6)==='k'&&guLv(7)==='o'&&JSON.stringify(guTb(26))==='[5]'&&guGN()===40&&guFoeHp(12)===5),'Kolay = eski değerler');
ok(await E(()=>{guStopOpen(1);var r=Math.abs(guQLim()-12000)<1&&GQ.fto===0;guToMap();return r}),'Kolay süre 12 sn, ilk süre dolması affedilir');
// Zor
await E(()=>guZOpen());await sleep(200);
ok(await E(()=>!!document.querySelector('.gzp .ghost3')&&!!document.querySelector('.gzc.gz-k.on')),'kılıç düğmesi: kart açılır, seçili kademe işaretli');
await p.click('.gzc.gz-z');await sleep(300);
ok(await E(()=>guZ()==='z'&&guD().c===0&&!document.querySelector('.gzov')),'Zor seçildi, yeni yol');
ok(await E(()=>guLv(1)==='o'&&guLv(3)==='z'&&guLv(35)==='o'&&guTb(35)===null&&guLv(49)==='z'),'Zor sayı seviyeleri');
ok(await E(()=>JSON.stringify(guTb(30).slice().sort((a,b)=>a-b))==='[2,3,4,5,10]'),'Zor tablolar birikerek');
ok(await E(()=>guFoeHp(4)===6&&guFoeHp(12)===6&&guFoeHp(49)===7&&guGN()===50),'Zor canlar ve kapı');
ok(await E(()=>{for(var i=0;i<40;i++){var q=guQ('add','z','',3),m=q.txt.match(/(\d+) \+ (\d+)/);if(!m||+m[1]<11||+m[2]<11)return false}return true}),'Zor 3. durak: iki basamak + iki basamak');
ok(await E(()=>{for(var i=0;i<40;i++){var q=guQ('rnd','z','',49);if(/[×÷]/.test(q.txt)&&q.lv!=='o')return false}return true}),'Zor final: çarpma/bölme iki basamaklı');
ok(await E(()=>{guStopOpen(3);var a=GQ.fto===1&&Math.abs(guQLim()-20000*0.7)<1;GQ.ok=7;GQ.i=10;guStopEnd();var b=GQ.stars===0;guStopOpen(3);GQ.ok=8;GQ.i=10;guStopEnd();var c=GQ.stars===1;guToMap();return a&&b&&c}),'Zor durak: kısa süre, affetme yok, 8 doğru şart');
// Orta
await E(()=>{guZSet('o');render()});
ok(await E(()=>guLv(3)==='k'&&guLv(4)==='o'&&JSON.stringify(guTb(26).slice().sort())==='[2,5]'&&guFoeHp(12)===6&&guFoeHp(4)===5&&guGN()===45&&guD().c===20),'Orta değerleri, eski ilerleme yerinde');
// düelloda iki yenilgi → alt kademe önerisi
await E(()=>{guZSet('z');guToMap()});await sleep(300);
for(let k=0;k<2;k++){await E(()=>{guDuelOpen(4)});await sleep(1500);await E(()=>{if(GD){GD.ph='fight';guLose()}});await sleep(300)}
ok(await E(()=>!!document.querySelector('.gzdn')&&/Orta/.test(document.querySelector('.gzdn').textContent)),'Zor’da 2 yenilgi → Orta önerisi');
await shot('02_down');
await p.click('.gzdn');await sleep(500);
ok(await E(()=>st.screen==='gumap'&&guZ()==='o'&&!GD&&GU.sel===4),'öneriye basınca Orta haritası, aynı durak seçili');
ok(await E(()=>!!document.querySelector('.gzch.gzb-o')),'haritada kademe rozeti');
await shot('03_map');
// eşitleme birleşmesi
ok(await E(()=>{var k='🦁 Kral Aslan',a=ls('mc_gu',{});a[k].x={c:2,s:{1:3},f:{}};lsSet('mc_gu',a);var B={};B[k]={c:5,s:{},h:1,e:{c:4,s:{4:2}},x:{c:1,s:{2:3}},zk:'k'};
  acMerge({mc_gu:JSON.stringify(B),mc_profiles:JSON.stringify([k])},true);var r=ls('mc_gu',{})[k];return r.c===20&&r.e.c===4&&r.e.s[1]===3&&r.e.s[4]===2&&r.x.c===2&&r.x.s[2]===3&&r.zk==='o'}),'eşitleme: kademeler ayrı ayrı birleşir, seçili kademe yerelde kalır');
// ana sayfa rozeti
await E(()=>go('home'));await sleep(300);
ok(await E(()=>!!document.querySelector('.hm-gu .gzs')),'ana sayfa kartında kademe');
await p.setViewportSize({width:320,height:568});await E(()=>{go('gumap');guZOpen()});await sleep(800);
ok(await E(()=>document.documentElement.scrollWidth<=320&&document.querySelector('.gzp').getBoundingClientRect().bottom<=568),'320 px: seçim kartı sığar');
await shot('04_small');
ok(!errs.length,'sayfa hatası yok '+errs.join(' | '));
console.log(fail?fail+' HATA':'HEPSİ GEÇTİ');await b.close();process.exit(fail?1:0)})();
