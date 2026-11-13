// Shared in-Node Firestore store for multi-phone tests, with the room/player rules enforced.
const fs=require('fs');
const mock=fs.readFileSync(__dirname+'/mock2.js','utf8');
const ROOMK=['host','hostNick','op','status','seed','created','qv','lv','tb','mode','win','at','ka','kb','cm','pub','cap','pw','tm','rk','hp','nb','n','hb'];
const PLK=['nick','score','hearts','ok','bad','n','tt','done','ts','rid','m','r','pr','pid','jt','rk','pv','tk','br','bs'];
module.exports=function(opts){
  opts=opts||{};
  const store={},subs=[],pages={},log=[],users={};let uidn=0;let lag=opts.lag||[30,150];
  const parent=p=>p.split('/').slice(0,-1).join('/');
  const deny=(m)=>{log.push('DENY '+m);return {__err:'permission-denied'}};
  function check(path,uid,d){
    const seg=path.split('/');
    if(seg[0]==='rooms'&&seg.length===2){
      const old=store[path];
      if(!old){
        if(Object.keys(d).some(k=>!ROOMK.includes(k)))return deny('room keys '+Object.keys(d));
        if(d.host!==uid||d.status!=='lobby')return deny('room create');
        if('mode' in d&&!['duel','mm','tw','ta'].includes(d.mode))return deny('mode');
        if('cap' in d&&!(Number.isInteger(d.cap)&&d.cap>=2&&d.cap<=10))return deny('cap');if('tm' in d&&![2,3,4].includes(d.tm))return deny('tm');
        if('win' in d&&![10,15,20].includes(d.win))return deny('win');
        return null;
      }
      if(old.host!==uid||!(d.status==='playing'||(d.status==='lobby'&&old.status==='lobby')))return deny('room update');
      const ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      if(ch.some(k=>!['status','pa','n','hb','nb'].includes(k)))return deny('room update keys '+ch);
      return null;
    }
    const owns=(pid)=>!!(store['pk/'+pid]&&store['pk/'+pid].u===uid);
    const frId=(x,y)=>x<y?x+'_'+y:y+'_'+x;
    const only=(o,ks)=>Object.keys(o).every(k=>ks.includes(k));
    if(seg[0]==='pk'){
      const old=store[path];
      if(!only(d,['k','u'])||d.u!==uid)return deny('pk shape');
      if(!old){if(seg[1].length!==7||typeof d.k!=='string'||d.k.length<16)return deny('pk create');return null}
      if(d.k!==old.k)return deny('pk key');return null;
    }
    if(seg[0]==='pl'){if(!owns(seg[1]))return deny('pl owner');if(!only(d,['nick','seen','v','rk','md','st','tm'])||('st' in d&&(typeof d.st!=='string'||d.st.length>60))||!d.nick||d.nick.length>60||!Number.isInteger(d.seen)||('rk' in d&&!(Number.isInteger(d.rk)&&d.rk>=0&&d.rk<=6))||('md' in d&&(typeof d.md!=='string'||d.md.length>12)))return deny('pl shape');return null}
    if(seg[0]==='ps'){if(!owns(seg[1]))return deny('ps owner');if(!only(d,['e','k','a','ts'])||typeof d.e!=='string'||!/^https:\/\//.test(d.e)||!Number.isInteger(d.ts))return deny('ps shape');return null}
    if(seg[0]==='fr'){
      const old=store[path];
      if(!old){if(!only(d,['a','b','by','st','ts'])||!(d.a<d.b)||seg[1]!==frId(d.a,d.b)||![d.a,d.b].includes(d.by)||d.st!=='req'||!owns(d.by))return deny('fr create');return null}
      const ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      if(old.st!=='req'||d.st!=='ok'||ch.some(k=>!['st','ts'].includes(k))||!owns(old.by===old.a?old.b:old.a))return deny('fr update');return null;
    }
    if(seg[0]==='iv'&&store[path]&&owns(seg[1])){
      const old=store[path],ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      if(ch.some(k=>!['rs','rr','ra'].includes(k))||!['seen','ok','busy','later'].includes(d.rs))return deny('iv answer');return null;
    }
    if(seg[0]==='rv'){
      const old=store[path];
      if(!old){if(!only(d,['from','fn','to','room','op','lv','win','md','at','ts','st','n'])||!owns(d.from)||seg[1]!==d.room+'_'+d.to||d.st!=='req'||!Number.isInteger(d.at)||!['duel','mm'].includes(d.md))return deny('rv create');
        const f=store['fr/'+frId(d.from,d.to)];if(!f||f.st!=='ok')return deny('rv not friends');
        const r=store['rooms/'+d.room];if(!r||r.host!==uid)return deny('rv room host');return null}
      const ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      if(ch.some(k=>!['st','ts'].includes(k)))return deny('rv update keys '+ch);
      if(owns(old.to)&&['ok','no'].includes(d.st))return null;
      if(owns(old.from)&&['x','d'].includes(d.st))return null;
      return deny('rv update '+old.st+'>'+d.st+' uid='+uid+' path='+path);
    }
    if(seg[0]==='tm'){
      const old=store[path],K=['m','cap','by','w','l','ct','jn','lm','ts','v'];
      if(!only(d,K)||!owns(d.by))return deny('tm shape');
      if(!old){if(!/^[0-9]{1,3}$/.test(seg[1])||JSON.stringify(d.m)!==JSON.stringify([d.by])||d.cap!==d.by||d.w!==0||d.l!==0)return deny('tm create');return null}
      const ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      const has=(a,b)=>b.every(x=>a.includes(x));
      if(d.m.length===old.m.length+1){const tv=store['tv/'+d.by];if(d.m.length<=4&&has(d.m,old.m)&&d.m.includes(d.by)&&!old.m.includes(d.by)&&ch.every(k=>['m','by','jn','ts'].includes(k))&&tv&&tv.t===+seg[1])return null;return deny('tm join')}
      if(d.m.length===old.m.length-1){if(old.m.includes(d.by)&&has(old.m,d.m)&&!d.m.includes(d.by)&&d.m.includes(d.cap)&&ch.every(k=>['m','by','cap','ts'].includes(k)))return null;return deny('tm leave')}
      if(JSON.stringify(d.m)===JSON.stringify(old.m)&&old.m.includes(d.by)&&old.m.includes(d.cap)&&[0,1].includes((d.w|0)-(old.w|0))&&[0,1].includes((d.l|0)-(old.l|0))&&ch.every(k=>['cap','ct','w','l','lm','by','ts'].includes(k)))return null;
      return deny('tm update '+ch);
    }
    if(seg[0]==='tv'){
      if(!only(d,['t','from','nick','ts'])||!owns(d.from))return deny('tv shape');
      const t=store['tm/'+d.t];if(!t||!t.m.includes(d.from))return deny('tv not member');
      const f=store['fr/'+frId(d.from,seg[1])];if(!f||f.st!=='ok')return deny('tv not friends');return null;
    }
    if(seg[0]==='ti'){
      if(!only(d,['by','nick','room','a','b','ts','cm'])||!owns(d.by))return deny('ti shape');
      const t=store['tm/'+d.a];if(!t||!t.m.includes(d.by))return deny('ti not member');
      if(+seg[1]!==d.a&&+seg[1]!==d.b)return deny('ti key');return null;
    }
    if(seg[0]==='ms'){
      if(!only(d,['from','to','m','ts','nick'])||seg[1]!==d.from+'_'+d.to||!Number.isInteger(d.m)||d.m<1||d.m>60||!owns(d.from))return deny('ms create');
      const f=store['fr/'+frId(d.from,d.to)];if(!f||f.st!=='ok')return deny('ms not friends');return null;
    }
    if(seg[0]==='iv'){
      if(!only(d,['from','nick','room','op','lv','win','ts','md','g'])||!owns(d.from))return deny('iv owner');
      const ov=store[path];if(d.g&&ov&&ov.from!==d.from&&Date.now()-ov.ts<=600000&&!(ov.rs&&ov.rs!=='seen'))return deny('iv group over other');
      const f=store['fr/'+frId(d.from,seg[1])];if(!f||f.st!=='ok')return deny('iv not friends');return null;
    }
    if(seg[0]==='nm'){
      const old=store[path];
      if(!/^[0-9]{1,3}_[0-9]{1,4}$/.test(seg[1]))return deny('nm key');
      if(!only(d,['u','t'])||d.u!==uid||!Number.isInteger(d.t))return deny('nm shape');
      if(old&&old.u!==uid)return deny('nm taken');
      return null;
    }
    if(/^lb[gr]_/.test(seg[0])){
      const old=store[path];
      if(seg[1]!==uid||!only(d,['nick','score','ts','pid','rk'])||('rk' in d&&!(Number.isInteger(d.rk)&&d.rk>=0&&d.rk<=6))||('pid' in d&&(typeof d.pid!=='string'||d.pid.length>10))||typeof d.nick!=='string'||d.nick.length<1||d.nick.length>60)return deny('lb shape');
      if(old&&d.score<old.score)return deny('lb lower');return null;
    }
    if(seg[0]==='bk'){
      const old=store[path];
      if(seg[1].length!==10)return deny('bk code');
      if(d.u!==uid)return deny('bk owner');
      if(old&&old.u!==uid)return deny('bk not owner');
      if(Object.keys(d).some(k=>!['u','d','ts','v'].includes(k))||typeof d.d!=='string'||d.d.length>=900000)return deny('bk shape');
      return null;
    }
    if(seg[0]==='ac'){
      const old=store[path];
      if(seg[1].length!==10)return deny('ac code');
      if(d.u!==uid||(old&&old.u!==uid))return deny('ac owner');
      if(Object.keys(d).some(k=>!['u','ts','dv','ln','lnd','del','v'].includes(k))||!Number.isInteger(d.ts))return deny('ac shape');
      return null;
    }
    if(seg[0]==='rooms'&&seg[2]==='sec'){const r=store['rooms/'+seg[1]];if(seg[3]!=='pw'||!r||r.host!==uid||!only(d,['p'])||!/^[0-9]{4}$/.test(d.p))return deny('sec');return null}
    if(seg[0]==='rooms'&&seg[2]==='tk'){const pw=store['rooms/'+seg[1]+'/sec/pw'];if(seg[3]!==uid||!only(d,['p'])||!pw||pw.p!==d.p)return deny('tk wrong password');return null}
    if(seg[0]==='rooms'&&seg[2]==='kick'){const r=store['rooms/'+seg[1]];if(!r||r.host!==uid)return deny('kick not host');return null}
    if(seg[0]==='rooms'&&seg[2]==='players'){
      if(seg[3]!==uid)return deny('player uid');
      if(Object.keys(d).some(k=>!PLK.includes(k)))return deny('player keys '+Object.keys(d));
      const r=store['rooms/'+seg[1]];
      if(!store[path]){
        if(!r||r.status!=='lobby')return deny('player create not lobby');
        if(r.pw===1&&r.host!==uid&&!store['rooms/'+seg[1]+'/tk/'+uid])return deny('player create no ticket');
        if(store['rooms/'+seg[1]+'/kick/'+uid])return deny('player create kicked');
      }
      if('bs' in d&&!(Array.isArray(d.bs)&&d.bs.length<=9))return deny('bs');
      return null;
    }
    return null;
  }
  function payload(s){
    if(!s.col)return store[s.path]===undefined?null:store[s.path];
    return Object.keys(store).filter(k=>parent(k)===s.path&&(!s.w||store[k][s.w.f]===s.w.v)).map(k=>[k,store[k]]);
  }
  function deliver(s){
    const d=lag[0]+Math.random()*(lag[1]-lag[0]);
    setTimeout(()=>{if(!s.dead)pages[s.pid].evaluate(([id,p])=>window.__push&&window.__push(id,p),[s.id,payload(s)]).catch(()=>{})},d);
  }
  function changed(path){subs.forEach(s=>{if(s.path===path||(s.col&&parent(path)===s.path))deliver(s)})}
  async function handle(pid,json){
    const [op,path,uid,a,b,c]=JSON.parse(json);
    if(op==='get'){const seg=path.split('/');if(seg[0]==='pk')return JSON.stringify(deny('pk read'));
      if(seg[0]==='rooms'&&(seg[2]==='sec'||seg[2]==='tk'))return JSON.stringify(deny('secret read'));
      if(seg[0]==='iv'||seg[0]==='tv'){const owns=(pid)=>!!(store['pk/'+pid]&&store['pk/'+pid].u===uid);const o=store[path];if(!(owns(seg[1])||(o&&owns(o.from))))return JSON.stringify(deny(seg[0]+' read'))}
      return JSON.stringify(store[path]===undefined?null:store[path])}
    if(op==='upd'){if(store[path]===undefined)return JSON.stringify({__err:'not-found'});const m=Object.assign(JSON.parse(JSON.stringify(store[path])),a);const e=check(path,uid,m);if(e)return JSON.stringify(e);store[path]=m;changed(path);return 'null'}
    if(op==='set'){const e=check(path,uid,a);if(e)return JSON.stringify(e);store[path]=JSON.parse(JSON.stringify(a));changed(path);return 'null'}
    if(op==='del'){const seg=path.split('/'),old=store[path];const owns=(pid)=>!!(store['pk/'+pid]&&store['pk/'+pid].u===uid);
      if(old&&seg[0]==='fr'&&!(owns(old.a)||owns(old.b)))return JSON.stringify(deny('fr del'));
      if(old&&seg[0]==='iv'&&!(owns(seg[1])||owns(old.from)))return JSON.stringify(deny('iv del'));
      if(old&&seg[0]==='rv'&&!(owns(old.to)||owns(old.from)))return JSON.stringify(deny('rv del'));
      if(old&&seg[0]==='ms'&&!(owns(old.to)||owns(old.from)))return JSON.stringify(deny('ms del'));
      if(old&&seg[0]==='tm'&&!(old.m.length===1&&owns(old.m[0])))return JSON.stringify(deny('tm del'));
      if(old&&seg[0]==='tv'&&!(owns(seg[1])||owns(old.from)))return JSON.stringify(deny('tv del'));
      if(old&&(seg[0]==='pl')&&!owns(seg[1]))return JSON.stringify(deny('pl del'));
      if(old&&seg[0]==='nm'&&old.u!==uid)return JSON.stringify(deny('nm del'));
      if(old&&seg[0]==='pk'&&old.u!==uid)return JSON.stringify(deny('pk del'));
      if(old&&seg[0]==='bk'&&old.u!==uid)return JSON.stringify(deny('bk del'));
      if(seg[0]==='ac')return JSON.stringify(deny('ac del'));
      if(/^lb[gr]_/.test(seg[0])&&seg[1]!==uid)return JSON.stringify(deny('lb del'));
      if(seg[0]==='rooms'&&seg.length===4&&seg[2]==='players'&&seg[3]!==uid&&!(store['rooms/'+seg[1]]&&store['rooms/'+seg[1]].host===uid))return JSON.stringify(deny('player del'));
      delete store[path];changed(path);return 'null'}
    if(op==='list'){let l=Object.keys(store).filter(k=>parent(k)===path).map(k=>[k,store[k]]);const q=a||{};
      if(path==='rooms'&&!(q.ws||[]).some(w=>w.f==='pub'&&w.v===1))return JSON.stringify(deny('rooms list without pub'));
      (q.ws&&q.ws.length?q.ws:(q.w?[q.w]:[])).forEach(w=>{l=l.filter(x=>x[1][w.f]===w.v)});if(q.ob)l.sort((x,y)=>q.ob.d==='desc'?y[1][q.ob.f]-x[1][q.ob.f]:x[1][q.ob.f]-y[1][q.ob.f]);if(q.lim)l=l.slice(0,q.lim);return JSON.stringify(l)}
    if(op==='auth'){const u=users[path];if(a==='in'){if(!u||u.pw!==b)return JSON.stringify({__err:'auth/invalid-credential'});return JSON.stringify(u.uid)}
      if(a==='up'){if(u)return JSON.stringify({__err:'auth/email-already-in-use'});const id=pid+'_u'+(++uidn);users[path]={uid:id,pw:b};return JSON.stringify(id)}
      if(a==='del'){delete users[path];return 'null'}}
    if(op==='sub'){const s={pid,id:a,path,col:b,w:c};subs.push(s);deliver(s);return 'null'}
    if(op==='unsub'){subs.forEach(s=>{if(s.pid===pid&&s.id===a)s.dead=true});return 'null'}
    return 'null';
  }
  async function phone(ctx,pid,url){
    const p=await ctx.newPage();
    p.on('pageerror',e=>log.push(pid+' ERR '+e.message));
    await p.exposeFunction('__srv',handle);
    await p.addInitScript(`window.__PID=${JSON.stringify(pid)};`);
    await p.addInitScript(mock);
    pages[pid]=p;
    await p.goto(url);
    return p;
  }
  return {store,log,phone,setLag:x=>{lag=x},pages,users};
};
