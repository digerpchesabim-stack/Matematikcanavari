// Bildirim sunucusu testi: Firestore ve push servisini taklit eder, şifreli içeriği Node crypto ile çözer, VAPID imzasını doğrular.
import crypto from 'node:crypto';
import { handle } from './index.js';
const u = b => Buffer.from(b).toString('base64url');
// VAPID
const v = crypto.createECDH('prime256v1'); v.generateKeys(); const vp = v.getPublicKey();
const env = { VAPID_D: u(v.getPrivateKey()), VAPID_X: u(vp.subarray(1, 33)), VAPID_Y: u(vp.subarray(33)), VAPID_PUB: u(vp) };
// alıcı tarayıcı
const ua = crypto.createECDH('prime256v1'); ua.generateKeys(); const auth = crypto.randomBytes(16);
const now = Date.now();
const db = {
  'iv/BBBBBBB': { from: 'AAAAAAA', nick: '🦊 Kurnaz Tilki', ts: now, md: 'mm', room: 'K7XQ2' },
  'fr/AAAAAAA_BBBBBBB': { a: 'AAAAAAA', b: 'BBBBBBB', by: 'AAAAAAA', st: 'req', ts: now },
  'pl/AAAAAAA': { nick: '🦊 Kurnaz Tilki' },
  'ps/BBBBBBB': { e: 'https://fcm.googleapis.com/fcm/send/xyz', k: u(ua.getPublicKey()), a: u(auth), ts: now }
};
const fv = x => typeof x === 'number' ? { integerValue: String(x) } : { stringValue: x };
let sent = null;
globalThis.fetch = async (url, o) => {
  if (url.startsWith('https://firestore')) {
    if (o.headers.Authorization !== 'Bearer TOK') return new Response('{}', { status: 403 });
    const p = url.split('/documents/')[1], d = db[p];
    if (!d) return new Response('{}', { status: 404 });
    return new Response(JSON.stringify({ fields: Object.fromEntries(Object.entries(d).map(([k, x]) => [k, fv(x)])) }));
  }
  sent = { url, o }; return new Response('', { status: 201 });
};
function decrypt(body) {
  const b = Buffer.from(body), salt = b.subarray(0, 16), rs = b.readUInt32BE(16), idl = b[20], asPub = b.subarray(21, 21 + idl), ct = b.subarray(21 + idl);
  const ecdh = ua.computeSecret(asPub);
  const ikm = Buffer.from(crypto.hkdfSync('sha256', ecdh, auth, Buffer.concat([Buffer.from('WebPush: info\0'), ua.getPublicKey(), asPub]), 32));
  const cek = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: aes128gcm\0'), 16));
  const nonce = Buffer.from(crypto.hkdfSync('sha256', ikm, salt, Buffer.from('Content-Encoding: nonce\0'), 12));
  const dc = crypto.createDecipheriv('aes-128-gcm', cek, nonce); dc.setAuthTag(ct.subarray(ct.length - 16));
  const pt = Buffer.concat([dc.update(ct.subarray(0, ct.length - 16)), dc.final()]);
  if (rs !== 4096 || pt[pt.length - 1] !== 2) throw new Error('çerçeve');
  return JSON.parse(pt.subarray(0, pt.length - 1).toString());
}
function checkVapid(h) {
  const m = /^vapid t=([^,]+), k=(.+)$/.exec(h); const [a, b, s] = m[1].split('.');
  const key = crypto.createPublicKey({ key: { kty: 'EC', crv: 'P-256', x: env.VAPID_X, y: env.VAPID_Y }, format: 'jwk' });
  const ok = crypto.verify('sha256', Buffer.from(a + '.' + b), { key, dsaEncoding: 'ieee-p1363' }, Buffer.from(s, 'base64url'));
  const c = JSON.parse(Buffer.from(b, 'base64url'));
  return ok && m[2] === env.VAPID_PUB && c.aud === 'https://fcm.googleapis.com' && c.exp > now / 1000;
}
let fail = 0; const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fail++; };
const call = b => handle(new Request('https://w/push', { method: 'POST', body: JSON.stringify(b) }), env).then(r => r.json().then(j => [r.status, j]));
let [s, j] = await call({ t: 'TOK', k: 'iv', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(s === 200 && j.ok, 'davet bildirimi gönderildi ' + JSON.stringify(j));
const m1 = decrypt(sent.o.body); ok(/Meydan Muharebesine/.test(m1.t) && /Kurnaz Tilki/.test(m1.t), 'şifre çözüldü: ' + m1.t);
ok(/\?kap=.*&to=BBBBBBB$/.test(m1.u), 'bildirim adresi odaya götürür: ' + m1.u);
ok(checkVapid(sent.o.headers.Authorization), 'VAPID imzası geçerli');
ok(sent.o.headers['Content-Encoding'] === 'aes128gcm', 'aes128gcm');
sent = null;[s, j] = await call({ t: 'TOK', k: 'fr', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(j.ok && /arkadaşlık isteği/.test(decrypt(sent.o.body).t), 'arkadaşlık bildirimi');
sent = null;[s, j] = await call({ t: 'TOK', k: 'iv', from: 'CCCCCCC', to: 'BBBBBBB' });
ok(s === 403 && !sent, 'başkası adına davet reddedildi');
db['iv/BBBBBBB'].ts = now - 600000; sent = null;[s] = await call({ t: 'TOK', k: 'iv', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(s === 403 && !sent, 'eski davet reddedildi');
sent = null;[s] = await call({ t: 'BAD', k: 'fr', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(s === 403 && !sent, 'oturumsuz istek reddedildi');
delete db['ps/BBBBBBB'];[s, j] = await call({ t: 'TOK', k: 'fr', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(j.ok === false && j.why === 'kapali', 'bildirimi kapalı oyuncu');
const r = await handle(new Request('https://w/key'), env); ok((await r.json()).k === env.VAPID_PUB, '/key');
console.log(fail ? 'HATA ' + fail : 'TAMAM'); process.exit(fail ? 1 : 0);
