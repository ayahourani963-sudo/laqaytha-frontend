// close-report.js — 10: إغلاق البلاغ ("تم الحل" أو "مغلق")
(function (App) {
"use strict";

const { $, esc, navigate, showToast } = App;
const { getReport, setReportStatus } = App;

const title = "إغلاق البلاغ";

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
      <h1>🔒 إغلاق البلاغ</h1>
      <div class="muted">${esc(report.title)}</div>
      <form id="close-form">
        <label class="choice"><input type="radio" name="status" value="solved" checked> ✅ تم الحل – استرجعت الغرض أو سُلِّم لصاحبه</label>
        <label class="choice"><input type="radio" name="status" value="closed"> 🔒 مغلق – لا أرغب بمتابعة البلاغ</label>
        <label for="note">ملاحظة (اختياري)</label>
        <textarea id="note" name="note" rows="2"></textarea>
        <div class="note">بعد الإغلاق لن يظهر البلاغ في نتائج المطابقة.</div>
        <div class="err" id="close-error" role="alert"></div>
        <button class="btn full" type="submit">تأكيد</button>
        <a class="btn line full center" href="#/reports/${esc(id)}">إلغاء</a>
      </form>
    </div>`;

  const form = $("#close-form", container);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = form.status.value;
    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      await setReportStatus(id, status, form.note.value.trim());
      showToast(status === "solved" ? "تم تحديث الحالة: تم الحل 🎉" : "تم إغلاق البلاغ");
      navigate(`/reports/${id}`);
    } catch (err) {
      $("#close-error", container).textContent = err.message;
      button.disabled = false;
    }
  });
}

(App.views = App.views || {}).closeReport = { title, render };
})(window.App = window.App || {});
