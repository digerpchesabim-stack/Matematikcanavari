// Shared in-Node Firestore store for multi-phone tests, with the room/player rules enforced.
const fs=require('fs');
const mock=fs.readFileSync(__dirname+'/mock2.js','utf8');
const ROOMK=['host','hostNick','op','status','seed','created','qv','lv','tb','mode','win'];
const PLK=['nick','score','hearts','ok','bad','n','tt','done','ts','rid','m','r','pr','pid','jt','rk'];
module.exports=function(opts){
  opts=opts||{};
  const store={},subs=[],pages={},log=[];let lag=opts.lag||[30,150];
  const parent=p=>p.split('/').slice(0,-1).join('/');
  const deny=(m)=>{log.push('DENY '+m);return {__err:'permission-denied'}};
  function check(path,uid,d){
    const seg=path.split('/');
    if(seg[0]==='rooms'&&seg.length===2){
      const old=store[path];
      if(!old){
        if(Object.keys(d).some(k=>!ROOMK.includes(k)))return deny('room keys '+Object.keys(d));
        if(d.host!==uid||d.status!=='lobby')return deny('room create');
        if('mode' in d&&!['duel','mm'].includes(d.mode))return deny('mode');
        if('win' in d&&![10,15,20].includes(d.win))return deny('win');
        return null;
      }
      if(old.host!==uid||d.status!=='playing')return deny('room update');
      const ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      if(ch.some(k=>k!=='status'))return deny('room update keys '+ch);
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
    if(seg[0]==='pl'){if(!owns(seg[1]))return deny('pl owner');if(!only(d,['nick','seen','v','rk','md'])||!d.nick||d.nick.length>60||!Number.isInteger(d.seen)||('rk' in d&&!(Number.isInteger(d.rk)&&d.rk>=0&&d.rk<=6))||('md' in d&&(typeof d.md!=='string'||d.md.length>12)))return deny('pl shape');return null}
    if(seg[0]==='fr'){
      const old=store[path];
      if(!old){if(!only(d,['a','b','by','st','ts'])||!(d.a<d.b)||seg[1]!==frId(d.a,d.b)||![d.a,d.b].includes(d.by)||d.st!=='req'||!owns(d.by))return deny('fr create');return null}
      const ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      if(old.st!=='req'||d.st!=='ok'||ch.some(k=>!['st','ts'].includes(k))||!owns(old.by===old.a?old.b:old.a))return deny('fr update');return null;
    }
    if(seg[0]==='iv'){
      if(!only(d,['from','nick','room','op','lv','win','ts','md'])||!owns(d.from))return deny('iv owner');
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
    if(seg[0]==='rooms'&&seg[2]==='players'){
      if(seg[3]!==uid)return deny('player uid');
      if(Object.keys(d).some(k=>!PLK.includes(k)))return deny('player keys '+Object.keys(d));
      if(!store[path]&&(!store['rooms/'+seg[1]]||store['rooms/'+seg[1]].status!=='lobby'))return deny('player create not lobby');
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
      if(seg[0]==='iv'){const owns=(pid)=>!!(store['pk/'+pid]&&store['pk/'+pid].u===uid);const o=store[path];if(!(owns(seg[1])||(o&&owns(o.from))))return JSON.stringify(deny('iv read'))}
      return JSON.stringify(store[path]===undefined?null:store[path])}
    if(op==='set'){const e=check(path,uid,a);if(e)return JSON.stringify(e);store[path]=JSON.parse(JSON.stringify(a));changed(path);return 'null'}
    if(op==='del'){const seg=path.split('/'),old=store[path];const owns=(pid)=>!!(store['pk/'+pid]&&store['pk/'+pid].u===uid);
      if(old&&seg[0]==='fr'&&!(owns(old.a)||owns(old.b)))return JSON.stringify(deny('fr del'));
      if(old&&seg[0]==='iv'&&!(owns(seg[1])||owns(old.from)))return JSON.stringify(deny('iv del'));
      if(old&&(seg[0]==='pl')&&!owns(seg[1]))return JSON.stringify(deny('pl del'));
      if(old&&seg[0]==='nm'&&old.u!==uid)return JSON.stringify(deny('nm del'));
      if(old&&seg[0]==='pk'&&old.u!==uid)return JSON.stringify(deny('pk del'));
      delete store[path];changed(path);return 'null'}
    if(op==='list'){let l=Object.keys(store).filter(k=>parent(k)===path).map(k=>[k,store[k]]);const q=a||{};
      if(q.w)l=l.filter(x=>x[1][q.w.f]===q.w.v);if(q.ob)l.sort((x,y)=>q.ob.d==='desc'?y[1][q.ob.f]-x[1][q.ob.f]:x[1][q.ob.f]-y[1][q.ob.f]);if(q.lim)l=l.slice(0,q.lim);return JSON.stringify(l)}
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
  return {store,log,phone,setLag:x=>{lag=x},pages};
};
