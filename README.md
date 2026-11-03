# Matematik Canavarı

Özel eğitim öğrencileri için telefonda çalışan **dört işlem pratik ve oyun uygulaması**. Kurulum gerektirmez; tarayıcıdan açılır, "Ana Ekrana Ekle" ile uygulama gibi kullanılır, internetsiz de çalışır.

**Uygulama:** https://digerpchesabim-stack.github.io/Matematikcanavari/

## Neler var?
- **İşlemler ve Problemler:** Toplama, çıkarma, çarpma, bölme (eldeli/eldesiz, 1–4 basamak), hikâyeli problemler, adım adım çözüm, paylaşılabilir rapor kartı.
- **Akıldan İşlem Oyunu:** Süreli, 3 canlı, Kolay/Orta/Zor; çarpma ve bölmede tablo çalışması; rekorlar tablosu.
- **Yarış Odası:** Aynı sorularla çok kişili yarış (oda kodu ya da davet linki).
- **1'e 1 Kapışma:** Her soruda önce doğru basan puanı alır; 10/15/20 puanlık maç, rövanş.
- **Canavara Karşı Savaş:** İnternetsiz, Yavru / Canavar / Dev Canavar.
- **Arkadaşlar:** Oyuncu kodu ile arkadaş ekleme, çevrim içi görme, kapışmaya davet.
- **Otomatik yedek:** Veriler buluta yedeklenir; yedek koduyla yeni telefona taşınır.

## Teknik
- Tek dosyalı PWA: `index.html` + `sw.js` (önbellek) + ses dosyaları.
- Firebase (Firestore + e-posta/şifre ile sessiz cihaz hesabı), Spark (ücretsiz) plan.
- Firestore kuralları `firebase/firestore.rules`; değişince GitHub Actions ile otomatik yüklenir.
- Testler `test/` klasöründe (Playwright, çok telefonlu Firebase taklidi).
- Geliştirme notları ve kurallar: `CLAUDE.md`.
