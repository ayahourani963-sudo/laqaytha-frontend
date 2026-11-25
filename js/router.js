// router.js — المسارات والتنقل (hash routing: #/path)
(function (App) {
"use strict";

const { CONFIG } = App;
const { isLoggedIn, navigate } = App;
const signup = App.views.signup;
const login = App.views.login;
const notifications = App.views.notifications;
const verification = App.views.verification;
const reports = App.views.reports;
const createLost = App.views.createLost;
const createFound = App.views.createFound;
const reportDetails = App.views.reportDetails;
const editReport = App.views.editReport;
const closeReport = App.views.closeReport;
const updateStatus = App.views.updateStatus;
const matchResults = App.views.matchResults;
const search = App.views.search;
const support = App.views.support;
const claims = App.views.claims;
const chat = App.views.chat;

/* جدول المسارات: الأخص أولاً ثم المسارات ذات المتغيّرات (:id)
   كل view تسجّل نفسها في App.views بالدالتين:  title  و  render(container, params)
   وقد تُرجع render دالة تنظيف تُستدعى عند مغادرة الصفحة. */
const routes = [
  { path: "/signup", view: signup, public: true },                // 01
  { path: "/login", view: login, public: true },                  // 02
  { path: "/notifications", view: notifications },                // 03
  { path: "/verification/:id", view: verification },              // 04
  { path: "/reports", view: reports },                            // 05
  { path: "/reports/new-lost", view: createLost },                // 06
  { path: "/reports/new-found", view: createFound },              // 07
  { path: "/reports/:id", view: reportDetails },                  // 08
  { path: "/reports/:id/edit", view: editReport },                // 09
  { path: "/reports/:id/close", view: closeReport },              // 10
  { path: "/reports/:id/status", view: updateStatus },            // 11
  { path: "/reports/:id/matches", view: matchResults },           // 12
  { path: "/search", view: search },                              // 13
  { path: "/support", view: support },                            // 14
  { path: "/claims", view: claims },                              // 15 (list)
  { path: "/claims/:id", view: claims },                          // 15 (details)
  { path: "/chat", view: chat },                                  // 16 (list)
  { path: "/chat/:id", view: chat },                              // 16 (conversation)
];

function match(pattern, path) {
  const p = pattern.split("/");
  const s = path.split("/");
  if (p.length !== s.length) return null;
  const params = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(":")) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

function startRouter(container) {
  let cleanup = null;

  async function resolve() {
    const path = (location.hash.slice(1) || "/").replace(/\/+$/, "") || "/";

    if (path === "/") return navigate(isLoggedIn() ? "/reports" : "/login");

    for (const route of routes) {
      const params = match(route.path, path);
      if (!params) continue;

      if (CONFIG.REQUIRE_AUTH && !route.public && !isLoggedIn()) return navigate("/login");

      if (typeof cleanup === "function") cleanup();
      cleanup = null;
      const page = document.createElement("div");   // عنصر جديد لكل صفحة: لا تتراكم مستمعات الأحداث
      container.replaceChildren(page);
      document.title = `${route.view.title} | لقيتها`;
      window.scrollTo(0, 0);
      try {
        cleanup = await route.view.render(page, params);
      } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="card">حدث خطأ أثناء عرض الصفحة.</div>`;
      }
      return;
    }
    container.innerHTML = `<div class="card">الصفحة غير موجودة. <a href="#/">العودة للرئيسية</a></div>`;
  }

  window.addEventListener("hashchange", resolve);
  resolve();
}

Object.assign(App, { startRouter });
})(window.App = window.App || {});
