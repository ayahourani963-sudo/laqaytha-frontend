// login.js — 02: تسجيل الدخول
(function (App) {
"use strict";

const { $, navigate, setSession } = App;
const { showToast } = App;
const { logIn } = App;

const title = "تسجيل الدخول";

function render(container) {
  container.innerHTML = `
    <div class="auth-box">
      <h1>تسجيل الدخول</h1>
      <div class="muted">أهلاً بعودتك</div>
      <form id="login-form" novalidate>
        <label for="identifier">رقم الهاتف أو البريد الإلكتروني</label>
        <input id="identifier" name="identifier" class="ltr" autocomplete="username">
        <label for="password">كلمة المرور</label>
        <input id="password" name="password" type="password" autocomplete="current-password">
        <div class="err" id="login-error" role="alert"></div>
        <button class="btn full" type="submit">دخول</button>
      </form>
      <div class="auth-alt">ليس لديك حساب؟ <a href="#/signup">إنشاء حساب جديد</a></div>
    </div>`;

  const form = $("#login-form", container);
  const error = $("#login-error", container);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const identifier = form.identifier.value.trim();
    const password = form.password.value;
    if (!identifier || !password) { error.textContent = "أدخل بيانات الدخول كاملة."; return; }
    error.textContent = "";

    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      setSession(await logIn({ identifier, password }));
      showToast("أهلاً بعودتك");
      navigate("/notifications");
    } catch (err) {
      error.textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });
}

(App.views = App.views || {}).login = { title, render };
})(window.App = window.App || {});
