// chat-service.js — المحادثات (الصفحة 16)
(function (App) {
"use strict";

const { CONFIG, api } = App;
const mock = App.mocks.chat;

/** [{ id, reportId, reportTitle, withName, lastMessage }] */
const getConversations = () =>
  CONFIG.USE_MOCKS ? mock.list() : api.get("/conversations");

/** { id, reportTitle, withName, messages: [{ id, mine, text }] } */
const getConversation = (id) =>
  CONFIG.USE_MOCKS ? mock.get(id) : api.get(`/conversations/${id}`);

const sendMessage = (id, text) =>
  CONFIG.USE_MOCKS ? mock.send(id, text) : api.post(`/conversations/${id}/messages`, { text });

/** يفتح (أو يُرجع) محادثة حول بلاغ مع شخص: { id } */
const openConversation = (reportId, withName = "") =>
  CONFIG.USE_MOCKS ? mock.open(reportId, withName) : api.post("/conversations", { reportId, withName });

Object.assign(App, { getConversations, getConversation, sendMessage, openConversation });
})(window.App = window.App || {});
