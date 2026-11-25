// verification.js — 04: الإجابة عن أسئلة التحقق من الملكية
(function (App) {
"use strict";

const { $, esc } = App;
const { getVerification, submitAnswers } = App;

const title = "التحقق من الملكية";

async function render(container, { id }) {
  container.innerHTML = `<div class="verify-box muted">جارٍ التحميل…</div>`;

  let data;
  try {
    data = await getVerification(id);
  } catch (err) {
    container.innerHTML = `<div class="verify-box err">${esc(err.message)}</div>`;
    return;
  }

  const { report, questions } = data;
  container.innerHTML = `
    <div class="verify-box">
      <h1>التحقق من الملكية</h1>
      <div class="muted">أجب عن الأسئلة التالية بدقة ليتأكد صاحب البلاغ أن الغرض لك.</div>

      <div class="card verify-item">
        <div class="ic">${esc(report.icon)}</div>
        <div>
          <span class="tag ${esc(report.kind)}">${report.kind === "found" ? "موجود" : "مفقود"}</span>
          <b>${esc(report.title)}</b>
          <div class="muted">📍 ${esc(report.place)} · بلاغ رقم #${esc(report.number ?? report.id)}</div>
        </div>
      </div>

      <div class="note">⚠️ لن تظهر لك تفاصيل الغرض الكاملة. إجاباتك تُرسل لصاحب البلاغ فقط.</div>

      <form id="verify-form" novalidate>
        ${questions.map(questionHtml).join("")}
        <div class="err" id="verify-error" role="alert"></div>
        <button class="btn full" type="submit">إرسال الإجابات</button>
      </form>
    </div>`;

  const form = $("#verify-form", container);
  const error = $("#verify-error", container);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const answers = {};
    for (const q of questions) answers[q.id] = form.elements[q.id].value.trim();

    const missing = questions.filter((q) => q.required && !answers[q.id]);
    if (missing.length) { error.textContent = "يرجى الإجابة عن الأسئلة الإلزامية."; return; }
    error.textContent = "";

    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      await submitAnswers(id, answers);
      showDone(container);
    } catch (err) {
      error.textContent = err.message;
      button.disabled = false;
    }
  });
}

function questionHtml(q, i) {
  const label = `<b>السؤال ${i + 1}:</b> ${esc(q.text)}${q.required ? "" : ` <span class="muted">(اختياري)</span>`}`;
  let field;
  if (q.type === "select") {
    field = `<select name="${esc(q.id)}"><option value="">اختر</option>${q.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select>`;
  } else if (q.type === "input") {
    field = `<input name="${esc(q.id)}" placeholder="${esc(q.placeholder ?? "")}">`;
  } else {
    field = `<textarea name="${esc(q.id)}" rows="2" placeholder="اكتب إجابتك"></textarea>`;
  }
  return `<div class="q">${label}${field}</div>`;
}

function showDone(container) {
  container.innerHTML = `
    <div class="verify-box verify-done">
      <div class="big">✅</div>
      <h1>تم إرسال إجاباتك</h1>
      <p class="muted">سيراجعها صاحب البلاغ وسنرسل لك إشعاراً بالنتيجة.</p>
      <a class="btn" href="#/notifications">العودة إلى الإشعارات</a>
    </div>`;
}

(App.views = App.views || {}).verification = { title, render };
})(window.App = window.App || {});
