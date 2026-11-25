# لقيتها — الواجهة الأمامية (laqaytha-frontend)

منصة سورية لإدارة بلاغات **المفقودات والموجودات**: تسجيل البلاغات، المطابقة، البحث، المطالبة بالملكية والتحقق، والمحادثة بين الطرفين.

> HTML + CSS + JavaScript عادي بدون أي إطار عمل أو أدوات بناء، مع دعم الاتجاه من اليمين لليسار (RTL).

## التشغيل

لا يحتاج تثبيتاً ولا خادماً: افتح `index.html` بالنقر المزدوج، أو شغّله بـ **Live Server** في VS Code (الأفضل أثناء التطوير)، أو:

```bash
python -m http.server 5500      # ثم افتح http://localhost:5500
```

في وضع التطوير الافتراضي (`USE_MOCKS: true` في `js/config.js`) يُقبل أي رقم/بريد وكلمة مرور عند الدخول.

## الهيكلية

```text
laqaytha-frontend/                    
├── index.html                        # HTML shell: header + main + toast
├── README.md                         # التشغيل والهيكلية
├── .gitignore                        
├── assets/                           
│   ├── images/                       
│   ├── icons/                        
│   └── fonts/                        
├── css/                              
│   ├── variables.css                 # الألوان والخطوط والثيم
│   ├── base.css                      # reset + قواعد HTML العامة
│   ├── layout.css                    # header / nav / container
│   ├── components.css                # button / card / form / modal
│   └── pages/                        
│       ├── auth.css                  # المجموعة 1
│       ├── notifications.css         
│       ├── verification.css          
│       ├── reports.css               # المجموعة 2 + تنسيقات 3 ذات الصلة
│       ├── report-actions.css        # المجموعة 3
│       ├── matches.css               
│       ├── search.css                # المجموعة 4
│       ├── support.css               
│       ├── claims.css                
│       └── chat.css                  
├── js/                               
│   ├── main.js                       # تهيئة التطبيق
│   ├── router.js                     # المسارات والتنقل
│   ├── core.js                       # أدوات DOM / state / constants
│   ├── ui.js                         # العناصر المشتركة toast و modal و header
│   ├── config.js                     # وضع التطوير + عنوان API
│   ├── services/                     
│   │   ├── api.js                    # طبقة HTTP المشتركة
│   │   ├── auth-service.js           # المصادقة (01, 02)
│   │   ├── notifications-service.js  # الإشعارات (03)
│   │   ├── items-service.js          # البلاغات والمطابقات والبحث
│   │   ├── claims-service.js         # المطالبات والتحقق
│   │   ├── chat-service.js           
│   │   └── support-service.js        
│   ├── mocks/                        # اختياري: بيانات للتطوير المعزول والاختبار
│   │   ├── items.mock.js
│   │   ├── auth.mock.js
│   │   ├── notifications.mock.js
│   │   ├── verification.mock.js
│   │   ├── claims.mock.js
│   │   ├── chat.mock.js
│   │   └── support.mock.js
│   └── views/                        
│       ├── signup.js                 # 01
│       ├── login.js                  # 02
│       ├── notifications.js          # 03
│       ├── verification.js           # 04
│       ├── reports.js                # 05
│       ├── create-lost.js            # 06
│       ├── create-found.js           # 07
│       ├── report-details.js         # 08
│       ├── edit-report.js            # 09
│       ├── close-report.js           # 10
│       ├── update-status.js          # 11
│       ├── match-results.js          # 12
│       ├── search.js                 # 13
│       ├── support.js                # 14
│       ├── claims.js                 # 15: list + details
│       └── chat.js                   # 16: list + conversation
└── docs/                             
    └── api-integration.md            # توزيع عمليات الربط ونتائج الاختبار + روابط Swagger
```

## توزيع العمل

| المجموعة | الصفحات | المسؤول |
|---|---|---|
| 1 | 01 إنشاء حساب · 02 تسجيل الدخول · 03 الإشعارات · 04 أسئلة التحقق من الملكية | (اكتب اسمك) |
| 2 | 05 البلاغات · 06 تسجيل مفقود · 07 تسجيل معثور عليه · 08 تفاصيل البلاغ | الآنسة بوران |
| 3 | 09 تعديل البلاغ · 10 إغلاق البلاغ · 11 تحديث الحالة · 12 نتائج المطابقة | الآنسة ديما |
| 4 | 13 البحث المتقدم · 14 الإبلاغ عن مشكلة | الأستاذ كمال |
| 5 | 15 إدارة المطالبات · 16 مركز التواصل (الشات) | الأستاذ كمال + صفي |

**كل الصفحات الـ16 منفَّذة وتعمل** ببيانات وهمية (`js/mocks`)، مبنية من النموذج الأولي `المنصة` وموزّعة على الهيكلية. على كل شخص مراجعة ملفات مجموعته وتطويرها أو الربط مع الـ API.

## المسارات

| المسار | الشاشة |
|---|---|
| `#/signup` · `#/login` | 01 · 02 |
| `#/notifications` · `#/verification/:id` | 03 · 04 |
| `#/reports` · `#/reports/new-lost` · `#/reports/new-found` · `#/reports/:id` | 05 · 06 · 07 · 08 |
| `#/reports/:id/edit` · `/close` · `/status` · `/matches` | 09 · 10 · 11 · 12 |
| `#/search` · `#/support` | 13 · 14 |
| `#/claims` · `#/claims/:id` | 15 (قائمة · تفاصيل بلاغ) |
| `#/chat` · `#/chat/:id` | 16 (قائمة · محادثة) |

## كيف تعمل الطبقات

```text
view (js/views)  →  service (js/services)  →  api.js (HTTP)  أو  mocks (بيانات وهمية)
```

| الطبقة | المسؤولية | ممنوع فيها |
|---|---|---|
| `views/*` | رسم الشاشة، التقاط أحداث المستخدم، التحقق من المدخلات | استدعاء `fetch` مباشرة |
| `services/*` | دالة لكل عملية على الـ API (مثل `signUp` و`getNotifications`) | لمس الـ DOM |
| `api.js` | رأس الطلب، التوكن، معالجة الأخطاء | منطق خاص بشاشة |
| `mocks/*` | بيانات وهمية تحاكي ردّ الخادم | الاستدعاء من الـ views |
| `core.js` / `ui.js` | أدوات ومكوّنات مشتركة (`$`, `esc`, الجلسة، toast, modal, بطاقة البلاغ، نموذج البلاغ) | منطق خاص بشاشة |

## إضافة / تنفيذ شاشة

1. افتح ملف الشاشة في `js/views/`؛ كل ملف يتبع هذا القالب (انظر `signup.js`):

```js
(function (App) {
"use strict";
const { $, esc, navigate } = App;      // الأدوات المشتركة
const { showToast } = App;

const title = "عنوان الصفحة";
function render(container, params) {
  container.innerHTML = `...`;
}

(App.views = App.views || {}).myView = { title, render };
})(window.App = window.App || {});
```

2. أي طلب للخادم: أضف دالة في الخدمة المناسبة على نمط `auth-service.js` (وبيانات وهمية في `mocks/`).
3. تنسيق الشاشة في ملفها داخل `css/pages/`، والألوان من `variables.css` فقط.
4. المسار مسجَّل مسبقاً في `router.js`. عند إضافة **ملف جديد** سجّله بـ `<script>` في `index.html` قبل `router.js` (الترتيب مهم).

## قواعد عامة

- أي نص قادم من المستخدم أو الخادم يمرّ بـ `esc()` قبل وضعه في `innerHTML`.
- كل ملف JS يُغلَّف بدالة `(function (App) { ... })` ويشارك الأدوات عبر الكائن العام `App`، فلا تلوّث المتغيرات العامة.
- التواصل بين الأجزاء بالأحداث (`emit` / `on`) وليس باستدعاء مباشر، مثل `auth:changed` و`notifications:unread`.
- التبديل بين البيانات الوهمية والخادم الحقيقي من `config.js` فقط.
- الخلاف على ملف مشترك (`core.js`, `ui.js`, `router.js`, `components.css`) يُحلّ بالاتفاق قبل التعديل.
