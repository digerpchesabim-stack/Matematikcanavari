/* Matematik Canavarı tanıtım videosu: sahne. Uygulama sayfasının içine eklenir (drawMonster, RKA, yazı tipi oradan gelir).
   PV.render(t) -> t anındaki kareyi kurar (tamamen t'nin fonksiyonu; kare kare kayıt için). */
(function(){
var W=1920,H=1080,CLIPS=window.__PV_CLIPS,MK=window.__PV_MARKS;
var T=[0,2.8,6.8,11.0,15.5,20.0,26.0,30.0];
var cl=function(x,a,b){return Math.max(a,Math.min(b,x))},pr=function(t,a,d){return cl((t-a)/d,0,1)},lerp=function(a,b,x){return a+(b-a)*x};
var E={o3:function(x){return 1-Math.pow(1-x,3)},i3:function(x){return x*x*x},io:function(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2},
  back:function(x){var c=1.9;return x<=0?0:x>=1?1:1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)},
  el:function(x){return x<=0?0:x>=1?1:Math.pow(2,-10*x)*Math.sin((x*10-0.75)*2.0944)+1},
  bo:function(x){var n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375}};
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mix(a,b,x){var o=[],i;for(i=0;i<3;i++)o.push(Math.round(lerp(a[i],b[i],x)));return o}
function rgb(c){return 'rgb('+c[0]+','+c[1]+','+c[2]+')'}
var EXT='0 2px 0 #1a3a9e,0 4px 0 #1a3a9e,0 6px 0 #17338d,0 8px 0 #142c7a,0 22px 30px rgba(6,14,60,.45)';
var EXG='0 2px 0 #d99a00,0 4px 0 #d99a00,0 6px 0 #bd8400,0 8px 0 #a37200,0 22px 30px rgba(6,14,60,.45)';
var css='#PV{position:fixed;left:0;top:0;width:1920px;height:1080px;z-index:2147483600;overflow:hidden;background:#1a3a9e;font-family:"MCP",Poppins,sans-serif;color:#fff;zoom:1;line-height:1.1}'+
'#PV *{box-sizing:border-box}#PV .ab{position:absolute;left:0;top:0;will-change:transform}#PV .sc{position:absolute;left:0;top:0;width:1920px;height:1080px;display:none}'+
'#PV .H{font-weight:700;font-size:96px;line-height:1.06;letter-spacing:-.015em;white-space:nowrap;text-shadow:'+EXT+'}#PV .H b{color:#ffd23f;font-weight:700;text-shadow:'+EXG+'}#PV .H .w{display:inline-block;white-space:pre}'+
'#PV .L{font-weight:500;font-size:34px;padding:12px 30px;border-radius:999px;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.4);white-space:nowrap;box-shadow:0 10px 24px rgba(6,14,60,.25)}'+
'#PV .ph{width:444px;height:887px;margin:-443px 0 0 -222px}#PV .ph .phb{position:absolute;left:0;top:0;right:0;bottom:0;border-radius:58px;background:linear-gradient(145deg,#2a3154,#0b0f22 40%,#05070f);box-shadow:0 0 0 2px rgba(255,255,255,.18) inset,0 50px 90px rgba(4,10,50,.55),0 12px 24px rgba(4,10,50,.4)}'+
'#PV .ph .phs{position:absolute;left:12px;top:12px;right:12px;bottom:12px;border-radius:46px;overflow:hidden;background:#eef2ff}#PV .ph img{position:absolute;left:0;top:0;width:100%;height:100%;display:block}'+
'#PV .ph .phn{position:absolute;left:50%;top:22px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#05070f;box-shadow:0 0 0 2px rgba(255,255,255,.08)}'+
'#PV .ph .phg{position:absolute;left:12px;top:12px;right:12px;bottom:12px;border-radius:46px;background:linear-gradient(115deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,0) 28%,rgba(255,255,255,0) 100%);pointer-events:none}'+
'#PV .ph .phf{position:absolute;left:12px;top:12px;right:12px;bottom:12px;border-radius:46px;background:#fff;opacity:0}'+
'#PV .big3{font-weight:700;font-size:190px;color:#ffd23f;text-shadow:0 3px 0 #d99a00,0 6px 0 #d99a00,0 9px 0 #bd8400,0 12px 0 #a37200,0 28px 34px rgba(6,14,60,.5)}'+
'#PV .chip{display:flex;align-items:center;gap:22px;background:#fff;color:#16205a;border-radius:999px;padding:12px 38px;font-weight:700;font-size:62px;box-shadow:0 8px 0 #c9d4ff,0 24px 40px rgba(6,14,60,.35);white-space:nowrap}#PV .chip i{font-style:normal;font-size:46px;opacity:.9}#PV .chip .a{color:#2f6bff}#PV .chip .b{color:#ff5e7e}'+
'#PV .bub{background:#fff;color:#16205a;font-weight:700;font-size:50px;padding:18px 34px;border-radius:40px;box-shadow:0 8px 0 #c9d4ff,0 22px 36px rgba(6,14,60,.3);white-space:nowrap}#PV .bub:after{content:"";position:absolute;bottom:-22px;width:44px;height:44px;background:#fff;transform:rotate(45deg);border-radius:8px;box-shadow:6px 6px 0 #c9d4ff}#PV .bub.l:after{right:60px}#PV .bub.r:after{left:60px}'+
'#PV .cap{font-weight:700;font-size:44px;text-align:center;white-space:nowrap;text-shadow:0 2px 0 #0d4763,0 4px 0 #0d4763,0 14px 22px rgba(4,30,50,.45)}#PV .cap small{display:block;font-weight:500;font-size:30px;opacity:.92;margin-top:6px}'+
'#PV .logo{font-weight:700;font-size:150px;line-height:.98;letter-spacing:-.02em;color:#fff;text-shadow:0 3px 0 #1a3a9e,0 6px 0 #1a3a9e,0 9px 0 #17338d,0 12px 0 #142c7a,0 30px 40px rgba(6,14,60,.5)}#PV .logo b{display:block;color:#ffd23f;text-shadow:0 3px 0 #d99a00,0 6px 0 #d99a00,0 9px 0 #bd8400,0 12px 0 #a37200,0 30px 40px rgba(6,14,60,.5)}'+
'#PV .pl1{font-weight:700;font-size:70px;color:#16205a;background:linear-gradient(#ffe07a,#ffc533);border-radius:999px;padding:16px 50px;box-shadow:0 9px 0 #d99a00,0 26px 40px rgba(6,14,60,.4);white-space:nowrap}'+
'#PV .med svg{width:150px;height:150px;display:block;filter:drop-shadow(0 14px 18px rgba(6,14,60,.45))}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var PV=document.createElement('div');PV.id='PV';document.body.appendChild(PV);
function el(tag,cls,html,par){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;(par||PV).appendChild(e);return e}
function tf(e,x,y,s,r,o,extra){e.style.transform='translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px) '+(extra||'')+' rotate('+(r||0).toFixed(3)+'deg) scale('+(s==null?1:s).toFixed(4)+')';if(o!=null)e.style.opacity=o.toFixed(3)}
function ctr(e){e.style.left='0';e.style.top='0';e.dataset.c='1';return e}
/* ortalanmış öğe: translate(-50%,-50%) */
function tc(e,x,y,s,r,o){tf(e,x,y,s,r,o,'translate(-50%,-50%)')}
function words(html){return html.replace(/(<[^>]+>)|([^\s<]+)(\s*)/g,function(m,tag,w,sp){return tag?tag:'<span class="w">'+w+'</span>'+(sp?'<span class="w"> </span>':'')})}
function wpop(e,t,t0,sg){var w=e.querySelectorAll('.w'),i,k=0;for(i=0;i<w.length;i++){if(w[i].textContent===' ')continue;var p=E.back(pr(t,t0+k*(sg||0.08),0.4));w[i].style.transform='translateY('+((1-p)*46).toFixed(1)+'px) scale('+(0.55+0.45*p).toFixed(3)+')';w[i].style.opacity=pr(t,t0+k*(sg||0.08),0.14).toFixed(3);k++}}
/* ---------- zemin ---------- */
var bg=el('div','ab');bg.style.cssText='position:absolute;left:0;top:0;width:1920px;height:1080px';
var symc=el('canvas','ab');symc.width=W;symc.height=H;var sx=symc.getContext('2d');
var PAL=[[[72,128,255],[24,52,150]],[[72,128,255],[24,52,150]],[[58,108,255],[18,34,118]],[[40,140,255],[16,54,140]],[[104,96,245],[34,26,112]],[[44,170,200],[14,72,108]],[[72,128,255],[24,52,150]]];
var SY=(function(){var r=rng(77),a=[],ch='+−×÷=1234567890%'.split(''),i;for(i=0;i<30;i++)a.push({c:ch[i%ch.length],x:r()*W,y:r()*H,s:70+r()*130,vx:(r()-.5)*14,vy:-10-r()*22,ro:r()*6.28,vr:(r()-.5)*.5,a:.05+r()*.07,ph:r()*6.28});return a})();
function drawBg(t,k,x){var a=PAL[k],b=PAL[Math.min(6,k+1)],c0=mix(a[0],b[0],x),c1=mix(a[1],b[1],x);
  bg.style.background='radial-gradient(1250px 900px at 50% 44%,'+rgb(c0)+' 0%,'+rgb(mix(c0,c1,.55))+' 55%,'+rgb(c1)+' 100%)';
  sx.clearRect(0,0,W,H);sx.textAlign='center';sx.textBaseline='middle';
  SY.forEach(function(s){var y=((s.y+s.vy*t)%(H+300)+H+300)%(H+300)-150,x2=((s.x+s.vx*t+Math.sin(t*.5+s.ph)*18)%(W+300)+W+300)%(W+300)-150;
    sx.save();sx.translate(x2,y);sx.rotate(s.ro+s.vr*t);sx.font='700 '+s.s.toFixed(0)+'px MCP,Poppins,sans-serif';
    sx.fillStyle='rgba(8,18,80,'+(s.a*1.2).toFixed(3)+')';sx.fillText(s.c,5,8);sx.fillStyle='rgba(255,255,255,'+s.a.toFixed(3)+')';sx.fillText(s.c,0,0);sx.restore()});
}
/* ---------- telefon ---------- */
var pend=[];
function phone(par){var p=el('div','ab ph','<div class="phb"></div><div class="phs"><img></div><div class="phg"></div><div class="phf"></div><div class="phn"></div>',par);p.img=p.querySelector('img');p.fl=p.querySelector('.phf');p.cur='';return p}
function clip(p,name,f){f=cl(Math.round(f),0,MK[name].frames-1);var u=CLIPS+name+'/f'+('000'+f).slice(-4)+'.jpg';if(p.cur===u)return;p.cur=u;p.img.src=u;pend.push(p.img)}
function ptf(p,x,y,ry,rx,s,o,rz){p.style.transform='translate('+x.toFixed(2)+'px,'+y.toFixed(2)+'px) perspective(1700px) rotateY('+(ry||0).toFixed(3)+'deg) rotateX('+(rx||0).toFixed(3)+'deg) rotate('+(rz||0).toFixed(3)+'deg) scale('+(s==null?1:s).toFixed(4)+')';p.style.opacity=(o==null?1:o).toFixed(3)}
/* ---------- canavar ---------- */
function monCanvas(par,n){var c=el('canvas','ab',null,par);c.width=c.height=n;c.style.width=c.style.height=n+'px';c.style.margin=(-n/2)+'px 0 0 '+(-n/2)+'px';c.cx=c.getContext('2d');return c}
function mon(c,r,o){var n=c.width;c.cx.clearRect(0,0,n,n);o=o||{};drawMonster(c.cx,n/2,n*0.47,r,o)}
/* ---------- konfeti ---------- */
var fx=null,BUR=[];
var CC=['#ffd23f','#ff5e7e','#4dd2ff','#3ddc97','#b388ff','#ff9f1c','#ffffff'];
function burst(t0,x,y,n,seed,pw,up){var e=30,i;for(i=1;i<T.length;i++)if(t0<T[i]){e=T[i];break}BUR.push({t:t0,x:x,y:y,n:n,s:seed,p:pw||900,u:up==null?1:up,e:e})}
function drawFx(t){var c=fx.cx;c.clearRect(0,0,W,H);
  BUR.forEach(function(b){var d=t-b.t;if(d<0||d>2.2||t>=b.e)return;var r=rng(b.s),i;
    for(i=0;i<b.n;i++){var an=-Math.PI/2+(r()-.5)*Math.PI*(b.u?1.25:2),sp=b.p*(.35+r()*.75),vx=Math.cos(an)*sp,vy=Math.sin(an)*sp,w=10+r()*14,h=6+r()*10,col=CC[(r()*CC.length)|0],ro=r()*6.28,vr=(r()-.5)*14,dr=.6+r()*.8;
      var k=1-Math.exp(-2.2*d),x=b.x+vx*k/2.2,y=b.y+vy*k/2.2+420*d*d*dr,a=cl(1.9-d,0,1);
      c.save();c.globalAlpha=a;c.translate(x,y);c.rotate(ro+vr*d);c.scale(1,Math.cos(d*9+ro));c.fillStyle=col;c.fillRect(-w/2,-h/2,w,h);c.restore()}});
}
/* yıldız parıltıları */
function star(c,x,y,r,a,col){c.save();c.globalAlpha=a;c.translate(x,y);c.fillStyle=col||'#fff';c.beginPath();for(var i=0;i<8;i++){var q=i*Math.PI/4,rr=i%2?r*.28:r;c.lineTo(Math.cos(q)*rr,Math.sin(q)*rr)}c.closePath();c.fill();c.restore()}
/* ============ SAHNE 1: açılış ============ */
var s1=el('div','sc');
var s1m=monCanvas(s1,900),s1x=el('div','ab big3','×',s1),s1cr=el('canvas','ab',null,s1);s1cr.width=W;s1cr.height=H;s1cr.cx=s1cr.getContext('2d');
var s1l=el('div','ab logo','<span class="w">Matematik</span><b><span class="w">Canavarı</span></b>',s1),s1t=el('div','ab pl1','Matematik… canavarca eğlenceli!',s1);s1t.style.fontSize='52px';
function sc1(t){var D=T[1]-T[0],mx=410,my=570,r=215;
  var land=E.bo(pr(t,0,0.62)),y=my-(1-land)*900,sq=1,x0=pr(t,2.55,0.25);
  var hit=cl(1-Math.abs(t-0.25)/0.09,0,1);sq=1-0.16*hit+0.07*cl(1-Math.abs(t-0.37)/0.1,0,1);
  /* × sembolü: sağ üstten ağza */
  var f=pr(t,0.5,0.72),fe=E.io(f),bx=lerp(1560,mx+70,fe),by=lerp(250,my+45,fe)-Math.sin(f*Math.PI)*210,eat=pr(t,1.22,0.1);
  tc(s1x,bx,by,lerp(1,0.36,E.i3(f))*(1-eat),f*-420,(t>0.42?pr(t,0.42,0.12):0)*(1-eat));
  var mo=E.o3(pr(t,0.78,0.34))*(1-pr(t,1.24,0.09)),chew=t>1.33&&t<1.95?Math.abs(Math.sin((t-1.33)*17))*0.32*(1-pr(t,1.7,0.25)):0;
  var hap=pr(t,1.3,0.15),gig=t>1.95?Math.sin((t-1.95)*30)*0.05*(1-pr(t,2.45,0.25)):0,bob=t>0.7?Math.sin((t-0.7)*5.2)*7:0;
  if(t>1.24&&t<1.4)sq=1-0.09*Math.sin(pr(t,1.24,0.16)*Math.PI);
  if(t>1.95)sq=1+Math.sin((t-1.95)*30)*0.025*(1-pr(t,2.45,0.25));
  var look=f>0&&eat<1?[cl((bx-mx)/700,-1,1)*0.9,cl((by-my)/500,-1,1)*0.8]:null,o={m:Math.max(mo,chew),happy:hap>0.5?1:0,yaw:lerp(-0.5,-0.15,pr(t,1.3,0.4)),pitch:0.05,roll:gig,sq:sq,blink:(t>0.66&&t<0.74)?1:0};
  if(look&&hap<0.5)o.look=look;
  mon(s1m,r,o);tf(s1m,mx-x0*80,y+bob*(1-x0),1,0,1-x0);
  /* kırıntılar */
  var c=s1cr.cx;c.clearRect(0,0,W,H);var d=t-1.27;if(d>0&&d<0.9){var rr=rng(5),i;for(i=0;i<16;i++){var an=-Math.PI/2+(rr()-.5)*2.6,sp=260+rr()*420,px=mx+70+Math.cos(an)*sp*d,py=my+45+Math.sin(an)*sp*d+900*d*d,sz=6+rr()*10;c.globalAlpha=cl(1-d/0.9,0,1);c.fillStyle=i%3?'#ffd23f':'#fff3b0';c.beginPath();c.arc(px,py,sz,0,6.28);c.fill()}c.globalAlpha=1}
  if(t>1.3){var q,rs=rng(9);for(q=0;q<7;q++){var ph=rs()*6.28,sxx=mx+(rs()-.5)*640,syy=my-80+(rs()-.5)*520,a=Math.max(0,Math.sin((t-1.3)*4+ph))*(1-x0)*pr(t,1.3,0.3);star(c,sxx,syy,14+rs()*18,a*.9,'#fff6c9')}}
  /* logo */
  var ws=s1l.querySelectorAll('.w'),p1=E.back(pr(t,1.38,0.45)),p2=E.back(pr(t,1.56,0.45));
  ws[0].style.cssText='display:inline-block;transform:translateY('+((1-p1)*70)+'px) scale('+(0.5+0.5*p1)+');opacity:'+pr(t,1.38,0.12);
  ws[1].style.cssText='display:inline-block;transform:translateY('+((1-p2)*70)+'px) scale('+(0.5+0.5*p2)+');opacity:'+pr(t,1.56,0.12);
  tf(s1l,770+x0*120,270,1,0,1-x0);
  var p3=E.back(pr(t,1.95,0.4));tf(s1t,772+x0*160,690+(1-p3)*40,0.7+0.3*p3,-2,pr(t,1.95,0.14)*(1-x0));s1t.style.transformOrigin='0 50%';
}
/* ============ SAHNE 2: çocuklar ============ */
var s2=el('div','sc'),s2zz=el('div','ab',null,s2),s2z=el('div','ab',null,s2zz);s2zz.style.cssText='position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:740px 650px';s2z.style.cssText='position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:960px 930px;transform:scale(1.16)';
function kid(id,c){
  var back=c.girl?'<circle cx="-94" cy="-44" r="40" fill="'+c.hair+'"/><circle cx="94" cy="-44" r="40" fill="'+c.hair+'"/><circle cx="-72" cy="-30" r="14" fill="#ffd23f"/><circle cx="72" cy="-30" r="14" fill="#ffd23f"/>':'';
  var front=c.girl?'<path d="M-84,-2 C-90,-72 -44,-96 0,-96 C44,-96 90,-72 84,-2 C70,-44 34,-58 -6,-54 C-42,-52 -70,-38 -84,-2 Z" fill="'+c.hair+'"/>':
    '<path d="M-82,-10 C-92,-78 -44,-100 4,-98 C48,-98 92,-74 82,-10 L68,-42 L50,-20 L32,-48 L10,-22 L-12,-50 L-32,-22 L-56,-46 Z" fill="'+c.hair+'"/>';
  return '<g id="'+id+'"><g class="bd">'+
   '<path d="M-64,-150 C-64,-196 -40,-200 0,-200 C40,-200 64,-196 64,-150 L62,-10 C62,14 46,18 0,18 C-46,18 -62,14 -62,-10 Z" fill="'+c.hood+'"/>'+
   '<path d="M-40,-196 Q0,-160 40,-196" fill="none" stroke="'+c.hoodD+'" stroke-width="10" stroke-linecap="round"/>'+
   '<g class="lg"><g class="l1"><rect x="-55" y="-4" width="48" height="86" rx="22" fill="'+c.pants+'"/><circle cx="-31" cy="4" r="29" fill="'+c.pantsL+'"/><ellipse cx="-31" cy="88" rx="33" ry="19" fill="'+c.shoe+'"/><ellipse cx="-31" cy="96" rx="33" ry="9" fill="'+c.sole+'"/></g><g class="l2"><rect x="7" y="-4" width="48" height="86" rx="22" fill="'+c.pants+'"/><circle cx="31" cy="4" r="29" fill="'+c.pantsL+'"/><ellipse cx="31" cy="88" rx="33" ry="19" fill="'+c.shoe+'"/><ellipse cx="31" cy="96" rx="33" ry="9" fill="'+c.sole+'"/></g></g>'+
   '<rect x="-17" y="-222" width="34" height="34" rx="10" fill="'+c.skinD+'"/>'+
   '<ellipse class="gl" cx="0" cy="-120" rx="78" ry="62" fill="#bfe0ff" opacity=".35"/>'+
   '<g class="an"><path d="M-58,-160 Q-112,-92 -30,-76" fill="none" stroke="'+c.hoodD+'" stroke-width="36" stroke-linecap="round"/><path d="M58,-160 Q112,-92 30,-76" fill="none" stroke="'+c.hoodD+'" stroke-width="36" stroke-linecap="round"/>'+
     '<g class="pn"><rect x="-33" y="-152" width="66" height="106" rx="14" fill="#2f6bff" stroke="#1a3a9e" stroke-width="4"/><circle cx="0" cy="-104" r="17" fill="#8b5cf6"/><circle cx="-6" cy="-107" r="4.5" fill="#fff"/><circle cx="6" cy="-107" r="4.5" fill="#fff"/><circle cx="-19" cy="-138" r="5" fill="#0b1020"/></g>'+
     '<circle class="h1" cx="-31" cy="-70" r="19" fill="'+c.skin+'"/><circle class="h2" cx="31" cy="-70" r="19" fill="'+c.skin+'"/></g>'+
   '<g class="au" style="display:none"><path d="M-58,-160 Q-128,-232 -112,-322" fill="none" stroke="'+c.hoodD+'" stroke-width="36" stroke-linecap="round"/><path d="M58,-160 Q128,-232 112,-322" fill="none" stroke="'+c.hoodD+'" stroke-width="36" stroke-linecap="round"/>'+
     '<g transform="translate(112,-356) rotate(16)"><rect x="-33" y="-53" width="66" height="106" rx="14" fill="#2f6bff" stroke="#1a3a9e" stroke-width="4"/><circle cx="0" cy="-5" r="17" fill="#8b5cf6"/><circle cx="-6" cy="-8" r="4.5" fill="#fff"/><circle cx="6" cy="-8" r="4.5" fill="#fff"/></g>'+
     '<circle cx="-112" cy="-326" r="20" fill="'+c.skin+'"/><circle cx="112" cy="-322" r="20" fill="'+c.skin+'"/></g>'+
   '<g class="hd"><g transform="translate(0,-280)">'+back+'<circle cx="-80" cy="8" r="16" fill="'+c.skinD+'"/><circle cx="80" cy="8" r="16" fill="'+c.skinD+'"/><circle cx="0" cy="0" r="82" fill="'+c.skin+'"/>'+front+
     '<g class="eo"><ellipse cx="-30" cy="6" rx="10.5" ry="13.5" fill="#232848"/><ellipse cx="30" cy="6" rx="10.5" ry="13.5" fill="#232848"/><circle cx="-26.5" cy="1" r="3.8" fill="#fff"/><circle cx="33.5" cy="1" r="3.8" fill="#fff"/></g>'+
     '<g class="ec" style="display:none"><path d="M-43,10 Q-30,-8 -17,10" fill="none" stroke="#232848" stroke-width="6.5" stroke-linecap="round"/><path d="M17,10 Q30,-8 43,10" fill="none" stroke="#232848" stroke-width="6.5" stroke-linecap="round"/></g>'+
     '<g class="br"><path d="M-42,-20 Q-30,-27 -18,-21" fill="none" stroke="'+c.hair+'" stroke-width="5.5" stroke-linecap="round"/><path d="M18,-21 Q30,-27 42,-20" fill="none" stroke="'+c.hair+'" stroke-width="5.5" stroke-linecap="round"/></g>'+
     '<ellipse cx="-52" cy="32" rx="15" ry="10" fill="#ff7d93" opacity=".5"/><ellipse cx="52" cy="32" rx="15" ry="10" fill="#ff7d93" opacity=".5"/>'+
     '<path class="ms" d="M-16,36 Q0,52 16,36" fill="none" stroke="#7a2a33" stroke-width="6" stroke-linecap="round"/>'+
     '<g class="mo" style="display:none"><path d="M-27,30 Q0,84 27,30 Z" fill="#6b1d2a"/><path d="M-21,33 Q0,42 21,33 L24,30 L-24,30 Z" fill="#fff"/><ellipse cx="0" cy="58" rx="12" ry="8" fill="#ff7b8a"/></g>'+
   '</g></g></g></g>';
}
var KL={girl:1,skin:'#f8cfa6',skinD:'#eab98c',hood:'#ff5e7e',hoodD:'#e84a6b',pants:'#3b4cc0',pantsL:'#4a5cd6',shoe:'#ffffff',sole:'#d5dcf5',hair:'#5a3320'},KR={girl:0,skin:'#dba673',skinD:'#c98f5c',hood:'#2ec4a6',hoodD:'#1fa98d',pants:'#27337a',pantsL:'#33429a',shoe:'#ffd23f',sole:'#e0a800',hair:'#22252f'};
el('div','ab','<svg width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="pvw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f7dff"/><stop offset="1" stop-color="#8aabff"/></linearGradient><linearGradient id="pvs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe4ff"/><stop offset="1" stop-color="#eaf6ff"/></linearGradient></defs>'+
  '<rect width="1920" height="1080" fill="url(#pvw)"/>'+
  '<g opacity=".16" fill="#fff"><circle cx="150" cy="620" r="7"/><circle cx="330" cy="700" r="7"/><circle cx="1620" cy="640" r="7"/><circle cx="1790" cy="720" r="7"/><circle cx="1700" cy="130" r="7"/><circle cx="700" cy="250" r="7"/><circle cx="1240" cy="230" r="7"/></g>'+
  '<g transform="translate(90,170)"><rect width="300" height="380" rx="28" fill="#fff"/><rect x="16" y="16" width="268" height="348" rx="16" fill="url(#pvs)"/><circle cx="210" cy="96" r="38" fill="#ffd23f"/><ellipse cx="96" cy="150" rx="56" ry="22" fill="#fff"/><ellipse cx="136" cy="134" rx="40" ry="22" fill="#fff"/><ellipse cx="200" cy="250" rx="50" ry="18" fill="#fff"/><rect x="144" y="16" width="12" height="348" fill="#fff"/><rect x="16" y="184" width="268" height="12" fill="#fff"/></g>'+
  '<g transform="translate(1540,190)"><rect width="270" height="210" rx="22" fill="#fff"/><rect x="14" y="14" width="242" height="182" rx="12" fill="#2f6bff"/><text x="135" y="130" text-anchor="middle" font-family="MCP,Poppins" font-weight="700" font-size="78" fill="#ffd23f">+ − × ÷</text></g>'+
  '<rect y="850" width="1920" height="230" fill="#3346b8"/><rect y="850" width="1920" height="14" fill="#2a3a9e"/><ellipse cx="960" cy="985" rx="760" ry="86" fill="#4d63e0"/><ellipse cx="960" cy="985" rx="690" ry="66" fill="#5a70ea"/>'+
  '<g transform="translate(1660,560)"><rect x="-46" y="210" width="92" height="96" rx="16" fill="#ff9f1c"/><path d="M0,220 C-90,150 -110,40 -40,-20 C-30,60 -10,120 0,220 Z" fill="#3ddc97"/><path d="M0,220 C90,150 120,20 50,-50 C36,50 14,120 0,220 Z" fill="#2fc487"/><path d="M0,220 C-20,120 -10,10 10,-90 C34,10 30,120 0,220 Z" fill="#52e6a6"/></g>'+
  '<g transform="translate(250,630)"><rect x="-70" y="150" width="140" height="80" rx="12" fill="#5b70ea"/><rect x="-10" y="30" width="20" height="130" fill="#2a3a9e"/><path d="M-80,40 L80,40 L54,-60 L-54,-60 Z" fill="#ffd23f"/></g>'+
  '</svg>',s2z);
var s2m=monCanvas(s2z,460);
var s2f=el('div','ab','<svg width="1920" height="1080" viewBox="0 0 1920 1080">'+
  '<rect x="500" y="518" width="920" height="300" rx="56" fill="#ffb627"/><rect x="500" y="518" width="920" height="60" rx="30" fill="#ffc94d"/><path d="M960,560 L960,790" stroke="#f0a013" stroke-width="6"/>'+
  '<rect x="412" y="660" width="130" height="260" rx="50" fill="#f5a01c"/><rect x="1378" y="660" width="130" height="260" rx="50" fill="#f5a01c"/>'+
  '<rect x="470" y="772" width="980" height="140" rx="44" fill="#ffcf5c"/><rect x="470" y="868" width="980" height="44" rx="22" fill="#f0a826"/>'+
  '<rect x="520" y="908" width="40" height="34" rx="8" fill="#7a4b12"/><rect x="1360" y="908" width="40" height="34" rx="8" fill="#7a4b12"/>'+
  '<g id="pvkl">'+kid('kL',KL)+'</g><g id="pvkr">'+kid('kR',KR)+'</g></svg>',s2z);
var s2h=el('div','ab H',words('Arkadaşınla <b>kapış!</b>'),s2),s2n=el('div','ab big3','3',s2),s2c=el('div','ab chip','<span>🦊</span><span class="a" id="pva">0</span><i>⚔️</i><span class="b" id="pvb">0</span><span>🐼</span>',s2);
var s2b1=el('div','ab bub l','Evet! 🎉',s2),s2b2=el('div','ab bub r','Rövanş! 😄',s2),s2p=[];
(function(){for(var i=0;i<5;i++){var e=el('div','ab','+1',s2);e.style.cssText='position:absolute;left:0;top:0;font-weight:700;font-size:64px;color:#ffd23f;text-shadow:0 3px 0 #b37f00,0 10px 16px rgba(6,14,60,.4)';s2p.push(e)}})();
var HITS=[[1.9,0],[2.12,1],[2.36,0],[2.62,1],[2.95,0]];
function kset(g,x,y,k){var q=function(s){return g.querySelector(s)};
  g.setAttribute('transform','translate('+x+','+(y+(k.dy||0)).toFixed(2)+') scale('+(1.15*(k.sx||1)).toFixed(4)+','+(1.15*(k.sy||1)).toFixed(4)+')');
  q('.bd').setAttribute('transform','rotate('+(k.br||0).toFixed(2)+')');
  q('.hd').setAttribute('transform','rotate('+(k.hr||0).toFixed(2)+' 0 -205) translate(0,'+(k.hy||0).toFixed(2)+')');
  q('.eo').style.display=k.ec?'none':'';q('.ec').style.display=k.ec?'':'none';q('.eo').setAttribute('transform','translate('+(k.lx||0)+','+(k.ly||0)+')');
  q('.ms').style.display=k.mo?'none':'';q('.mo').style.display=k.mo?'':'none';q('.mo').setAttribute('transform','translate(0,30) scale(1,'+(k.mo||1).toFixed(3)+') translate(0,-30)');
  q('.an').style.display=k.up?'none':'';q('.au').style.display=k.up?'':'none';q('.gl').style.display=k.up?'none':'';
  q('.h1').setAttribute('transform','translate('+(k.j1||0).toFixed(2)+','+(k.j1y||0).toFixed(2)+')');q('.h2').setAttribute('transform','translate('+(k.j2||0).toFixed(2)+','+(k.j2y||0).toFixed(2)+')');
  q('.l1').setAttribute('transform','rotate('+(k.s1||0).toFixed(2)+' -31 4)');q('.l2').setAttribute('transform','rotate('+(k.s2||0).toFixed(2)+' 31 4)');
  q('.br').setAttribute('transform','translate(0,'+(k.by||0)+')');
}
function sc2(t){var D=T[2]-T[1],inn=E.o3(pr(t,0,0.4)),z=pr(t,3.72,0.28),ze=E.i3(z);
  s2zz.style.transform='translateY('+((1-inn)*90).toFixed(2)+'px) scale('+(1+ze*2.4).toFixed(4)+')';s2zz.style.opacity=pr(t,0,0.2).toFixed(3);
  var fr=t>1.58&&t<2.98,win=t>=2.98,wt=t-2.98,kl={},kr={};
  /* ortak: nefes, bacak sallama */
  kl.s1=Math.sin(t*5)*9;kl.s2=Math.sin(t*5+2.2)*9;kr.s1=Math.sin(t*4.4+1)*8;kr.s2=Math.sin(t*4.4+3.4)*8;
  kl.hy=Math.sin(t*3)*2;kr.hy=Math.sin(t*3+1)*2;
  if(t<1.58){kl.lx=5;kl.ly=-2;kr.lx=-5;kr.ly=-2;kl.hr=Math.sin(t*2.2)*2+3;kr.hr=Math.sin(t*2.2+1)*2-3;var cnt=(t>0.38)?Math.sin(pr((t-0.38)%0.4,0,0.4)*Math.PI):0;kl.hy-=cnt*4;kr.hy-=cnt*4}
  if(fr){var a=Math.sin(t*38),b=Math.sin(t*33+1);kl.j1y=a>0?-7:0;kl.j2y=a>0?0:-7;kr.j1y=b>0?-7:0;kr.j2y=b>0?0:-7;kl.ly=7;kr.ly=7;kl.hr=4+Math.sin(t*9)*1.5;kr.hr=-4+Math.sin(t*8+2)*1.5;kl.hy+=6;kr.hy+=6;kl.by=3;kr.by=3;kl.br=Math.sin(t*19)*0.8;kr.br=Math.sin(t*17+1)*0.8;
    HITS.forEach(function(h){var d=t-h[0];if(d>0&&d<0.3){var k=h[1]?kr:kl;k.mo=0.5;k.hy-=Math.sin(d/0.3*Math.PI)*10;k.ly=0}})}
  if(win){var j1=pr(wt,0,0.46),j2=pr(wt,0.46,0.34);kl.up=1;kl.dy=-Math.sin(j1*Math.PI)*78-Math.sin(j2*Math.PI)*46;kl.mo=1;kl.ec=1;kl.by=-5;kl.hr=Math.sin(wt*16)*4;kl.s1=-22*Math.sin(j1*Math.PI)+kl.s1*.3;kl.s2=22*Math.sin(j1*Math.PI)+kl.s2*.3;
    var sqz=wt<0.06?1-wt/0.06*0.08:1;kl.sy=sqz*(1+Math.sin(j1*Math.PI)*0.04);kl.sx=2-kl.sy;
    kr.ec=wt>0.25?1:0;kr.mo=wt>0.25?0.8+Math.sin(wt*24)*0.2:0;kr.hr=wt>0.25?-9+Math.sin(wt*22)*4:-2;kr.br=wt>0.25?Math.sin(wt*22)*1.6:0;kr.lx=-7;kr.ly=-4;kr.hy+=wt>0.25?Math.abs(Math.sin(wt*22))*-5:0;kr.j1y=0}
  kset(document.getElementById('kL'),770,806,kl);kset(document.getElementById('kR'),1150,806,kr);
  /* canavar koltuğun arkasından bakar */
  var pk=E.back(pr(t,0.55,0.5)),mh=win?1:0,lk=win?[-0.7,0.2]:(fr?[Math.sin(t*6)*0.8,0.5]:[0,0.3]);
  mon(s2m,120,{yaw:win?0.35:Math.sin(t*1.6)*0.25,pitch:0.1,happy:mh,m:win?0.6:0,look:mh?null:lk,nosh:1,blink:(t>1.2&&t<1.28)?1:0,roll:win?Math.sin(wt*14)*0.08:0});
  tf(s2m,960,640-pk*150+(win?-Math.abs(Math.sin(wt*9))*26:Math.sin(t*2.4)*5),1,0,1);
  /* başlık */
  wpop(s2h,t,0.12,0.1);var hw=win?pr(wt,0,0.22):0;tc(s2h,960,92-hw*60,1,0,(1-z)*(1-hw));
  /* geri sayım */
  var ci=Math.floor((t-0.38)/0.4),show=t>=0.38&&t<2.0,txt=ci<3?String(3-ci):'BAŞLA!',lt=ci<3?(t-0.38)%0.4:t-1.58,dn=ci<3?0.4:0.42;
  if(show){s2n.textContent=txt;s2n.style.fontSize=ci<3?'190px':'112px';var pp=E.back(pr(lt,0,0.2));tc(s2n,960,ci<3?285:232,(0.4+0.6*pp)*(1+pr(lt,dn-0.12,0.12)*0.25),ci<3?0:-4,pr(lt,0,0.06)*(1-pr(lt,dn-0.1,0.1)))}else s2n.style.opacity='0';
  /* skor */
  var A=0,B=0;HITS.forEach(function(h){if(t>=h[0]){if(h[1])B++;else A++}});document.getElementById('pva').textContent=A;document.getElementById('pvb').textContent=B;
  var cp=E.back(pr(t,1.98,0.3)),bump=0;HITS.forEach(function(h){var d=t-h[0];if(d>0&&d<0.2)bump=Math.sin(d/0.2*Math.PI)*0.12});
  var cw=win?E.o3(pr(wt,0,0.3)):0;tc(s2c,960,232-cw*122,(0.5+0.5*cp)*(1+bump)*(1+cw*0.12),0,pr(t,1.98,0.1)*(1-z));
  HITS.forEach(function(h,i){var d=t-h[0],e=s2p[i];if(i<4&&d>0&&d<0.6){tc(e,(h[1]?1180:740)+(h[1]?120:-120),330-d*150,0.6+E.back(pr(d,0,0.2))*0.5,0,1-pr(d,0.35,0.25))}else e.style.opacity='0'});
  /* konuşma balonları */
  var b1=E.back(pr(wt,0.1,0.3)),b2=E.back(pr(wt,0.42,0.3));
  tc(s2b1,400,330,win?b1:0,-5,win?pr(wt,0.1,0.08)*(1-z):0);tc(s2b2,1500,330,win?b2:0,4,win?pr(wt,0.42,0.08)*(1-z):0);
}
/* ============ SAHNE 3: 1'e 1 kapışma ============ */
var s3=el('div','sc'),s3p=phone(s3),s3l=el('div','ab L','⚔️ 1’e 1 Kapışma',s3),s3h=el('div','ab H',words('Önce doğru<br>bilen <b>kazanır!</b>'),s3),s3s=el('div','ab pl1','+1 puan',s3);
function exitX(e,t,D){var x=pr(t,D-0.24,0.24);e.style.opacity=(1-x).toFixed(3);e.style.transform='translateX('+(-E.i3(x)*110).toFixed(2)+'px)';return x}
function sc3(t){var D=T[3]-T[2];exitX(s3,t,D);
  var e=E.back(pr(t,0,0.5)),fl=Math.sin(t*1.7)*6,q0=MK.duel.q0,f;
  if(t<1.28)f=24+t*30;else f=q0+4+(t-1.28)*30;clip(s3p,'duel',f);
  s3p.fl.style.opacity=(cl(1-Math.abs(t-1.28)/0.1,0,1)*0.85).toFixed(3);
  var tapT=1.28+(MK.duel.tap0-q0-4)/30,pu=cl(1-Math.abs(t-tapT-0.12)/0.14,0,1);
  ptf(s3p,560,560+(1-e)*500+fl,16-pu*3,3,(0.72+0.28*e)*(1+pu*0.035),pr(t,0,0.15),-2);
  var lp=E.back(pr(t,0.3,0.35));tf(s3l,1010,268+(1-lp)*30,1,0,pr(t,0.3,0.12));
  wpop(s3h,t,0.42,0.09);tf(s3h,1004,372,1.12,0,1);s3h.style.transformOrigin='0 0';
  var sp=E.back(pr(t,tapT+0.1,0.35));tf(s3s,1010,690+(1-sp)*30,0.6+0.4*sp,-3,pr(t,tapT+0.1,0.1));s3s.style.transformOrigin='0 50%';
}
/* ============ SAHNE 4: Akıldan İşlem ============ */
var s4=el('div','sc'),s4p=phone(s4),s4l=el('div','ab L','🧠 Akıldan İşlem',s4),s4h=el('div','ab H',words('Hızlı düşün,<br><b>rekor kır!</b>'),s4),s4s=el('div','ab pl1','👑 Zirveye çıktın!',s4);
function sc4(t){var D=T[4]-T[3];exitX(s4,t,D);
  var e=E.back(pr(t,0,0.5)),fl=Math.sin(t*1.7+1)*6,G=MK.game,f,cA=2.3,cB=3.5;
  if(t<cA){clip(s4p,'game',G.tap1-10+t*30)}else if(t<cB){clip(s4p,'game',G.tap6-8+(t-cA)*30)}else clip(s4p,'lb',12+(t-cB)*30);
  s4p.fl.style.opacity=(Math.max(cl(1-Math.abs(t-cA)/0.1,0,1),cl(1-Math.abs(t-cB)/0.1,0,1))*0.85).toFixed(3);
  ptf(s4p,1360,560+(1-e)*500+fl,-16,3,0.72+0.28*e,pr(t,0,0.15),2);
  var lp=E.back(pr(t,0.25,0.35));tf(s4l,150,268+(1-lp)*30,1,0,pr(t,0.25,0.12));
  wpop(s4h,t,0.36,0.09);tf(s4h,144,372,1.12,0,1);s4h.style.transformOrigin='0 0';
  var zt=cA+0.32,sp=E.back(pr(t,zt,0.35));tf(s4s,150,690+(1-sp)*30,0.6+0.4*sp,-3,pr(t,zt,0.1));s4s.style.transformOrigin='0 50%';
}
/* ============ SAHNE 5: takım + rütbe ============ */
var s5=el('div','sc'),s5a=phone(s5),s5b=phone(s5),s5h1=el('div','ab H',words('Takımını kur'),s5),s5h2=el('div','ab H',words('<b>Rütbe atla</b>'),s5),s5h3=el('div','ab H',words('Madalya topla'),s5),s5m=[];
function sc5(t){var D=T[5]-T[4];exitX(s5,t,D);
  var e=E.back(pr(t,0,0.5)),e2=E.back(pr(t,0.55,0.5)),cut=1.6;
  if(t<cut)clip(s5a,'team',8+t*30);else clip(s5a,'podium',(t-cut)*30);
  s5a.fl.style.opacity=(cl(1-Math.abs(t-cut)/0.1,0,1)*0.85).toFixed(3);
  if(t<1.9)clip(s5b,'kart',Math.max(0,8+(t-0.55)*30));else clip(s5b,'rank',2+(t-1.9)*30);
  s5b.fl.style.opacity=(cl(1-Math.abs(t-1.9)/0.1,0,1)*0.85).toFixed(3);
  ptf(s5a,330,560+(1-e)*500+Math.sin(t*1.7)*6,14,3,0.72+0.28*e,pr(t,0,0.15),-2);
  ptf(s5b,1590,560+(1-e2)*500+Math.sin(t*1.7+2)*6,-14,3,0.72+0.28*e2,pr(t,0.55,0.15),2);
  wpop(s5h1,t,0.3,0.1);tc(s5h1,960,250,0.9,0,1);
  wpop(s5h2,t,2.05,0.1);tc(s5h2,960,400,0.9,0,1);
  wpop(s5h3,t,2.85,0.1);tc(s5h3,960,550,0.9,0,1);
  s5m.forEach(function(m,i){var p=E.back(pr(t,3.1+i*0.16,0.4));tc(m,960+(i-1)*190,760+(1-p)*60,p,(1-p)*-40+Math.sin(t*3+i)*3,pr(t,3.1+i*0.16,0.1))});
}
/* ============ SAHNE 6: öğretici ve güvenli ============ */
var s6=el('div','sc'),s6h=el('div','ab H',words('Öğretici ve <b>güvenli</b>'),s6),s6p=[phone(s6),phone(s6),phone(s6)],
  s6c=[el('div','ab cap','💡 Adım adım çözüm<small>Takılınca yol gösterir</small>',s6),el('div','ab cap','🔊 Sesli okuma<small>Problemi sesli dinle</small>',s6),el('div','ab cap','🛡️ Hazır adlar ve mesajlar<small>Serbest yazışma yok</small>',s6)],s6w=el('canvas','ab',null,s6);
s6w.width=W;s6w.height=H;s6w.cx=s6w.getContext('2d');
function sc6(t){var D=T[6]-T[5];exitX(s6,t,D);
  wpop(s6h,t,0.15,0.1);tc(s6h,960,96,0.88,0,1);
  var X=[400,960,1520],T0=[0.35,1.45,2.55],S=0.8,i;
  for(i=0;i<3;i++){var e=E.back(pr(t,T0[i],0.55)),a=pr(t,T0[i],0.15),lt=t-T0[i];
    ptf(s6p[i],X[i],528+(1-e)*420+Math.sin(t*1.5+i*2)*5,(1-i)*7,2,S*(0.75+0.25*e),a,0);
    var c=E.back(pr(t,T0[i]+0.3,0.4));tc(s6c[i],X[i],968+(1-c)*30,0.8+0.2*c,0,pr(t,T0[i]+0.3,0.12))}
  clip(s6p[0],'solve',MK.solve.sol-8+Math.max(0,t-0.35)*30);
  clip(s6p[1],'tts',10+Math.max(0,t-1.45)*30);
  clip(s6p[2],'msg',Math.max(0,t-2.55)*30);
  /* ses dalgaları */
  var c2=s6w.cx;c2.clearRect(0,0,W,H);var on=T0[1]+(MK.tts.on-10)/30+0.1;
  if(t>on){var k;c2.lineCap='round';for(k=0;k<3;k++){var ph=((t-on)*1.3+k/3)%1,r0=40+ph*120,al=(1-ph)*0.9*pr(t,on,0.2);c2.strokeStyle='rgba(255,255,255,'+al.toFixed(3)+')';c2.lineWidth=9;
      c2.beginPath();c2.arc(X[1]+165,300,r0,-0.7,0.7);c2.stroke();c2.beginPath();c2.arc(X[1]-165,300,r0,Math.PI-0.7,Math.PI+0.7);c2.stroke()}}
}
/* ============ SAHNE 7: kapanış ============ */
var s7=el('div','sc'),s7p=phone(s7),s7m=monCanvas(s7,900),s7l=el('div','ab logo','<span class="w">Matematik</span><b><span class="w">Canavarı</span></b>',s7),s7t=el('div','ab pl1',window.__PV_END==='sosyal'?'İndir · Oyna · Öğren':'Topla · Çıkar · Çarp · Böl',s7);s7t.style.fontSize=window.__PV_END==='sosyal'?'72px':'60px',s7a=el('div','ab L',window.__PV_END==='sosyal'?'Google Play’de':'Dört işlem artık bir oyun',s7),s7s=el('canvas','ab',null,s7);
s7s.width=W;s7s.height=H;s7s.cx=s7s.getContext('2d');
function sc7(t){var D=T[7]-T[6],mx=350,my=560,r=178;
  var e=E.back(pr(t,0,0.6)),hop=Math.abs(Math.sin(t*4.2)),land=1-cl(hop/0.25,0,1),sq=1+0.05*hop-0.07*land;
  mon(s7m,r,{m:0.45+Math.sin(t*8.4)*0.12,happy:(t%1.6)<1.0?1:0,yaw:0.28+Math.sin(t*2.1)*0.12,pitch:0.04,roll:Math.sin(t*4.2)*0.07,sq:sq});
  tf(s7m,mx,my+(1-e)*600-hop*46,1,0,pr(t,0,0.12));
  var ws=s7l.querySelectorAll('.w'),p1=E.back(pr(t,0.3,0.45)),p2=E.back(pr(t,0.48,0.45));
  ws[0].style.cssText='display:inline-block;transform:translateY('+((1-p1)*70)+'px) scale('+(0.5+0.5*p1)+');opacity:'+pr(t,0.3,0.12);
  ws[1].style.cssText='display:inline-block;transform:translateY('+((1-p2)*70)+'px) scale('+(0.5+0.5*p2)+');opacity:'+pr(t,0.48,0.12);
  tf(s7l,640,250,1,0,1);
  var p3=E.back(pr(t,0.95,0.4));tf(s7t,642,640+(1-p3)*40,0.7+0.3*p3,-2,pr(t,0.95,0.14));s7t.style.transformOrigin='0 50%';
  var p4=E.back(pr(t,1.35,0.4));tf(s7a,646,790+(1-p4)*30,window.__PV_END==='sosyal'?1.3:1,0,pr(t,1.35,0.14));s7a.style.transformOrigin='0 50%';
  var e2=E.back(pr(t,0.5,0.6));clip(s7p,'home',Math.min(89,t*30));ptf(s7p,1725,580+(1-e2)*600+Math.sin(t*1.6)*8,-20,4,0.74,pr(t,0.5,0.15),5);
  var c=s7s.cx;c.clearRect(0,0,W,H);var rs=rng(21),q;for(q=0;q<12;q++){var ph=rs()*6.28,x=rs()*W,y=rs()*H*0.9,a=Math.max(0,Math.sin(t*3.2+ph))*pr(t,0.4,0.4);star(c,x,y,10+rs()*20,a*.85,'#fff6c9')}
}
/* ---------- ortak üst katmanlar ---------- */
fx=el('canvas','ab');fx.width=W;fx.height=H;fx.cx=fx.getContext('2d');
var flash=el('div','ab');flash.style.cssText='position:absolute;left:0;top:0;width:1920px;height:1080px;background:#eaf1ff;opacity:0';
var fade=el('div','ab');fade.style.cssText='position:absolute;left:0;top:0;width:1920px;height:1080px;background:#0b1640;opacity:0';
/* patlamalar (mutlak zaman) */
burst(T[1]+3.0,740,330,80,11,1300);burst(T[1]+3.08,1180,380,30,12,900);
burst(T[2]+1.28+(MK.duel.tap0-MK.duel.q0-4)/30+0.08,560,430,60,13,1150);
burst(T[3]+2.3+0.3,1360,420,70,14,1200);
burst(T[4]+1.65,330,330,60,15,1150);burst(T[4]+2.1,1590,330,60,16,1150);
burst(T[6]+0.55,350,420,80,17,1300);burst(T[6]+0.75,1050,300,60,18,1200);
var SC=[[s1,sc1],[s2,sc2],[s3,sc3],[s4,sc4],[s5,sc5],[s6,sc6],[s7,sc7]];
var ready=false;
window.PV={T:T,
 init:function(){
  try{M3.st=0;M3.cv=null;M3.gl=null;M3.pr=null;M3.n=1024;m3dReady(true)}catch(e){}
  for(var i=0;i<3;i++){var m=el('div','ab med',rkStill(RKA.medal([0,2,6][i],'bsg'.charAt(i))),s5);s5m.push(m)}
  ready=true;return M3.st},
 render:function(t){
  var k=0,i;for(i=0;i<7;i++)if(t>=T[i])k=i;var lt=t-T[k],D=T[k+1]-T[k];
  drawBg(t,k,pr(lt,D-0.5,0.5));
  for(i=0;i<7;i++)SC[i][0].style.display=i===k?'block':'none';
  pend=[];SC[k][1](lt);drawFx(t);
  /* 2 -> 3 geçişi: çocuğun telefonuna dalış */
  var z=k===1?pr(lt,D-0.2,0.2):(k===2?1-pr(lt,0,0.22):0);flash.style.opacity=(z*0.96).toFixed(3);
  fade.style.opacity=(k===0?1-pr(lt,0,0.18):0).toFixed(3);
  return Promise.all(pend.map(function(im){return im.decode?im.decode().catch(function(){}):0})).then(function(){return k});
 }};
})();
