// signup.js — 01: إنشاء حساب جديد
(function (App) {
"use strict";

const { $, esc, GOVERNORATES, navigate, setSession, isEmail, isSyrianPhone } = App;
const { showToast } = App;
const { signUp } = App;

const title = "إنشاء حساب جديد";

function render(container) {
  container.innerHTML = `
    <div class="auth-box wide">
      <h1>إنشاء حساب جديد</h1>
      <div class="muted">انضم إلى المجتمع وساعد في إعادة الأمانات</div>
      <form id="signup-form" novalidate>
        <div class="row">
          <div><label for="firstName">الاسم الأول</label><input id="firstName" name="firstName" autocomplete="given-name"></div>
          <div><label for="lastName">الكنية</label><input id="lastName" name="lastName" autocomplete="family-name"></div>
        </div>
        <div class="row">
          <div><label for="phone">رقم الهاتف</label><input id="phone" name="phone" class="ltr" type="tel" inputmode="tel" placeholder="09XXXXXXXX"></div>
          <div><label for="email">البريد الإلكتروني <span class="muted">(اختياري)</span></label><input id="email" name="email" class="ltr" type="email" placeholder="name@mail.com"></div>
        </div>
        <label for="governorate">المحافظة</label>
        <select id="governorate" name="governorate">
          <option value="">اختر المحافظة</option>
          ${GOVERNORATES.map((g) => `<option>${esc(g)}</option>`).join("")}
        </select>
        <div class="row">
          <div><label for="password">كلمة المرور</label><input id="password" name="password" type="password" autocomplete="new-password"></div>
          <div><label for="confirm">تأكيد كلمة المرور</label><input id="confirm" name="confirm" type="password" autocomplete="new-password"></div>
        </div>
        <div class="err" id="signup-error" role="alert"></div>
        <button class="btn full" type="submit">إنشاء الحساب</button>
      </form>
      <div class="auth-alt">لديك حساب؟ <a href="#/login">تسجيل الدخول</a></div>
    </div>`;

  const form = $("#signup-form", container);
  const error = $("#signup-error", container);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    Object.keys(d).forEach((k) => { d[k] = String(d[k]).trim(); });

    const problem = validate(d);
    if (problem) { error.textContent = problem; return; }
    error.textContent = "";

    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      const { confirm, ...payload } = d;
      setSession(await signUp(payload));
      showToast("تم إنشاء حسابك بنجاح 🎉");
      navigate("/notifications");
    } catch (err) {
      error.textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });
}

function validate(d) {
  if (!d.firstName || !d.lastName || !d.phone || !d.governorate || !d.password)
    return "يرجى تعبئة جميع الحقول المطلوبة.";
  if (!isSyrianPhone(d.phone)) return "رقم الهاتف يجب أن يكون بالشكل 09XXXXXXXX.";
  if (d.email && !isEmail(d.email)) return "البريد الإلكتروني غير صالح.";
  if (d.password.length < 6) return "كلمة المرور يجب ألا تقل عن ٦ أحرف.";
  if (d.password !== d.confirm) return "كلمتا المرور غير متطابقتين.";
  return "";
}

(App.views = App.views || {}).signup = { title, render };
})(window.App = window.App || {});
