// items-service.js — البلاغات والمطابقات والبحث (المجموعات 2 و3 و4)
(function (App) {
"use strict";

const { CONFIG, api } = App;
const mock = App.mocks.items;

/** kind: "all" | "lost" | "found" */
const getReports = (kind = "all") =>
  CONFIG.USE_MOCKS ? mock.list(kind) : api.get(`/reports?kind=${encodeURIComponent(kind)}`);

const getReport = (id) =>
  CONFIG.USE_MOCKS ? mock.get(id) : api.get(`/reports/${id}`);

/** data: { kind, title, category, color, governorate, place, date, description, image?, verificationQuestions? } */
const createReport = (data) =>
  CONFIG.USE_MOCKS ? mock.create(data) : api.post("/reports", data);

const updateReport = (id, data) =>
  CONFIG.USE_MOCKS ? mock.update(id, data) : api.put(`/reports/${id}`, data);

/** إضافة تفاصيل جديدة طرأت على البلاغ (الصفحة 11) */
const addReportUpdate = (id, text) =>
  CONFIG.USE_MOCKS ? mock.addUpdate(id, text) : api.post(`/reports/${id}/updates`, { text });

/** إغلاق البلاغ (الصفحة 10): status = "solved" | "closed" */
const setReportStatus = (id, status, note = "") =>
  CONFIG.USE_MOCKS ? mock.setStatus(id, { status, note }) : api.patch(`/reports/${id}/status`, { status, note });

/** يُرجع: [{ report, score }] مرتبة تنازلياً */
const getMatches = (id) =>
  CONFIG.USE_MOCKS ? mock.matches(id) : api.get(`/reports/${id}/matches`);

/** filters: { q, kind, category, color, governorate, from, expand, relax } */
function searchReports(filters = {}) {
  if (CONFIG.USE_MOCKS) return mock.search(filters);
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
  return api.get(`/reports/search?${params}`);
}

Object.assign(App, { getReports, getReport, createReport, updateReport, addReportUpdate, setReportStatus, getMatches, searchReports });
})(window.App = window.App || {});
