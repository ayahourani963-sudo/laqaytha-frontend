// create-lost.js — 06: تسجيل غرض مفقود
(function (App) {
"use strict";

const { navigate, showToast, renderReportForm, createReport } = App;

const title = "تسجيل غرض مفقود";

function render(container) {
  renderReportForm(container, {
    kind: "lost",
    cancelHref: "#/reports",
    async onSubmit(data) {
      const report = await createReport(data);
      showToast("تم تسجيل البلاغ ✅");
      navigate(`/reports/${report.id}/matches`);   // مباشرة إلى المطابقات المحتملة
    },
  });
}

(App.views = App.views || {}).createLost = { title, render };
})(window.App = window.App || {});
