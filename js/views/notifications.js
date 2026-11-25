// notifications.js — 03: الإشعارات (تعليقات، رسائل، مطابقات)
(function (App) {
"use strict";

const { $, $$, esc, NOTIFICATION_TYPES } = App;
const { getNotifications, markAsRead, markAllAsRead, refreshUnreadBadge, } = App;

const title = "الإشعارات";

async function render(container) {
  let filter = "all";

  container.innerHTML = `
    <h2 class="page-title">🔔 الإشعارات</h2>
    <div class="tabs" id="tabs">
      <button class="on" data-filter="all">الكل</button>
      ${Object.entries(NOTIFICATION_TYPES)
        .map(([key, t]) => `<button data-filter="${key}">${t.label}</button>`).join("")}
      <button class="push-end" data-read-all>تعليم الكل كمقروء</button>
    </div>
    <div id="list" aria-live="polite"></div>`;

  const list = $("#list", container);

  async function load() {
    list.innerHTML = `<div class="card muted">جارٍ التحميل…</div>`;
    try {
      const items = await getNotifications(filter);
      list.innerHTML = items.length ? items.map(itemHtml).join("") : `<div class="card muted">لا توجد إشعارات.</div>`;
    } catch (err) {
      list.innerHTML = `<div class="card err">${esc(err.message)}</div>`;
    }
  }

  async function refresh() { await load(); refreshUnreadBadge(); }

  container.addEventListener("click", async (e) => {
    const tab = e.target.closest("[data-filter]");
    if (tab) {
      filter = tab.dataset.filter;
      $$("[data-filter]", container).forEach((b) => b.classList.toggle("on", b === tab));
      return load();
    }
    if (e.target.closest("[data-read-all]")) {
      await markAllAsRead();
      return refresh();
    }
    const verify = e.target.closest("[data-read-id]");   // زر "أنا صاحب الغرض" ينتقل للتحقق
    if (verify) markAsRead(Number(verify.dataset.readId)).then(refreshUnreadBadge);
  });

  await load();
}

function itemHtml(n) {
  const type = NOTIFICATION_TYPES[n.type] ?? { icon: "🔔" };
  const action = n.type === "match" && n.reportId
    ? `<a class="btn small" href="#/verification/${encodeURIComponent(n.reportId)}" data-read-id="${n.id}">أنا صاحب الغرض – تحقّق</a>`
    : "";
  return `
    <div class="nt ${n.unread ? "unread" : ""}">
      <div class="ic">${type.icon}</div>
      <div class="body">
        <h4>${esc(n.title)}</h4>
        <div>${esc(n.text)}</div>
        <div class="muted">${esc(n.time)}</div>
        ${action}
      </div>
    </div>`;
}

(App.views = App.views || {}).notifications = { title, render };
})(window.App = window.App || {});
