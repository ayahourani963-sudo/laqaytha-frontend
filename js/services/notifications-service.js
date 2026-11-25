// notifications-service.js — جلب الإشعارات وتعليمها كمقروءة
(function (App) {
"use strict";

const { CONFIG } = App;
const { emit } = App;
const { api } = App;
const mock = App.mocks.notifications;

/** type: "all" | "match" | "comment" | "msg" */
function getNotifications(type = "all") {
  return CONFIG.USE_MOCKS ? mock.list(type) : api.get(`/notifications?type=${encodeURIComponent(type)}`);
}

function markAsRead(id) {
  return CONFIG.USE_MOCKS ? mock.markRead(id) : api.patch(`/notifications/${id}/read`);
}

function markAllAsRead() {
  return CONFIG.USE_MOCKS ? mock.markAllRead() : api.patch("/notifications/read-all");
}

function getUnreadCount() {
  return CONFIG.USE_MOCKS ? mock.unreadCount() : api.get("/notifications/unread-count").then((r) => r.count);
}

/** يحدّث العدّاد الظاهر في الـ header */
async function refreshUnreadBadge() {
  try { emit("notifications:unread", { count: await getUnreadCount() }); } catch { /* تجاهل */ }
}

Object.assign(App, { getNotifications, markAsRead, markAllAsRead, getUnreadCount, refreshUnreadBadge });
})(window.App = window.App || {});
