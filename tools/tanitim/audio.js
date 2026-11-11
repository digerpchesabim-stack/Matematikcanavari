// Uygulamanın kendi ses efektlerini (kodla üretilen) tek parça halinde çevrim dışı üretir -> sfx.wav
const {chromium}=require('playwright');const fs=require('fs');const R='/home/claude/matematikcanavari';
const MK=JSON.parse(fs.readFileSync(__dirname+'/clips/marks.json'));
const T=[0,2.8,6.8,11.0,15.5,20.0,26.0,30.0];
const tap3=T[2]+1.28+(MK.duel.tap0-MK.duel.q0-4)/30;
const EV=[[0.0,'sndSwoosh'],[0.25,'sndPop'],[0.55,'sndSwoosh'],[1.24,'sndCrunch'],[1.42,'sndCrunch'],[1.6,'sndCrunch'],[1.95,'sndGiggle'],
 [T[1]+0.38,'sndPop'],[T[1]+0.78,'sndPop'],[T[1]+1.18,'sndPop'],[T[1]+1.58,'sndWhistle'],
 [T[1]+1.9,'sndOk',1],[T[1]+2.12,'sndOk',1],[T[1]+2.36,'sndOk',1],[T[1]+2.62,'sndOk',1],[T[1]+2.98,'sndOk',3],[T[1]+3.3,'sndGiggle'],[T[1]+3.72,'sndSwoosh'],
 [T[2]+0.05,'sndSwoosh'],[T[2]+0.63,'sndClang'],[T[2]+1.3,'sndPop'],[tap3,'sndOk',3],
 [T[3],'sndSwoosh'],[T[3]+10/30,'sndOk',3],[T[3]+(MK.game.tap2-MK.game.tap1+10)/30,'sndOk',3],[T[3]+2.3+8/30,'sndOk',3],
 [T[4],'sndSwoosh'],[T[4]+0.55,'sndSwoosh'],[T[4]+1.62,'sndClap',true],[T[4]+3.1,'sndPop'],[T[4]+3.26,'sndPop'],[T[4]+3.42,'sndPop'],
 [T[5]+0.35,'sndPop'],[T[5]+1.45,'sndPop'],[T[5]+2.55,'sndPop'],
 [T[6],'sndSwoosh'],[T[6]+0.3,'sndBoing'],[T[6]+0.75,'sndGiggle'],[T[6]+0.98,'sndOk',3]];
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.addInitScript(fs.readFileSync(R+'/test/mockfb.js','utf8'));
await p.addInitScript(()=>{var O=window.OfflineAudioContext;window.AudioContext=function(){return new O(2,31*48000,48000)};window.webkitAudioContext=window.AudioContext;try{localStorage.setItem('mc_mmus','false')}catch(e){}});
await p.goto('file://'+R+'/index.html');await p.waitForTimeout(800);
const b64=await p.evaluate(async(EV)=>{AU.sfx=true;var c=auCtx();window.sfxPlay=function(fn){try{fn(window.__T)}catch(e){console.log('sfx',e)}};
  var SG=AU.sg;EV.forEach(function(e){var k={sndWhistle:0.32,sndClang:0.8,sndClap:0.8,sndSwoosh:0.7}[e[1]]||1,g=c.createGain();g.gain.value=k*0.45;g.connect(AU.master);AU.sg=g;window.__T=e[0];window[e[1]](e[2])});AU.sg=SG;
  var buf=await c.startRendering(),n=30*48000,L=buf.getChannelData(0),Rr=buf.getChannelData(1),out=new DataView(new ArrayBuffer(44+n*4)),i,w=function(o,s){for(var k=0;k<s.length;k++)out.setUint8(o+k,s.charCodeAt(k))};
  w(0,'RIFF');out.setUint32(4,36+n*4,true);w(8,'WAVEfmt ');out.setUint32(16,16,true);out.setUint16(20,1,true);out.setUint16(22,2,true);out.setUint32(24,48000,true);out.setUint32(28,192000,true);out.setUint16(32,4,true);out.setUint16(34,16,true);w(36,'data');out.setUint32(40,n*4,true);
  var pk=0;for(i=0;i<n;i++){pk=Math.max(pk,Math.abs(L[i]))}
  for(i=0;i<n;i++){out.setInt16(44+i*4,Math.max(-1,Math.min(1,L[i]))*32767,true);out.setInt16(46+i*4,Math.max(-1,Math.min(1,Rr[i]))*32767,true)}
  var u=new Uint8Array(out.buffer),s='',k;for(k=0;k<u.length;k+=32768)s+=String.fromCharCode.apply(null,u.subarray(k,k+32768));return [btoa(s),pk]},EV);
fs.writeFileSync(__dirname+'/sfx.wav',Buffer.from(b64[0],'base64'));console.log('sfx.wav tepe',b64[1].toFixed(3));
fs.writeFileSync(__dirname+'/times.json',JSON.stringify({tap3,T,pass4:T[3]+(MK.game.tap2-MK.game.tap1+10)/30+0.05,zir4:T[3]+2.3+8/30+0.08}));
await b.close()})();
