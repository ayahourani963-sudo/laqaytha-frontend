// search.js — 13: البحث المتقدم والفلاتر (توسيع النطاق / تخفيف المعايير)
(function (App) {
"use strict";

const { $, esc, CATEGORIES, COLORS, GOVERNORATES } = App;
const { searchReports } = App;
const { reportCard, optionsHtml } = App;

const title = "البحث المتقدم";

function render(container) {
  container.innerHTML = `
    <div class="page-box full">
      <h1>🔎 البحث المتقدم</h1>
      <form id="search-form" novalidate>
        <label for="q">كلمة مفتاحية</label>
        <input id="q" name="q" placeholder="محفظة، مفاتيح…">
        <div class="row">
          <div><label for="kind">النوع</label>
            <select id="kind" name="kind"><option value="">الكل</option><option value="lost">مفقود</option><option value="found">موجود</option></select></div>
          <div><label for="category">الفئة</label><select id="category" name="category">${optionsHtml(CATEGORIES, "", "الكل")}</select></div>
        </div>
        <div class="row">
          <div><label for="color">اللون</label><select id="color" name="color">${optionsHtml(COLORS, "", "الكل")}</select></div>
          <div><label for="governorate">المحافظة</label><select id="governorate" name="governorate">${optionsHtml(GOVERNORATES, "", "الكل")}</select></div>
        </div>
        <label for="from">من تاريخ</label>
        <input id="from" type="date" name="from">
        <label class="choice"><input type="checkbox" name="expand"> توسيع النطاق (يشمل المحافظات المجاورة)</label>
        <label class="choice"><input type="checkbox" name="relax"> تخفيف المعايير (يكفي تطابق معيار واحد)</label>
      </form>
      <h3 id="count"></h3>
      <div class="grid" id="results" aria-live="polite"></div>
    </div>`;

  const form = $("#search-form", container);
  let timer;
  let latest = 0;       // رقم آخر طلب، لتجاهل الردود المتأخرة

  async function run() {
    const ticket = ++latest;
    const f = form.elements;
    try {
      const results = await searchReports({
        q: f.q.value.trim(), kind: f.kind.value, category: f.category.value, color: f.color.value,
        governorate: f.governorate.value, from: f.from.value, expand: f.expand.checked, relax: f.relax.checked,
      });
      if (ticket !== latest) return;
      $("#count", container).textContent = "النتائج: " + results.length;
      $("#results", container).innerHTML = results.map((r) => reportCard(r)).join("") ||
        `<p class="muted">لا نتائج. جرّب توسيع النطاق أو تخفيف المعايير.</p>`;
    } catch (err) {
      if (ticket === latest) $("#results", container).innerHTML = `<div class="card err">${esc(err.message)}</div>`;
    }
  }

  const schedule = () => { clearTimeout(timer); timer = setTimeout(run, 250); };
  form.addEventListener("input", schedule);
  form.addEventListener("change", schedule);
  form.addEventListener("submit", (e) => e.preventDefault());
  run();

  return () => clearTimeout(timer);
}

(App.views = App.views || {}).search = { title, render };
})(window.App = window.App || {});
