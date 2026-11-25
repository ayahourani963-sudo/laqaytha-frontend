// support-service.js — الدعم الفني (الصفحة 14)
(function (App) {
"use strict";

const { CONFIG, api } = App;
const mock = App.mocks.support;

/** data: { type, page, description } — يُرجع: { ticketId } */
const reportProblem = (data) =>
  CONFIG.USE_MOCKS ? mock.sendProblem(data) : api.post("/support/tickets", data);

Object.assign(App, { reportProblem });
})(window.App = window.App || {});
