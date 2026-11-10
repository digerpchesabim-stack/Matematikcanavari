// S58: rastgele dokunma testi. Görünen düğmelere rastgele basar, arada geri tuşuna basar; sayfa hatası çıkarsa son adımlarla birlikte yazar.
// Kullanım: node test/monkey.js [adım=700] [tohum=1] [profil=1|0]   (sade mod için LITE=1)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');
const N=+(process.argv[2]||700),SEED=+(process.argv[3]||1),PROF=process.argv[4]!=='0';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844}});
const p=await ctx.newPage();const errs=[];let trail=[];
p.on('pageerror',e=>errs.push({m:String(e.message||e),s:String(e.stack||'').split('\n').slice(0,3).join(' | '),t:trail.slice(-6)}));
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.addInitScript((lite)=>{if(!lite)try{Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8})}catch(e){}},!!process.env.LITE);
await p.addInitScript(()=>{window.open=function(){return null};try{Object.defineProperty(navigator,'share',{value:function(){return Promise.resolve()},configurable:true})}catch(e){}
  try{navigator.clipboard.writeText=function(){return Promise.resolve()}}catch(e){}window.print=function(){};try{localStorage.setItem('mc_mmus','false')}catch(e){}});
await p.goto(U);await sleep(800);
if(PROF)await p.evaluate(()=>{localStorage.setItem('mc_profiles',JSON.stringify(['🦊 Kurnaz Tilki']));NMS.busy=true;st.profile='🦊 Kurnaz Tilki';go('home');frEnsure()});
await sleep(800);
let seed=SEED;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff};
const seen={};
for(let i=0;i<N;i++){
  const r=rnd(),r2=rnd();
  const a=await p.evaluate(([r,r2])=>{
    try{
      var bad=/Güncelle|Verilerimi sil|Evet, sil|Hesabımı sil|Takımdan ayrıl/;
      if(r<0.07){back();return 'GERİ @'+st.screen}
      var root=document.getElementById('ov').hidden?document.getElementById('app'):document.getElementById('ov');
      var l=[].filter.call(root.querySelectorAll('button,[onclick],summary,canvas#mon'),function(e){var b=e.getBoundingClientRect();return b.width>0&&b.height>0&&!e.disabled&&!bad.test(e.textContent||'')});
      if(!l.length){back();return 'GERİ(boş) @'+st.screen}
      var e=l[Math.floor(r2*l.length)];var t=(e.textContent||e.id||e.tagName).trim().slice(0,28);e.click();return t+' @'+st.screen;
    }catch(x){return 'İSTİSNA '+x.message}
  },[r,r2]).catch(e=>'DEĞERLENDİRME HATASI '+e.message);
  trail.push(a);const sc=a.split('@')[1];if(sc)seen[sc]=(seen[sc]||0)+1;
  if(/^İSTİSNA|^DEĞERLENDİRME/.test(a))errs.push({m:a,t:trail.slice(-6)});
  await sleep(rnd()<0.15?700:140);
  if((await p.url()).indexOf('index.html')<0){errs.push({m:'sayfadan çıkıldı '+(await p.url()),t:trail.slice(-6)});await p.goto(U);await sleep(600)}
}
const uniq={};errs.forEach(e=>{const k=e.m.slice(0,90);if(!uniq[k])uniq[k]=e});
console.log('adım',N,'tohum',SEED,'profil',PROF,'ekran sayısı',Object.keys(seen).length,Object.keys(seen).join(','));
console.log('hata',Object.keys(uniq).length);Object.values(uniq).forEach(e=>console.log(' -',e.m,'\n   ',e.s||'','\n   son adımlar:',JSON.stringify(e.t)));
await b.close();process.exit(Object.keys(uniq).length?1:0)})().catch(e=>{console.error(e);process.exit(1)});
