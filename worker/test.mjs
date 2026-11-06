// Bildirim sunucusu testi: Firestore ve push servisini taklit eder, şifreli içeriği Node crypto ile çözer, VAPID imzasını doğrular.
import crypto from 'node:crypto';
import { handle, cron } from './index.js';
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
function hhm(t) { const d = new Date(t + 3 * 3600000); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); }
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
// S54: davet cevabı ve zamanlı oyun
db['ps/BBBBBBB'] = { e: 'https://fcm.googleapis.com/fcm/send/xyz', k: u(ua.getPublicKey()), a: u(auth), ts: now };
db['ps/AAAAAAA'] = { e: 'https://fcm.googleapis.com/fcm/send/aaa', k: u(ua.getPublicKey()), a: u(auth), ts: now };
db['pl/BBBBBBB'] = { nick: '🐼 Cesur Panda' };
db['iv/BBBBBBB'] = { from: 'AAAAAAA', nick: '🦊 Kurnaz Tilki', ts: now - 60000, room: 'K7XQ2', rs: 'busy' };
sent = null;[s, j] = await call({ t: 'TOK', k: 'rs', from: 'BBBBBBB', to: 'AAAAAAA' });
ok(j.ok && sent && /Cesur Panda şu an meşgul/.test(decrypt(sent.o.body).t), 'meşgulüm bildirimi davet edene gitti');
sent = null;[s] = await call({ t: 'TOK', k: 'rs', from: 'BBBBBBB', to: 'CCCCCCC' });
ok(s === 403 && !sent, 'başkasına meşgul bildirimi reddedildi');
const KV = new Map(); env.MCR = { get: async k => KV.has(k) ? KV.get(k) : null, put: async (k, v) => { KV.set(k, v) }, delete: async k => { KV.delete(k) } };
const at = Math.ceil((now + 30 * 60000) / 60000) * 60000;
db['rv/R54AB_BBBBBBB'] = { from: 'AAAAAAA', fn: '🦊 Kurnaz Tilki', to: 'BBBBBBB', room: 'R54AB', md: 'duel', at, ts: now, st: 'req' };
sent = null;[s, j] = await call({ t: 'TOK', k: 'rv', from: 'AAAAAAA', to: 'BBBBBBB', r: 'R54AB' });
const tr = hhm(at); const mrv = sent && decrypt(sent.o.body);
ok(j.ok && mrv && mrv.t.endsWith('saat ' + tr) && /\?rv=1&to=BBBBBBB$/.test(mrv.u), 'randevu isteği bildirimi: ' + (mrv && mrv.t));
sent = null;[s] = await call({ t: 'TOK', k: 'rv', from: 'CCCCCCC', to: 'BBBBBBB', r: 'R54AB' });
ok(s === 403 && !sent, 'başkası adına randevu reddedildi');
sent = null;[s] = await call({ t: 'TOK', k: 'rva', from: 'BBBBBBB', to: 'AAAAAAA', r: 'R54AB' });
ok(s === 403 && !sent, 'cevaplanmamış randevuya cevap bildirimi reddedildi');
db['rv/R54AB_BBBBBBB'].st = 'ok';
sent = null;[s, j] = await call({ t: 'TOK', k: 'rva', from: 'BBBBBBB', to: 'AAAAAAA', r: 'R54AB' });
ok(j.ok && sent && /kabul etti/.test(decrypt(sent.o.body).t) && sent.url.endsWith('/aaa'), 'kabul bildirimi kurucuya');
const key = 'm' + Math.floor((at - 300000) / 60000), rem = JSON.parse(KV.get(key) || '[]');
ok(rem.length === 2 && rem.every(x => x.s && x.m && /5 dakika sonra kapışma/.test(x.m.t)), 'iki kişiye hatırlatma kaydedildi (' + key + ')');
const realNow = Date.now; Date.now = () => at - 300000 + 5000; sent = null;
const n = await cron(env); Date.now = realNow;
ok(n === 2 && !KV.has(key), 'zamanlayıcı 5 dk kala gönderdi: ' + n);
// iptal: hatırlatma silinir
db['rv/R54AB_BBBBBBB'].st = 'ok';[s] = await call({ t: 'TOK', k: 'rva', from: 'BBBBBBB', to: 'AAAAAAA', r: 'R54AB' });
db['rv/R54AB_BBBBBBB'].st = 'x';[s, j] = await call({ t: 'TOK', k: 'rvc', from: 'AAAAAAA', to: 'BBBBBBB', r: 'R54AB' });
ok(j.ok && !KV.has(key), 'iptal: hatırlatma silindi, davetliye haber gitti');
db['rv/R54AB_BBBBBBB'].st = 'ok';[s] = await call({ t: 'TOK', k: 'rva', from: 'BBBBBBB', to: 'AAAAAAA', r: 'R54AB' });
db['rv/R54AB_BBBBBBB'].st = 'no';[s] = await call({ t: 'TOK', k: 'rva', from: 'BBBBBBB', to: 'AAAAAAA', r: 'R54AB' });
const left = JSON.parse(KV.get(key) || '[]'); ok(left.length === 1 && left[0].k === 'AAAAAAA|R54AB', 'gelemem: davetlinin hatırlatması silindi');
// S55: hazır mesaj bildirimi + toplu davet
db['ms/AAAAAAA_BBBBBBB'] = { from: 'AAAAAAA', to: 'BBBBBBB', m: 5, ts: Date.now(), nick: '🦊 Kurnaz Tilki' };
sent = null;[s, j] = await call({ t: 'TOK', k: 'ms', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(j.ok && sent && decrypt(sent.o.body).t === '💬 🦊 Kurnaz Tilki: ⚔️ Hadi oynayalım!', 'oyun mesajı bildirimi');
db['ms/AAAAAAA_BBBBBBB'].m = 1; sent = null;[s] = await call({ t: 'TOK', k: 'ms', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(s === 403 && !sent, 'selam mesajı bildirim olmaz');
db['iv/BBBBBBB'] = { from: 'AAAAAAA', nick: '🦊 Kurnaz Tilki', ts: Date.now(), md: 'race', room: 'K7XQ2', g: 1 };
sent = null;[s, j] = await call({ t: 'TOK', k: 'iv', from: 'AAAAAAA', to: 'BBBBBBB' });
ok(j.ok && /herkesi Yarış Odasına/.test(decrypt(sent.o.body).t), 'toplu yarış daveti bildirimi');
delete env.MCR; db['rv/R54AB_BBBBBBB'].st = 'ok'; sent = null;[s, j] = await call({ t: 'TOK', k: 'rva', from: 'BBBBBBB', to: 'AAAAAAA', r: 'R54AB' });
ok(j.ok, 'KV yoksa da cevap bildirimi çalışır');
console.log(fail ? 'HATA ' + fail : 'TAMAM'); process.exit(fail ? 1 : 0);
