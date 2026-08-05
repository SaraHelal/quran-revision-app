# Quran Revision App — Version 2 Roadmap

## V2 Main Goal

تحويل التطبيق من:
"يعرض أضعف 3 سور"

إلى:

"يعرف ما الذي يحتاج إلى المراجعة اليوم، يرتب الأولويات، ويشرح للمستخدم لماذا اقترح كل سورة."

الهدف الأساسي في V2 هو بناء Adaptive Review Engine قابل للتطوير لاحقًا إلى AI Recommendation Engine.

---

## Phase 1 — Data & Safety Foundation

### 1. Manage Memorized Surahs

إنشاء صفحة لإدارة السور المحفوظة.

المستخدم يستطيع:

* رؤية جميع السور المحفوظة.
* تعديل مستوى الإتقان.
* تعديل تاريخ الحفظ عند الحاجة.
* حذف سورة أضيفت بالخطأ.

الصفحة المقترحة:
`/my-surahs`

### 2. Prevent Duplicate Surahs

منع إضافة نفس السورة لنفس المستخدم أكثر من مرة.

التحقق يكون باستخدام:

* userId
* surahNumber

إذا كانت موجودة:
"هذه السورة مضافة بالفعل."

---

## Phase 2 — Review Scheduling Engine

### 3. Calculate nextReviewDate

بعد كل مراجعة، التطبيق يحدد موعد المراجعة التالية.

نسخة البداية تكون Rule-Based وليست AI.

مثال أولي:

* weak → مراجعة قريبًا جدًا
* good → بعد فترة متوسطة
* excellent → بعد فترة أطول

القواعد سيتم تصميمها واختبارها قبل كتابة الكود.

### 4. Overdue Reviews

إذا:

today > nextReviewDate

تعتبر السورة متأخرة.

نعيد Stat:
"متأخر"

للـ Dashboard بعد أن يصبح له معنى حقيقي.

---

## Phase 3 — Adaptive Recommendation Engine ⭐

### 5. Review Priority Score

بدل ترتيب السور فقط حسب:

weak → good → excellent

نحسب Priority Score لكل سورة.

يمكن أن يعتمد على:

* mastery level
* days since last review
* overdue status
* repeated weak reviews
* recent review results
* improving or declining performance

ثم نرتب السور بناءً على الـ score ونرشح الأعلى أولوية.

### 6. Recommendation Reason

كل سورة مقترحة يجب أن يكون لها سبب مفهوم.

مثال:

"أولوية عالية — كانت ضعيفة في آخر مراجعتين ولم تُراجع منذ 5 أيام."

أو:

"مستواها جيد، لكن حان موعد تثبيت الحفظ."

هذه Feature أساسية في الـ Demo.

---

## Phase 4 — Statistics & Charts

نستخدم `reviewHistory` الذي بدأ جمعه من V1.

### 7. Statistics

إحصائيات أساسية:

* عدد المراجعات هذا الأسبوع.
* عدد السور الضعيفة.
* عدد السور التي تحسنت.
* متوسط نتيجة المراجعات.
* عدد أيام المراجعة.

### 8. Charts

نبني فقط Charts مفيدة، وليس Dashboard مليئة بالرسوم.

أمثلة:

* Line chart: تطور مستوى المراجعة مع الوقت.
* Bar chart: أكثر السور احتياجًا للمراجعة.
* Weekly review activity.
* Distribution of weak / good / excellent reviews.

---

## Phase 5 — Smart / AI Layer

### 9. Smart Recommendation Prototype

بعد أن يصبح لدينا Review History حقيقي، نطور الـ Recommendation Engine.

النسخة الأولى قد تظل deterministic/rule-based حتى نستطيع تفسيرها وتقييمها.

بعد ذلك ندرس استخدام AI/ML في:

* learning personalized review intervals
* detecting patterns of forgetting
* predicting which surahs are at risk
* personalized recommendations

### 10. AI Explanation Layer

يمكن أن ينتج النظام تفسيرًا طبيعيًا مثل:

"أقترح عليك مراجعة سورة الملك اليوم لأن مستواها انخفض في آخر مراجعتين، وقد مر وقت أطول من المعتاد منذ آخر مراجعة ناجحة."

الـ AI يجب أن يضيف قيمة حقيقية، وليس مجرد Chatbot داخل التطبيق.

---

## Phase 6 — Interview Demo Polish

قبل عرض المشروع:

* Mobile-first polished UI.
* Deploy على رابط حقيقي يعمل على الهاتف.
* Demo data كافية لإظهار History وRecommendations.
* Dashboard واضح.
* Recommendation reasons.
* Statistics بسيطة وجميلة.

لا نبني:

* Speech recognition.
* Quran recitation mistake detection.
* Tajweed correction.
* Audio engine.

هذه ليست نقطة تميز المشروع أمام Tarteel.

---

# Target Demo

المستخدم يفتح التطبيق.

Dashboard تقول:

"مراجعة اليوم — مقترحة لك"

1. سورة الملك
   أولوية عالية
   ضعفت في آخر مراجعتين ولم تُراجع منذ عدة أيام.

2. سورة النبأ
   أولوية متوسطة
   مستواها جيد لكن حان موعد تثبيت الحفظ.

3. سورة يس
   أولوية متوسطة
   تحسنت مؤخرًا ونقترح مراجعة تثبيت.

المستخدم يراجع ويختار:
ضعيف / جيد / ممتاز

ثم:

* reviewHistory يُحفظ.
* nextReviewDate يتغير.
* priority score يتغير.
* Dashboard يعيد ترتيب الترشيحات.
* Statistics تتحدث.

---

# V2 Build Order

1. Manage Memorized Surahs
2. Prevent Duplicate Surahs
3. Design Review Scheduling Rules
4. Implement nextReviewDate
5. Implement Overdue
6. Build Priority Score
7. Add Recommendation Reasons
8. Build Statistics
9. Add Charts
10. Build Smart/AI Recommendation Prototype
11. Deploy and polish Interview Demo
