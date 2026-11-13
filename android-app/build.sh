#!/usr/bin/env bash
# Matematik Canavarı Android paketi: GitHub Actions'ta çalışır (bkz. .github/workflows/android.yml).
# Uygulama dosyaları pakete gömülür (internet yokken de açılır); Firebase SDK da pakete indirilir.
set -euo pipefail
cd "$(dirname "$0")"
R=..
APPV=$(grep -o 'APPV=[0-9]*' $R/index.html | head -1 | cut -d= -f2)
FBV=$(grep -o "var FBV='[^']*'" $R/index.html | cut -d"'" -f2)
echo "Sürüm $APPV, Firebase SDK $FBV"

rm -rf www out && mkdir -p www/fb out
cp $R/index.html $R/manifest.json $R/icon-192.png $R/icon-512.png $R/push.json $R/gizlilik.html $R/aydinlatma.html $R/veri-silme.html www/
cp $R/*.mp3 $R/mc-*.webp www/
for f in firebase-app firebase-auth firebase-firestore; do
  curl -fsSL "https://www.gstatic.com/firebasejs/$FBV/$f.js" | sed "s#https://www.gstatic.com/firebasejs/$FBV/#./#g" > www/fb/$f.js
done
! grep -l "https://www.gstatic.com/firebasejs" www/fb/*.js || { echo "SDK içinde dış bağlantı kaldı"; exit 1; }

FCM=0
if [ -f google-services.json ]; then FCM=1; echo '{"on":1}' > www/fcm.json; echo "Bildirimler (FCM) açık"; else echo "::warning::google-services.json yok: Android bildirimleri bu pakette kapalı"; fi

npm install --no-audit --no-fund --legacy-peer-deps
[ -d android ] || npx cap add android
npx cap sync android
npx capacitor-assets generate --android --iconBackgroundColor '#2f6bff' --iconBackgroundColorDark '#2f6bff' --splashBackgroundColor '#2f6bff' --splashBackgroundColorDark '#152a66' || echo "::warning::simge üretimi başarısız"

A=android/app
[ $FCM = 1 ] && cp google-services.json $A/
cp res/drawable/ic_stat_mc.xml $A/src/main/res/drawable/
# sürüm numarası = uygulamadaki APPV
sed -i -E "s/versionCode( =)? [0-9]+/versionCode\1 $APPV/; s/versionName( =)? \"[^\"]*\"/versionName\1 \"$APPV\"/" $A/build.gradle
grep -E "versionCode|versionName|targetSdk|compileSdk" $A/build.gradle android/variables.gradle || true
# bildirim simgesi/kanalı ve dikey ekran
M=$A/src/main/AndroidManifest.xml
grep -q default_notification_icon $M || sed -i 's#<application#<application#; s#\(<activity\)#<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/ic_stat_mc" />\n        <meta-data android:name="com.google.firebase.messaging.default_notification_color" android:resource="@color/mc_accent" />\n        <meta-data android:name="com.google.firebase.messaging.default_notification_channel_id" android:value="mc" />\n        \1 android:screenOrientation="portrait"#' $M
mkdir -p $A/src/main/res/values
cat > $A/src/main/res/values/mc_colors.xml <<'X'
<?xml version="1.0" encoding="utf-8"?>
<resources><color name="mc_accent">#2F6BFF</color></resources>
X
cat $M

cd android
./gradlew --no-daemon assembleDebug
cp app/build/outputs/apk/debug/app-debug.apk ../out/matematik-canavari-$APPV-debug.apk
# Play için imzalı AAB: yükleme anahtarı gizlileri varsa (UPLOAD_KS = keystore base64, UPLOAD_KS_PASS, UPLOAD_KEY_ALIAS, UPLOAD_KEY_PASS)
if [ -n "${UPLOAD_KS:-}" ]; then
  KS=$(mktemp -d)/upload.jks; printf '%s' "$UPLOAD_KS" | base64 -d > "$KS"
  ./gradlew --no-daemon bundleRelease \
    -Pandroid.injected.signing.store.file="$KS" -Pandroid.injected.signing.store.password="$UPLOAD_KS_PASS" \
    -Pandroid.injected.signing.key.alias="$UPLOAD_KEY_ALIAS" -Pandroid.injected.signing.key.password="${UPLOAD_KEY_PASS:-$UPLOAD_KS_PASS}"
  rm -f "$KS"
  cp app/build/outputs/bundle/release/app-release.aab ../out/matematik-canavari-$APPV.aab
else echo "::notice::Yükleme anahtarı yok: sadece debug APK derlendi"; fi
ls -la ../out
