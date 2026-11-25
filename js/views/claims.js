// claims.js — 15: إدارة طلبات المطالبة بالملكية (قائمة + تفاصيل)
//   /claims      → البلاغات التي عليها طلبات
//   /claims/:id  → طلبات بلاغ محدد، مع قبولها أو رفضها
(function (App) {
"use strict";

const { $, esc, navigate, CLAIM_STATUS } = App;
const { showToast, reportTagsHtml } = App;
const { getClaimsOverview, getReportClaims, decideClaim, openConversation } = App;

const title = "طلبات المطالبة";

async function render(container, params) {
  return params.id ? renderDetails(container, params.id) : renderList(container);
}

/* ---------- القائمة ---------- */
async function renderList(container) {
  container.innerHTML = `<h2 class="page-title">🙋 طلبات المطالبة بالملكية</h2><div id="list"><p class="muted">جارٍ التحميل…</p></div>`;
  const list = $("#list", container);
  try {
    const rows = await getClaimsOverview();
    list.innerHTML = rows.map(({ report, total, pending }) => `
      <a class="card claim-row" href="#/claims/${report.id}">
        <div class="grow">
          ${reportTagsHtml(report)}
          <h3>${esc(report.title)}</h3>
          <div class="muted">${total} طلب · ${pending} قيد المراجعة</div>
        </div>
        <span class="muted">←</span>
      </a>`).join("") || `<div class="card muted">لا توجد طلبات مطالبة على بلاغاتك بعد.</div>`;
  } catch (err) {
    list.innerHTML = `<div class="card err">${esc(err.message)}</div>`;
  }
}

/* ---------- التفاصيل ---------- */
async function renderDetails(container, reportId) {
  container.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;

  let data;
  try {
    data = await getReportClaims(reportId);
  } catch (err) {
    container.innerHTML = `<div class="card err">${esc(err.message)} <a href="#/claims">العودة</a></div>`;
    return;
  }
  const { report } = data;
  let claims = data.claims;

  function draw() {
    container.innerHTML = `
      <div class="page-box">
        <a href="#/claims" class="muted">→ رجوع للقائمة</a>
        <h1>🙋 طلبات المطالبة بالملكية</h1>
        <div class="muted">${esc(report.title)}</div>
        ${claims.map(claimHtml).join("") || `<p class="muted">لا توجد طلبات بعد.</p>`}
      </div>`;
  }

  function claimHtml(c) {
    const actions = c.status === "pending"
      ? `<button class="btn" data-claim="${c.id}" data-decision="accepted">✅ قبول</button>
         <button class="btn line" data-claim="${c.id}" data-decision="rejected">❌ رفض</button>`
      : c.status === "accepted"
        ? `<button class="btn" data-chat="${esc(c.name)}">💬 فتح المحادثة</button>` : "";
    return `
      <div class="card claim-card">
        <div class="cinfo">
          <div class="ic">👤</div>
          <b class="grow">${esc(c.name)}</b>
          <span class="tag st ${c.status === "accepted" ? "solved" : ""}">${esc(CLAIM_STATUS[c.status])}</span>
        </div>
        <details>
          <summary>عرض الإجابات</summary>
          ${report.verificationQuestions.map((q, j) =>
            `<div class="q"><b>${esc(q)}</b><div>${esc(c.answers[j] || "—")}</div></div>`).join("")}
        </details>
        ${actions}
      </div>`;
  }

  container.addEventListener("click", async (e) => {
    const decisionBtn = e.target.closest("[data-decision]");
    const chatBtn = e.target.closest("[data-chat]");
    try {
      if (decisionBtn) {
        const decision = decisionBtn.dataset.decision;
        const updated = await decideClaim(reportId, Number(decisionBtn.dataset.claim), decision);
        claims = claims.map((c) => (c.id === updated.id ? updated : c));
        showToast(decision === "accepted" ? "تم القبول، يمكنك مراسلته الآن" : "تم رفض الطلب");
        draw();
      } else if (chatBtn) {
        const { id } = await openConversation(reportId, chatBtn.dataset.chat);
        navigate(`/chat/${id}`);
      }
    } catch (err) {
      showToast(err.message);
    }
  });

  draw();
}

(App.views = App.views || {}).claims = { title, render };
})(window.App = window.App || {});
