// create-found.js — 07: تسجيل غرض معثور عليه
(function (App) {
"use strict";

const { navigate, showToast, renderReportForm, createReport } = App;

const title = "تسجيل غرض معثور عليه";

function render(container) {
  renderReportForm(container, {
    kind: "found",
    cancelHref: "#/reports",
    async onSubmit(data) {
      const report = await createReport(data);
      showToast("تم تسجيل البلاغ ✅");
      navigate(`/reports/${report.id}/matches`);
    },
  });
}

(App.views = App.views || {}).createFound = { title, render };
})(window.App = window.App || {});
