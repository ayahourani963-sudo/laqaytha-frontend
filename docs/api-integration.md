# توزيع عمليات الربط ونتائج الاختبار

> المسارات أدناه **مقترحة** وتُعدَّل حسب Swagger الفعلي للـ Back-end. كل الدوال تعمل حالياً ببيانات وهمية (`USE_MOCKS: true`).

**رابط Swagger:** (يُضاف هنا)

## المجموعة 1

| الصفحة | الدالة | الملف | الطلب المقترح |
|---|---|---|---|
| 01 إنشاء حساب | `signUp` | `auth-service.js` | `POST /auth/signup` |
| 02 تسجيل الدخول | `logIn` | `auth-service.js` | `POST /auth/login` |
| 03 الإشعارات | `getNotifications` | `notifications-service.js` | `GET /notifications?type=` |
| 03 الإشعارات | `markAsRead` · `markAllAsRead` | `notifications-service.js` | `PATCH /notifications/:id/read` · `PATCH /notifications/read-all` |
| 03 الإشعارات | `getUnreadCount` | `notifications-service.js` | `GET /notifications/unread-count` |
| 04 أسئلة التحقق | `getVerification` · `submitAnswers` | `claims-service.js` | `GET` · `POST /reports/:id/verification` |

## المجموعة 2

| الصفحة | الدالة | الملف | الطلب المقترح |
|---|---|---|---|
| 05 البلاغات | `getReports` | `items-service.js` | `GET /reports?kind=` |
| 06 · 07 التسجيل | `createReport` | `items-service.js` | `POST /reports` (الصورة حالياً Base64؛ تُحوَّل إلى `multipart/form-data` إن طلب الـ Back-end) |
| 08 التفاصيل | `getReport` | `items-service.js` | `GET /reports/:id` |

## المجموعة 3

| الصفحة | الدالة | الملف | الطلب المقترح |
|---|---|---|---|
| 09 تعديل | `updateReport` | `items-service.js` | `PUT /reports/:id` |
| 10 إغلاق | `setReportStatus` | `items-service.js` | `PATCH /reports/:id/status` |
| 11 تحديث | `addReportUpdate` | `items-service.js` | `POST /reports/:id/updates` |
| 12 المطابقة | `getMatches` | `items-service.js` | `GET /reports/:id/matches` |

## المجموعة 4

| الصفحة | الدالة | الملف | الطلب المقترح |
|---|---|---|---|
| 13 البحث | `searchReports` | `items-service.js` | `GET /reports/search?q=&kind=&category=&color=&governorate=&from=&expand=&relax=` |
| 14 الدعم | `reportProblem` | `support-service.js` | `POST /support/tickets` |

## المجموعة 5

| الصفحة | الدالة | الملف | الطلب المقترح |
|---|---|---|---|
| 15 المطالبات | `getClaimsOverview` | `claims-service.js` | `GET /claims` |
| 15 المطالبات | `getReportClaims` | `claims-service.js` | `GET /reports/:id/claims` |
| 15 المطالبات | `decideClaim` | `claims-service.js` | `PATCH /reports/:id/claims/:claimId` |
| 16 المحادثة | `getConversations` · `getConversation` | `chat-service.js` | `GET /conversations` · `GET /conversations/:id` |
| 16 المحادثة | `sendMessage` | `chat-service.js` | `POST /conversations/:id/messages` |
| 16 المحادثة | `openConversation` | `chat-service.js` | `POST /conversations` |

## نتائج الاختبار

| السيناريو | النتيجة |
|---|---|
| تدفق كامل: دخول ← بلاغ مفقود ← مطابقة ← تعديل ← تحديث ← إغلاق | ينجح (Mock) |
| البحث: فلاتر + توسيع النطاق + تخفيف المعايير | ينجح (Mock) |
| المطالبات: قبول طلب ← فتح محادثة ← إرسال رسالة وردّ | ينجح (Mock) |
| بلاغ غير موجود / حقول ناقصة | رسائل خطأ مناسبة |

الاختبار مع الخادم الحقيقي: بعد ضبط `USE_MOCKS: false` يُسجَّل هنا.
