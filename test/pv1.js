// S51: eski sürüm rakip (pv yok) → kapışma başlamaz, uyarı; başlarken rakip belgesi yoksa beklenir
const {chromium}=require('playwright');
const U='file://'+require('path').resolve(__dirname,'../index.html');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();const S=require(__dirname+'/dsrv.js')({lag:[20,60]});
const ctx=await b.newContext({viewport:{width:390,height:844}});const A=await S.phone(ctx,'A',U);
await A.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['Ali']));NMS.busy=true;st.profile='Ali';go('rooms');rcGo('duel');rcSet('win',10)});
await A.evaluate(()=>rcOp('add'));await sleep(1200);
const r1=await A.evaluate(()=>{RM.players.push({uid:'OLD',nick:'Eski',ts:Date.now(),jt:Date.now()+1,rid:RM.room.created,done:false});rmRefresh();return {ast:RM.ast,w:document.getElementById('du-pv').innerText}});
ok(!r1.ast&&/eski sürümü/.test(r1.w),'eski sürüm rakip: maç başlamadı, uyarı: '+r1.w.slice(0,60));
await A.screenshot({path:(process.env.OUT||'.')+'/pv_uyari.png'});
const r2=await A.evaluate(()=>{RM.players=RM.players.filter(p=>p.uid!=='OLD');RM.players.push({uid:'NEW',nick:'Yeni',ts:Date.now(),jt:Date.now()+1,rid:RM.room.created,done:false,pv:2});RM.ast=true;rmRefresh();return document.getElementById('du-pv').innerText});
ok(r2==='','güncel rakipte uyarı yok');
// başlama yarışı: oda 'playing' ama rakip belgesi henüz yok → bekle
const r3=await A.evaluate(()=>{RM.players=RM.players.filter(p=>p.uid!=='NEW');RM.started=false;RM.gw=0;RM.room=Object.assign({},RM.room,{status:'playing'});rmGo();return [RM.started,!!RM.gwt].join()});
ok(r3==='false,true','rakip yokken başlamadı, bekliyor');
const r4=await A.evaluate(()=>new Promise(res=>{RM.players.push({uid:'NEW',nick:'Yeni',ts:Date.now(),jt:Date.now()+1,rid:RM.room.created,done:false,pv:2});setTimeout(()=>res([RM.started,DU&&DU.ids.length,st.screen].join()),900)}));
ok(r4==='true,2,dintro','rakip gelince iki kişiyle başladı: '+r4);
// güncelle düğmesi
await A.evaluate(()=>{rmReset();go('welcome')});await sleep(300);
ok(await A.evaluate(()=>/Sürüm 5[0-9]/.test(document.body.innerText)&&!!document.querySelector('.vupd')),'giriş ekranında Sürüm ve Güncelle düğmesi');
await A.screenshot({path:(process.env.OUT||'.')+'/guncelle.png'});
await b.close();console.log(fail?'HATA':'TAMAM');process.exit(fail?1:0)})().catch(e=>{console.error(e);process.exit(1)});
