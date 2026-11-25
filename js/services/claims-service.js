// claims-service.js — المطالبات والتحقق من الملكية
// الصفحة 04 (المجموعة 1): getVerification و submitAnswers
// الصفحة 15 (المجموعة 5): getClaimsOverview و getReportClaims و decideClaim
(function (App) {
"use strict";

const { CONFIG, api } = App;
const verification = App.mocks.verification;
const claims = App.mocks.claims;

/** يُرجع: { report: { id, number, title, icon, place, kind }, questions: [...] } */
const getVerification = (reportId) =>
  CONFIG.USE_MOCKS ? verification.getVerification(reportId) : api.get(`/reports/${reportId}/verification`);

/** answers: { [questionId]: "الإجابة" } */
const submitAnswers = (reportId, answers) =>
  CONFIG.USE_MOCKS
    ? verification.submitAnswers(reportId, answers)
    : api.post(`/reports/${reportId}/verification`, { answers });

/** بلاغات المستخدم التي عليها طلبات: [{ report, total, pending }] */
const getClaimsOverview = () =>
  CONFIG.USE_MOCKS ? claims.overview() : api.get("/claims");

/** يُرجع: { report, claims: [{ id, name, answers, status }] } */
const getReportClaims = (reportId) =>
  CONFIG.USE_MOCKS ? claims.forReport(reportId) : api.get(`/reports/${reportId}/claims`);

/** decision: "accepted" | "rejected" */
const decideClaim = (reportId, claimId, decision) =>
  CONFIG.USE_MOCKS
    ? claims.decide(reportId, claimId, decision)
    : api.patch(`/reports/${reportId}/claims/${claimId}`, { decision });

Object.assign(App, { getVerification, submitAnswers, getClaimsOverview, getReportClaims, decideClaim });
})(window.App = window.App || {});
