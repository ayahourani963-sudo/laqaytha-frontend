// edit-report.js — 09: تعديل البلاغ
(function (App) {
"use strict";

const { esc, navigate, showToast, renderReportForm } = App;
const { getReport, updateReport } = App;

const title = "تعديل البلاغ";

async function render(container, { id }) {
  container.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;

  let report;
  try {
    report = await getReport(id);
  } catch (err) {
    container.innerHTML = `<div class="card err">${esc(err.message)}</div>`;
    return;
  }

  renderReportForm(container, {
    kind: report.kind,
    report,
    cancelHref: `#/reports/${id}`,
    async onSubmit(data) {
      await updateReport(id, data);
      showToast("تم حفظ التعديلات ✅");
      navigate(`/reports/${id}`);
    },
  });
}

(App.views = App.views || {}).editReport = { title, render };
})(window.App = window.App || {});
