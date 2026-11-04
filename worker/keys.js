// VAPID anahtarı CF_API_TOKEN'dan türetilir (ayrı bir gizli değer gerekmez; anahtar yenilenirse uygulama yeniden abone olur).
const c = require('crypto'), fs = require('fs');
const t = process.env.CF_API_TOKEN; if (!t) { console.error('CF_API_TOKEN yok'); process.exit(1); }
let i = 0, e, d;
for (;;) { d = c.createHmac('sha256', t).update('mc-vapid-v1:' + i).digest(); try { e = c.createECDH('prime256v1'); e.setPrivateKey(d); break; } catch (x) { i++; } }
const pub = e.getPublicKey(), u = b => Buffer.from(b).toString('base64url');
fs.writeFileSync('vapid_d', u(d));
fs.writeFileSync('vapid.json', JSON.stringify({ pub: u(pub), x: u(pub.subarray(1, 33)), y: u(pub.subarray(33, 65)) }));
console.log('VAPID açık anahtar:', u(pub));
