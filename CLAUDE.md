# Matematik Canavarı — Proje Belgesi (Claude için)

Bu dosya projenin tek kaynak belgesidir. Yeni bir oturumda önce bunu oku; bilgiyi yeniden sorma.
Son güncelleme: 10 Kasım 2026 · Yayındaki sürüm: **58**

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
- **Her sürümde:** `index.html` içinde `var APPV=N` (karşılama ekranındaki `Sürüm N` buradan gelir, S51) ve `sw.js` içindeki `var CACHE = 'mc-vN'` değerini artır. Service worker cache-first çalışır; yeni sürümde sayfa kendini yeniler (`controllerchange`/`PENDRELOAD`). Telefonda eski sürüm görünüyorsa uygulama kapatılıp açılır.
- **GitHub Pages:** main'e push → "pages build and deployment" çalışır. Kontrol: `gh run list --limit 3`. (Canlı siteye WebFetch izinli değil.)
- **Firestore kuralları:** `firebase/firestore.rules` değişip push edilince Actions kuralları otomatik yükler (secret `FIREBASE_SA`, servis hesabında "Firebase Rules Admin" rolü). Elle tetikleme: `gh api -X POST repos/digerpchesabim-stack/Matematikcanavari/actions/workflows/firestore-rules.yml/dispatches -f ref=main` (GraphQL engelli, `gh workflow run` çalışmaz).
- **Sıra:** Kural değişikliği gerekiyorsa önce kurallar (geriye uyumlu/ek), sonra uygulama.
- **Zip:** Kullanıcıya dosya gerekiyorsa 5 web dosyası düz zip (`matematik-canavari-web.zip`).
- Firebase projesi: `matematik-canavari-57e2d` (Spark, Firestore Avrupa). Connector yok; her şey depo + Actions üzerinden.

## 4. Mimari (index.html)
- Vanilla JS, tek `<script>`. Global durum `st` (st.screen, st.profile, st.g …), `go(screen)` → `render()`, `back()` (uygulama içi ← ve telefon geri tuşu aynı fonksiyon), `topBar(title)`, `modal(msg,yes,no,onYes,onNo)`, `toast()`.
- **Ekranlar:** welcome, profiles (S53: ilk giriş = karakter seç / hesabım var / misafir), pedit (S46; S53'ten beri sadece yeni karakter ya da otomatik verilen adın tek seferlik değişimi), mig (S53 çoklu karakterden seçim), hesap (S53 Hesabım ve ayarlar), hgir (S53 hesap koduyla aç), fprof (S47), home, ops/mode/digits/quiz/summary/pmenu/mixmenu/history (pratik + problemler), gmenu/gsetup/gcount/game/gover (Akıldan İşlem), rooms/rcreate/rctb/lobby/rcount/rover/rjoin/rhist (yarış), dintro/duel/dover (1'e 1 kapışma), bpick/bset (canavara karşı), lb (rekorlar), guide (kılavuz), rvl/rvn (S54 Zamanlı Oyun listesi / kurma), tml/tmn/tmv/tms (S56 Takımım / takım kur / rakip takım / kapışma ayarı).
- **localStorage:** mc_acc (S53, cihaza özel: dv cihaz kimliği, st son eşit bulut sürümü, ln bilinen son hesap açılışı; eşitlenmez), mc_fs (yazı boyutu 0/1/2), mc_tts ({a:1} problemi kendiliğinden oku), mc_mgk (geçiş yedeği kodu), mc_lbcl (bir kerelik rekor satırı temizliği), mc_profiles (S53'ten beri en çok 1), mc_records (oyun/pratik kayıtları, profil başına son 200), mc_bk/mc_bkh/mc_bkt (yedek kodu, son yedek özeti ve zamanı), mc_best (profil→mod anahtarı rekor), mc_rhist/mc_rbest (yarış geçmişi/rekoru), mc_dhist (kapışma geçmişi, `bot` alanı canavar maçları), mc_nm/mc_nmnew (oyun adları, S46; mc_gnick S46'da kaldırıldı), mc_audio, mc_dev (cihaz hesabı), mc_vert (yan yana/alt alta), mc_lbfix1 (S31 bir kerelik rekor kurtarma bayrağı).
- **Ses:** Web Audio ile kodla üretilir (`auCtx`, `tone`, `sfxPlay`, `AU.sg`, `AU.nb` gürültü tamponu). Efektler: sndPop/Ok/Bad/Fast/Win/End/Tick, sndWhistle (düdük), sndClap (alkış), sndCrunch (çıtırtı), sndSwoosh, sndClang (kılıç). Müzik: musStart/musStop/musTempo (sadece Akıldan İşlem). Hazır ses dosyaları (S37): lose/pass/top/win.mp3; yeni ses dosyası eklenirse sw.js FILES listesine de ekle. Telefonlar dokunuş olmadan ses çalmaz.
- **Geri tuşu (S27):** `NAV` — dokunuş (click) anında 10 kayıtlık geçmiş tamponu doldurulur (Chrome dokunuşsuz eklenen kayıtları atlar). `popstate` → modal açıksa "Hayır", karşılamada çıkış sorusu, aksi halde `back()`. Çıkış onaylanınca (S43) tüm geçmiş sarılır.
- **Karşılama canavarı (S40):** `drawMonster(c,cx,cy,r,{m:ağız,happy})`; kovalamaca sahnesi `CH` (`chStart/chFrame/chTap`).
- **Menü müziği (S40):** `menu.mp3`, `MM`/`mmUpdate`/`mmToggle`, `MMOFF` ekranlarında susar; sağ üstte 🎵 (`mc_mmus`). S54: iPhone'da `volume` salt okunur → `MM.vol=false`, kısma efekti yok, doğrudan `pause()/play()` (test `test/mus3.js`).

### 4.1 Tasarım sistemi (S58 — görünümü değiştirirken buraya uy)
- Kullanıcı kararları (10 Kasım 2026): arayüz **kabartmalı 3D** + özel ekranlarda **gerçek 3D sahne**, hareket **dengeli** (menüler canlı, soru ekranı sakin), **yepyeni palet** (mor kimlik bırakıldı). Canavar maskot olarak mor kaldı (uygulama simgesiyle aynı).
- Stil dosyası: `<style>` sonunda "S58: yeni tasarım sistemi" bloğu eski kuralların üstüne yazar (eski kurallar düzen için duruyor). Yazı tipi **Poppins** (500/700, Türkçe alt küme, base64 gömülü `MCP`; ek dosya yok).
- Renk değişkenleri: `--bg/--bg2` zemin, `--card`, `--text`, `--muted`, `--accent` (kobalt #2f6bff) + `--accent-d` (alt kenar), `--gold/--gold2/--gold-d/--gold-t` (ana eylem düğmesi `.next` altın), `--ok/--ok-bg/--ok-d`, `--bad/--bad-bg/--bad-d`, `--line`, `--edge` (kartların alt kenarı = derinlik), `--sh` (gölge), `--me/--me-t` (kendi satırın), `--glow`. 6 tema aynı anahtarlarla: auto, light (Gündüz), sepia (Kum), dark (Gece), ocean, hc. Yeni renk eklerken sabit hex yazma, değişken kullan.
- Kabartma kuralı: düğme/kart = `box-shadow:0 Npx 0 var(--edge)` + `:active{transform:translateY(N-1px)}`. `.btn .big` = renkli simge karosu (`.hgrid` içinde nth-child ile 6 renk). Izgaralar `minmax(0,1fr)` (320 px'te taşma olmasın).
- 3D sahneler: karşılama (`.logo3d` kabartma başlık + dönen `.cube` küpler, canavar gölgeli/ışıklı `drawMonster`), kazanma madalyonu `coin3d(emoji)` (1'e 1/muharebe/takım/rekor/yarış), rütbe kutlaması `.rkart` dönerek gelir, karakter kartı `.kcard.tilt` telefon eğimi/parmakla eğilir (`tiltInit`, `--tx/--ty/--gx`), kapışma girişi isimler derinlikten gelir, geri sayım `#cdn.tick`, pencereler `boxin`.
- Ekran geçişi: `render()` ekran değişince `#app`'e `scr-in` / `scr-back` (geri) / `scr-fade` (oyun ekranları `MMOFF`, quiz, summary, sabit alt çubuklu ekranlar) sınıfı verir.
- **Sade mod** `html.lite` (`LITE`: hareketi azalt ayarı, ≤2 GB bellek ya da ≤2 çekirdek): küp/madalyon/eğim/3D geçiş kapanır.
- Takım kapışması simgeleri: `icoShields()` (kalkanlar; menü/düğme, `tIcon(px)`), `icoTeams()` (iki takım + VS; giriş ve sonuç). SVG, her çağrıda benzersiz gradient kimliği (`ICN`).
- Büyük yazı (`data-fs`): oyun ekranında cevap kutuları küçülür (iki sıra ekrana sığsın).
- Paylaşılan görsellerde (canvas) mor tonlar kobalta çevrildi.

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
- S54: `iv` belgesine alıcı cevap yazar: `rs` ('seen'|'ok'|'busy'|'later'), `rr` (randevu odası), `ra` (saat). Oda `at` (zamanlı oyun başlama zamanı). `rv/{ODA}_{alıcı}` {from, fn, to, room, op, lv, win, md:'duel'|'mm', at, ts, st:'req'|'ok'|'no'|'x'(iptal)|'d'(başladı), n}: okuma oturum (liste), oluşturma arkadaş + oda kurucusu, alıcı st→ok/no, kurucu st→x/d, silme taraflar.
- S56: `tm/{ad no}` {m:[pid ≤4], cap, by, w, l, ct (kaptanlık maçı), jn (son katılma), lm (son yazılan maç), ts, v}: okuma oturum; oluşturma m=[by]; katılma sadece kendini ekler + geçerli `tv`; ayrılma sadece kendini çıkarır (kimse başkasını çıkaramaz); cap/ct/w/l (+0/+1)/lm üyelerce; silme son üye. `tv/{alıcı}` {t,from,nick,ts} takıma çağırma (üye → arkadaş). `ti/{takım}` {by,nick,room,a,b,ts,cm?} takım çağrısı (a takımının üyesi yazar; doc a ya da b). Oda + `ka`,`kb` (−1 Canavar Takımı),`cm` (kaptanlık maçı), güncellemede `pa` (eşleşme). Oyuncu + `tk`,`br` (bot sonuçları). `pl` + `tm`. QV=5 (takım kapışması odası qv 5).
- S55: `iv` + `g` (toplu davet; başkasının açık (10 dk içinde, cevapsız/seen) davetinin üzerine yazamaz), `md:'race'`. `ms/{gönderen}_{alıcı}` {from,to,m (1–60 tam sayı),ts,nick}: okuma oturum, yazma gönderen + arkadaş, silme taraflar.

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
- 38: arkadaşlar + kapışma tur sesi. 1'e 1 / canavar "Bu tur senin!" sesi → `tur.mp3` (6297'nin hızlandırılmış 1 sn sürümü, kullanıcı seçti: D4). **Arkadaşlar (Blaze gerekmez):** her profile kalıcı oyuncu kimliği `mc_pid={profil:{id:7 karakter, k:gizli anahtar}}` (yedeğe dahil). Firestore: `pk/{id}={k,u}` (okunamaz; aynı k ile yeni telefona taşınır), `pl/{id}={nick,seen,v}` (60 sn'de bir çevrim içi sinyali; 150 sn içinde görüldüyse 🟢), `fr/{a_b}={a,b,by,st:'req'|'ok',ts}`, `iv/{alıcı}={from,nick,room,op,lv,win,ts}` (10 dk geçerli; oyun/kapışma sırasında gösterilmez, menüye dönünce modal). Ekranlar: `friends`, `fcall`; ana menüde "👫 Arkadaşlarım" (+ yeni istek sayısı). Çağır → seviye/maç/işlem → kapışma odası kurulur → davet yazılır; kabul edince `rmJoinCode`. Profil silinince "arkadaşlıklar da silinsin mi?" (`frWipe`). Kod: `frEnsure/frStart/frStop/frBeat/frAdd/frAccept/frDel/frCall/frCallGo/frInvSend/frInvCheck`. Uygulama kapalıyken bildirim S49'da eklendi.
- 39: oyun sonunda rakibi arkadaş ekle: oyuncu belgesine `pid` (plx(), rmEnter'da frEnsure), 1'e 1 sonuçta "➕ X arkadaş ekle" / "⏳ istek gönderildi" / "✓ kabul et" (`frBtn(p,true)`), yarış sonucunda arkadaş olmayanların yanında ➕ (`frBtn(p)`); `frAddId(pid)`; misafirlerde yok.
- 40: **Karşılama:** canavar ekranda rakam/sembolleri kovalar (`CH`, `chStart/chFrame/chTap`, canvas 480×440 mantıksal, 7 sembol, yakınlaşınca kaçarlar, canavar yakalayıp yer; dokunulan sembole koşar). Ekran sade: başlık, Haydi Başlayalım, Kılavuz. **Menü müziği:** `menu.mp3` (kullanıcının seçtiği marimba parçası, 150 sn, mono 64k, ~1,2 MB), `<audio loop>` %35 ses, menülerde çalar; quiz/game/gcount/gover/lobby/rcount/rover/dintro/duel/dover ekranlarında yavaşça kısılıp durur (`MMOFF`, `mmUpdate`). İlk dokunuşta başlar. Sağ üstte sabit 🎵/🔇 düğmesi (`mc_mmus`). **Profil sayfası** ("Kim oynuyor?"): baş harfli renkli yuvarlak + "🟢 N arkadaşın çevrim içi" (`prLoad`, 30 sn önbellek). Yedek kutusu ve geri yükleme buradan kaldırıldı. **Ana menü:** üstte "🟢 Şu an oyunda" panosu (`frLive`, çevrim içi arkadaşlar + ⚔️ Çağır); en altta Kılavuz düğmesi yerine "☁️ Yedek ve geri yükleme" (kod + paylaş + ♻️ Yedekten Geri Yükle). Yeni telefonda: Misafir → ana menü → Yedek. `bkr` geri → home.
- 41: **Okuma tasarrufu (Spark 50k okuma/gün):** rekor tablosu 2 dk telefonda saklanır (`LBC`, `lbTop`), kendi yazılan puan önbelleğe işlenir (`lbPatch`); bir oyun + tablo ekranı 3 → 1 indirme. Profil rozetleri 2 dk önbellek; ana menüde arkadaş durumu her 2 dakikada bir. **iPhone ses:** sw.js Range isteklerini önbellekten 206 ile cevaplar (`rangeResponse`); internetsiz müzik/ses. **Ana menü 2 sütunlu ızgara** (`.hgrid`), kısa açıklamalar; küçük telefonda tek ekran. Kullanılmayan eski karşılama animasyonu (MON) silindi (MONSYM/MONCOL kaldı), `panel.html` depodan silindi, README yenilendi.
- 42: menü müziği kendini toparlar: ses öğesi hata verirse/kaynak yoksa atılıp yeniden oluşturulur (`mmMake/mmRetry`, en çok 4 deneme, artan bekleme), her dokunuşta müzik isteniyor ama duruyorsa yeniden başlatılır. (Kullanıcı S41'den sonra telefonunda müziğin gittiğini bildirdi; emülasyonda tekrarlanamadı, güncelleme anında yükleme hatası olası sebep.)
- 43: çıkış döngüsü düzeltmesi: uygulama güncellenip yenilenince önceki oturumların geri adımları geçmişte kalıyordu, "Evet, çık" sadece o oturumun adımlarını sarıyordu → soru tekrar tekrar geliyordu. Şimdi `appExit` `NAV.ex` açıkken her popstate'te `history.back()` ile tüm uygulama adımlarını sarar; dokunuş çıkışı iptal eder. Test: `test/exit2.js`.
- 44–45: Arkadaşlarım'da oyuncu kodunun altında 📋 Kopyala + 📤 Paylaş (`frCopy`); oyuncu ve yedek kodları **çizgisiz** gösterilir (`frFmt`, `bkFmt` ham kod; eski çizgili yazımlar da kabul); Paylaş **sadece kodu** gönderir (açıklama metni yok — kullanıcı isteği). **Tema** (`mc_theme`, yedeğe dahil): Otomatik (varsayılan, telefon ayarı) / Açık / Sepya / Gece / Okyanus / Yüksek kontrast; `<html data-theme>` + CSS değişkenleri, başta küçük script ile ilk boyada uygulanır; seçim penceresi `themeOpen` (önizleme kartları); giriş ekranı sol üst 🎨 + ana menüde "🎨 Tema". Paylaşılan görseller tema dışı.
- 46: Öğrenci ad yazamaz; oyun adı hazır karakterden seçilir.
  - `NMC` 10 kategori, `NME` 209 karakter `[emoji, ad, kategori]` — **sıra değişmez, yeni karakter sadece sona**. Oyundaki canavar simgeleri (🐣 👾 🐉) ve benzerleri (🐲, 🐥) bilerek yok; insan yüzü, bayrak, din, silah, hakaret çağrıştıran hayvan yok; imalı ya da takılmaya açık adlar (patlıcan, muz, salatalık, sosisli, şeftali, fıstık, armut, fil, balina, kaplumbağa, mantar, "top", "çekici", "sevgili"…) kullanıcı uyarısıyla çıkarıldı. Yeni ad eklerken aynı gözle bak.
  - Ad = `emoji + ' ' + ad` (+ `' #N'`). Karakteri ilk alan numarasız; doluysa 100–999, o da doluysa 1000–9999 (`nmClaim`).
  - Kayıt: Firestore `nm/{e_n}` {u,t}; oluşturma herkes, güncelleme/silme sahibi, get açık (liste yok). Seçerken tek `getDoc` ile "✨ boş / alınmış" (`peCheck`).
  - Yerel `mc_nm` {profil:{e,n,c}} (c=bulutta ayrıldı), `mc_nmnew` (ilk girişte "Yeni oyun adın… Beğendin mi?" kartı, `nmAsk`). İkisi yedekte.
  - `nmSync` (açılıştan 1,5 sn sonra, `online`, profil ekranı): eski düz adlı profillere rastgele karakter verir, `profRename` ile tüm yerel kayıtları taşır, `nmRemote` ile pl nick ve bu cihazın 30 rekor satırını günceller; eski misafir adı (`mc_gnick`) satırları "👤 Misafir" olur.
  - Ekran `pedit` (`peOpen(i,ret)`): kategori sekmeleri 5×2 + karakter kartları; ✏️ düzenle (profil kartının yanında), silme bu ekranda; eski ad serbest kalır (`nmRelease`).
  - Misafir: ad kutuları kalktı, `rmNick()`='👤 Misafir', rekor tablosuna yazılmaz (`lbRun` → `{guest:true}`).
  - Kurallar: nick sınırları 60 (lb, pl, oda oyuncusu) + `nm`. Yayında **önce kurallar**, sonra uygulama. Test: `test/v46.js`.

- 47: **🛡️ Meydan Muharebesi (3–4 kişi)**, arkadaş profili, rekor tablosundan arkadaşlık isteği.
  - Oda `mode:'mm'`, `qv:4` (`QV=4`; eski sürüm katılamaz). Kurucu en az 3 kişide "▶️ Muharebeyi Başlat"; en çok 4 (`duCap`). Oyuncu belgesinde `jt` (giriş zamanı, sıralama sabit kalsın; `plx` ekler). Lobide `mmInvHtml` ile arkadaş çağırma (`iv.md='mm'`).
  - Kapışma motoru N kişiye genelleşti: `DU.ids/nick/pid/gone/pts/wk`; `duR(uid)`, `duBest(k)` (rakiplerin en hızlı doğrusu → "geç kaldın"), `duWinner(k)` (en kısa doğru süre; eşitlikte kurucu), `duReady(k)` (ayrılanlar hariç herkesin sonucu), `duPts()`. Ayrılan (done ya da 45 sn ses yok) `duGone`; herkes ayrılırsa kalan kazanır. Rövanş: hayatta kalan herkes basınca. 1'e 1 ve canavar aynı motoru kullanır (`DU.sc=[ben, en iyi rakip]`).
  - Ekranlar: `duIntroHtml` (MEYDAN MUHAREBESİ + 4 isim), `.dsc4` puan çipleri (emoji), `duPodium` 🥇🥈🥉 + ➕, `drawDuel` çok kişili kart. Geçmişte `mm:1, rk, n, o (adlar), qs (pid'ler)`; 1'e 1 kayıtlarında rakip kimliği `q`.
  - Arkadaş profili `fprof` (`frProf`, `frProfHtml`, `frH2H`: `q` ile, eski kayıtlarda şimdiki adla eşleşir): aranızdaki skor, son 30 kapışma, çağır, arkadaşlıktan çıkar.
  - Rekor satırı `{nick,score,ts,pid?}`: `lbSubmit` profil pid'ini yazar; `lbPidFix` her profil için bir kez kendi satırlarına ekler (`mc_lbpid`). Satıra dokununca `lbTap` kartı: ➕ istek / ⚔️ çağır / 👤 profil.
  - Kurallar: rooms mode ['duel','mm'], players keys + 'jt', lb keys + 'pid' (≤10), iv keys + 'md'. Test: `test/mm1.js` (4 telefon, kopma, rövanş, çıkış, 1'e 1 pid, arkadaş profili, rekor tablosu isteği).

- 48: **🏅 Rütbe ve madalyalar** (tasarım vitrini ve "Rütbe ve Madalya Sistemi" dokümanı artifact olarak paylaşıldı).
  - Puan (sadece insanlı kapışma): 1'e 1 galibiyet K/O/Z = 1/2/3; muharebe 1. = 2/4/6, 2. = 1/2/3. Kayıpta puan gitmez. Tablo modu = Kolay.
  - Rütbe `RKP=[0,15,60,150,300,600,1000]`, Zor galibiyet şartı `RKZ=[0,0,0,0,25,50,100]`: Çaylak (S50'de Filiz'in yerine; kanatlarını açmış genç kuş, göğsünde tüy deseni), Çırak (kitap +−), Savaşçı (×, kılıçlar), Şövalye (tüy kalemli miğfer), Usta (π'li baykuş), Şampiyon (+ kupa), Efsane (∞, alev). Rütbe düşmez; sınırlar sadece düşürülebilir.
  - Madalyalar `RKF` (bronz/gümüş/altın): Kılıç 10/30/60 (1'e 1), Kalkan 5/15/30 (muharebe 1.), Seri 3/5/8 (en iyi seri), Canavar Avcısı Yavru/Canavar/Dev 10'ar, Azim 10/40/100 gün (≥20 doğru), Soru Ustası 500/3000/10000 doğru. Gümüş sadece Orta/Zor, altın sadece Zor galibiyet sayar.
  - Adil oyun: aynı rakiple günde 5 maç (`dc`), rakip yarıdan önce çıkarsa sayılmaz, canavar maçı puan vermez, misafir kazanmaz.
  - Yerel `mc_rk` {profil:{p,hz,sw,sh,se,sb,mo,dz,q,m(6 haneli bit maskesi),r,dc,dd,dq,dk,ls,bf}} (yedekte, profRename/silme taşır). İlk açılışta `rkBackfill`: kayıtlardaki doğrular + mc_dhist (yarım puan, sayaçlar tam).
  - Kancalar: `gSave`/`saveProgress` → `rkQ(sid,ok)` (fark sayılır), `duSave` → `rkMatch()`. Kutlama sırası `RK.q`, `rkFlush` sadece `RKOK` ekranlarında; pencere `#ov.rkov` (`rkShow`), 📤 `rkShare` 1080×1080 PNG.
  - Herkese açık: `pl` {+rk,md}, oda oyuncusu {+rk} (maç başındaki rütbe), lb satırı {+rk}. Rekor tablosu satırında mini rozet, `lbTap` kartında rütbe + madalyalar (pl okunur), arkadaş profili, kapışma girişi (`duRkE`).
  - Ekranlar `rozet` (Rozetlerim, ana menüde düğme), `rhelp` (Nasıl kazanırım?), kılavuzda `rank`. Çizim `RKA.emblem/medal` (SVG + SMIL, `rkStill` animasyonsuz).
  - Kurallar: players keys + rk; pl keys + rk(int 0–6), md(string ≤12); lb keys + rk. Test: `test/rk1.js`.

- 49: **🪪 Karakter Kartı + 🔔 bildirimler + rekor tablosunda rütbe.**
  - Karakter kartı (`kart` ekranı; eski `rozet` adı da açar): büyük rozet, ad, rütbe · puan, ilerleme (kendi kartı), en iyi madalyalar, 6 istatistik (1'e 1 galibiyet, muharebe 1.'liği, en uzun seri, doğru cevap, oyun günü, canavar galibiyeti), oyuncu kodu. Kendi kartında 📤 Kartımı Paylaş (1080×1350 PNG, `rkCardShare`), Nasıl kazanırım?, rütbe merdiveni ve bütün madalyalar. Başkasının kartı: `rkCardOpen(pid,nick)` → `pl` okunur; altında ➕/✓/⏳/⚔️ çağır + "Aranızdaki kapışmalar" (fprof, geri → kart). Ana menüde "🪪 Karakter Kartım"; rekor tablosunda (kendi satırın dahil) ve Arkadaşlarım listesinde dokununca kart.
  - `pl.st` = 'p.hz.sw.sh.sb.q.dz.mo' (`rkSt`). Eski sürümdeki oyuncunun kartında "henüz güncellemedi" yazar.
  - Rekor satırlarına rütbe: `rkLbSync(p)` (frStart'tan 7 sn sonra ve rütbe değişince; `mc_lbrk` {profil: yazılan rütbe}), 30 koleksiyonda kendi satırı okunur, nick eşleşirse rk yazılır. `lbPidFix` ve ad değişikliği artık rk/pid'i korur (`Object.assign`).
  - **Bildirimler (Web Push, ücretsiz):** sunucu `worker/index.js` (Cloudflare Worker `mc-push`), `.github/workflows/worker.yml` main'de `worker/**` değişince kurar (secret `CF_API_TOKEN`, `CF_ACCOUNT_ID`; kullanıcı ekledi). VAPID anahtarı CF_API_TOKEN'dan türetilir (`worker/keys.js`; token yenilenirse anahtar değişir, uygulama `mc_push.k` farkını görüp yeniden abone olur). İş akışı sunucu adresini + açık anahtarı `push.json` olarak main'e kendisi yazar; uygulama `push.json`'u okur (`pushCfg`).
  - Akış: Arkadaşlarım → "🔔 Bildirimleri aç" (`pushOn`, izin + `pushManager.subscribe`) → `ps/{pid}` {e,k,a,ts}; frStart'ta `pushSync`. Davet yazılınca `pushSend(to,'iv')`, arkadaşlık isteğinde `pushSend(to,'fr')` → Worker, gönderenin Firebase ID token'ıyla Firestore REST'ten `iv/{to}` (from + 3 dk içinde) ya da `fr/{a_b}` (by, req, 3 dk) doğrular, `ps/{to}` okur, aes128gcm + VAPID ile gönderir. sw.js `push` → bildirim, `notificationclick` → uygulamayı öne getir/aç (davet zaten frInvCheck ile gelir). iPhone: sadece ana ekrana eklenmiş uygulamada (iOS 16.4+), kutuda bilgi yazar.
  - Kurallar: `ps/{pid}` get oturum, yazma owns(pid); pl + 'st' (≤60). Testler: `worker/test.mjs` (şifre çözme + VAPID doğrulama + red durumları), `test/push1.js`, `test/rk2.js` (kart).

- 50: ilk rütbe **Filiz → Çaylak** (kullanıcı Filiz'i beğenmedi; + işaretsiz kuş rozeti `DRAW.kite`). Rütbe sırası aynı, veri değişmedi.

- 51: **Kapışma başlama yarışı düzeltildi** (kullanıcı: davetle girilen 1'e 1'de iki telefon da kendini kazanmış gösterdi). Sebep: katılan telefona oda "playing" bildirimi, rakibin oyuncu belgesinden önce gelince `duNew` rakipsiz `DU.ids=[ben]` kuruyordu → tek başına oynuyordu. Çözüm: `rmGo()` (oda snapshot + `rmRefresh`) rakip belgeleri gelene kadar bekler (1'e 1 ≥1 rakip, muharebe 6 sn ≥2, 20 sn hiç yoksa çıkar); `duSync` maç içinde geç gelen oyuncuyu ekler. Sürüm uyumu: oyuncu belgesinde `pv` (kapışma protokolü, `PV=2`); eski sürümlü rakip varsa maç başlamaz, lobide uyarı (`duPvOld/duPvHtml`, `#du-pv`). Giriş ekranında "Sürüm N 🔄 Güncelle" (`APPV`, `appUpd`: sw.js'teki mc-vN ile karşılaştırır, `reg.update()` → controllerchange → yenile; 8 sn sonra eski önbellekleri silip yeniler). **Her sürümde `APPV` de artırılır.** Kurallar: players + 'pv'. Testler: `test/du2.js`, `test/du3.js` (davetle, 10/10), `test/pv1.js`.

- 52: **Bildirimden doğrudan kapışma + Uygulamayı Paylaş.** Worker bildirim adresine `?kap=ODA&to=OYUNCU` (arkadaşlık isteğinde `?fr=1&to=`) ekler; sw.js `notificationclick` açık pencereye `postMessage({mc:'open',u})` gönderir, yoksa adresi açar. Uygulama `deepParse/deepRun`: `to` ile eşleşen profili seçer (yoksa tek profil/aktif profil), `frEnsure` → `rmJoinCode` (davet kutusu `DEEPJ` ile bastırılır, davet silinir); oyun sırasındaysa "Önce bu oyunu bitir". `devAuth` eşzamanlı girişleri tek söze bağlar (`CL.ap`). "📲 Uygulamayı Paylaş" (`appShare`, Web Share; yoksa wa.me) ana menüde ve giriş ekranında; metinde link + "Ana ekrana ekle" açıklaması. Test: `test/deep1.js`.

- 53 (5 Kasım 2026 yayında): **Her cihazda tek karakter + hesap kodu ile cihazlar arası eşitleme + Hesabım + sesli okuma + yazı boyutu.**
  - Tek karakter, kalıcı (değiştirilemez; kullanıcı kararı: "dikkatsizliğe yapacak bir şey yok"). Seçimde onay ("hep senin, değiştiremezsin"). Sadece `nmSync`'in otomatik verdiği ad (`mc_nmnew`) bir kez değiştirilebilir. "Kim oynuyor?" kalktı: Haydi Başlayalım → `startGo()` (0 karakter: `profiles` giriş ekranı, 1: ana menü, >1: `mig`). Misafir kaldı (puan/rütbe/rekor yok). `go()` korur: >1 karakterde profiles/home(karakterle) → mig.
  - Göç (`mig`, `migPick`, `migRun`): kartlarda rütbe/puan/oyun sayısı, iki onay, internet şart. Önce **geçiş yedeği** `bk/{yeni kod}` (v:1, bütün karakterler, mc_dev yok; kod `mc_mgk`, Hesabım altında küçük yazılı; kurtarma = o kodla "Hesabım var" → eski yedek yolu). Sonra silinenlerin `frWipe(n,id)` (pk/pl/fr/iv/ps), `nmRelease`, `profPurge`; `lbReset(keep,true)`.
  - Hesap = `mc_bk` kodu (kalıcı, artık geri yüklemede değişmez). `bk/{kod}` {u,d,ts,v:2}, d içinde **mc_dev de var** → hesabı açan cihaz aynı Firebase hesabıyla girer (aynı uid: rekor satırı, pk, nm, bk sahipliği ortak). `ac/{kod}` {u,ts,dv,ln,lnd,del,v} küçük özet.
  - Eşitleme: `acPull` (açılış 2 sn, online, öne gelince; 60 sn sınır; oyun ekranlarında değil) ac okur, `ac.ts>acc.st && ac.dv!=benim` ise `acPullDoc` → `acMerge`. `bkRun` önce aynı kontrolü yapar, sonra bk + ac yazar. Birleştirme: kayıtlar id ile birleşir, dhist/rhist t ile, best/rbest büyük olan, `rkMerge1` sayaçlarda büyük olan (rütbe geri gitmez), ayarlar (`ACLWW`) sadece bu cihazda gönderilmemiş değişiklik yoksa buluttan. Değişiklik yoksa yazma yok (mc_bkh).
  - Başka cihazda açma: Hesabım → "💻 Bilgisayara aktar" (`?hesap=KOD` bağlantısı, Web Share) ya da giriş ekranı "🔑 Hesabım var" (`hgir`, `acLinkStart`, `acApply`). Açılınca `ac.ln/lnd` yazılır, öbür cihaz `acLinkWarn` ("Hesabın başka bir cihazda açıldı… sen değilsen öğretmenine söyle"). mc_dev'i olmayan eski kod: "önce eski cihazı güncelle" + "Yine de yükle" (yeni hesap, yeni kod).
  - Hesabım (`hesap`): kod gizli (👁 Göster, 📋 Kopyala), aktar, son eşitleme + 🔄 Şimdi eşitle, yazı boyutu, sesli okuma ayarı + Sesi dene, Tema, 🔒 Gizlilik (`PRIV`), 🗑 Verilerimi sil (`acWipe`: frWipe, nm, 30 rekor satırı, geçiş yedeği, bk silinir, `ac.del=true`, giriş hesabı silinir, yerel kişisel veri silinir; öbür cihaz `acGone` ile silinir). Misafirde "⚙️ Ayarlar".
  - Rekor satırı temizliği: `lbReset(p,strict)`; tek karakterli cihazda bir kez (`lbFixOnce`, 9 sn, `mc_lbcl`) adı farklı satırları (eski gerçek ad, eski karakter, misafir) siler, karakterin kendi rekoruyla yeniden yazar.
  - Sesli okuma: problemlerde soru kutusunun köşesinde 🔊 (0.9 hız) ve 🐢 (0.6), tekrar dokununca durur; `speechSynthesis`, tr-TR, emoji temizlenir; Türkçe ses yoksa uyarı; `mc_tts.a` ile yeni soruda kendiliğinden. Yazı boyutu: `<html data-fs>` + `body{zoom:1.15/1.3}`, ilk boyada baştaki betikle.
  - `modal(...,no=null)` tek düğmeli; `ovBusy`. Kurallar: `ac` (yeni), bk delete (sahibi), lb delete (kendi satırı). **Yayında önce kurallar.** Test: `test/acc1.js` (3 karakterli göç, iki cihaz, eşitleme, eski kod, yeni kullanıcı, sesli okuma, yazı boyutu, silme, satır temizliği); test sunucusunda giriş hesapları artık ortak (`dsrv` users).

- 54 (6 Kasım 2026 yayında): **Davet cevabı + ⏰ Zamanlı Oyun + iPhone müzik düzeltmesi.**
  - Davet penceresi (`ivBox`, `modal3`): ⚔️ Kabul et / ⏳ Meşgulüm / 🕐 Daha sonra oynayalım. Açılınca `rs:'seen'` (`ivAns`). Gönderen lobide izler (`ivWatch/ivSeen/ivUi/ivStHtml`, `RM.ivs`): 📨 → 👀 gördü → ✅ geliyor / ⏳ meşgul (pencere + oda kapanır) / 🕐 sonra (`rvLaterAsk`: "saat X için … Olur mu?"); 2 dk cevapsız: Bekle / Vazgeç; belge silinip 4 sn'de gelmezse "şimdi gelemiyor" (eski sürüm "Şimdi değil"). Muharebe lobisinde arkadaş başına durum (`IVT`).
  - Daha sonra → `rvFrom(v)`: kurma ekranı rakip + ayarlar hazır, sadece zaman seçilir; randevuyu **alıcı kurar**, ilk davet edene randevu isteği gider.
  - Zamanlı Oyun (`rvl`, `rvn`; Yarış Odası'nda Meydan Muharebesi'nin altında "⏰ Zamanlı Oyun Kur"; ana menüde üstte "⏰ Zamanlı oyunların" kutusu `rvHomeHtml` + Gir): 15/30/45/60 dk (`RVDT`, `rvAt` dakikaya yuvarlar), 1'e 1 (1 kişi) ya da muharebe (3–4 kişi seçilir, en çok 3 kabul: kurucuyla 4; 4. kabul "doldu"). Oda önceden kurulur (`rooms.at`), en çok 3 aktif randevu. Gelen istek penceresi `rvCheck` (Olur / Gelemem / Sonra karar veririm), listede de cevap. Gir saatten 10 dk önce (`RVPRE`). Lobide geri sayım (`rvLobbyHtml/rvLobbyTick`); 1'e 1 saat gelince ve ikisi de oradaysa başlar; muharebe saat gelince 4 kişiyle hemen, 3 kişiyle 1 dk sonra kendiliğinden (kurucu da başlatabilir). Kurucu erken çıkarsa oda silinmez. Başlayınca davetler `st:'d'` (`rvDone`). İptal `rvCancel` (x + oda silinir). Süresi geçen (saat + 15 dk, `RVEXP`) belgeler/odalar silinir (`rvClean`). Bildirimden `?rv=1` → Zamanlı Oyun.
  - Worker: yeni türler `rs` (meşgul → davet edene), `rv` (randevu isteği), `rva` (Olur/Gelemem → kurucuya; Olur'da iki kişi için hatırlatma kaydı), `rvc` (iptal). **5 dk kala hatırlatma:** Cloudflare KV `mc-rv` (binding `MCR`), dakika kovası `m<dakika>`; cron her dakika (`scheduled` → `cron`). Abonelikler kabul anında kopyalanır (servis hesabı gerekmez). İş akışı KV'yi API ile bulur/oluşturur, `wrangler.toml` üretir; KV yoksa uyarı verip hatırlatmasız kurar. `/key` cevabında `kv`.
  - Saat yazımında Türkçe ek sorunu olmasın diye "saat 18:30 için / olunca" kalıpları kullanıldı (’de/’den yok).
  - Kurallar: rooms + 'at'; iv alıcı güncellemesi; rv (yeni). Testler: `test/rv1.js` (5 telefon: meşgul, 2 dk, daha sonra → randevu → saatinde otomatik başlama, iptal, muharebe doluluğu, kabul), `test/mus3.js`, `worker/test.mjs` (rs/rv/rva/rvc + KV + cron).

- 55 (6 Kasım 2026 yayında): **📣 Herkesi çağır + 💬 hazır mesajlar.**
  - Toplu çağırma (`frAllOpen` → `fcall` (oyun türü çipleri: 1'e 1 / Muharebe / Yarış, varsayılan 1'e 1) → oda → `frInvAll`; lobilerde `ivAllBtn`): sadece `frOnline` arkadaşlar, odada/çağrılmış olanlar hariç, `ivSendOne(to,nick,true)` (`iv.g=1`; kural başkasının açık davetini ezmez → setDoc reddedilirse "başka daveti vardı"). 3 dk sınırı (`FR.allT`). Alıcıda `ivBox` g: ⚔️ Katıl / ⏳ Meşgulüm (bildirimsiz); `rmJoinCode(code,onFail,soft)` hata → "Bu oyun doldu, başka sefere 🙂"; davet geri çekilirse aynı mesaj (`IVBG`). Oyun başlayınca (`rmGo`) ve muharebe 4 kişi olunca (`RM.rcl`) `ivRecall`. Lobide `#iv-sum` özet (`ivSumHtml`). Arkadaşlarım üstünde ve ana menü "Şu an oyunda" kutusunda düğme.
  - Hazır mesajlar: `MSG` (1–22 mesaj, 23–32 emoji; **sadece sona ekle**), `MSGT` sekmeler, `MSGGAME` [5–10] (⚔️ Çağır düğmesi + bildirim). `ms/{from}_{to}` (`msSend`, 30 sn/kişi `MS.out`), dinleme `msStart` (to==ben), gösterim `msCheck` (FRBUSY'de değil; `mc_msr` görülen ts), seçici `msgOpen/msgPick/msgTab/msgSend`. Arkadaşlarım satırında 💬 + son mesaj (`msLine`, 24 saat), ana menü kutusunda 💬, karakter kartında "💬 Mesaj gönder", maç sonunda arkadaş rakiplere 👏/🎉 (`duMsgHtml`). Profil silinince ms belgeleri de silinir (`frWipe`). Bildirim: Worker `ms` (sadece MSGGAME), adres `?ms=1` → Arkadaşlarım.
  - Test: `test/s55.js` (5 telefon).

- 56 (6 Kasım 2026 yayında): **👥 Takımlar + takım kapışması (eşleşmeli) + 🤝 Takım Oyuncusu madalyası.**
  - Takım adı listesi `TMN` (110 ad, [emoji, ad]; **sıra değişmez, sadece sona ekle**; takılmaya açık/insan/canavar simgesi yok). Belge id = ad no → her ad tek takımın. Yerel `mc_tm` {profil: ad no} (yedekte; birleştirmede mc_pid gibi). Dinleme `tmStart/tmWatch` (tm/{k}, ti/{k}, tv/{ben}); takım yoksa ya da üyesi değilsen anahtar silinir.
  - Ekranlar: `tml` (Takımım: kart, üyeler (pl okunur, 🟢), kapışma, canavar takımı, kaptanlık, çağır, ayrıl), `tmn` (ad seçimi + müsaitlik `tmPick`), `tmv` (rakip takımlar, w'ye göre 60), `tms` (soru 10/15/20, seviye, işlem). Ana menüde Karakter Kartım'ın altında "👥 Takımım" (`tmHomeBtn`), Yarış Odası'nda "👥 Takım Kapışması".
  - Katılma `tmJoin` (getDoc + updateDoc, 3 deneme), ayrılma `tmLeave` (kaptan ayrılırsa en yüksek rütbeli; son kişi → silinir), çağırma `tmInv` (tv + bildirim `tv`), gelen pencereler `tmCheck` (`TMBUSY` ekranlarında değil).
  - Kaptanlık Maçı `tmCapGo` (2 kişi 1'e 1, 3–4 muharebe; oda `cm`; `ti` cm ile çağrı), kazanan `tmCapWin` (cap, ct). Haftada bir ya da yeni üye gelince (`tmCapOk`). Rütbe puanı yok (duSave rkMatch atlanır).
  - Takım kapışması: `twCreate` (oda mode 'tw', qv 5, win=soru sayısı, ka/kb) + `tmCall` (ti iki takıma, bildirim `ti` Worker'da takım üyelerine). Katılma `twJoin` → rmJoinCode (takımın değilse red, takımından en çok 4). Lobi `twLobbyHtml` (iki sütun, canavar önizleme, `twValid`: her takım ≥2 gerçek, büyük ≤ 2×küçük, ≤4). Başlatma: kurucu `pa=twPairsMake()` (rütbe sırasıyla çift, eksik `~` = bot) yazar. `rmGo` tw: pa'da yoksan çık; rakip belgeleri 6 sn beklenir.
  - Motor: `duNew` tw dalı (DU.tw, side, pairs, nq; bot çiftinde DU.bot='tw' + `twBotPlan` = denk canavar: maçtaki kendi doğru sürelerinin ortancası ×0.85–1.35, ilk sorularda rütbeye göre, %75 doğru). `duWrite` bot çiftinde `br` de yazar. `duResolve` tw: nq soruda biter, maç sayısı/altın soru yok. Takım skoru `twState` (çiftlerin r/br dizilerinden; ayrılan tarafın kalan soruları rakibe), `twScoreHtml`, `twUi`. `duEnd` tw → dover (`twOverHtml`, çift bitince "⏳ diğer çiftler"), `twFinal` (hepsi bitince: ses/konfeti, `twSave`, `twTeamDoc`).
  - Puan (`twSave`): gerçek rakibe karşı çift galibiyeti `rkApply` (1'e 1 gibi, günlük 5 sınırı); takım kazanırsa +1/+2/+3 (`dc` 't:'+rakip takım, günde 5) ve `tw` sayacı → madalya 🤝 **Takım Oyuncusu** (RKF 7., 5/15/30; FAM 'team' iki halka; `m` 7 hane, pl.md 7). Canavar Takımı (kb −1) puan yok. Takım w/l: her takımdan pa sırasındaki ilk gerçek oyuncu yazar (`lm` ile tek sefer).
  - Geçmiş: dhist `tw:1, ta, tb2, A, B, tr` (Kapışmalarım'da 👥 satırı). Kılavuz `team`. Bildirim adresi `?tm=1` → Takımım.
  - Test: `test/s56.js` (5 telefon: kur, ad benzersiz, çağır/katıl, çıkarma reddi, kaptanlık maçı, 2'ye 3 + canavar, skor eşitliği, rütbe, w/l, canavar takımı, ayrılma/silme), `worker/test.mjs` (ti/tv).

- 57 (6 Kasım 2026 yayında): **Kilitlenme düzeltmesi + Kaptanlık Maçı sadece takım.**
  - Kullanıcı: 3 kişilik muharebe "Doğru! Sonuç bekleniyor…"da kilitlendi (bir oyuncu 0 puan, büyük olasılıkla telefonu arka planda: sinyal gidiyor, cevap/süre yazılmıyor → `duReady` sonsuza kadar bekliyordu). Çözüm: `duWatchSet/duWatch` — kendi cevabından sonra süre + 6 sn içinde gelmeyen cevap "süre doldu" sayılır (`DU.fill`, `duRv` → duBest/duWinner/duReady), 2 tur üst üste cevapsız → "… cevap vermiyor, oyundan düştü" + `duGone`. Takım kapışmasında `twGone`: 40 sn hiç tur ilerlemeyen oyuncu ayrılmış sayılır (`TWP`).
  - Kaptanlık Maçı lobisi (`cmRoom`): başlık "👑 Kaptanlık Maçı", arkadaş listesi / herkesi çağır / davet linki yok; yerine takım üyeleri (✓ odada / 🟢 / ⚪) + "📣 Takımı yeniden çağır" (`cmRecall`, 60 sn). Takım dışı katılım `rmJoinCode`'da reddedilir.
  - Test: `test/s57.js`.

- 58 (10 Kasım 2026 yayında): **Baştan tasarım: kabartmalı 3D arayüz + 3D sahneler + yeni palet** (ayrıntı §4.1). İşlev ve veri değişmedi; kural/Worker değişikliği yok.
  - Düzeltilen hatalar: bildirim (toast) dar kalıp iki satıra bölünüyordu; 320 px'te karakter kategorileri taşıyordu; üst başlık sabit ses düğmesinin altına giriyordu; küçük ekranda pencere (tema) taşıp üstü kesiliyordu; "Çok büyük" yazıda Akıldan İşlem'de alt sıra cevaplar ekran dışında kalıyordu; takım kartı sola yaslıydı.
  - Akıldan İşlem menüsü ana menü gibi simgeli ızgara oldu. Tema adları: Gündüz, Kum, Gece, Okyanus, Yüksek kontrast.
  - Yeni test araçları: `test/shots.js [tema] [klasör]` (36 ekranı dolaşır, görüntü alır, sayfa hatası + taşan öğe raporu; `W=320 H=568`, `FS=2` ortam değişkenleri), `test/monkey.js [adım] [tohum] [profil]` (rastgele dokunma; 5 koşu, 0 hata).

## 9. Bekleyen / yayınlanmamış
- Yayınlanmamış kod yok. (Gerçek telefonda denenecekler: sesli okuma, büyük yazıda Akıldan İşlem, iki cihaz eşitleme, iPhone müzik kapat/aç, zamanlı oyun bildirimleri ve 5 dk hatırlatması, toplu çağırma ve mesaj bildirimleri, S58 3D efektlerin eski telefonlarda akıcılığı ve telefonu eğince kartın eğilmesi.)
- Ertelenenler (kullanıcı "şimdilik ertele"): problem çözme adımları yardımcısı, Hatalarım, Rahat mod. İsteğe bağlı fikir: Müsait/Meşgul durum düğmesi.

## 10. Bilinen eksikler (kullanıcı "ileride" dedi)
1. Ortak telefonda rekor satırı cihaza bağlı → başka profil adı üzerine yazar (cihaz+profil anahtarı gerekir).
2. Yarış ortasında kopan oyuncu geri dönemez.
3. Rahat mod (süresiz) ve sesli okuma yok.
4. Yeni oyun fikirleri (kullanıcı "şimdilik dursun" dedi): Market (para hesabı), Hatalarım, Canavarını Büyüt + rozetler, Doğru mu Yanlış mı, Eksik Sayı, Günün Görevi.
5. Tek kişilik tabloda "İlk hedefin" zirveyle aynı görünür.
6. Profil silinince rekor satırı kalır; misafir rekoru kalıcı değil; profil şifresi yok; puan istemci tarafında (hile mümkün).
7. Play Store: hazır ad/avatar listesi, gizlilik politikası, "Verilerimi sil", Android paketi (TWA), 12 test kullanıcısı × 14 gün kapalı test.
