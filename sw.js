var CACHE = 'mc-v71';
/* Güneş Ülkesi dosyaları (gu/): ilk kullanılınca indirilir, sürümler arasında saklanır */
var GUC = 'mc-gu5';
var FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './lose.mp3', './pass.mp3', './top.mp3', './win.mp3', './tur.mp3', './menu.mp3', './gizlilik.html', './aydinlatma.html', './veri-silme.html', './mc-idle.webp', './mc-happy.webp', './mc-look.webp', './mc-wait.webp', './mc-cheer.webp', './mc-sad.webp', './mc-peek.webp', './mc-blink.webp', './mc-sidel.webp', './mc-sider.webp', './mc-atlas.webp', './wel-sun.webp', './gu-card.webp', './mc-wave.webp', './mc-wow.webp', './mc-trophy.webp', './mc-thumb.webp', './mc-sleep.webp', './mc-point.webp', './mc-think.webp', './mc-clap.webp', './mc-front.webp', './mc-k-ready.webp', './mc-k-sad.webp', './mc-k-bow.webp', './mc-p.webp', './mc-k-p.webp', './mc-k-idle.webp', './mc-k-look.webp', './mc-k-cheer.webp', './mc-k-peek.webp', './mca-idle.webp', './mca-hop.webp', './mca-cheer.webp', './mca-sad.webp', './mca-sneeze.webp', './mca-k-idle.webp', './mca-k-hop.webp', './mca-k-cheer.webp', './mca-k-attack.webp', './mca-k-block.webp'];

self.addEventListener('install', function (e) {
  /* çekirdek dosyalar zorunlu; görsel/ses dosyaları tek tek eklenir (biri inmezse kurulum bozulmaz) */
  e.waitUntil(caches.open(CACHE).then(function (c) {
    var core = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
    return Promise.all(FILES.map(function (f) {
      var p = c.add(new Request(f, { cache: 'reload' }));
      return core.indexOf(f) >= 0 ? p : p.catch(function () {});
    }));
  }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== GUC; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* iPhone (Safari) ses dosyalarını parça parça (Range) ister; önbellekten 206 cevabı üret */
function rangeResponse(req, res) {
  var m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m) return res;
  return res.arrayBuffer().then(function (buf) {
    var size = buf.byteLength, start = m[1] ? parseInt(m[1], 10) : 0, end = m[2] ? parseInt(m[2], 10) : size - 1;
    if (!m[1] && m[2]) { start = Math.max(0, size - parseInt(m[2], 10)); end = size - 1; }
    if (isNaN(start) || isNaN(end)) return res;
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
        return hit || fetch(e.request).then(function (r) { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(function () { return Response.error(); });
      });
    }));
    return;
  }
  if (u.indexOf(self.location.origin) !== 0) return;
  /* hikâye videosu önbelleğe alınmaz: tarayıcı akış hâlinde oynatır */
  if (/\.mp4(\?|#|$)/.test(u)) return;
  if (u.indexOf('/gu/') > 0) {
    var key = u.split('#')[0].split('?')[0];
    e.respondWith(caches.open(GUC).then(function (c) {
      return c.match(key).then(function (hit) {
        if (hit) return e.request.headers.get('range') ? rangeResponse(e.request, hit) : hit;
        return fetch(key).then(function (r) {
          if (r && r.ok && r.status === 200) c.put(key, r.clone());
          return e.request.headers.get('range') && r.ok ? rangeResponse(e.request, r) : r;
        }).catch(function () { return Response.error(); });
      });
    }));
    return;
  }
  if (e.request.headers.get('range')) {
    e.respondWith(caches.match(u.split('#')[0], { ignoreSearch: true }).then(function (hit) {
      return hit ? rangeResponse(e.request, hit) : fetch(e.request);
    }).catch(function () { return Response.error(); }));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).catch(function () {
        /* internet yokken sadece sayfa gezintisi index.html'e düşer; görsel/ses için temiz hata */
        return (e.request.mode === 'navigate' ? caches.match('./index.html') : Promise.resolve(null)).then(function (x) { return x || Response.error(); });
      });
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
  }).catch(function () {}));
});
