// Shared in-Node Firestore store for multi-phone tests, with the room/player rules enforced.
const fs=require('fs');
const mock=fs.readFileSync(__dirname+'/mock2.js','utf8');
const ROOMK=['host','hostNick','op','status','seed','created','qv','lv','tb','mode','win'];
const PLK=['nick','score','hearts','ok','bad','n','tt','done','ts','rid','m','r','pr'];
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
        if('mode' in d&&d.mode!=='duel')return deny('mode');
        if('win' in d&&![10,15,20].includes(d.win))return deny('win');
        return null;
      }
      if(old.host!==uid||d.status!=='playing')return deny('room update');
      const ch=Object.keys(Object.assign({},old,d)).filter(k=>JSON.stringify(old[k])!==JSON.stringify(d[k]));
      if(ch.some(k=>k!=='status'))return deny('room update keys '+ch);
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
    return Object.keys(store).filter(k=>parent(k)===s.path).map(k=>[k,store[k]]);
  }
  function deliver(s){
    const d=lag[0]+Math.random()*(lag[1]-lag[0]);
    setTimeout(()=>{if(!s.dead)pages[s.pid].evaluate(([id,p])=>window.__push&&window.__push(id,p),[s.id,payload(s)]).catch(()=>{})},d);
  }
  function changed(path){subs.forEach(s=>{if(s.path===path||(s.col&&parent(path)===s.path))deliver(s)})}
  async function handle(pid,json){
    const [op,path,uid,a,b]=JSON.parse(json);
    if(op==='get')return JSON.stringify(store[path]===undefined?null:store[path]);
    if(op==='set'){const e=check(path,uid,a);if(e)return JSON.stringify(e);store[path]=JSON.parse(JSON.stringify(a));changed(path);return 'null'}
    if(op==='del'){delete store[path];changed(path);return 'null'}
    if(op==='list'){let l=Object.keys(store).filter(k=>parent(k)===path).map(k=>[k,store[k]]);const q=a||{};
      if(q.w)l=l.filter(x=>x[1][q.w.f]===q.w.v);if(q.ob)l.sort((x,y)=>q.ob.d==='desc'?y[1][q.ob.f]-x[1][q.ob.f]:x[1][q.ob.f]-y[1][q.ob.f]);if(q.lim)l=l.slice(0,q.lim);return JSON.stringify(l)}
    if(op==='sub'){const s={pid,id:a,path,col:b};subs.push(s);deliver(s);return 'null'}
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
