// in-memory Firebase mock (init script)
/* S60: testlerde ilk açılış bilgilendirme kartı görülmüş sayılır (window.__INFO0 ile kapatılır) */
/* (açılışta localStorage'a yazmak Chromium'da yenilemede depoyu kaybettiriyordu; bu yüzden sadece okuma taklidi) */
try{if(!window.__INFO0){var __gi=Storage.prototype.getItem;Storage.prototype.getItem=function(k){var v=__gi.call(this,k);return v===null&&k==='mc_info'?'1':v}}}catch(e){}
(function(){
  var store={},users={},cur=null,listeners=[],uidn=0,snaps=[];
  window.__DB=store;window.__USERS=users;
  function notify(){snaps.forEach(function(s){s.f(s.col?colSnap(s.path):snap(s.path))})}
  window.__notify=notify;
  function fire(){listeners.forEach(function(f){f(cur)})}
  function snap(path){var d=store[path];return {exists:function(){return d!==undefined},data:function(){return d===undefined?undefined:JSON.parse(JSON.stringify(d))},id:path.split('/').pop()}}
  function colSnap(path){var p=path+'/',out=[];Object.keys(store).forEach(function(k){if(k.indexOf(p)===0&&k.slice(p.length).indexOf('/')<0)out.push(snap(k))});return {forEach:function(f){out.forEach(f)},size:out.length}}
  function err(code){var e=new Error(code);e.code=code;return e}
  window.__MC_FB={
    initializeApp:function(c,n){return {n:n||'def'}},
    getAuth:function(a){return {a:a}},
    getFirestore:function(){return {}},
    onAuthStateChanged:function(a,f){listeners.push(f);setTimeout(function(){f(cur)},0);return function(){}},
    signInWithEmailAndPassword:function(a,e,p){return new Promise(function(res,rej){var u=users[e];setTimeout(function(){if(!u||u.pw!==p)rej(err('auth/invalid-credential'));else{cur={uid:u.uid,email:e,delete:function(){delete users[e];cur=null;fire();return Promise.resolve()}};fire();res({user:cur})}},0)})},
    createUserWithEmailAndPassword:function(a,e,p){return new Promise(function(res,rej){setTimeout(function(){if(users[e])return rej(err('auth/email-already-in-use'));var uid='u'+(++uidn);users[e]={uid:uid,pw:p};cur={uid:uid,email:e,delete:function(){delete users[e];cur=null;fire();return Promise.resolve()}};fire();res({user:cur})},0)})},
    signOut:function(){cur=null;fire();return Promise.resolve()},
    doc:function(db){var a=[].slice.call(arguments,1);return {path:a.join('/')}},
    collection:function(db){var a=[].slice.call(arguments,1);return {path:a.join('/')}},
    query:function(c){var cs=[].slice.call(arguments,1);var o={path:c.path,ob:null,lim:null,w:null,ws:[]};cs.forEach(function(x){if(x.__ob)o.ob=x;else if(x.__lim)o.lim=x.n;else{o.w=x;o.ws.push(x)}});return o},
    orderBy:function(f,d){return {__ob:1,f:f,d:d}},
    limit:function(n){return {__lim:1,n:n}},
    where:function(f,op,v){return {f:f,v:v}},
    getDoc:function(r){return Promise.resolve(snap(r.path))},
    setDoc:function(r,d){store[r.path]=JSON.parse(JSON.stringify(d));setTimeout(notify,0);return Promise.resolve()},
    updateDoc:function(r,d){if(!store[r.path])return Promise.reject(Object.assign(new Error('not-found'),{code:'not-found'}));Object.assign(store[r.path],JSON.parse(JSON.stringify(d)));setTimeout(notify,0);return Promise.resolve()},
    onSnapshot:function(r,f){var o={path:r.path,f:f,col:r.path.split('/').length%2===1};snaps.push(o);setTimeout(function(){f(o.col?colSnap(o.path):snap(o.path))},0);return function(){var i=snaps.indexOf(o);if(i>=0)snaps.splice(i,1)}},
    deleteDoc:function(r){delete store[r.path];setTimeout(notify,0);return Promise.resolve()},
    getDocs:function(q){
      var p=q.path+'/',out=[];
      Object.keys(store).forEach(function(k){if(k.indexOf(p)===0&&k.slice(p.length).indexOf('/')<0){if((q.ws||[]).some(function(w){return store[k][w.f]!==w.v}))return;out.push(snap(k))}});
      if(q.ob)out.sort(function(a,b){var x=a.data()[q.ob.f],y=b.data()[q.ob.f];return q.ob.d==='desc'?y-x:x-y});
      if(q.lim)out=out.slice(0,q.lim);
      return Promise.resolve({forEach:function(f){out.forEach(f)},size:out.length});
    }
  };
})();
