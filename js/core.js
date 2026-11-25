// core.js — أدوات DOM / state / constants
(function (App) {
"use strict";

/* ---------- DOM ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** تهريب النص قبل وضعه داخل innerHTML (حماية من XSS) */
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/* ---------- Constants ---------- */
const GOVERNORATES = [
  "دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس",
  "إدلب", "درعا", "السويداء", "القنيطرة", "دير الزور", "الرقة", "الحسكة",
];

const NOTIFICATION_TYPES = {
  match:   { icon: "🎯", label: "المطابقات" },
  comment: { icon: "💬", label: "التعليقات" },
  msg:     { icon: "✉️", label: "الرسائل" },
};

/* ---------- Constants: البلاغات ---------- */
const CATEGORY_ICONS = {
  "محفظة": "👛", "مفاتيح": "🔑", "هاتف": "📱", "حقيبة": "🎒",
  "وثائق": "🪪", "حيوان أليف": "🐾", "أخرى": "📦",
};
const CATEGORIES = Object.keys(CATEGORY_ICONS);
const COLORS = ["أسود", "أبيض", "أزرق", "أحمر", "أخضر", "بني", "رمادي", "أخرى"];
const REPORT_KIND = { lost: "مفقود", found: "موجود" };
const REPORT_STATUS = { open: "مفتوح", solved: "تم الحل", closed: "مغلق" };
const CLAIM_STATUS = { pending: "قيد المراجعة", accepted: "مقبول", rejected: "مرفوض" };

const todayISO = () => new Date().toISOString().slice(0, 10);
/** رقم البلاغ الظاهر للمستخدم */
const reportNumber = (id) => 4800 + Number(id);

/* ---------- Events (تواصل بين الأجزاء بدون ربط مباشر) ---------- */
const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));
const on = (name, handler) => document.addEventListener(name, handler);

/* ---------- Navigation ---------- */
const navigate = (path) => { location.hash = "#" + path; };

/* ---------- State: المستخدم الحالي ---------- */
const USER_KEY = "laqaytha.session";
let session = readSession();

function readSession() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || null; } catch { return null; }
}

const getSession = () => session;            // { token, user } أو null
const isLoggedIn = () => !!session;

function setSession(data) {
  session = data;
  try { localStorage.setItem(USER_KEY, JSON.stringify(data)); } catch { /* التخزين غير متاح */ }
  emit("auth:changed");
}

function clearSession() {
  session = null;
  try { localStorage.removeItem(USER_KEY); } catch { /* التخزين غير متاح */ }
  emit("auth:changed");
}

/* ---------- Validation ---------- */
const isSyrianPhone = (v) => /^09\d{8}$/.test(v);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

Object.assign(App, { $, $$, esc, GOVERNORATES, NOTIFICATION_TYPES, emit, on, navigate, getSession, isLoggedIn, setSession, clearSession, isSyrianPhone, isEmail, CATEGORY_ICONS, CATEGORIES, COLORS, REPORT_KIND, REPORT_STATUS, CLAIM_STATUS, todayISO, reportNumber });
})(window.App = window.App || {});
