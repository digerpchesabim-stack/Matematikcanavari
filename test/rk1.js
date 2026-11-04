// S48: rütbe/madalya — geriye dönük tarama, birim kontroller, iki telefonlu kapışmada rütbe atlama + herkese açık kart
const {chromium}=require('playwright');
const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';
const OUT=process.env.OUT||'.';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fail=0;const ok=(c,m)=>{console.log((c?'✓ ':'✗ ')+m);if(!c)fail++};
(async()=>{
const b=await chromium.launch();
const S=require(__dirname+'/dsrv.js')({lag:[30,150]});
const mk=async(pid,name,pre)=>{const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await S.phone(ctx,pid,U);
  await p.evaluate(([n,pre])=>{localStorage.setItem('mc_profiles',JSON.stringify([n]));if(pre)for(const k in pre)localStorage.setItem(k,JSON.stringify(pre[k]));NMS.busy=true;st.profile=n;},[name,pre]);return p};
// Ali'nin telefonunda eski kayıtlar: 14 Orta galibiyet, 2 kayıp, 3 Yavru Canavar galibiyeti, 600 doğru cevap
const now=Date.now(),dh=[],rec=[];
for(let i=0;i<14;i++)dh.push({p:'Ali',t:now-86400000*20+i*3600000,o:'Veli',a:10,b:4,w:1,left:0,op:'add',lv:'o',tb:0,win:10,bot:''});
dh.push({p:'Ali',t:now-86400000*3,o:'Veli',a:3,b:10,w:0,left:0,op:'add',lv:'o',tb:0,win:10,bot:''});
for(let i=0;i<3;i++)dh.push({p:'Ali',t:now-86400000*2+i,o:'Yavru',a:10,b:2,w:1,left:0,op:'add',lv:'k',tb:0,win:10,bot:'y'});
for(let i=0;i<12;i++)rec.push({id:now-86400000*(12-i),p:'Ali',t:new Date(now-86400000*(12-i)).toISOString(),op:'add',ok:50,bad:2,k:'g'});
const A=await mk('A','Ali',{mc_dhist:dh,mc_records:rec}),B=await mk('B','Ayşe');
const ev=(p,f,a)=>p.evaluate(f,a);
// 1) birim: kurallar
const u=await ev(A,()=>{var x=rkNew(),r=[];
  for(var i=0;i<6;i++)r.push(rkApply(x,{won:true,lv:'z',win:10,my:10},1,'o:K'));
  var h=rkApply(x,{won:true,left:true,lv:'z',win:10,my:3},1,'o:L');
  var y=rkNew();rkApply(y,{mm:true,rk:1,lv:'o',win:10,my:10},1,'m:1');rkApply(y,{mm:true,rk:2,lv:'z',win:10,my:7},1,'m:1');
  var z=rkNew();rkApply(z,{bot:'d',won:true,lv:'z'},1,null);
  var w=rkNew();w.p=300;w.hz=24;var r1=rkRank(w);w.hz=25;var r2=rkRank(w);
  return {res:r.join(),p:x.p,hz:x.hz,sw:x.sw.join(),half:h,y:[y.p,y.sh.join(),y.se.join(),y.hz].join('|'),z:[z.p,z.mo.join()].join('|'),r1:r1,r2:r2}});
ok(u.res==='ok,ok,ok,ok,ok,cap','aynı rakiple günde 5 maç: '+u.res);
ok(u.p===15&&u.hz===5&&u.sw==='5,5,5','5 Zor galibiyet = 15 puan, kılıç sayaçları '+u.sw);
ok(u.half==='half','rakip yarıdan önce çıkınca sayılmaz');
ok(u.y==='7|1,1,0|0,0,0|0','muharebe: Orta 1. = 4, Zor 2. = 3 puan, seri sıfırlandı: '+u.y);
ok(u.z==='0|0,0,1','canavar: puan yok, Dev sayacı: '+u.z);
ok(u.r1===4-1&&u.r2===4,'Usta için 25 Zor galibiyet şartı: '+u.r1+'→'+u.r2);
// 2) geriye dönük tarama + kutlama
await ev(A,()=>go('home'));await sleep(2600);
const bf=await ev(A,()=>{var x=rkRaw(st.profile);return {p:x.p,r:x.r,m:x.m,q:x.q,dz:x.dz,mo:x.mo.join(),sb:x.sb.join(),ov:document.getElementById('ov').innerText.replace(/\n+/g,' | ')}});
console.log('  tarama:',JSON.stringify(bf));
ok(bf.p===14&&bf.r===0,'14 eski Orta galibiyet yarım puan = 14 (Filiz)');
ok(bf.q===600&&bf.dz===12,'600 doğru cevap, 12 gün');
ok(bf.m.charAt(0)==='1'&&bf.m.charAt(2)==='3'&&bf.m.charAt(5)==='1','madalyalar: Bronz Kılıç, Bronz+Gümüş Seri, Bronz Soru Ustası ('+bf.m+')');
ok(/GEÇMİŞİN SAYILDI/.test(bf.ov),'geçmiş penceresi açıldı');
await A.screenshot({path:OUT+'/rk_gecmis.png'});
await ev(A,()=>document.getElementById('mn').click());await sleep(500);
await A.screenshot({path:OUT+'/rk_menu.png'});
await ev(A,()=>go('rozet'));await sleep(400);await A.screenshot({path:OUT+'/rk_rozetlerim.png',fullPage:true});
await ev(A,()=>go('rhelp'));await sleep(300);await A.screenshot({path:OUT+'/rk_nasil.png',fullPage:true});
// 3) kapışma: Ali Kolay kazanır → 15 puan → Çırak
await ev(A,()=>{go('rooms');rcGo('duel');rcSet('win',10)});await ev(A,()=>rcOp('add'));await sleep(800);
const code=await ev(A,()=>RM.code);
await ev(B,()=>go('rooms'));await B.fill('#r-code',code);await ev(B,()=>rmJoin());
for(let i=0;i<80&&await ev(A,()=>st.screen)!=='dintro';i++)await sleep(100);
await sleep(1200);await A.screenshot({path:OUT+'/rk_giris.png'});
const waitQ=async(k)=>{for(let i=0;i<300;i++){const a=await ev(A,()=>DU&&[DU.k,DU.ph,st.screen].join()),bb=await ev(B,()=>DU&&[DU.k,DU.ph,st.screen].join());if(a===k+',q,duel'&&bb===k+',q,duel')return true;if(await ev(A,()=>DU&&DU.over))return false;await sleep(50)}return false};
const tap=(p,k,d,okk)=>ev(p,([k,d,okk])=>{setTimeout(()=>{if(DU&&DU.ph==='q'&&DU.k===k){var q=DU.qs[k];var i=q.opts.findIndex(o=>(o.v===q.ans)===okk);duAns(i,document.querySelectorAll('#dgrid .ani')[i])}},d)},[k,d,okk]);
for(let k=0;k<12;k++){if(!await waitQ(k))break;await tap(A,k,250,true);await tap(B,k,700,false);await sleep(900);
  for(let i=0;i<60;i++){if(await ev(A,()=>DU&&(DU.ph==='res'||DU.over)))break;await sleep(100)}if(await ev(A,()=>DU.over))break}
await sleep(3500);
const end=await ev(A,()=>({s:st.screen,won:DU.won,res:DU.rkRes,p:rkRaw(st.profile).p,r:rkRaw(st.profile).r,ov:document.getElementById('ov').innerText.replace(/\n+/g,' | ')}));
console.log('  maç sonu:',JSON.stringify(end));
ok(end.s==='dover'&&end.won&&end.res==='ok','Ali kazandı, maç sayıldı');
ok(end.p===15&&end.r===1,'15 puan → Çırak');
ok(/TEBRİKLER/.test(end.ov)&&/Çırak/.test(end.ov),'rütbe atlama penceresi: '+end.ov.slice(0,80));
await A.screenshot({path:OUT+'/rk_rutbe.png'});
// paylaşım görseli
await ev(A,()=>{window.__shot=null;shareCanvas=function(cv){window.__shot=cv.toDataURL('image/png')};document.getElementById('rksh').click()});
for(let i=0;i<40&&!await ev(A,()=>!!window.__shot);i++)await sleep(100);
const png=await ev(A,()=>window.__shot);ok(!!png,'paylaşım görseli oluştu');
if(png)require('fs').writeFileSync(OUT+'/rk_paylas.png',Buffer.from(png.split(',')[1],'base64'));
const eB=await ev(B,()=>({r:rkRaw(st.profile).r,se:rkRaw(st.profile).se.join(),ov:document.getElementById('ov').hidden}));
ok(eB.se==='0,0,0','kaybeden Ayşe: seri 0, puan kaybı yok');
// herkese açık
await sleep(500);
const pl=Object.keys(S.store).filter(k=>k.startsWith('pl/')).map(k=>[k,S.store[k].rk,S.store[k].md]);
console.log('  pl kartları:',JSON.stringify(pl));
ok(pl.some(x=>x[1]===1&&/^1/.test(x[2]||'')),'Ali’nin herkese açık kartında rütbe 1 ve madalyalar');
const pk=Object.keys(S.store).filter(k=>k.startsWith('rooms/'+code+'/players/'));console.log('  oyuncular:',pk.map(k=>k.split('/').pop()+':'+S.store[k].rk).join(' '));ok(pk.length===2&&pk.every(k=>S.store[k].rk===0),'oda oyuncu belgesinde maç başındaki rütbe (rk=0) yazılı');
console.log('  ret sayısı:',S.denied?S.denied.length:'?',S.denied?JSON.stringify(S.denied.slice(0,5)):'');
await b.close();console.log(fail?('HATA: '+fail):'TAMAM');process.exit(fail?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
