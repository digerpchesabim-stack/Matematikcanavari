# Matematik Canavarı — Proje Belgesi (Claude için)

Bu dosya projenin tek kaynak belgesidir. Yeni bir oturumda önce bunu oku; bilgiyi yeniden sorma.
Son güncelleme: 3 Kasım 2026 · Yayındaki sürüm: **40**

## 1. Proje ve kullanıcı
- **Ne:** Özel eğitim meslek okulundaki öğrenciler (11 Zihin B, hafif zihinsel yetersizlik) için 4 işlem pratik + oyun uygulaması. Tek dosyalı mobil PWA.
- **Kim:** Öğretmen (Türkçe konuşur). Kod yazmaz; tüm GitHub/Firebase işlerini Claude yapar.
- **Yayın:** https://digerpchesabim-stack.github.io/Matematikcanavari/ · Depo: `digerpchesabim-stack/Matematikcanavari` (main dalı).
- Öğrenciler raporlarını WhatsApp'tan gönderir. Öğretmen paneli/sınıf sistemi **iptal edildi** (`panel.html` S41'de silindi).
- Bu sohbet/proje sadece Matematik Canavarı içindir. `-kelime-kartlari` deposuna dokunma (ayrı proje).

## 2. Çalışma ilkeleri (kullanıcı tercihleri — mutlaka uy)
1. **Üslup:** Türkçe, doğrudan, kısa, teknik. Gereksiz nezaket yok. Komutlar ayrı kod bloklarında, kod tam dosya.
2. **Önce konuş:** Kod değişikliğinden önce ne yapılacağını anlat, onay bekle ("uygula", "değişiklikleri yap" gibi). Birkaç değişikliği biriktirip tek seferde yapmak uygundur.
3. **Onaysız yayın YOK:** Kullanıcı açıkça "yükle/yayınla" demeden hiçbir sürümü GitHub'a gönderme (3 Kasım 2026 talimatı). Değişiklikleri yerelde biriktir, listesini ver.
4. **Yayın onaylanınca:** uygula → test et → hataları düzelt → yeniden test et → yükle → Pages derlemesini doğrula → kullanıcıyı kısa mesajla "dürt" (🔔 Sürüm N yayında).
5. **Dil hassasiyeti:** Öğrencileri incitebilecek ifadeler kullanma (ör. "Arkadaşın yok mu?" kaldırıldı). Kaybedene moral bozmayan mesaj ("İyi mücadele! 💪").
6. **Güvenlik:** Firebase servis hesabı JSON anahtarını asla isteme/gösterme. Kullanıcı bir kez şifresini sohbete yazmıştı; değiştirmesi önerildi.
7. Commit mesajı sonuna oturumun verdiği `Co-Authored-By` / `Claude-Session` satırlarını ekle.

## 3. Yayın hattı
- **Dosyalar:** `index.html` (tüm uygulama), `sw.js` (önbellek), `manifest.json`, `icon-192.png`, `icon-512.png`. Ayrıca `firebase/` (kurallar) ve `.github/workflows/firestore-rules.yml`.
- **Her sürümde:** `index.html` içinde karşılama ekranındaki `Sürüm N` yazısını ve `sw.js` içindeki `var CACHE = 'mc-vN'` değerini artır. Service worker cache-first çalışır; yeni sürümde sayfa kendini yeniler (`controllerchange`/`PENDRELOAD`). Telefonda eski sürüm görünüyorsa uygulama kapatılıp açılır.
- **GitHub Pages:** main'e push → "pages build and deployment" çalışır. Kontrol: `gh run list --limit 3`. (Canlı siteye WebFetch izinli değil.)
- **Firestore kuralları:** `firebase/firestore.rules` değişip push edilince Actions kuralları otomatik yükler (secret `FIREBASE_SA`, servis hesabında "Firebase Rules Admin" rolü). Elle tetikleme: `gh api -X POST repos/digerpchesabim-stack/Matematikcanavari/actions/workflows/firestore-rules.yml/dispatches -f ref=main` (GraphQL engelli, `gh workflow run` çalışmaz).
- **Sıra:** Kural değişikliği gerekiyorsa önce kurallar (geriye uyumlu/ek), sonra uygulama.
- **Zip:** Kullanıcıya dosya gerekiyorsa 5 web dosyası düz zip (`matematik-canavari-web.zip`).
- Firebase projesi: `matematik-canavari-57e2d` (Spark, Firestore Avrupa). Connector yok; her şey depo + Actions üzerinden.

## 4. Mimari (index.html)
- Vanilla JS, tek `<script>`. Global durum `st` (st.screen, st.profile, st.g …), `go(screen)` → `render()`, `back()` (uygulama içi ← ve telefon geri tuşu aynı fonksiyon), `topBar(title)`, `modal(msg,yes,no,onYes,onNo)`, `toast()`.
- **Ekranlar:** welcome, profiles, home, ops/mode/digits/quiz/summary/pmenu/mixmenu/history (pratik + problemler), gmenu/gsetup/gcount/game/gover (Akıldan İşlem), rooms/rcreate/rctb/lobby/rcount/rover/rjoin/rhist (yarış), dintro/duel/dover (1'e 1 kapışma), bpick/bset (canavara karşı), lb (rekorlar), guide (kılavuz).
- **localStorage:** mc_profiles, mc_records (oyun/pratik kayıtları, profil başına son 200), mc_bk/mc_bkh/mc_bkt (yedek kodu, son yedek özeti ve zamanı), mc_best (profil→mod anahtarı rekor), mc_rhist/mc_rbest (yarış geçmişi/rekoru), mc_dhist (kapışma geçmişi, `bot` alanı canavar maçları), mc_gnick (misafir adı), mc_audio, mc_dev (cihaz hesabı), mc_vert (yan yana/alt alta), mc_lbfix1 (S31 bir kerelik rekor kurtarma bayrağı).
- **Ses:** Web Audio ile kodla üretilir (`auCtx`, `tone`, `sfxPlay`, `AU.sg`, `AU.nb` gürültü tamponu). Efektler: sndPop/Ok/Bad/Fast/Win/End/Tick, sndWhistle (düdük), sndClap (alkış), sndCrunch (çıtırtı), sndSwoosh, sndClang (kılıç). Müzik: musStart/musStop/musTempo (sadece Akıldan İşlem). Hazır ses dosyaları (S37): lose/pass/top/win.mp3; yeni ses dosyası eklenirse sw.js FILES listesine de ekle. Telefonlar dokunuş olmadan ses çalmaz.
- **Geri tuşu (S27):** `NAV` — dokunuş (click) anında 10 kayıtlık geçmiş tamponu doldurulur (Chrome dokunuşsuz eklenen kayıtları atlar). `popstate` → modal açıksa "Hayır", karşılamada çıkış sorusu, aksi halde `back()`.
- **Karşılama canavarı (S40):** `drawMonster(c,cx,cy,r,{m:ağız,happy})`; kovalamaca sahnesi `CH` (`chStart/chFrame/chTap`).
- **Menü müziği (S40):** `menu.mp3`, `MM`/`mmUpdate`/`mmToggle`, `MMOFF` ekranlarında susar; sağ üstte 🎵 (`mc_mmus`).

## 5. Özellikler
### 5.1 Pratik ve Problemler
4 işlem, eldeli/eldesiz, 1–4 basamak, sınırsız soru, yanlışta 2. deneme (puansız), "Sonucu Gör" adımlı çözüm, yan yana/alt alta format, 1 mola hakkı, detaylı rapor kartı (fotoğraf olarak paylaşılır). Problemler: şablonlu sonsuz problem + karma (iki işlem).

### 5.2 Akıldan İşlem Oyunu
- Seviye: Kolay/Orta/Zor (`GT`, `gTime`): Kolay 8/6/5/4 sn, Orta 10/8/6/5, Zor 12/10/8/7 (10'ar soruda azalır). 3 can. Puan hıza göre 3/2/1. Seçenekler sade kutular; renk cevaptan sonra.
- Çarpma/bölmede **📚 Tablo çalış** (2–9): rekor tablosuna yazılmaz, tabloya özel yerel rekor.
- Mod anahtarı `gMk(op,lv,tb)`: `add`, `add_o`, `add_z`, `mul_t6`.
- **Başlangıç kartı:** zirve bilgisi gelene kadar bekler (en çok 7 sn), sonra 5 sn sayım + zirve kartı (👑 Zirve, 🎯 İlk hedef), düdükle başlar (`zPre`, `cdRun`).
- **Geçme kartı:** oyun sırasında biri geçilince alkış + "🎉 Bravo! Geçtin: …" + sıradaki hedef; zirvede "👑 Zirveye çıktın!" (`gPass`, `gPopShow`).

### 5.3 Yarış Odası (çok kişili, internetli)
Oda kodu (3–10) ya da davet linki `?oda=KOD`; profil ya da misafir. Seviye ya da tablo. Herkes aynı sorular (tohumlu RNG: `seed*7919+n*104729+13`), 3 can, canlı sıralama, herkes bitince sonuç; sadece birinci tebrik + konfeti. Başlayınca yeni kişi giremez. Yarış geçmişi ve rekoru yerelde.

### 5.4 ⚔️ 1'e 1 Kapışma (S32–33)
- Kurarken: seviye, maç puanı **10/15/20** (varsayılan 10), işlem (+ tablo). 2. kişi girince otomatik başlar; 3. kişi giremez.
- Giriş kartı: isim soldan, isim sağdan, kılıçlar çarpışır (sndClang), 5 sn sayım, düdük.
- Kural: her soruda **önce doğru basan** 1 puan; yanlış basan o soruda kilitlenir. Süre sabit: Kolay/tablo 10, Orta 12, Zor 15 sn (`DLIM`).
- **Adalet:** hız her telefonda yerel ölçülür (soru ekrana gelince → dokunuş). Rakibin doğru süresi gelince, kendi süren onu geçtiyse kaybedersin.
- Tur kartı iki telefonda anında: yeşil "🎉 Bu tur senin!" / turuncu "⚡ Ali bildi!". 🔥 MAÇ SAYISI, ⚡ ALTIN SORU, 15/20'lik maçta "Yarı yol".
- Rövanş (ikisi de basınca), çıkan yenilmiş sayılır, 45 sn ses yoksa "Rakip ayrıldı". Rekor tablosuna gitmez; Yarış Geçmişim → Kapışmalarım.
- Kod: `DU` durumu, `duStart/duRound/duTick/duAns/duMine/duSync/duResolve/duEnd/duRematch`.

### 5.5 👾 Canavara Karşı Savaş (S34–35, internetsiz)
- Canavar = sayı zorluğu + hız: 🐣 Yavru (Kolay sayılar, 3–5 sn, %70 doğru), 👾 Canavar (Orta, 1,5–3 sn ×1,5, %85), 🐉 Dev (Zor, 0,8–1,5 sn ×2, %95). (`BOTS`, `BLF`, `botPlan`)
- Akış: canavar seç → maç puanı + işlem → başlar. Tablo seçeneği yok (bilinçli sadeleştirme).
- Kapışma motorunu kullanır (`DU.bot`, `DU.botR`). Geçmişte canavar başına galibiyet.

### 5.6 Rekorlar Tablosu
- Koleksiyonlar `lbg_<op>[_o|_z]` (Akıldan İşlem) ve `lbr_<op>[_o|_z]` (yarış); belge id = cihaz uid; `{nick≤12, score int 0–5000 (sadece artar), ts}`; ilk 50, sıra "50+". Tablo çalışması ve kapışma yazılmaz.
- `lbSubmit(kind,op,lv,score,cand,nick)` (S31'de yarış çağrısında `lv` eksikti → S21–30 yarış puanları yazılmadı; düzeltildi + `lbBackfill`).
- Paylaş butonu (görsel).

### 5.7 Kılavuz
Girişte ve menülerde "📖 Uygulama Kılavuzu" (`GUIDE` dizisi: oyun, yarış, kapışma, rekorlar…). Yeni özellikte kılavuz metnini de güncelle.

## 6. Firebase veri modeli ve kurallar
- Kimlik: sessiz e-posta/şifre cihaz hesabı (`devAuth`), Firebase JS SDK 10.12.2 (gstatic, SW önbelleğinde).
- `rooms/{KOD}`: `{host, hostNick, op, status:'lobby'|'playing', seed, created, qv, lv:'k'|'o'|'z', tb:0–10, mode?:'duel', win?:10|15|20}`. Güncelleme: sadece kurucu, sadece status→playing. 24 saatten eski oda silinebilir.
- `rooms/{KOD}/players/{uid}`: anahtarlar `nick, score, hearts, ok, bad, n, tt, done, ts, rid, m, r, pr, pid`. Kapışmada `m`=maç no, `r`=[tur sonuçları: >0 doğru ms, <0 yanlış/geç/süre], `pr`=önceki maçın r'si (rövanş geçişi için).
- `QV=3` soru üretim sürümü: oda `qv` > uygulama `QV` ise "farklı sürüm" uyarısı. Kolay yarış qv=1, seviyeli/tablo 2, kapışma 3.
- Rekor koleksiyonları için kurallar: `lbOk()` listesi (30 koleksiyon), sadece kendi uid belgesi.
- Arkadaşlar (S38): `pk/{id}` {k,u} okunamaz, aynı k ile sahiplik taşınır; `owns(pid)` = pk.u == auth.uid. `pl/{id}` {nick,seen,v} herkese okunur. `fr/{a_b}` (a<b) {a,b,by,st,ts}: oluşturma 'req' (by sahibi), güncelleme sadece st→'ok' (karşı taraf), silme taraflar. `iv/{alıcı}`: sadece arkadaş yazar, alıcı/gönderen okur/siler.
- Yedek (S36): `bk/{10 karakter}` {u,d,ts,v}, sadece get (liste yok), sahibi günceller.

## 7. Test düzeneği (`test/` klasörü)
- Playwright + Chromium kurulu; `require('playwright')`. Sözdizimi kontrolü: `node -e "new Function(html.match(/<script>([\s\S]*)<\/script>/)[1])"`.
- `test/mockfb.js`: tek sayfalık bellek içi Firebase taklidi (`window.__MC_FB`).
- `test/mock2.js` + `test/dsrv.js`: **çok telefonlu** test; veri Node'da ortak tutulur, oda/oyuncu kuralları denetlenir, rastgele ağ gecikmesi. Örnek: `test/duel1.js` (iki telefon tam kapışma + rövanş + çıkış), `test/race2.js`, `test/bot1.js` (canavar).
- Testlerdeki `U` yolu yerel `index.html`'i göstermeli (gerekirse düzenle). Animasyonlu öğelere `click({force:true})`.

## 8. Sürüm geçmişi (özet)
- ≤15: pratik, problemler, akıldan işlem oyunu, ses, profil, yarış odaları (sınıf sistemi kaldırıldı).
- 16–19: rekor tablosu (2 sekme), davet linki, konfeti sadece birinciye, hayvanlar kaldırıldı (sade kutular).
- 20–21: kılavuz, seviye + tablo çalış, rekor tablosu paylaş.
- 22–25: zirve/hedef → başlangıç kartı + 5 sn sayım + düdük, geçince alkış kartı, zirve bilgisi gelmeden sayım başlamaz.
- 26–27: telefon geri tuşu = ← , çıkış sorusu.
- 28–29: karşılama canavarı sembol yer (otomatik).
- 30: "📚 Tablo çalış" sadece çarpma/bölme seçilince.
- 31: yarış puanları rekor tablosuna yazılmıyordu → düzeltme + kurtarma.
- 32–33: 1'e 1 Kapışma, tur kartları.
- 34–35: Canavara Karşı Savaş (sadeleştirilmiş).
- 36: otomatik bulut yedeği (`bk/{10 karakter kod}`: `{u, d: mc_* JSON, ts, v}`; oyun kaydından 15 sn sonra, açılışta, arka plana geçince; profil ekranında yedek kodu + paylaş; "♻️ Yedekten Geri Yükle" `bkr`; geri yüklenen telefon yeni kod alır), yarışta "📶 bağlantısı koptu" (10 sn sinyal `rmBeat`, yerel alım zamanı `RM.seen`, 30 sn → koptu, 45 sn → yarış beklemez), profil başına son 200 kayıt (`recTrim`), yazı 15 px / dokunma alanı 44–46 px, Yarış Odası metinleri, Canavar modu Akıldan İşlem menüsünde de (`botOpen(from)`), kapışmada 45 sn.
- 37: kullanıcının seçtiği hazır ses dosyaları (`smpLoad/smpPlay/smpStop`, sw.js önbelleğinde): `lose.mp3` (1'e 1/canavar kaybı, %70), `pass.mp3` (Akıldan İşlem'de birini geçince, 2 sn), `top.mp3` (oyun sonunda rekor tablosunda 1. olunca, 10 sn, kırpılmadı, fanfarı keser, yeni oyunda durur), `win.mp3` (normal kazanma: yeni kişisel rekor, 1'e 1/canavar zaferi, yarış birinciliği). Düdük aynen kaldı; kapışma zaferindeki alkış kaldırıldı.
- 38: arkadaşlar + kapışma tur sesi. 1'e 1 / canavar "Bu tur senin!" sesi → `tur.mp3` (6297'nin hızlandırılmış 1 sn sürümü, kullanıcı seçti: D4). **Arkadaşlar (Blaze gerekmez):** her profile kalıcı oyuncu kimliği `mc_pid={profil:{id:7 karakter, k:gizli anahtar}}` (yedeğe dahil). Firestore: `pk/{id}={k,u}` (okunamaz; aynı k ile yeni telefona taşınır), `pl/{id}={nick,seen,v}` (60 sn'de bir çevrim içi sinyali; 150 sn içinde görüldüyse 🟢), `fr/{a_b}={a,b,by,st:'req'|'ok',ts}`, `iv/{alıcı}={from,nick,room,op,lv,win,ts}` (10 dk geçerli; oyun/kapışma sırasında gösterilmez, menüye dönünce modal). Ekranlar: `friends`, `fcall`; ana menüde "👫 Arkadaşlarım" (+ yeni istek sayısı). Çağır → seviye/maç/işlem → kapışma odası kurulur → davet yazılır; kabul edince `rmJoinCode`. Profil silinince "arkadaşlıklar da silinsin mi?" (`frWipe`). Kod: `frEnsure/frStart/frStop/frBeat/frAdd/frAccept/frDel/frCall/frCallGo/frInvSend/frInvCheck`. Uygulama kapalıyken bildirim YOK (ileride Cloudflare Worker + FCM ile ücretsiz yapılabilir).
- 39: oyun sonunda rakibi arkadaş ekle: oyuncu belgesine `pid` (plx(), rmEnter'da frEnsure), 1'e 1 sonuçta "➕ X arkadaş ekle" / "⏳ istek gönderildi" / "✓ kabul et" (`frBtn(p,true)`), yarış sonucunda arkadaş olmayanların yanında ➕ (`frBtn(p)`); `frAddId(pid)`; misafirlerde yok.
- 40: **Karşılama:** canavar ekranda rakam/sembolleri kovalar (`CH`, `chStart/chFrame/chTap`, canvas 480×440 mantıksal, 7 sembol, yakınlaşınca kaçarlar, canavar yakalayıp yer; dokunulan sembole koşar). Ekran sade: başlık, Haydi Başlayalım, Kılavuz. **Menü müziği:** `menu.mp3` (kullanıcının seçtiği marimba parçası, 150 sn, mono 64k, ~1,2 MB), `<audio loop>` %35 ses, menülerde çalar; quiz/game/gcount/gover/lobby/rcount/rover/dintro/duel/dover ekranlarında yavaşça kısılıp durur (`MMOFF`, `mmUpdate`). İlk dokunuşta başlar. Sağ üstte sabit 🎵/🔇 düğmesi (`mc_mmus`). **Profil sayfası** ("Kim oynuyor?"): baş harfli renkli yuvarlak + "🟢 N arkadaşın çevrim içi" (`prLoad`, 30 sn önbellek). Yedek kutusu ve geri yükleme buradan kaldırıldı. **Ana menü:** üstte "🟢 Şu an oyunda" panosu (`frLive`, çevrim içi arkadaşlar + ⚔️ Çağır); en altta Kılavuz düğmesi yerine "☁️ Yedek ve geri yükleme" (kod + paylaş + ♻️ Yedekten Geri Yükle). Yeni telefonda: Misafir → ana menü → Yedek. `bkr` geri → home.

## 9. Bekleyen / yayınlanmamış (Sürüm 41, `surum-41-onay-bekliyor` dalı, test edildi, yayın onayı bekliyor; kural değişikliği yok)
- **Okuma tasarrufu (Spark 50k okuma/gün):** rekor tablosu 2 dk telefonda saklanır (`LBC`, `lbTop`), kendi yazılan puan önbelleğe işlenir (`lbPatch`); bir oyun + tablo ekranı 3 → 1 indirme. Profil rozetleri 2 dk önbellek; ana menüde arkadaş durumu her 2 dakikada bir.
- **iPhone ses:** sw.js Range isteklerini önbellekten 206 ile cevaplar (`rangeResponse`); internetsiz müzik/ses.
- **Ana menü 2 sütunlu ızgara** (`.hgrid`), kısa açıklamalar; küçük telefonda tek ekran.
- Kullanılmayan eski karşılama animasyonu (MON) silindi (MONSYM/MONCOL kaldı), `panel.html` depodan silindi, README yenilendi.

## 10. Bilinen eksikler (kullanıcı "ileride" dedi)
1. Ortak telefonda rekor satırı cihaza bağlı → başka profil adı üzerine yazar (cihaz+profil anahtarı gerekir).
2. Yarış ortasında kopan oyuncu geri dönemez.
3. Rahat mod (süresiz) ve sesli okuma yok.
4. Yeni oyun fikirleri (kullanıcı "şimdilik dursun" dedi): Market (para hesabı), Hatalarım, Canavarını Büyüt + rozetler, Doğru mu Yanlış mı, Eksik Sayı, Günün Görevi.
5. Tek kişilik tabloda "İlk hedefin" zirveyle aynı görünür.
6. panel.html kalıntı; profil silinince rekor satırı kalır; misafir rekoru kalıcı değil; profil şifresi yok; puan istemci tarafında (hile mümkün).
7. Play Store: hazır ad/avatar listesi, gizlilik politikası, "Verilerimi sil", Android paketi (TWA), 12 test kullanıcısı × 14 gün kapalı test.
