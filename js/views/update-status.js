// update-status.js — 11: تحديث حالة البلاغ (تفاصيل جديدة طرأت عليه)
(function (App) {
"use strict";

const { $, esc, navigate, showToast } = App;
const { getReport, addReportUpdate } = App;
const { updatesHtml } = App.views.reportDetails;

const title = "تحديث البلاغ";

async function render(container, { id }) {
  container.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;

  let report;
  try {
    report = await getReport(id);
  } catch (err) {
    container.innerHTML = `<div class="card err">${esc(err.message)}</div>`;
    return;
  }

  container.innerHTML = `
    <div class="page-box">
      <h1>📝 تحديث البلاغ</h1>
      <div class="muted">${esc(report.title)}</div>
      <form id="update-form" novalidate>
        <label for="text">تفاصيل جديدة طرأت على البلاغ</label>
        <textarea id="text" name="text" rows="4" placeholder="مثال: تذكرت أنني فقدتها قرب سوق الحميدية"></textarea>
        <div class="err" id="update-error" role="alert"></div>
        <button class="btn full" type="submit">نشر التحديث</button>
        <a class="btn line full center" href="#/reports/${esc(id)}">رجوع للبلاغ</a>
      </form>
      ${updatesHtml(report)}
    </div>`;

  const form = $("#update-form", container);
  const error = $("#update-error", container);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = form.text.value.trim();
    if (!text) { error.textContent = "اكتب التفاصيل الجديدة."; return; }
    error.textContent = "";
    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      await addReportUpdate(id, text);
      showToast("تم نشر التحديث ✅");
      navigate(`/reports/${id}`);
    } catch (err) {
      error.textContent = err.message;
      button.disabled = false;
    }
  });
}

(App.views = App.views || {}).updateStatus = { title, render };
})(window.App = window.App || {});
