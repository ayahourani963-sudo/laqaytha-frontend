// chat.js — 16: مركز التواصل (قائمة المحادثات + المحادثة)
//   /chat      → قائمة المحادثات
//   /chat/:id  → محادثة محددة
(function (App) {
"use strict";

const { $, esc } = App;
const { showToast } = App;
const { getConversations, getConversation, sendMessage } = App;

const title = "مركز التواصل";

function render(container, params) {
  return params.id ? renderConversation(container, params.id) : renderList(container);
}

/* ---------- القائمة ---------- */
async function renderList(container) {
  container.innerHTML = `<h2 class="page-title">💬 المحادثات</h2><div id="list"><p class="muted">جارٍ التحميل…</p></div>`;
  const list = $("#list", container);
  try {
    const items = await getConversations();
    list.innerHTML = items.map((c) => `
      <a class="card claim-row" href="#/chat/${c.id}">
        <div class="ic">👤</div>
        <div class="grow">
          <b>${esc(c.withName)}</b>
          <div class="muted">حول: ${esc(c.reportTitle)}</div>
          <div class="muted clip">${esc(c.lastMessage) || "ابدأ المحادثة…"}</div>
        </div>
      </a>`).join("") || `<div class="card muted">لا توجد محادثات بعد. تبدأ المحادثة بعد قبول طلب المطالبة أو من صفحة البلاغ.</div>`;
  } catch (err) {
    list.innerHTML = `<div class="card err">${esc(err.message)}</div>`;
  }
}

/* ---------- المحادثة ---------- */
async function renderConversation(container, id) {
  container.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;

  let conversation;
  try {
    conversation = await getConversation(id);
  } catch (err) {
    container.innerHTML = `<div class="card err">${esc(err.message)} <a href="#/chat">العودة</a></div>`;
    return;
  }

  container.innerHTML = `
    <div class="page-box">
      <a href="#/chat" class="muted">→ كل المحادثات</a>
      <h1>💬 مركز التواصل</h1>
      <div class="muted">محادثة حول: <b>${esc(conversation.reportTitle)}</b> · مع ${esc(conversation.withName)}</div>
      <div class="chat" id="messages" aria-live="polite"></div>
      <form id="chat-form" class="chat-form">
        <input name="text" placeholder="اكتب رسالتك…" autocomplete="off">
        <button class="btn" type="submit">إرسال</button>
      </form>
    </div>`;

  const box = $("#messages", container);
  const form = $("#chat-form", container);
  let alive = true;
  let replyTimer;

  function draw(messages) {
    box.innerHTML = messages.map((m) => `<div class="m${m.mine ? " me" : ""}">${esc(m.text)}</div>`).join("") ||
      `<p class="muted">لا توجد رسائل بعد.</p>`;
    box.scrollTop = box.scrollHeight;
  }

  async function refresh() {
    try { draw((await getConversation(id)).messages); } catch { /* تجاهل أخطاء التحديث الصامت */ }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = form.text.value.trim();
    if (!text) return;
    form.text.value = "";
    try {
      await sendMessage(id, text);
      await refresh();
      // في الوضع الحقيقي يُستبدل هذا بـ polling أو WebSocket
      clearTimeout(replyTimer);
      replyTimer = setTimeout(() => { if (alive) refresh(); }, 1500);
    } catch (err) {
      showToast(err.message);
    }
  });

  draw(conversation.messages);
  return () => { alive = false; clearTimeout(replyTimer); };
}

(App.views = App.views || {}).chat = { title, render };
})(window.App = window.App || {});
