// reports.js — 05: عرض صفحة البلاغات (قائمة البلاغات)
(function (App) {
"use strict";

const { $, $$, esc } = App;
const { getReports } = App;
const { reportCard } = App;

const title = "البلاغات";

async function render(container) {
  let kind = "all";

  container.innerHTML = `
    <div class="page-head">
      <h2 class="page-title">📋 البلاغات</h2>
      <a class="btn" href="#/reports/new-lost">＋ مفقود</a>
      <a class="btn navy" href="#/reports/new-found">＋ موجود</a>
    </div>
    <div class="tabs">
      <button class="on" data-kind="all">الكل</button>
      <button data-kind="lost">مفقودات</button>
      <button data-kind="found">موجودات</button>
      <a class="btn line small push-end" href="#/search">🔎 بحث متقدم</a>
    </div>
    <div class="grid" id="list" aria-live="polite"></div>`;

  const list = $("#list", container);

  async function load() {
    list.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;
    try {
      const reports = await getReports(kind);
      list.innerHTML = reports.map((r) => reportCard(r)).join("") || `<p class="muted">لا توجد بلاغات.</p>`;
    } catch (err) {
      list.innerHTML = `<div class="card err">${esc(err.message)}</div>`;
    }
  }

  container.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-kind]");
    if (!tab) return;
    kind = tab.dataset.kind;
    $$("[data-kind]", container).forEach((b) => b.classList.toggle("on", b === tab));
    load();
  });

  await load();
}

(App.views = App.views || {}).reports = { title, render };
})(window.App = window.App || {});
