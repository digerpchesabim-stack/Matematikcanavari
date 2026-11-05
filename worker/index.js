// Matematik Canavarı bildirim sunucusu (Cloudflare Worker).
// Uygulama, arkadaşını çağırınca ya da arkadaşlık isteği gönderince buraya haber verir.
// Sunucu, isteği gönderenin Firebase oturumuyla Firestore'dan doğrular (kurallar geçerlidir),
// alıcının bildirim adresini okur ve Web Push (RFC 8291 + VAPID RFC 8292) ile bildirim gönderir.
const PROJECT = 'matematik-canavari-57e2d';
const FS = 'https://firestore.googleapis.com/v1/projects/' + PROJECT + '/databases/(default)/documents/';
const SUB = 'https://digerpchesabim-stack.github.io/Matematikcanavari/';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'content-type' };
const enc = new TextEncoder();

function b64u(buf) { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function ub64(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const r = atob(s), o = new Uint8Array(r.length); for (let i = 0; i < r.length; i++) o[i] = r.charCodeAt(i); return o; }
function cat(...a) { const n = a.reduce((x, y) => x + y.length, 0), o = new Uint8Array(n); let p = 0; for (const x of a) { o.set(x, p); p += x.length; } return o; }
async function hmac(key, data) { const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return new Uint8Array(await crypto.subtle.sign('HMAC', k, data)); }
async function hkdf(salt, ikm, info, len) { const prk = await hmac(salt, ikm); return (await hmac(prk, cat(info, new Uint8Array([1])))).slice(0, len); }

// RFC 8291: aes128gcm şifreleme
async function encrypt(sub, payload) {
  const uaPub = ub64(sub.k), auth = ub64(sub.a);
  const kp = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const asPub = new Uint8Array(await crypto.subtle.exportKey('raw', kp.publicKey));
  const uaKey = await crypto.subtle.importKey('raw', uaPub, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: uaKey }, kp.privateKey, 256));
  const ikm = await hkdf(auth, ecdh, cat(enc.encode('WebPush: info\0'), uaPub, asPub), 32);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(salt, ikm, enc.encode('Content-Encoding: aes128gcm\0'), 16);
  const nonce = await hkdf(salt, ikm, enc.encode('Content-Encoding: nonce\0'), 12);
  const key = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, key, cat(enc.encode(payload), new Uint8Array([2]))));
  const head = new Uint8Array(21); head.set(salt, 0); new DataView(head.buffer).setUint32(16, 4096); head[20] = 65;
  return cat(head, asPub, ct);
}
// RFC 8292: VAPID imzası
async function vapid(env, endpoint) {
  const aud = new URL(endpoint).origin;
  const h = b64u(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const c = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: SUB })));
  const k = await crypto.subtle.importKey('jwk', { kty: 'EC', crv: 'P-256', d: env.VAPID_D, x: env.VAPID_X, y: env.VAPID_Y, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, k, enc.encode(h + '.' + c));
  return 'vapid t=' + h + '.' + c + '.' + b64u(sig) + ', k=' + env.VAPID_PUB;
}
// Firestore belgesini, çağıranın oturumuyla oku (kurallar uygulanır)
async function doc(path, tok) {
  const r = await fetch(FS + path, { headers: { Authorization: 'Bearer ' + tok } });
  if (!r.ok) return null;
  const j = await r.json(), o = {};
  for (const [k, v] of Object.entries(j.fields || {})) o[k] = 'stringValue' in v ? v.stringValue : 'integerValue' in v ? Number(v.integerValue) : 'doubleValue' in v ? v.doubleValue : 'booleanValue' in v ? v.booleanValue : null;
  return o;
}
const ID = /^[A-Z0-9]{7}$/;
function json(o, s) { return new Response(JSON.stringify(o), { status: s || 200, headers: Object.assign({ 'content-type': 'application/json' }, CORS) }); }
function fresh(ts) { return typeof ts === 'number' && Math.abs(Date.now() - ts) < 180000; }

export async function handle(req, env) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  const u = new URL(req.url);
  if (req.method === 'GET' && u.pathname === '/key') return json({ k: env.VAPID_PUB });
  if (req.method !== 'POST' || u.pathname !== '/push') return json({ err: 'yok' }, 404);
  let b; try { b = JSON.parse(await req.text()); } catch (e) { return json({ err: 'istek' }, 400); }
  const tok = String(b.t || ''), to = String(b.to || ''), from = String(b.from || '');
  if (!tok || !ID.test(to) || !ID.test(from) || to === from) return json({ err: 'istek' }, 400);
  let msg;
  if (b.k === 'iv') {
    const iv = await doc('iv/' + to, tok);
    if (!iv || iv.from !== from || !fresh(iv.ts)) return json({ err: 'davet yok' }, 403);
    msg = iv.md === 'mm' ? { t: '🛡️ ' + iv.nick + ' seni Meydan Muharebesine çağırıyor!', b: 'Dokun, muharebeye katıl.', g: 'iv' }
                        : { t: '⚔️ ' + iv.nick + ' seni kapışmaya çağırıyor!', b: 'Dokun, maça katıl.', g: 'iv' };
    msg.u = SUB + '?kap=' + encodeURIComponent(String(iv.room || '')) + '&to=' + to;
  } else if (b.k === 'fr') {
    const fr = await doc('fr/' + (from < to ? from + '_' + to : to + '_' + from), tok);
    if (!fr || fr.by !== from || fr.st !== 'req' || !fresh(fr.ts)) return json({ err: 'istek yok' }, 403);
    const pl = await doc('pl/' + from, tok);
    msg = { t: '👫 ' + ((pl && pl.nick) || 'Bir oyuncu') + ' arkadaşlık isteği gönderdi', b: 'Kabul etmek için dokun.', g: 'fr', u: SUB + '?fr=1&to=' + to };
  } else return json({ err: 'tür' }, 400);
  const ps = await doc('ps/' + to, tok);
  if (!ps || !ps.e || !ps.k || !ps.a) return json({ ok: false, why: 'kapali' });
  msg.u = msg.u || SUB;
  const body = await encrypt(ps, JSON.stringify(msg));
  const r = await fetch(ps.e, { method: 'POST', body, headers: { Authorization: await vapid(env, ps.e), 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '900', Urgency: 'high' } });
  return json({ ok: r.ok, s: r.status });
}
export default { fetch: (req, env) => handle(req, env).catch(e => json({ err: 'hata', m: String(e && e.message || e) }, 500)) };
