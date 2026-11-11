# Yasal sayfaları üretir: gizlilik.html, aydinlatma.html, veri-silme.html (web, Play Store bağlantıları)
# ve aynı metni index.html içine LEGAL nesnesi olarak gömer (uygulama içi 'legal' ekranı).
# Metni değiştirmek için BU dosyayı düzenle, sonra: python3 tools/yasal.py
# Yer tutucular: aşağıdaki P sözlüğü (doldurulmadan mağazaya gönderilmez).
import os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+os.sep
P={'AD':'<mark>[VERİ SORUMLUSU ADI SOYADI]</mark>','EPOSTA':'<mark>[İLETİŞİM E-POSTASI]</mark>','ADRES':'<mark>[YAZIŞMA ADRESİ]</mark>','TARIH':'<mark>[YÜRÜRLÜK TARİHİ]</mark>','GELISTIRICI':'<mark>[GOOGLE PLAY GELİŞTİRİCİ ADI]</mark>'}
CSS='''
:root{--bg:#eef3ff;--card:#ffffff;--text:#16224a;--muted:#55628a;--accent:#2f6bff;--line:#d8e0f5;--mark:#fff1b8}
@media (prefers-color-scheme:dark){:root{--bg:#0e1530;--card:#18224a;--text:#eef2ff;--muted:#a6b1d8;--accent:#7ea2ff;--line:#2b3870;--mark:#5a4a00}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",sans-serif;padding:24px max(16px,env(safe-area-inset-right)) 48px max(16px,env(safe-area-inset-left))}
main{max-width:760px;margin:0 auto}
header{display:flex;align-items:center;gap:14px;margin-bottom:8px}
header img{width:56px;height:56px;border-radius:14px;flex:none}
header .app{font-weight:700;font-size:15px;color:var(--muted)}
h1{font-size:28px;line-height:1.2;margin:4px 0 0;text-wrap:balance}
.meta{color:var(--muted);font-size:14px;margin:6px 0 18px}
nav{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px}
nav a{padding:7px 12px;border-radius:999px;border:1.5px solid var(--line);background:var(--card);color:var(--accent);text-decoration:none;font-weight:600;font-size:14px}
nav a[aria-current]{background:var(--accent);border-color:var(--accent);color:#fff}
section{background:var(--card);border:1.5px solid var(--line);border-radius:18px;padding:18px 20px;margin:0 0 14px}
h2{font-size:20px;margin:0 0 8px}
h3{font-size:16px;margin:14px 0 4px}
p{margin:0 0 10px}
ul,ol{margin:0 0 10px;padding-left:22px}
li{margin:4px 0}
.sum li{list-style:none;margin-left:-22px}
.tw{overflow-x:auto;margin:6px 0 10px}
table{border-collapse:collapse;width:100%;min-width:560px;font-size:14.5px}
th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}
th{font-size:13px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em}
mark{background:var(--mark);color:inherit;padding:0 3px;border-radius:4px}
a{color:var(--accent)}
.steps li{margin:8px 0}
.note{font-size:14px;color:var(--muted)}
footer{color:var(--muted);font-size:13px;text-align:center;margin-top:24px}
'''
NAV=[('gizlilik.html','Gizlilik Politikası'),('aydinlatma.html','KVKK Aydınlatma Metni'),('veri-silme.html','Hesap ve Veri Silme')]
def page(fn,title,lead,body):
    nav=''.join('<a href="%s"%s>%s</a>'%(h,' aria-current="page"' if h==fn else '',t) for h,t in NAV)
    html='''<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>%s · Matematik Canavarı</title>
<meta name="description" content="%s">
<link rel="icon" href="icon-192.png">
<style>%s</style>
</head>
<body>
<main>
<header><img src="icon-192.png" alt=""><div><div class="app">Matematik Canavarı</div><h1>%s</h1></div></header>
<p class="meta">Yürürlük tarihi: %s · Son güncelleme: %s</p>
<nav aria-label="Yasal sayfalar">%s</nav>
%s
%s
<footer>Matematik Canavarı · %s · %s</footer>
</main>
</body>
</html>
'''%(title,lead,CSS,title,P['TARIH'],P['TARIH'],nav,('<section><p>'+lead+'</p></section>') if lead else '',body,P['GELISTIRICI'],P['EPOSTA'])
    open(R+fn,'w',encoding='utf8').write(html)

# ---------------- GİZLİLİK POLİTİKASI ----------------
gz='''
<section>
<h2>Kısaca</h2>
<ul class="sum">
<li>✅ Çocuğunuzun seçtiği <b>hazır karakter adı</b>, <b>oyun sonuçları</b>, <b>rütbe ve madalyaları</b>, <b>arkadaş listesi</b> saklanır.</li>
<li>❌ <b>Gerçek ad, e-posta, telefon numarası, konum, fotoğraf, ses ve rehber istenmez.</b> Uygulamada serbest yazı alanı yoktur; ad ve mesajlar hazır listeden seçilir.</li>
<li>❌ <b>Reklam yoktur.</b> Reklam kimliği kullanılmaz, veriler satılmaz, davranış analizi ve izleme aracı kullanılmaz.</li>
<li>🗑 Bütün veriler uygulama içinden <b>Ayarlar → Verilerimi sil</b> ile ya da <a href="veri-silme.html">bu sayfadan</a> talep edilerek silinebilir.</li>
</ul>
</section>

<section>
<h2>1. Veri sorumlusu</h2>
<p>Matematik Canavarı, %(AD)s tarafından geliştirilmektedir. Kişisel verilerin korunmasıyla ilgili her türlü soru ve talep için:</p>
<ul><li>E-posta: %(EPOSTA)s</li><li>Yazışma adresi: %(ADRES)s</li></ul>
</section>

<section>
<h2>2. Uygulama kimler için?</h2>
<p>Matematik Canavarı, ilkokul çağındaki çocukların (6–12 yaş) dört işlem pratiği yapması için tasarlanmış bir eğitim oyunudur. Uygulamayı çocuklar kullanır; bu nedenle bu metin öncelikle <b>velilere ve öğretmenlere</b> yöneliktir. Uygulamanın ilk açılışında çocuğun anlayabileceği dilde kısa bir bilgilendirme gösterilir ve bu metne bağlantı verilir.</p>
</section>

<section>
<h2>3. Hangi bilgileri, neden saklıyoruz?</h2>
<div class="tw"><table>
<thead><tr><th>Bilgi</th><th>Neden</th><th>Nerede</th><th>Ne kadar süre</th></tr></thead>
<tbody>
<tr><td><b>Cihaz hesabı</b>: uygulamanın kendiliğinden oluşturduğu rastgele kimlik ve parola (gerçek bir e-posta adresi değildir)</td><td>Bulut özelliklerinin (yedek, arkadaşlar, rekorlar) yalnızca hesabın sahibi tarafından değiştirilebilmesi</td><td>Google Firebase Authentication</td><td>Hesap silinene kadar</td></tr>
<tr><td><b>Oyun adı</b>: hazır listeden seçilen karakter adı (ör. "🦊 Kurnaz Tilki #482")</td><td>Oyuncunun oyunda ve listelerde görünmesi; aynı adın iki kişide olmaması</td><td>Google Cloud Firestore (Avrupa)</td><td>Hesap silinene kadar</td></tr>
<tr><td><b>Oyun ilerlemesi</b>: oyun ve pratik sonuçları, rekorlar, rütbe, madalyalar, kapışma geçmişi, ayarlar</td><td>İlerlemenin kaybolmaması (yedek) ve aynı hesabın başka cihazda açılabilmesi</td><td>Telefonun kendisi ve Firestore (yedek)</td><td>Hesap silinene kadar</td></tr>
<tr><td><b>Rekor tablosu satırı</b>: oyun adı, puan, rütbe, oyuncu kodu</td><td>Rekorlar tablosunun gösterilmesi</td><td>Firestore (diğer oyunculara açık)</td><td>Hesap silinene kadar</td></tr>
<tr><td><b>Oyuncu kodu</b>: 7 harflik rastgele kod</td><td>Arkadaş ekleme ve oyuncu kartının açılması</td><td>Firestore</td><td>Hesap silinene kadar</td></tr>
<tr><td><b>Arkadaşlık bilgileri</b>: arkadaş listesi, arkadaşlık istekleri, oyun davetleri, hazır mesajlar, takım üyeliği, zamanlı oyun randevuları</td><td>Arkadaşlarla oynama özelliklerinin çalışması</td><td>Firestore</td><td>Arkadaşlık sürdükçe; davetler 10 dakika, randevular oyun saatinden 15 dakika sonrasına kadar geçerlidir</td></tr>
<tr><td><b>Çevrim içi durumu</b>: uygulamanın en son ne zaman açık olduğu</td><td>Arkadaşların birbirini oyuna çağırabilmesi</td><td>Firestore</td><td>Hesap silinene kadar (her açılışta güncellenir)</td></tr>
<tr><td><b>Oyun odası kayıtları</b>: yarış ve kapışma sırasında puan, kalan can, cevap süreleri</td><td>Çok oyunculu oyunun yürütülmesi</td><td>Firestore</td><td>Geçicidir; oda 24 saat sonra geçersiz olur, kayıt aynı oda kodu yeniden kullanıldığında silinir</td></tr>
<tr><td><b>Hesap kodu</b>: 10 harflik gizli kod</td><td>Aynı hesabın başka bir cihazda açılması</td><td>Firestore</td><td>Hesap silinene kadar</td></tr>
<tr><td><b>Bildirim adresi</b>: yalnızca bildirimler açılırsa, telefonun bildirim servisinin verdiği adres</td><td>Oyun daveti ve randevu hatırlatması gönderilmesi</td><td>Firestore; hatırlatmalar için Cloudflare</td><td>Bildirim kapatılana ya da hesap silinene kadar; Cloudflare'daki hatırlatma kaydı en geç birkaç saat içinde kendiliğinden silinir</td></tr>
</tbody>
</table></div>
<p class="note">Bunlara ek olarak, uygulama internete bağlandığında hizmet sağlayıcıların sunucuları bağlantının kurulabilmesi için cihazın IP adresini teknik olarak işler. Bu bilgi tarafımızca saklanmaz ve kullanılmaz.</p>
</section>

<section>
<h2>4. Hangi bilgileri toplamıyoruz?</h2>
<ul>
<li>Gerçek ad ve soyad, doğum tarihi, e-posta adresi, telefon numarası</li>
<li>Konum, fotoğraf, video, ses kaydı, rehber</li>
<li>Reklam kimliği ve benzeri cihaz tanımlayıcıları</li>
<li>Serbest yazı: uygulamada çocukların yazı yazabileceği bir alan yoktur. Adlar, takım adları ve mesajlar hazır listelerden seçilir.</li>
</ul>
</section>

<section>
<h2>5. Bilgileri kimler görür?</h2>
<h3>Diğer oyuncular</h3>
<ul>
<li>Herkes: rekorlar tablosundaki oyun adı, puan ve rütbe; oyuncu kartındaki rütbe, madalyalar ve oyun istatistikleri.</li>
<li>Sadece arkadaşlar: çevrim içi durumu, gönderilen hazır mesajlar ve davetler.</li>
<li>Aynı oyun odasındakiler: oyun adı ve o oyundaki puanlar.</li>
</ul>
<h3>Hizmet sağlayıcılar</h3>
<p>Uygulamanın çalışması için aşağıdaki hizmetler kullanılır. Bu şirketler verileri yalnızca hizmeti sunmak için işler.</p>
<ul>
<li><b>Google Firebase</b> (Authentication ve Cloud Firestore, sunucu konumu Avrupa): hesap, oyun verileri ve arkadaşlık bilgileri. <a href="https://firebase.google.com/support/privacy" rel="noopener">Firebase gizlilik bilgileri</a></li>
<li><b>Cloudflare</b> (Workers): oyun davetleri ve randevu hatırlatmaları için bildirim gönderimi. <a href="https://www.cloudflare.com/privacypolicy/" rel="noopener">Cloudflare gizlilik politikası</a></li>
<li><b>GitHub Pages</b>: uygulama dosyalarının barındırılması. <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">GitHub gizlilik bildirimi</a></li>
</ul>
<p>Veriler hiçbir şekilde satılmaz, reklam amacıyla kullanılmaz ve bu hizmetler dışında kimseyle paylaşılmaz. Yasal bir zorunluluk olması hâlinde yetkili kurumlara bilgi verilebilir.</p>
</section>

<section>
<h2>6. Çocukların güvenliği</h2>
<ul>
<li>Çocuklar gerçek adlarını yazamaz; ad hazır karakter listesinden seçilir. Listede takılmaya ya da alaya açık adlar bulunmaz.</li>
<li>Oyuncular birbirine yalnızca hazır mesajlar (ör. "Hadi oynayalım!", emojiler) gönderebilir; serbest sohbet yoktur.</li>
<li>Arkadaşlık karşılıklı onayla kurulur. Bir oyuncu istenmezse <b>🚫 Engelle</b> ile arkadaşlıktan çıkarılır ve bir daha istek, davet ya da mesaj gönderemez.</li>
<li>Uygulamada reklam, uygulama içi satın alma ve başka sitelere yönlendiren bağlantı yoktur.</li>
</ul>
</section>

<section>
<h2>7. Saklama süresi ve silme</h2>
<p>Bilgiler, tabloda yazan süreler boyunca ve hesap silinene kadar saklanır. Hesap ve bütün bulut verileri iki yolla silinebilir:</p>
<ol>
<li>Uygulamada <b>Ayarlar</b> (⚙️) → <b>🗑 Verilerimi sil</b>. Silme hemen gerçekleşir.</li>
<li><a href="veri-silme.html">Hesap ve veri silme sayfasındaki</a> adımlarla e-posta ile talep. Talep en geç 30 gün içinde yerine getirilir.</li>
</ol>
<p>Uygulamayı telefondan kaldırmak telefondaki verileri siler, ancak buluttaki yedeği silmez.</p>
</section>

<section>
<h2>8. Güvenlik</h2>
<ul>
<li>Uygulama ile sunucular arasındaki bütün bağlantılar şifrelidir (HTTPS).</li>
<li>Bulut verilerine erişim kurallarla sınırlandırılmıştır: her oyuncu yalnızca kendi verisini değiştirebilir, gizli bilgiler başkaları tarafından okunamaz.</li>
<li><b>Hesap kodu</b> hesabı başka cihazda açmaya yarar; bu kodun kimseyle paylaşılmaması gerekir. Uygulama bu konuda kullanıcıyı uyarır.</li>
</ul>
</section>

<section>
<h2>9. Haklarınız</h2>
<p>Veliler, çocukları adına verilerine erişme, düzeltilmesini ya da silinmesini isteme ve diğer yasal haklarını kullanabilir. Ayrıntılar ve başvuru yolu <a href="aydinlatma.html">KVKK Aydınlatma Metni</a>'ndedir.</p>
</section>

<section>
<h2>10. Değişiklikler</h2>
<p>Bu politika değişirse yeni metin bu sayfada yayımlanır ve yukarıdaki "Son güncelleme" tarihi değişir. Önemli değişiklikler uygulama içinde de duyurulur.</p>
</section>

<section>
<h2>11. İletişim</h2>
<p>Sorularınız için: %(EPOSTA)s</p>
</section>
'''%P
page('gizlilik.html','Gizlilik Politikası','Bu metin, Matematik Canavarı uygulamasının hangi bilgileri neden kullandığını, kimlerle paylaştığını ve bu bilgilerin nasıl silinebileceğini açıklar.',gz)

# ---------------- KVKK AYDINLATMA METNİ ----------------
ay='''
<section>
<h2>1. Veri sorumlusu</h2>
<p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu %(AD)s'dır.</p>
<ul><li>Yazışma adresi: %(ADRES)s</li><li>E-posta: %(EPOSTA)s</li></ul>
<p>Uygulama çocuklar tarafından kullanıldığı için bu metin <b>velilere</b> yöneliktir.</p>
</section>

<section>
<h2>2. İşlenen kişisel veriler</h2>
<ul>
<li><b>Kimlik niteliği taşımayan kullanıcı bilgileri:</b> hazır listeden seçilen oyun adı, rastgele oluşturulan oyuncu kodu, hesap kodu ve cihaz hesabı kimliği</li>
<li><b>Kullanım bilgileri:</b> oyun ve pratik sonuçları, rekorlar, rütbe, madalyalar, kapışma geçmişi, uygulama ayarları</li>
<li><b>Etkileşim bilgileri:</b> arkadaş listesi, arkadaşlık istekleri, oyun davetleri, hazır mesajlar, takım üyeliği, zamanlı oyun randevuları, çevrim içi durumu</li>
<li><b>Teknik bilgiler:</b> bildirimler açıldıysa bildirim adresi; bağlantı sırasında hizmet sağlayıcıların teknik olarak işlediği IP adresi</li>
</ul>
<p>Gerçek ad, doğum tarihi, iletişim bilgisi, konum, görüntü ve ses kaydı işlenmez. Özel nitelikli kişisel veri işlenmez.</p>
</section>

<section>
<h2>3. İşleme amaçları</h2>
<ul>
<li>Eğitim oyununun sunulması ve oyun ilerlemesinin saklanması</li>
<li>Oyun verisinin yedeklenmesi ve aynı hesabın başka cihazda açılabilmesi</li>
<li>Rekorlar tablosu, arkadaşlarla oynama, takım ve davet özelliklerinin çalışması</li>
<li>İstenirse oyun daveti ve randevu bildirimlerinin gönderilmesi</li>
<li>Hesabın güvenliğinin sağlanması ve kötüye kullanımın önlenmesi</li>
</ul>
</section>

<section>
<h2>4. Hukuki sebepler</h2>
<ul>
<li>KVKK m. 5/2-c: bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (uygulamanın sunduğu hizmetin verilebilmesi)</li>
<li>KVKK m. 5/2-f: ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati (hesap güvenliği, kötüye kullanımın önlenmesi)</li>
<li>Bildirimler gibi isteğe bağlı özellikler, kullanıcı tarafından açılmadıkça çalışmaz.</li>
</ul>
</section>

<section>
<h2>5. Toplama yöntemi</h2>
<p>Veriler, uygulama kullanılırken elektronik ortamda, otomatik yollarla toplanır.</p>
</section>

<section>
<h2>6. Aktarım</h2>
<p>Kişisel veriler yurt içinde herhangi bir üçüncü kişiye aktarılmaz. Uygulamanın teknik altyapısı yurt dışında yerleşik hizmet sağlayıcılar tarafından sunulduğu için veriler, KVKK m. 9'da öngörülen güvencelere uygun olarak aşağıdaki hizmet sağlayıcılara aktarılır:</p>
<ul>
<li>Google (Firebase Authentication ve Cloud Firestore; sunucu konumu Avrupa): hesap ve oyun verilerinin saklanması</li>
<li>Cloudflare (Workers): bildirimlerin gönderilmesi</li>
<li>GitHub (Pages): uygulama dosyalarının barındırılması</li>
</ul>
<p>Diğer oyuncular, oyun adını, puanları, rütbeyi ve madalyaları uygulama içinde görebilir (ayrıntı: <a href="gizlilik.html">Gizlilik Politikası</a>, bölüm 5).</p>
</section>

<section>
<h2>7. Saklama süresi</h2>
<p>Veriler, işleme amacı ortadan kalkana kadar, en geç hesap silinene kadar saklanır. Davet, oyun odası ve hatırlatma kayıtları gibi geçici kayıtlar kısa süre sonra kendiliğinden geçersiz olur. Süreler <a href="gizlilik.html">Gizlilik Politikası</a>'nın 3. bölümündeki tabloda yer alır.</p>
</section>

<section>
<h2>8. Haklarınız (KVKK m. 11)</h2>
<p>Veli olarak, çocuğunuz adına veri sorumlusuna başvurarak şu haklara sahipsiniz:</p>
<ol>
<li>Kişisel veri işlenip işlenmediğini öğrenme</li>
<li>İşlenmişse buna ilişkin bilgi talep etme</li>
<li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
<li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
<li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
<li>KVKK m. 7'deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
<li>Düzeltme, silme ve yok etme işlemlerinin aktarılan üçüncü kişilere bildirilmesini isteme</li>
<li>Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhe bir sonuç ortaya çıkmasına itiraz etme</li>
<li>Kanuna aykırı işleme sebebiyle zarara uğranması hâlinde zararın giderilmesini talep etme</li>
</ol>
</section>

<section>
<h2>9. Başvuru yolu</h2>
<p>Başvurunuzu, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ'e uygun olarak aşağıdaki yollardan biriyle iletebilirsiniz:</p>
<ul>
<li>Islak imzalı dilekçe ile yazışma adresine: %(ADRES)s</li>
<li>Kayıtlı elektronik posta (KEP), güvenli elektronik imza ya da mobil imza ile</li>
<li>E-posta ile: %(EPOSTA)s</li>
</ul>
<p>Uygulamada kayıtlı bir e-posta adresi bulunmadığından, başvurunun hangi hesaba ait olduğunun anlaşılabilmesi için başvuruya <b>oyun adını</b> ve <b>oyuncu kodunu</b> (Arkadaşlar sekmesinde görünen 7 harflik kod) eklemeniz gerekir. <b>Hesap kodunu göndermeyin</b>; o kod hesabı açmaya yarar.</p>
<p>Başvurular en geç <b>30 gün</b> içinde ücretsiz olarak sonuçlandırılır. Başvurunuzun reddedilmesi, cevabın yetersiz bulunması veya süresinde cevap verilmemesi hâlinde Kişisel Verileri Koruma Kurulu'na şikâyette bulunabilirsiniz.</p>
</section>
'''%P
page('aydinlatma.html','KVKK Aydınlatma Metni','',ay)

# ---------------- VERİ SİLME ----------------
vs='''
<section>
<h2>Uygulamadan silme (hemen)</h2>
<ol class="steps">
<li>Matematik Canavarı'nı açın ve internete bağlı olduğunuzdan emin olun.</li>
<li>Alttaki sekme çubuğundan <b>⚙️ Ayarlar</b>'a dokunun.</li>
<li>Sayfanın en altındaki <b>🗑 Verilerimi sil</b> düğmesine dokunun ve onaylayın.</li>
</ol>
<p>Silme hemen gerçekleşir. Aynı hesap başka bir cihazda açıksa, o cihazdaki veriler de bir sonraki açılışta silinir.</p>
</section>

<section>
<h2>E-posta ile talep (uygulamaya erişemiyorsanız)</h2>
<p>Telefon kaybolduysa ya da uygulama silindiyse, silme talebinizi %(EPOSTA)s adresine gönderin.</p>
<ul>
<li>Konu: <b>Veri silme talebi</b></li>
<li>Çocuğunuzun <b>oyun adı</b> (ör. "🦊 Kurnaz Tilki #482")</li>
<li>Biliyorsanız <b>oyuncu kodu</b> (Arkadaşlar sekmesinde görünen 7 harflik kod)</li>
</ul>
<p><b>Hesap kodunu göndermeyin.</b> Talep, hesabın doğrulanmasının ardından en geç <b>30 gün</b> içinde yerine getirilir ve size e-postayla bilgi verilir.</p>
</section>

<section>
<h2>Neler silinir?</h2>
<ul>
<li>Cihaz hesabı ve hesap kodu</li>
<li>Oyun adı (başkasının seçebilmesi için serbest bırakılır)</li>
<li>Oyun ilerlemesinin bulut yedeği: sonuçlar, rekorlar, rütbe, madalyalar, kapışma geçmişi</li>
<li>Rekorlar tablosundaki bütün satırlar</li>
<li>Arkadaşlıklar, arkadaşlık istekleri, davetler, hazır mesajlar, takım üyeliği</li>
<li>Bildirim adresi</li>
<li>Telefondaki uygulama verileri</li>
</ul>
</section>

<section>
<h2>Neler bir süre kalabilir?</h2>
<ul>
<li><b>Oyun odası kayıtları:</b> geçmiş yarış ve kapışmalardaki oyun adı ve puanlar; oda 24 saat sonra geçersiz olur; kayıt aynı oda kodu yeniden kullanıldığında silinir.</li>
<li><b>Bildirim hatırlatmaları:</b> zamanlı oyun hatırlatmaları en geç birkaç saat içinde kendiliğinden silinir.</li>
<li><b>Diğer oyuncuların telefonları:</b> arkadaşların telefonlarında, onların kendi kapışma geçmişinde oyun adı görünmeye devam edebilir. Bu kayıtlar o oyuncuların kendi cihazındadır.</li>
</ul>
<p>Yasal bir saklama zorunluluğu dışında başka hiçbir veri tutulmaz. Ayrıntılar: <a href="gizlilik.html">Gizlilik Politikası</a>.</p>
</section>
'''%P
page('veri-silme.html','Hesap ve Veri Silme','Bu sayfa, %s tarafından geliştirilen <b>Matematik Canavarı</b> uygulamasındaki hesabın ve ilişkili bütün verilerin nasıl silineceğini açıklar.'%P['GELISTIRICI'],vs)
print('tamam')

# ---------------- uygulamaya gömme (index.html, LEGAL nesnesi) ----------------
import re,json
def inner(fn):
    h=open(R+fn,encoding='utf8').read()
    t=re.search(r'<h1>(.*?)</h1>',h).group(1)
    m=re.search(r'</nav>\n(.*)\n<footer>',h,re.S).group(1)
    m=re.sub(r'href="(gizlilik|aydinlatma|veri-silme)\.html"',lambda x:'href="#" onclick="legalOpen(\'%s\');return false"'%x.group(1),m)
    m=re.sub(r'href="(https://[^"]+)" rel="noopener"',r'href="\1" target="_blank" rel="noopener"',m)
    meta=re.search(r'<p class="meta">(.*?)</p>',h).group(1)
    return {'t':t,'h':'<p class="lgmeta">'+meta+'</p>'+m.strip()}
L={k:inner(k+'.html') for k in ('gizlilik','aydinlatma','veri-silme')}
js='/*LEGAL-BEGIN: yasal sayfalardan üretilir (gizlilik.html, aydinlatma.html, veri-silme.html ile aynı metin); elle düzenleme, sayfalarla birlikte değiştir*/var LEGAL='+json.dumps(L,ensure_ascii=False)+';/*LEGAL-END*/'
assert '</script' not in js
ip=R+'index.html';s=open(ip,encoding='utf8').read()
if '/*LEGAL-BEGIN' in s:
    s=re.sub(r'/\*LEGAL-BEGIN.*?/\*LEGAL-END\*/',lambda _:js,s,flags=re.S)
else:
    a='function guest(){';i=s.index(a);s=s[:i]+js+'\n'+s[i:]
open(ip,'w',encoding='utf8').write(s)
print('gömüldü',len(js))
