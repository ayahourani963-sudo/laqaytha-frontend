// main.js — تهيئة التطبيق
(function (App) {
"use strict";

const { $, on, isLoggedIn } = App;
const { renderHeader } = App;
const { startRouter } = App;
const { refreshUnreadBadge } = App;

renderHeader($("#app-header"));
startRouter($("#app-main"));

// تحديث عدّاد الإشعارات غير المقروءة عند البدء وعند تغيّر المستخدم
const syncBadge = () => { if (isLoggedIn()) refreshUnreadBadge(); };
on("auth:changed", syncBadge);
syncBadge();

})(window.App = window.App || {});
