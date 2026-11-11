// Uygulama klipleri. Kullanım: node clips.js <ad> [ad...]
const L=require('./lib.js'),C=require('./common.js');const fs=require('fs');const CL=__dirname+'/clips';
const INIT=()=>{
  try{var SS={speak:function(u){window.__u=u},cancel:function(){},getVoices:function(){return [{lang:'tr-TR',name:'Türkçe',default:true}]},addEventListener:function(){},speaking:false,pending:false};
    Object.defineProperty(window,'speechSynthesis',{value:SS,configurable:true});window.SpeechSynthesisUtterance=function(t){this.text=t}}catch(e){}
  // dokunma izi
  document.addEventListener('DOMContentLoaded',function(){var s=document.createElement('style');s.textContent='.tapdot{position:fixed;z-index:99999;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;background:rgba(47,107,255,.28);border:3px solid rgba(255,255,255,.9);box-shadow:0 0 0 2px rgba(47,107,255,.55);pointer-events:none;animation:tapdot .5s ease-out forwards}@keyframes tapdot{0%{transform:scale(.35);opacity:0}25%{opacity:1}100%{transform:scale(1.25);opacity:0}}';document.head.appendChild(s);
    document.addEventListener('pointerdown',function(e){var d=document.createElement('div');d.className='tapdot';d.style.left=e.clientX+'px';d.style.top=e.clientY+'px';document.body.appendChild(d);setTimeout(function(){d.remove()},600)},true)});
};
const marks={};const mk=(c,k,p)=>{(marks[c]=marks[c]||{})[k]=p.F};
async function page(b,prof){const p=await L.open(b,Object.assign({init:INIT},C.VP));p.F=0;const rec=p.rec;
  p.R=async(name,secs,acts)=>{p.F=await rec(CL+'/'+name,secs,acts);return p.F};return p}
const clickSel=async(p,sel,i)=>{try{await p.locator(sel).nth(i||0).click({force:true,timeout:3000})}catch(e){console.log('tık yok',sel,i)}};
const S={
 async duel(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>{BOTS.c={n:'🐼 Cesur Panda',e:'',d:'Normal',t:[2300,2900],p:1};BOT.b='c';BOT.lv='o';BOT.win=10});
  const tap=async(p)=>{const i=await p.evaluate(()=>{var q=DU.qs[DU.k];return q.opts.findIndex(o=>o.v===q.ans)});await clickSel(p,'#dgrid button',i)};
  await p.evaluate(()=>botGo('mul',0));
  await p.R('duel',7.9);mk('duel','intro_end',p);
  // soru ekrana gelene kadar bekle
  for(let i=0;i<40&&!(await p.evaluate(()=>st.screen==='duel'&&DU.ph==='q'));i++)await p.R('duel',0.1);
  mk('duel','q0',p);
  await p.R('duel',8.5,[[1.25,async p=>{await tap(p);mk('duel','tap0',p)}],[4.6,async p=>{await tap(p);mk('duel','tap1',p)}]]);
 },
 async game(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>{var D=window.__DB,now=Date.now();[['x1','🦁 Kral Aslan',16,3],['x2','🦉 Bilge Baykuş',12,1],['x3','🐼 Cesur Panda',8,2],['x4','🐬 Akıllı Yunus',3,0]].forEach(function(r){D['lbg_mul/'+r[0]]={nick:r[1],score:r[2],ts:now-r[2]*1e5,rk:r[3]}});LBC={}});
  await p.evaluate(()=>gStart('mul','k',0));
  await p.R('game',3);
  for(let i=0;i<120&&!(await p.evaluate(()=>st.screen==='game'));i++)await p.R('game',0.1);
  mk('game','start',p);
  // yeni soru gelince 0,45 sn sonra doğru cevaba dokun
  let lastQ='',due=-1,n=0;const acts=[];
  const chk=async(p)=>{const q=await p.evaluate(()=>{var g=st.g,bs=[...document.querySelectorAll('.ani')];return st.screen==='game'&&g&&g.q&&bs.length&&!bs[0].disabled&&!bs.some(x=>/ok|bad/.test(x.className))?g.q.txt||JSON.stringify(g.q.opts):''});
    if(q&&q!==lastQ){lastQ=q;due=p.F+14}
    if(due>=0&&p.F>=due){due=-1;const i=await p.evaluate(()=>{var q=st.g.q;return [...document.querySelectorAll('.ani')].findIndex(x=>+x.textContent===q.ans)});if(i>=0){await clickSel(p,'.ani',i);n++;mk('game','tap'+n,p)}}};
  for(let k=0;k<13*30;k++)acts.push([k/30,chk]);
  await p.R('game',13,acts);
  console.log('oyun',await p.evaluate(()=>JSON.stringify({sc:st.g.score,h:st.g.hearts,n:st.g.n})));
 },
 async lb(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>{var D=window.__DB,now=Date.now();[['x1','🦁 Kral Aslan',16,3],['x2','🦉 Bilge Baykuş',12,1],['x3','🐼 Cesur Panda',8,2],['x4','🐬 Akıllı Yunus',3,0],['x5','🐧 Neşeli Penguen',2,0]].forEach(function(r){D['lbg_mul/'+r[0]]={nick:r[1],score:r[2],ts:now-r[2]*1e5,rk:r[3]}});LBC={}});
  await p.evaluate(()=>{devAuth()});await p.adv(400);
  await p.evaluate(()=>{window.__DB['lbg_mul/'+CL.user.uid]={nick:st.profile,score:18,ts:Date.now(),rk:3};LBC={};lbOpen('solo','mul','k')});
  await p.R('lb',3);
 },
 async podium(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>{RM.nick=st.profile;BOT.on=false;
   DU={m:0,k:9,ids:['me','a','b','c'],nick:{me:st.profile,a:'🦁 Kral Aslan',b:'🐼 Cesur Panda',c:'🦉 Bilge Baykuş'},pid:{},gone:{},pts:{me:10,a:8,b:6,c:3},mm:true,bot:'',me:'me',oid:'a',onick:'🦁 Kral Aslan',
      qg:{op:'mul',lv:'o',tb:0},win:10,sc:[10,8],over:true,won:true,rank:1,left:false,saved:true,ph:'over',myR:[],prevR:[],oseen:{},osig:{},wk:[]};
   go('dover');confetti(true)});
  await p.R('podium',3.5);
 },
 async rank(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>{lbOpen('solo','mul','k')});await p.adv(600);
  await p.evaluate(()=>rkShow({t:'rank',r:3}));
  await p.R('rank',4);
 },
 async kart(b){const p=await page(b);await C.setup(p,{p:158,r:3,sw:[19,11,4],sh:[3,2,1],sb:[6,5,3],se:[6,5,3],mo:[10,6,0],tw:[5,2,0],q:3240,dz:41,hz:9,m:'3101120',dq:0});
  await p.evaluate(()=>rkMyCard());
  await p.R('kart',3);
 },
 async team(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>frEnsure());await p.adv(1500);
  await p.evaluate(()=>{var o=ls('mc_tm',{});o[st.profile]=12;lsSet('mc_tm',o);var now=Date.now();
   TM.d={m:[FR.pid,'AAAAAA1','AAAAAA2','AAAAAA3'],cap:FR.pid,by:FR.pid,w:7,l:2,ct:now-2*86400000,jn:0,ts:now,v:1};
   TM.pl={AAAAAA1:{nick:'🐼 Cesur Panda',rk:2,seen:now},AAAAAA2:{nick:'🦁 Kral Aslan',rk:3,seen:now},AAAAAA3:{nick:'🦉 Bilge Baykuş',rk:1,seen:now}};
   go('tml')});
  await p.R('team',3);
 },
 async solve(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>{st.kind='a';st.op='add';go('mode')});await p.adv(300);
  await clickSel(p,'#app .btn',1);await p.adv(300);await clickSel(p,'#app .btn',1);await p.adv(500);
  console.log('soru',await p.evaluate(()=>st.screen+' '+st.q.text));
  const wrong=async p=>{const i=await p.evaluate(()=>[...document.querySelectorAll('#opts .opt')].findIndex(x=>!x.disabled&&+x.dataset.v!==st.q.ans));await clickSel(p,'#opts .opt',i)};
  await p.R('solve',9.5,[[0.8,wrong],[1.7,wrong],[2.6,async p=>{await clickSel(p,'#sol');mk('solve','sol',p)}],[4.2,p=>clickSel(p,'#steps .next')],[5.8,p=>clickSel(p,'#steps .next')],[7.4,p=>clickSel(p,'#steps .next')]]);
 },
 async tts(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>pickPOp('add'));await p.adv(300);await clickSel(p,'#app .btn',0);await p.adv(500);
  await p.R('tts',4,[[1.0,async p=>{await clickSel(p,'#tts-n');mk('tts','on',p)}]]);
 },
 async msg(b){const p=await page(b);await C.setup(p);
  await p.evaluate(()=>frEnsure());await p.adv(1200);
  await p.evaluate(()=>{FR.ready=true;FR.list=['AAAAAA1'];FR.nick={AAAAAA1:'🐼 Cesur Panda'};go('friends')});await p.adv(500);
  await p.evaluate(()=>msgOpen('AAAAAA1'));
  await p.R('msg',4.5,[[1.6,p=>clickSel(p,'.msgtab .chip',1)],[3.0,p=>clickSel(p,'.msgtab .chip',2)]]);
 },
 async home(b){const p=await page(b);await C.setup(p);await p.evaluate(()=>{go('welcome');go('home')});
  await p.R('home',3);
 },
};
(async()=>{const b=await L.launch();const mf=CL+'/marks.json';let all={};try{all=JSON.parse(fs.readFileSync(mf))}catch(e){}
for(const n of process.argv.slice(2)){fs.rmSync(CL+'/'+n,{recursive:true,force:true});const t=Date.now();await S[n](b);
  const cnt=fs.readdirSync(CL+'/'+n).length;all[n]=Object.assign({frames:cnt},marks[n]||{});
  C.sheet(CL+'/'+n,__dirname+'/sheet_'+n+'.jpg',Math.max(6,Math.ceil(cnt/24)),12);
  console.log(n,cnt,'kare',((Date.now()-t)/1000|0)+' sn',JSON.stringify(all[n]))}
fs.writeFileSync(mf,JSON.stringify(all,null,1));await b.close()})();
