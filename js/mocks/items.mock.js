// items.mock.js — بيانات وهمية للبلاغات والمطابقة والبحث (تُحفظ في الذاكرة فقط)
(function (App) {
"use strict";

const { mockResponse, mockError } = App;
const { GOVERNORATES, todayISO } = App;

// المحافظات المجاورة (فهارس GOVERNORATES) — تُستعمل في المطابقة وتوسيع نطاق البحث
const NEIGHBORS = {
  0: [1, 10], 1: [0, 8], 2: [7, 12], 3: [4, 6], 4: [3, 7], 5: [6, 7], 6: [5, 3],
  7: [2, 4, 5], 8: [9, 1], 9: [8], 10: [0, 8], 11: [12, 13], 12: [2, 11], 13: [11, 12],
};
const neighborNames = (gov) => (NEIGHBORS[GOVERNORATES.indexOf(gov)] ?? []).map((i) => GOVERNORATES[i]);

let seq = 0;
const DEFAULT_QUESTIONS = ["ما العلامة المميزة للغرض؟", "ما الذي كان بداخله؟"];

function make(kind, title, category, color, governorate, place, date, description, isOwner, questions) {
  return {
    id: ++seq, kind, title, category, color, governorate, place, date, description, isOwner,
    verificationQuestions: questions ?? DEFAULT_QUESTIONS, status: "open", updates: [], image: null,
  };
}

let reports = [
  make("lost",  "محفظة جلدية سوداء", "محفظة", "أسود", "دمشق", "المزة", "2026-10-29", "ضاعت قرب موقف الباصات، فيها بطاقات وأوراق شخصية.", true),
  make("found", "محفظة جلدية سوداء", "محفظة", "أسود", "دمشق", "المزة", "2026-10-30", "وُجدت قرب موقف الباصات بحالة جيدة.", false),
  make("found", "مفاتيح سيارة", "مفاتيح", "رمادي", "حلب", "الفرقان", "2026-10-31", "حلقة مفاتيح مع ميدالية صغيرة.", true, ["ما ماركة السيارة؟", "كم عدد المفاتيح في الحلقة؟"]),
  make("lost",  "هاتف سامسونج", "هاتف", "أسود", "اللاذقية", "الكورنيش", "2026-10-28", "هاتف بغلاف شفاف.", false),
  make("found", "حقيبة مدرسية", "حقيبة", "أزرق", "حمص", "الحمرا", "2026-10-30", "حقيبة فيها دفاتر وأقلام.", false),
  make("lost",  "قطة شيرازي بيضاء", "حيوان أليف", "أبيض", "دمشق", "باب توما", "2026-10-31", "ترتدي طوقاً أحمر.", false),
  make("found", "هاتف سامسونج", "هاتف", "أسود", "اللاذقية", "الكورنيش", "2026-10-29", "وُجد قرب الكورنيش بغلاف شفاف.", false),
];
// الأحدث أولاً
reports.reverse();

const find = (id) => reports.find((r) => r.id === Number(id));
const notFound = () => mockError("البلاغ غير موجود.", 404);

/** نسبة التطابق بين بلاغين (0–100) */
function score(a, b) {
  let s = 0;
  if (a.category === b.category) s += 40;
  if (a.color === b.color) s += 20;
  if (a.governorate === b.governorate) s += 25;
  else if (neighborNames(a.governorate).includes(b.governorate)) s += 10;
  if (a.title.split(" ").some((w) => w.length > 2 && b.title.includes(w))) s += 15;
  return s;
}

const list = (kind = "all") => mockResponse(reports.filter((r) => kind === "all" || r.kind === kind));

const get = (id) => { const r = find(id); return r ? mockResponse(r) : notFound(); };

function create(data) {
  const report = {
    verificationQuestions: DEFAULT_QUESTIONS, image: null, ...data,
    id: ++seq, isOwner: true, status: "open", updates: [],
  };
  reports.unshift(report);
  return mockResponse(report);
}

function update(id, data) {
  const r = find(id);
  if (!r) return notFound();
  const { image, ...rest } = data;
  Object.assign(r, rest);
  if (image) r.image = image;
  return mockResponse(r);
}

function addUpdate(id, text) {
  const r = find(id);
  if (!r) return notFound();
  r.updates.unshift({ date: todayISO(), text });
  return mockResponse(r);
}

function setStatus(id, { status, note }) {
  const r = find(id);
  if (!r) return notFound();
  r.status = status;
  if (note) r.updates.unshift({ date: todayISO(), text: "ملاحظة الإغلاق: " + note });
  return mockResponse(r);
}

function matches(id) {
  const r = find(id);
  if (!r) return notFound();
  const result = reports
    .filter((x) => x.kind !== r.kind && x.status === "open")
    .map((x) => ({ report: x, score: score(r, x) }))
    .filter((m) => m.score >= 40)
    .sort((a, b) => b.score - a.score);
  return mockResponse(result);
}

/** filters: { q, kind, category, color, governorate, from, expand, relax } */
function search({ q = "", kind = "", category = "", color = "", governorate = "", from = "", expand = false, relax = false } = {}) {
  const govs = governorate ? [governorate, ...(expand ? neighborNames(governorate) : [])] : [];
  const result = reports.filter((r) => {
    const criteria = [];
    if (category) criteria.push(r.category === category);
    if (color) criteria.push(r.color === color);
    if (governorate) criteria.push(govs.includes(r.governorate));
    if (from) criteria.push(r.date >= from);
    const ok = !criteria.length || (relax ? criteria.some(Boolean) : criteria.every(Boolean));
    return ok && (!kind || r.kind === kind) && (!q || (r.title + " " + r.description).includes(q));
  });
  return mockResponse(result);
}

/** وصول متزامن لبيانات بلاغ — للاستعمال من mocks أخرى فقط */
const peek = (id) => find(id) ?? null;

(App.mocks = App.mocks || {}).items = { list, get, create, update, addUpdate, setStatus, matches, search, peek };
})(window.App = window.App || {});
