const {chromium}=require('playwright');const fs=require('fs');
const mock=fs.readFileSync(__dirname+'/mockfb.js','utf8');
const U=''+(process.env.MC_URL||'file://'+require('path').resolve(__dirname,'../index.html'))+'';
const hook=`window.__S={w:0,c:[]};`;
(async()=>{const b=await chromium.launch();const errs=[];
const ctx=await b.newContext({viewport:{width:390,height:844}});
const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));await p.addInitScript(mock);await p.goto(U);
await p.evaluate(()=>{window.__S={w:0,c:[]};var w=sndWhistle,c=sndClap;sndWhistle=function(){__S.w++;w()};sndClap=function(b){__S.c.push(!!b);c(b)};
window.__DB['lbg_add/a']={nick:'Ali',score:50,ts:1};window.__DB['lbg_add/b']={nick:'Ayşe',score:30,ts:1};window.__DB['lbg_add/c']={nick:'Veli',score:12,ts:1};
localStorage.setItem('mc_profiles',JSON.stringify(['Umut']));st.profile='Umut';go('gmenu')});
await p.evaluate(()=>gStart('add','k',0));await p.waitForTimeout(500);
console.log('1',await p.evaluate(()=>st.screen+' | '+document.body.innerText.replace(/\n+/g,' | ')));
await p.screenshot({path:'c1.png'});
await p.waitForTimeout(1200);console.log('  cdn',await p.evaluate(()=>document.getElementById('cdn').textContent));
await p.waitForTimeout(4000);
console.log('2',await p.evaluate(()=>st.screen+' whistle='+__S.w+' top='+(st.g.top||[]).length+' g-zr='+!!document.getElementById('g-zr')));
// puan geçişleri
const sc=async(from,to)=>{await p.evaluate(([f,t])=>{var g=st.g;g.lock=false;g.score=f;var q=g.q;var i=q.opts.findIndex(o=>o.v===q.ans);g.el=0;g.tm=8000;
 var orig=g.score;gAnswer(i,document.querySelectorAll('#agrid .ani')[i]);// +3 -> f+3 (hızlı)
 },[from,to])};
await p.evaluate(()=>{st.g.score=10});
await sc(10);await p.waitForTimeout(200);
console.log('3 10->13 geçti Veli?',await p.evaluate(()=>(document.querySelector('.gpop')||{}).innerText+' clap='+JSON.stringify(__S.c)+' pop='+st.g.pop));
await p.screenshot({path:'c2.png'});
await p.waitForTimeout(2200);console.log('  popup kapandı:',await p.evaluate(()=>!document.querySelector('.gpop')+' screen='+st.screen+' lock='+st.g.lock));
await p.evaluate(()=>{st.g.score=28;st.g.lock=false});await sc(28);await p.waitForTimeout(200);
console.log('4 28->31 geçti Ayşe:',await p.evaluate(()=>(document.querySelector('.gpop')||{}).innerText.replace(/\n/g,' | ')));
await p.waitForTimeout(2200);
await p.evaluate(()=>{st.g.score=49;st.g.lock=false});await sc(49);await p.waitForTimeout(200);
console.log('5 49->52 zirve:',await p.evaluate(()=>(document.querySelector('.gpop')||{}).innerText.replace(/\n/g,' | ')+' clap='+JSON.stringify(__S.c)));
await p.screenshot({path:'c3.png'});
await p.waitForTimeout(2200);
// geçme yok
const n0=await p.evaluate(()=>__S.c.length);await p.evaluate(()=>{st.g.score=60;st.g.lock=false});await sc(60);await p.waitForTimeout(200);
console.log('6 geçilen yok:',await p.evaluate(n=>!document.querySelector('.gpop')&&__S.c.length===n,n0));
// yanlış cevap popup yok
await p.waitForTimeout(800);
// tablo çalışması
await p.evaluate(()=>{st.g.done=true;gStart('mul','k',4)});await p.waitForTimeout(400);
console.log('7 tablo kartı:',await p.evaluate(()=>st.screen+' | '+document.getElementById('zc').innerText.replace(/\n/g,' | ')));
await p.waitForTimeout(5400);console.log('  başladı',await p.evaluate(()=>st.screen));
// çevrimdışı
await p.evaluate(()=>{st.g.done=true});await ctx.setOffline(true);await p.evaluate(()=>gStart('add','k',0));await p.waitForTimeout(400);
console.log('8 çevrimdışı kart:',await p.evaluate(()=>JSON.stringify(document.getElementById('zc').innerText)+' disp='+getComputedStyle(document.getElementById('zc')).display));
await p.waitForTimeout(5400);console.log('  ',await p.evaluate(()=>st.screen));await ctx.setOffline(false);
// boş tablo
await p.evaluate(()=>{st.g.done=true;gStart('sub','k',0)});await p.waitForTimeout(500);
console.log('9 boş tablo:',await p.evaluate(()=>document.getElementById('zc').innerText.replace(/\n/g,' | ')));await p.waitForTimeout(5400);
// yarış
const q=await ctx.newPage();q.on('pageerror',e=>errs.push(e.message));await q.addInitScript(mock);await q.addInitScript(`window.__DB['lbr_add/a']={nick:'Ali',score:60,ts:1};window.__DB['lbr_add/b']={nick:'Ayşe',score:25,ts:1};`);await q.goto(U);
await q.evaluate(()=>{window.__S={w:0};var w=sndWhistle;sndWhistle=function(){__S.w++;w()};localStorage.setItem('mc_profiles',JSON.stringify(['Umut']));st.profile='Umut';go('rcreate')});
await q.evaluate(()=>rmCreate('add'));await q.waitForTimeout(400);await q.evaluate(()=>rmStart());await q.waitForTimeout(700);
console.log('10 yarış sayım:',await q.evaluate(()=>st.screen+' | '+document.getElementById('zc').innerText.replace(/\n/g,' | ')));
await q.screenshot({path:'c4.png'});await q.waitForTimeout(5400);
console.log('11 yarış başladı:',await q.evaluate(()=>st.screen+' whistle='+__S.w+' top='+(st.g.top||[]).length));
console.log('errs',errs);await b.close()})();
