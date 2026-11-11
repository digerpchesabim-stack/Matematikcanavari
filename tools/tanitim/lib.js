// Sanal zamanla kare kare uygulama kaydı (30 fps, makine hızından bağımsız)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const R='/home/claude/matematikcanavari';const FPS=30;
exports.R=R;exports.FPS=FPS;
exports.launch=()=>chromium.launch();
exports.open=async function(b,o){o=o||{};
  const ctx=await b.newContext({viewport:{width:o.w||390,height:o.h||844},deviceScaleFactor:o.dsf||2,locale:'tr-TR',timezoneId:'Europe/Istanbul'});
  const p=await ctx.newPage();p.errs=[];
  p.on('pageerror',e=>{p.errs.push(e.message);console.log('PAGEERR',e.message)});
  await p.clock.install({time:new Date('2026-11-14T16:05:00+03:00')});
  await p.addInitScript(fs.readFileSync(R+'/test/mockfb.js','utf8'));
  await p.addInitScript((prof)=>{try{
    if(prof&&!localStorage.getItem('mc_profiles'))localStorage.setItem('mc_profiles',JSON.stringify([prof]));
    localStorage.setItem('mc_nm',JSON.stringify({'🦊 Kurnaz Tilki':{e:1,n:0,c:1}}));Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8});navigator.vibrate=()=>true}catch(e){}},o.prof===undefined?'🦊 Kurnaz Tilki':o.prof);
  if(o.init)await p.addInitScript(o.init);
  await p.goto('file://'+R+'/index.html');
  await p.waitForTimeout(1500);
  const cdp=await ctx.newCDPSession(p);await cdp.send('Animation.enable');await cdp.send('Animation.setPlaybackRate',{playbackRate:0});
  await p.evaluate(()=>{
    window.__step=function(dt){
      document.getAnimations().forEach(function(a){if(a.playState!=='paused'){try{a.currentTime=(a.currentTime||0)+dt}catch(e){}}});
      document.querySelectorAll('svg').forEach(function(s){if(s.ownerSVGElement)return;try{if(s.__t===undefined)s.__t=0;s.pauseAnimations();s.__t+=dt/1000;s.setCurrentTime(s.__t)}catch(e){}});
    };
    try{M3.live=true;window.m3dPerf=function(){}}catch(e){}
  });
  const now=await p.evaluate(()=>Date.now());await p.clock.pauseAt(now+3000);
  p.T=0;p.N=0;
  // ms kadar sanal zaman ilerlet (kayıt yok)
  p.adv=async function(ms){let n=Math.round(ms/1000*FPS);for(let i=0;i<n;i++){const dt=(i%3===2)?34:33;await p.clock.runFor(dt);await p.evaluate(d=>__step(d),dt)}};
  // secs saniye kaydet; acts=[[t,fn]] kayıt içi zamanlı eylemler
  p.rec=async function(dir,secs,acts){fs.mkdirSync(dir,{recursive:true});acts=(acts||[]).slice().sort((a,b)=>a[0]-b[0]);
    const n=Math.round(secs*FPS);let ai=0;const base=p.N0=fs.readdirSync(dir).filter(f=>/^f\d+\.jpg$/.test(f)).length;
    for(let i=0;i<n;i++){p.F=base+i;
      while(ai<acts.length&&acts[ai][0]<=i/FPS){await acts[ai][1](p);ai++}
      const dt=(i%3===2)?34:33;await p.clock.runFor(dt);await p.evaluate(d=>__step(d),dt);
      await p.screenshot({path:path.join(dir,'f'+String(base+i).padStart(4,'0')+'.jpg'),type:'jpeg',quality:94});
    }
    return base+n};
  return p};
