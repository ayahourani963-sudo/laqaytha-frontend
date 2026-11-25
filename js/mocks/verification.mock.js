// verification.mock.js — بيانات وهمية لأسئلة التحقق (الصفحة 04)
(function (App) {
"use strict";

const { mockResponse, mockError } = App;
const { CATEGORY_ICONS, reportNumber } = App;
const items = App.mocks.items;

function getVerification(reportId) {
  const r = items.peek(reportId);
  if (!r) return mockError("البلاغ غير موجود.", 404);
  return mockResponse({
    report: {
      id: r.id, number: reportNumber(r.id), title: r.title, kind: r.kind,
      icon: CATEGORY_ICONS[r.category] ?? "📦", place: `${r.governorate} – ${r.place}`,
    },
    questions: [
      ...r.verificationQuestions.map((text, i) => ({ id: "q" + (i + 1), text, type: "textarea", required: true })),
      { id: "where", text: "أين ومتى فقدتها؟", type: "input", required: false, placeholder: "مثال: سوق الحميدية، الخميس مساءً" },
    ],
  });
}

const submitAnswers = () => mockResponse({ ok: true });

(App.mocks = App.mocks || {}).verification = { getVerification, submitAnswers };
})(window.App = window.App || {});
