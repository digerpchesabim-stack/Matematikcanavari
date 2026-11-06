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
const ROOM = /^[A-Z0-9]{3,10}$/;
// S55: bildirim olan hazır mesajlar (uygulamadaki MSG numaralarıyla aynı)
const MSGG = { 5: '⚔️ Hadi oynayalım!', 6: '🎮 Oyunu sen kur, ben gelirim', 7: '📨 Beni çağır', 8: '🛡️ Muharebe yapalım mı?', 9: '🏁 Yarışalım mı?', 10: '🔁 Rövanş ister misin?' };
// Türkiye saati (UTC+3, yaz saati yok)
function hhmm(t) { const d = new Date(t + 3 * 3600000); return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); }
async function sendPush(env, ps, msg) {
  const body = await encrypt(ps, JSON.stringify(msg));
  return fetch(ps.e, { method: 'POST', body, headers: { Authorization: await vapid(env, ps.e), 'Content-Encoding': 'aes128gcm', 'Content-Type': 'application/octet-stream', TTL: '900', Urgency: 'high' } });
}
function sub(ps) { return ps && ps.e && ps.k && ps.a ? { e: ps.e, k: ps.k, a: ps.a } : null; }
// S54: 5 dk kala hatırlatma. KV'de dakika kovası: m<dakika> = [{k: oyuncu|oda, s: abonelik, m: mesaj}]
const mkey = t => 'm' + Math.floor((t - 300000) / 60000);
async function remAdd(env, rv, list) {
  if (!env.MCR) return 'kv yok';
  if (rv.at - 300000 < Date.now() + 60000) return 'gec';
  const key = mkey(rv.at), cur = JSON.parse((await env.MCR.get(key)) || '[]');
  for (const x of list) { if (!x.s) continue; const i = cur.findIndex(y => y.k === x.k); if (i >= 0) cur[i] = x; else cur.push(x); }
  await env.MCR.put(key, JSON.stringify(cur), { expirationTtl: Math.max(120, Math.ceil((rv.at - Date.now()) / 1000) + 3600) });
  return 'ok';
}
async function remDel(env, rv, f) {
  if (!env.MCR) return;
  const key = mkey(rv.at), cur = JSON.parse((await env.MCR.get(key)) || '[]'), nx = cur.filter(x => !f(x));
  if (nx.length === cur.length) return;
  if (nx.length) await env.MCR.put(key, JSON.stringify(nx), { expirationTtl: 3600 * 3 }); else await env.MCR.delete(key);
}
export async function cron(env) {
  if (!env.MCR) return 0;
  const m = Math.floor(Date.now() / 60000); let n = 0;
  for (const k of ['m' + (m - 2), 'm' + (m - 1), 'm' + m]) {
    const v = await env.MCR.get(k); if (!v) continue;
    await env.MCR.delete(k);
    for (const x of JSON.parse(v)) { try { await sendPush(env, x.s, x.m); n++; } catch (e) {} }
  }
  return n;
}
function rvMsg(rv, who) {
  const t = hhmm(rv.at);
  return rv.md === 'mm' ? { t: '⏰ 5 dakika sonra Meydan Muharebesi!', b: 'Saat ' + t + '. Dokun, Gir’e bas.', g: 'rm', u: SUB + '?rv=1&to=' + who }
                        : { t: '⏰ 5 dakika sonra kapışma!', b: 'Saat ' + t + '. Dokun, Gir’e bas.', g: 'rm', u: SUB + '?rv=1&to=' + who };
}

export async function handle(req, env) {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  const u = new URL(req.url);
  if (req.method === 'GET' && u.pathname === '/key') return json({ k: env.VAPID_PUB, kv: !!env.MCR });
  if (req.method !== 'POST' || u.pathname !== '/push') return json({ err: 'yok' }, 404);
  let b; try { b = JSON.parse(await req.text()); } catch (e) { return json({ err: 'istek' }, 400); }
  const tok = String(b.t || ''), to = String(b.to || ''), from = String(b.from || '');
  if (!tok || !ID.test(to) || !ID.test(from) || to === from) return json({ err: 'istek' }, 400);
  let msg;
  if (b.k === 'iv') {
    const iv = await doc('iv/' + to, tok);
    if (!iv || iv.from !== from || !fresh(iv.ts)) return json({ err: 'davet yok' }, 403);
    const all = iv.g ? ' herkesi' : ' seni';
    msg = iv.md === 'mm' ? { t: (iv.g ? '📣 ' : '🛡️ ') + iv.nick + all + ' Meydan Muharebesine çağırıyor!', b: 'Dokun, muharebeye katıl.', g: 'iv' }
        : iv.md === 'race' ? { t: '📣 ' + iv.nick + all + ' Yarış Odasına çağırıyor!', b: 'Dokun, yarışa katıl.', g: 'iv' }
        : { t: (iv.g ? '📣 ' : '⚔️ ') + iv.nick + all + ' kapışmaya çağırıyor!', b: iv.g ? 'İlk gelen oynar. Dokun, katıl.' : 'Dokun, maça katıl.', g: 'iv' };
    msg.u = SUB + '?kap=' + encodeURIComponent(String(iv.room || '')) + '&to=' + to;
  } else if (b.k === 'fr') {
    const fr = await doc('fr/' + (from < to ? from + '_' + to : to + '_' + from), tok);
    if (!fr || fr.by !== from || fr.st !== 'req' || !fresh(fr.ts)) return json({ err: 'istek yok' }, 403);
    const pl = await doc('pl/' + from, tok);
    msg = { t: '👫 ' + ((pl && pl.nick) || 'Bir oyuncu') + ' arkadaşlık isteği gönderdi', b: 'Kabul etmek için dokun.', g: 'fr', u: SUB + '?fr=1&to=' + to };
  } else if (b.k === 'ms') {
    // S55: hazır mesaj; sadece oyuna çağıran mesajlar bildirim olur
    const ms = await doc('ms/' + from + '_' + to, tok);
    if (!ms || ms.from !== from || ms.to !== to || !fresh(ms.ts) || !MSGG[ms.m]) return json({ err: 'mesaj yok' }, 403);
    msg = { t: '💬 ' + (ms.nick || 'Arkadaşın') + ': ' + MSGG[ms.m], b: 'Dokun, cevap ver.', g: 'ms', u: SUB + '?ms=1&to=' + to };
  } else if (b.k === 'rs') {
    // davete "meşgulüm" cevabı: alıcının (from) davet belgesi, gönderen (to) tarafından yazılmış olmalı
    const iv = await doc('iv/' + from, tok);
    if (!iv || iv.from !== to || iv.rs !== 'busy' || typeof iv.ts !== 'number' || Math.abs(Date.now() - iv.ts) > 900000) return json({ err: 'cevap yok' }, 403);
    const pl = await doc('pl/' + from, tok);
    msg = { t: '⏳ ' + ((pl && pl.nick) || 'Arkadaşın') + ' şu an meşgul', b: 'Sonra oynarsınız 🙂', g: 'iv' };
  } else if (b.k === 'rv' || b.k === 'rva' || b.k === 'rvc') {
    const room = String(b.r || '');
    if (!ROOM.test(room)) return json({ err: 'istek' }, 400);
    // rv: kurucu (from) → davetli (to) ; rva: davetli (from) → kurucu (to) ; rvc: kurucu iptal etti → davetli (to)
    const inv = b.k === 'rva' ? from : to, host = b.k === 'rva' ? to : from;
    const rv = await doc('rv/' + room + '_' + inv, tok);
    if (!rv || rv.from !== host || rv.to !== inv || !fresh(rv.ts)) return json({ err: 'randevu yok' }, 403);
    const t = hhmm(rv.at), mm = rv.md === 'mm';
    if (b.k === 'rv') {
      if (rv.st !== 'req') return json({ err: 'randevu yok' }, 403);
      msg = { t: '⏰ ' + rv.fn + ' seni ' + (mm ? 'Meydan Muharebesine' : 'kapışmaya') + ' çağırıyor · saat ' + t, b: 'Olur mu? Dokun, cevap ver.', g: 'rv', u: SUB + '?rv=1&to=' + to };
    } else if (b.k === 'rvc') {
      if (rv.st !== 'x') return json({ err: 'randevu yok' }, 403);
      await remDel(env, rv, x => x.r === room);
      msg = { t: '🙂 ' + rv.fn + ' saat ' + t + ' oyununu iptal etti', b: 'Başka zaman oynarsınız.', g: 'rv', u: SUB + '?rv=1&to=' + to };
    } else {
      if (rv.st !== 'ok' && rv.st !== 'no') return json({ err: 'randevu yok' }, 403);
      const pl = await doc('pl/' + from, tok), nk = (pl && pl.nick) || 'Arkadaşın';
      if (rv.st === 'ok') {
        const sh = sub(await doc('ps/' + host, tok)), si = sub(await doc('ps/' + inv, tok));
        await remAdd(env, rv, [{ k: host + '|' + room, r: room, s: sh, m: rvMsg(rv, host) }, { k: inv + '|' + room, r: room, s: si, m: rvMsg(rv, inv) }]);
        msg = { t: '✅ ' + nk + ' saat ' + t + ' randevusunu kabul etti', b: 'Saatinden 10 dakika önce Gir’e dokun.', g: 'rv', u: SUB + '?rv=1&to=' + to };
      } else {
        await remDel(env, rv, x => x.k === inv + '|' + room);
        msg = { t: '🙂 ' + nk + ', saat ' + t + ' randevusuna gelemiyor', b: 'Başka bir saat deneyebilirsin.', g: 'rv', u: SUB + '?rv=1&to=' + to };
      }
    }
  } else return json({ err: 'tür' }, 400);
  const ps = await doc('ps/' + to, tok);
  if (!ps || !ps.e || !ps.k || !ps.a) return json({ ok: false, why: 'kapali' });
  msg.u = msg.u || SUB;
  const r = await sendPush(env, ps, msg);
  return json({ ok: r.ok, s: r.status });
}
export default {
  fetch: (req, env) => handle(req, env).catch(e => json({ err: 'hata', m: String(e && e.message || e) }, 500)),
  scheduled: (ev, env, ctx) => ctx.waitUntil(cron(env).catch(() => 0))
};
