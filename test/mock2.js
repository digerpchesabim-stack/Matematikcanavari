// Firebase mock whose data lives in Node (shared between pages); auth is per page.
(function(){
  var cur=null,listeners=[],uidn=0,subs={},sn=0,PID=window.__PID||'p';
  function fire(){listeners.forEach(function(f){f(cur)})}
  function snap(path,d){return {exists:function(){return d!==undefined&&d!==null},data:function(){return d==null?undefined:JSON.parse(JSON.stringify(d))},id:path.split('/').pop()}}
  function colSnap(list){var out=list.map(function(x){return snap(x[0],x[1])});return {forEach:function(f){out.forEach(f)},size:out.length}}
  function err(code){var e=new Error(code);e.code=code;return e}
  var users=window.__USERS={};
  window.__push=function(id,payload){var s=subs[id];if(!s)return;s.f(s.col?colSnap(payload):snap(s.path,payload))};
  function srv(){var a=[].slice.call(arguments);return window.__srv(PID,JSON.stringify(a)).then(function(r){var x=JSON.parse(r);if(x&&x.__err)throw err(x.__err);return x})}
  window.__MC_FB={
    initializeApp:function(c,n){return {n:n||'def'}},getAuth:function(a){return {a:a}},getFirestore:function(){return {}},
    onAuthStateChanged:function(a,f){listeners.push(f);setTimeout(function(){f(cur)},0);return function(){}},
    signInWithEmailAndPassword:function(a,e,p){return new Promise(function(res,rej){var u=users[e];setTimeout(function(){if(!u||u.pw!==p)rej(err('auth/invalid-credential'));else{cur={uid:u.uid,email:e,delete:function(){return Promise.resolve()}};fire();res({user:cur})}},0)})},
    createUserWithEmailAndPassword:function(a,e,p){return new Promise(function(res,rej){setTimeout(function(){if(users[e])return rej(err('auth/email-already-in-use'));var uid=PID+'_u'+(++uidn);users[e]={uid:uid,pw:p};cur={uid:uid,email:e,delete:function(){return Promise.resolve()}};fire();res({user:cur})},0)})},
    signOut:function(){cur=null;fire();return Promise.resolve()},
    doc:function(db){var a=[].slice.call(arguments,1);return {path:a.join('/')}},
    collection:function(db){var a=[].slice.call(arguments,1);return {path:a.join('/')}},
    query:function(c){var cs=[].slice.call(arguments,1);var o={path:c.path,ob:null,lim:null,w:null};cs.forEach(function(x){if(x.__ob)o.ob=x;else if(x.__lim)o.lim=x.n;else o.w=x});return o},
    orderBy:function(f,d){return {__ob:1,f:f,d:d}},limit:function(n){return {__lim:1,n:n}},where:function(f,op,v){return {f:f,v:v}},
    getDoc:function(r){return srv('get',r.path,cur&&cur.uid).then(function(d){return snap(r.path,d)})},
    setDoc:function(r,d){return srv('set',r.path,cur&&cur.uid,d)},
    deleteDoc:function(r){return srv('del',r.path,cur&&cur.uid)},
    getDocs:function(q){return srv('list',q.path,cur&&cur.uid,q).then(colSnap)},
    onSnapshot:function(r,f){var id=++sn,col=r.path.split('/').length%2===1;subs[id]={f:f,col:col,path:r.path};srv('sub',r.path,cur&&cur.uid,id,col,r.w||null);return function(){delete subs[id];srv('unsub',r.path,null,id)}}
  };
})();
