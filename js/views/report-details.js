// report-details.js — 08: عرض تفاصيل البلاغ
(function (App) {
"use strict";

const { $, esc, navigate, reportNumber } = App;
const { showToast, thumbHtml, reportTagsHtml } = App;
const { getReport, openConversation } = App;

const title = "تفاصيل البلاغ";

/** المستجدات على البلاغ (تُستعمل أيضاً في صفحة تحديث الحالة) */
function updatesHtml(report) {
  if (!report.updates.length) return "";
  return `<h3>المستجدات</h3>` +
    report.updates.map((u) => `<div class="note">🕒 ${esc(u.date)} — ${esc(u.text)}</div>`).join("");
}

async function render(container, { id }) {
  container.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;

  let r;
  try {
    r = await getReport(id);
  } catch (err) {
    container.innerHTML = `<div class="card err">${esc(err.message)} <a href="#/reports">العودة للبلاغات</a></div>`;
    return;
  }

  const info = [
    ["الفئة", r.category], ["اللون", r.color], ["المحافظة", r.governorate],
    ["المنطقة", r.place], ["التاريخ", r.date], ["رقم البلاغ", "#" + reportNumber(r.id)],
  ];

  const ownerActions = `
    <a class="btn line" href="#/reports/${r.id}/edit">✏️ تعديل</a>
    <a class="btn line" href="#/reports/${r.id}/status">📝 تحديث</a>
    <a class="btn line" href="#/reports/${r.id}/matches">🎯 المطابقات</a>
    <a class="btn line" href="#/claims/${r.id}">🙋 طلبات المطالبة</a>
    ${r.status === "open" ? `<a class="btn navy" href="#/reports/${r.id}/close">إغلاق البلاغ</a>` : ""}`;

  const visitorActions = `
    ${r.kind === "found" ? `<a class="btn" href="#/verification/${r.id}">✋ هذا غرضي – تحقّق</a>` : ""}
    <button class="btn line" data-chat>💬 مراسلة</button>`;

  container.innerHTML = `
    <div class="page-box full">
      <a href="#/reports" class="muted">→ رجوع للبلاغات</a>
      ${thumbHtml(r, 230)}
      <div class="spaced">${reportTagsHtml(r)}</div>
      <h1>${esc(r.title)}</h1>
      <div class="info-grid">
        ${info.map(([label, value]) => `<div class="q"><span class="muted">${label}</span><br><b>${esc(value)}</b></div>`).join("")}
      </div>
      <h3>الوصف</h3>
      <p>${esc(r.description) || "—"}</p>
      ${updatesHtml(r)}
      <div class="actions-row">${r.isOwner ? ownerActions : visitorActions}</div>
    </div>`;

  container.addEventListener("click", async (e) => {
    if (!e.target.closest("[data-chat]")) return;
    try {
      const { id: conversationId } = await openConversation(r.id);
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      showToast(err.message);
    }
  });
}

(App.views = App.views || {}).reportDetails = { title, render, updatesHtml };
})(window.App = window.App || {});
