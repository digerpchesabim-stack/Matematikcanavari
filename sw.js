var CACHE = 'mc-v55';
var FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './lose.mp3', './pass.mp3', './top.mp3', './win.mp3', './tur.mp3', './menu.mp3'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); })); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

/* iPhone (Safari) ses dosyalarını parça parça (Range) ister; önbellekten 206 cevabı üret */
function rangeResponse(req, res) {
  var m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m) return res;
  return res.arrayBuffer().then(function (buf) {
    var size = buf.byteLength, start = m[1] ? parseInt(m[1], 10) : 0, end = m[2] ? parseInt(m[2], 10) : size - 1;
    if (!m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }
    end = Math.min(end, size - 1);
    if (start > end || start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
    return new Response(buf.slice(start, end + 1), {
      status: 206,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'audio/mpeg',
        'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
        'Content-Length': String(end - start + 1),
        'Accept-Ranges': 'bytes'
      }
    });
  });
}

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = e.request.url;
  if (u.indexOf('https://www.gstatic.com/firebasejs/') === 0) {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(e.request).then(function (hit) {
        return hit || fetch(e.request).then(function (r) { if (r && r.ok) c.put(e.request, r.clone()); return r; });
      });
    }));
    return;
  }
  if (u.indexOf(self.location.origin) !== 0) return;
  if (e.request.headers.get('range')) {
    e.respondWith(caches.match(u.split('#')[0], { ignoreSearch: true }).then(function (hit) {
      return hit ? rangeResponse(e.request, hit) : fetch(e.request);
    }));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).catch(function () { return caches.match('./index.html'); });
    })
  );
});

/* bildirimler (S49) */
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { t: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.t || 'Matematik Canavarı', { body: d.b || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.g || 'mc', renotify: true, data: { u: d.u || './' } }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var u = (e.notification.data && e.notification.data.u) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (l) {
    for (var i = 0; i < l.length; i++) { if ('focus' in l[i]) { try { l[i].postMessage({ mc: 'open', u: u }); } catch (x) {} return l[i].focus(); } }
    return self.clients.openWindow(u);
  }));
});
