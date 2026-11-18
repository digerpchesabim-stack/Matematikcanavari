// Haritanın tamamı + durak daireleri: node test/mapshot.js çıktı.png
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const U='file://'+path.resolve(__dirname,'../index.html');
(async()=>{const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage();
await p.addInitScript(fs.readFileSync(__dirname+'/mockfb.js','utf8'));
await p.goto(U);await new Promise(r=>setTimeout(r,1200));
const d=await p.evaluate(async()=>{await document.fonts.load('italic 700 24px MCL');var c=document.createElement('canvas');c.width=GUM.W/2;c.height=GUM.H/2;var g=c.getContext('2d');g.scale(.5,.5);GUM.base(g);
GUM.ST.forEach(function(q,i){var n=i+1,big=[12,24,30,36,47,48,49].indexOf(n)>=0;g.beginPath();g.arc(q[0],q[1],big?40:26,0,7);g.fillStyle=big?'rgba(200,0,0,.6)':'rgba(0,0,200,.5)';g.fill();g.fillStyle='#fff';g.font='bold 22px sans-serif';g.textAlign='center';g.fillText(n,q[0],q[1]+8)});return c.toDataURL()});
fs.writeFileSync(process.argv[2],Buffer.from(d.split(',')[1],'base64'));await b.close()})();
