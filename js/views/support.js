// support.js — 14: الإبلاغ عن مشكلة (الدعم الفني)
(function (App) {
"use strict";

const { $, showToast } = App;
const { reportProblem } = App;

const title = "الإبلاغ عن مشكلة";

const PROBLEM_TYPES = [
  "خطأ في التطبيق", "مشكلة في رفع الصور", "الإشعارات لا تصل", "مشكلة في تسجيل الدخول", "أخرى",
];

function render(container) {
  container.innerHTML = `
    <div class="page-box">
      <h1>🛠️ الإبلاغ عن مشكلة</h1>
      <div class="muted">أخبرنا بالمشكلة التقنية وسيتابعها فريق الدعم.</div>
      <form id="support-form" novalidate>
        <label for="type">نوع المشكلة</label>
        <select id="type" name="type">${PROBLEM_TYPES.map((t) => `<option>${t}</option>`).join("")}</select>
        <label for="page">الصفحة المتأثرة</label>
        <input id="page" name="page" placeholder="مثال: صفحة البلاغات">
        <label for="description">وصف المشكلة</label>
        <textarea id="description" name="description" rows="4"></textarea>
        <div class="err" id="support-error" role="alert"></div>
        <button class="btn full" type="submit">إرسال</button>
      </form>
    </div>`;

  const form = $("#support-form", container);
  const error = $("#support-error", container);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const description = form.description.value.trim();
    if (!description) { error.textContent = "صف المشكلة باختصار."; return; }
    error.textContent = "";
    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      const { ticketId } = await reportProblem({
        type: form.type.value, page: form.page.value.trim(), description,
      });
      form.reset();
      showToast(`وصل بلاغك، رقم التذكرة #${ticketId}`);
    } catch (err) {
      error.textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });
}

(App.views = App.views || {}).support = { title, render };
})(window.App = window.App || {});
