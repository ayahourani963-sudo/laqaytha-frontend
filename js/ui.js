// ui.js — العناصر المشتركة: toast و modal و header
(function (App) {
"use strict";

const { $, $$, esc, on, isLoggedIn, getSession, clearSession, navigate } = App;
const { CATEGORY_ICONS, CATEGORIES, COLORS, GOVERNORATES, REPORT_KIND, REPORT_STATUS, todayISO } = App;

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

/* ---------- Modal ----------
   showModal({ title, body, actions: [{ label, className, onClick }] })
   يُرجع دالة close() */
function showModal({ title, body = "", actions = [] }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <h3>${esc(title)}</h3>
      <div class="modal-body">${body}</div>
      <div class="actions"></div>
    </div>`;
  const close = () => backdrop.remove();
  const box = $(".actions", backdrop);
  actions.forEach(({ label, className = "btn", onClick }) => {
    const b = document.createElement("button");
    b.className = className;
    b.textContent = label;
    b.addEventListener("click", () => { onClick?.(close); if (!onClick) close(); });
    box.append(b);
  });
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) close(); });
  document.body.append(backdrop);
  return close;
}

/* ---------- شاشة "قيد التطوير" للصفحات التي لم تُنفَّذ بعد ---------- */
function renderStub(container, { number, title, group }) {
  container.innerHTML = `
    <div class="stub card">
      <div class="big">🚧</div>
      <h2>صفحة (${esc(number)}): ${esc(title)}</h2>
      <p class="muted">قيد التطوير — المجموعة ${esc(group)}</p>
    </div>`;
}

/* ---------- Header ---------- */
function renderHeader(headerEl) {
  headerEl.className = "site-header";
  let unread = 0;

  function draw() {
    const session = getSession();
    const badge = unread ? `<span class="badge">${unread}</span>` : "";
    headerEl.innerHTML = `
      <div class="bar">
        <a class="logo" href="#/reports"><b>🔍</b> لقيتها</a>
        <nav class="nav">
          ${isLoggedIn() ? `
            <a href="#/reports">📋 البلاغات</a>
            <a href="#/search">🔎 البحث</a>
            <a href="#/claims">🤝 المطالبات</a>
            <a href="#/chat">💬 المحادثات</a>
            <a href="#/notifications">🔔 الإشعارات${badge}</a>
            <a href="#/support">🛠️ الدعم</a>
            <button class="link" data-logout>خروج (${esc(session.user.firstName)})</button>
          ` : `
            <a class="btn ghost" href="#/login">تسجيل الدخول</a>
            <a class="btn" href="#/signup">إنشاء حساب جديد</a>
          `}
        </nav>
      </div>`;
    markActive();
  }

  function markActive() {
    const current = location.hash || "#/";
    $$(".nav a", headerEl).forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === current);
    });
  }

  headerEl.addEventListener("click", (e) => {
    if (e.target.closest("[data-logout]")) {
      clearSession();
      showToast("تم تسجيل الخروج");
      navigate("/login");
    }
  });

  on("auth:changed", () => { unread = 0; draw(); });
  on("notifications:unread", (e) => { unread = e.detail.count; draw(); });
  window.addEventListener("hashchange", markActive);
  draw();
}

/* ---------- مكوّنات البلاغات المشتركة (قائمة، بحث، مطابقة) ---------- */
function thumbHtml(report, height = 110) {
  const inner = report.image
    ? `<img src="${esc(report.image)}" alt="">`
    : (CATEGORY_ICONS[report.category] ?? "📦");
  return `<div class="th" style="height:${height}px">${inner}</div>`;
}

function reportTagsHtml(report) {
  return `<span class="tag ${esc(report.kind)}">${esc(REPORT_KIND[report.kind])}</span> ` +
         `<span class="tag st ${esc(report.status)}">${esc(REPORT_STATUS[report.status])}</span>`;
}

/** بطاقة بلاغ تفتح صفحة التفاصيل. extraHtml: محتوى إضافي موثوق (مثل نسبة التطابق) */
function reportCard(report, extraHtml = "") {
  return `
    <a class="card report-card" href="#/reports/${report.id}">
      ${thumbHtml(report)}
      ${reportTagsHtml(report)}
      <h3>${esc(report.title)}</h3>
      <div class="muted">📍 ${esc(report.governorate)} – ${esc(report.place)} · <span class="nowrap">${esc(report.date)}</span></div>
      ${extraHtml}
    </a>`;
}

const optionsHtml = (list, selected = "", allLabel = "") =>
  (allLabel ? `<option value="">${esc(allLabel)}</option>` : "") +
  list.map((x) => `<option${x === selected ? " selected" : ""}>${esc(x)}</option>`).join("");

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("الملف المختار ليس صورة."));
    if (file.size > 2 * 1024 * 1024) return reject(new Error("حجم الصورة يجب ألا يتجاوز 2 ميغابايت."));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("تعذّرت قراءة الصورة."));
    reader.readAsDataURL(file);
  });
}

/* ---------- نموذج البلاغ المشترك: تسجيل مفقود / معثور عليه / تعديل ----------
   renderReportForm(container, { kind, report?, cancelHref, onSubmit(data) })
   - report: يُمرَّر عند التعديل لملء الحقول.
   - onSubmit يُستدعى بعد التحقق، وأي خطأ يرميه يظهر تحت النموذج. */
function renderReportForm(container, { kind, report, cancelHref, onSubmit }) {
  const r = report ?? {};
  const isFound = kind === "found";
  const heading = report ? "✏️ تعديل البلاغ" : isFound ? "🤲 تسجيل غرض معثور عليه" : "📢 تسجيل غرض مفقود";
  const q = r.verificationQuestions ?? [];

  container.innerHTML = `
    <div class="page-box">
      <h1>${heading}</h1>
      <form id="report-form" novalidate>
        <label for="title">اسم الغرض</label>
        <input id="title" name="title" value="${esc(r.title)}" placeholder="مثال: محفظة جلدية سوداء">
        <div class="row">
          <div><label for="category">الفئة</label><select id="category" name="category">${optionsHtml(CATEGORIES, r.category)}</select></div>
          <div><label for="color">اللون</label><select id="color" name="color">${optionsHtml(COLORS, r.color)}</select></div>
        </div>
        <div class="row">
          <div><label for="governorate">المحافظة</label><select id="governorate" name="governorate">${optionsHtml(GOVERNORATES, r.governorate)}</select></div>
          <div><label for="place">المنطقة / الحي</label><input id="place" name="place" value="${esc(r.place)}"></div>
        </div>
        <div class="row">
          <div><label for="date">${isFound ? "تاريخ العثور" : "تاريخ الفقد"}</label><input id="date" type="date" name="date" max="${todayISO()}" value="${esc(r.date ?? todayISO())}"></div>
          <div><label for="image">صورة الغرض</label><input id="image" type="file" name="image" accept="image/*"></div>
        </div>
        <label for="description">وصف تفصيلي</label>
        <textarea id="description" name="description" rows="3">${esc(r.description)}</textarea>
        ${isFound ? `
          <div class="note">🔐 ضع سؤالين يجيب عنهما صاحب الغرض الحقيقي، ولا تذكر إجابتهما في الوصف.</div>
          <label for="q1">سؤال التحقق ١</label><input id="q1" name="q1" value="${esc(q[0])}">
          <label for="q2">سؤال التحقق ٢ <span class="muted">(اختياري)</span></label><input id="q2" name="q2" value="${esc(q[1])}">` : ""}
        <div class="err" id="form-error" role="alert"></div>
        <button class="btn full" type="submit">${report ? "حفظ التعديلات" : "نشر البلاغ"}</button>
        <a class="btn line full center" href="${esc(cancelHref)}">إلغاء</a>
      </form>
    </div>`;

  const form = $("#report-form", container);
  const error = $("#form-error", container);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = (name) => (form.elements[name]?.value ?? "").trim();
    if (!v("title") || !v("place")) { error.textContent = "أدخل اسم الغرض والمنطقة."; return; }
    if (isFound && !v("q1")) { error.textContent = "أضف سؤال تحقق واحداً على الأقل."; return; }
    error.textContent = "";

    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      const data = {
        kind, title: v("title"), category: v("category"), color: v("color"),
        governorate: v("governorate"), place: v("place"), date: v("date"), description: v("description"),
      };
      if (isFound) data.verificationQuestions = [v("q1"), v("q2")].filter(Boolean);
      const file = form.elements.image.files[0];
      if (file) data.image = await readImage(file);
      await onSubmit(data);
    } catch (err) {
      error.textContent = err.message;
      button.disabled = false;
    }
  });
}

Object.assign(App, { showToast, showModal, renderStub, renderHeader, thumbHtml, reportTagsHtml, reportCard, optionsHtml, renderReportForm });
})(window.App = window.App || {});
