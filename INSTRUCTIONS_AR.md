# دليل إصلاح وبناء Smart Debt Messenger

## سبب الخطأ السابق
رسالة `Expected to find project root in current working directory` ظهرت لأن سير العمل شغّل الأمر `flutter pub get`، بينما هذا المشروع تطبيق Android أصلي مبني باستخدام Gradle وJava، وليس مشروع Flutter. تحذيرات Node.js وsetup-java ليست سبب الفشل الأساسي.

## رفع المشروع إلى GitHub
1. فك ضغط الأرشيف.
2. افتح مجلد `html-to-apk-builder`.
3. ارفع **محتويات هذا المجلد** إلى جذر مستودع GitHub (بحيث يظهر `settings.gradle` و`build.gradle` و`app/` و`.github/` في جذر المستودع).
4. تأكد من استبدال ملف `.github/workflows/build-apk.yml` بالنسخة الموجودة في هذا المشروع، وحذف أو تعطيل سير العمل القديم الذي ينفّذ `flutter pub get`.
5. افتح تبويب Actions وشغّل `Build Smart Debt Messenger APK` أو ادفع التعديلات إلى فرع `main`.
6. بعد نجاح المهمة، افتح تفاصيل التشغيل ونزّل Artifact باسم `Smart-Debt-Messenger-debug-apk`.

## البناء محليًا
من داخل مجلد المشروع شغّل:

```bash
gradle --no-daemon assembleDebug
```

ملف APK الناتج عادةً:
`app/build/outputs/apk/debug/app-debug.apk`

## ملاحظات
- هذه حزمة مصدر، وليست ملف APK مبنيًا مسبقًا.
- لا يمكن تأكيد نجاح البناء إلا بعد تشغيل سير العمل ومشاهدة نتيجة ناجحة.
- الاستيراد الحالي يدعم CSV فقط؛ قراءة Excel وPDF غير منفذة بعد.
- رسائل SMS وواتساب تُجهّز للمراجعة والإرسال اليدوي، ولا تُرسل تلقائيًا.
