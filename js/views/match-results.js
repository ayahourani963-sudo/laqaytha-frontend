// match-results.js — 12: نتائج المطابقة المحتملة
(function (App) {
"use strict";

const { esc } = App;
const { getReport, getMatches } = App;
const { reportCard } = App;

const title = "المطابقات المحتملة";

async function render(container, { id }) {
  container.innerHTML = `<p class="muted">جارٍ البحث عن مطابقات…</p>`;

  let report, matches;
  try {
    [report, matches] = await Promise.all([getReport(id), getMatches(id)]);
  } catch (err) {
    container.innerHTML = `<div class="card err">${esc(err.message)}</div>`;
    return;
  }

  const cards = matches.map(({ report: m, score }) => reportCard(m, `
    <div class="bar2"><i style="width:${Number(score)}%"></i></div>
    <b class="score">نسبة التطابق ${Number(score)}٪</b>`)).join("");

  container.innerHTML = `
    <div class="page-box full">
      <h1>🎯 المطابقات المحتملة</h1>
      <div class="muted">أغراض قريبة من مواصفات: <b>${esc(report.title)}</b></div>
      <div class="grid spaced">
        ${cards || `<p class="muted">لا توجد مطابقات حالياً، وسنُشعرك فور ظهور غرض مشابه.</p>`}
      </div>
      <div class="actions-row">
        <a class="btn line" href="#/search">🔎 توسيع البحث</a>
        <a class="btn" href="#/reports/${esc(id)}">رجوع للبلاغ</a>
      </div>
    </div>`;
}

(App.views = App.views || {}).matchResults = { title, render };
})(window.App = window.App || {});
