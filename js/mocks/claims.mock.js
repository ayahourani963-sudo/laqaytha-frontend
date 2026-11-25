// claims.mock.js — بيانات وهمية لطلبات المطالبة بالملكية (الصفحة 15)
(function (App) {
"use strict";

const { mockResponse, mockError } = App;
const items = App.mocks.items;

const sample = () => [
  { id: 1, name: "سامر حداد", answers: ["بطانة حمراء", "هوية وبطاقة بنكية"], status: "pending" },
  { id: 2, name: "لينا منصور", answers: ["لا أذكر بالضبط", "بطاقة فقط"], status: "pending" },
];

// reportId -> طلبات المطالبة على البلاغات التي يملكها المستخدم
const claimsByReport = { 1: sample(), 3: sample() };

/** البلاغات التي عليها طلبات مطالبة، مع العدّادات */
function overview() {
  const rows = Object.entries(claimsByReport)
    .map(([id, claims]) => ({
      report: items.peek(id), total: claims.length,
      pending: claims.filter((c) => c.status === "pending").length,
    }))
    .filter((row) => row.report);
  return mockResponse(rows);
}

function forReport(reportId) {
  const report = items.peek(reportId);
  if (!report) return mockError("البلاغ غير موجود.", 404);
  return mockResponse({ report, claims: claimsByReport[reportId] ?? [] });
}

/** decision: "accepted" | "rejected" */
function decide(reportId, claimId, decision) {
  const claim = (claimsByReport[reportId] ?? []).find((c) => c.id === Number(claimId));
  if (!claim) return mockError("الطلب غير موجود.", 404);
  claim.status = decision;
  return mockResponse(claim);
}

(App.mocks = App.mocks || {}).claims = { overview, forReport, decide };
})(window.App = window.App || {});
