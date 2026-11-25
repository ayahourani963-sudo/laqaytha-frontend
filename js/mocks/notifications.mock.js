// notifications.mock.js — بيانات وهمية للإشعارات
(function (App) {
"use strict";

const { mockResponse } = App;

let items = [
  { id: 1, type: "match",   title: "مطابقة جديدة محتملة", text: "تم العثور على «محفظة جلدية سوداء» تشبه بلاغك المفقود في دمشق – المزة.", time: "قبل ٥ دقائق", unread: true,  reportId: 2 },
  { id: 2, type: "msg",     title: "رسالة من أحمد", text: "مرحباً، أعتقد أن المفاتيح التي نشرتها هي لسيارتي، هل يمكننا التواصل؟", time: "قبل ساعة", unread: true },
  { id: 3, type: "comment", title: "تعليق جديد على بلاغك", text: "رأيت شيئاً مشابهاً قرب موقف الباصات في الفرقان.", time: "قبل ٣ ساعات", unread: true },
  { id: 4, type: "match",   title: "مطابقة جديدة محتملة", text: "هاتف سامسونج موجود في اللاذقية قد يكون هاتفك.", time: "أمس", unread: false, reportId: 7 },
  { id: 5, type: "msg",     title: "رسالة من فريق لقيتها", text: "تم قبول بلاغك ونشره بنجاح. شكراً لمساهمتك.", time: "قبل يومين", unread: false },
];

const list = (type) => mockResponse(items.filter((n) => type === "all" || n.type === type));
const unreadCount = () => mockResponse(items.filter((n) => n.unread).length);

function markRead(id) {
  items = items.map((n) => (n.id === id ? { ...n, unread: false } : n));
  return mockResponse({ ok: true });
}

function markAllRead() {
  items = items.map((n) => ({ ...n, unread: false }));
  return mockResponse({ ok: true });
}

(App.mocks = App.mocks || {}).notifications = { list, unreadCount, markRead, markAllRead };
})(window.App = window.App || {});
