exports.VP={w:360,h:740,dsf:2.5};
exports.ME='🦊 Kurnaz Tilki';
// karakter, rütbe verisi, ana menü
exports.setup=async function(p,rk){
  await p.evaluate((rk)=>{NMS.busy=true;st.profile='🦊 Kurnaz Tilki';
    var R=rkGet(st.profile);Object.assign(R,rk||{p:158,r:3,sw:34,sh:6,sb:5,q:3240,dz:41,hz:9,m:'2101120',dq:0});rkPut(st.profile,R);
    go('home');if(st.modal)closeModal();RK.q=[]},rk);
  await p.adv(500);
  await p.evaluate(()=>{if(st.modal)closeModal();RK.q=[]});
};
exports.sheet=function(dir,out,every,cols){require('child_process').execSync(`ffmpeg -v error -y -framerate 30 -i ${dir}/f%04d.jpg -vf "select='not(mod(n,${every||30}))',scale=225:-1,tile=${cols||10}x2" -frames:v 1 ${out}`)};
