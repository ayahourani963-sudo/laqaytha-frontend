// chat.mock.js — بيانات وهمية للمحادثات (الصفحة 16)
(function (App) {
"use strict";

const { mockResponse, mockError } = App;
const items = App.mocks.items;

let seq = 2;
let conversations = [
  {
    id: 1, reportId: 1, reportTitle: "محفظة جلدية سوداء", withName: "سامر حداد",
    messages: [
      { id: 1, mine: false, text: "مرحباً، أعتقد أن هذا الغرض لي." },
      { id: 2, mine: true, text: "أهلاً، تم قبول طلبك. متى يناسبك الاستلام؟" },
    ],
  },
];

const find = (id) => conversations.find((c) => c.id === Number(id));

const list = () => mockResponse(conversations.map(({ messages, ...c }) => ({
  ...c, lastMessage: messages.at(-1)?.text ?? "",
})));

const get = (id) => { const c = find(id); return c ? mockResponse(c) : mockError("المحادثة غير موجودة.", 404); };

function send(id, text) {
  const c = find(id);
  if (!c) return mockError("المحادثة غير موجودة.", 404);
  c.messages.push({ id: ++seq, mine: true, text });
  // ردّ تلقائي للتجربة فقط
  setTimeout(() => c.messages.push({ id: ++seq, mine: false, text: "شكراً لك، سأتواصل معك قريباً." }), 1200);
  return mockResponse({ ok: true });
}

/** يفتح محادثة حول بلاغ مع شخص، أو يُرجع الموجودة */
function open(reportId, withName) {
  const name = withName || "صاحب البلاغ";
  let c = conversations.find((x) => x.reportId === Number(reportId) && x.withName === name);
  if (!c) {
    c = { id: ++seq, reportId: Number(reportId), reportTitle: items.peek(reportId)?.title ?? "", withName: name, messages: [] };
    conversations.unshift(c);
  }
  return mockResponse({ id: c.id });
}

(App.mocks = App.mocks || {}).chat = { list, get, send, open };
})(window.App = window.App || {});
