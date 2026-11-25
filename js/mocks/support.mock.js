// support.mock.js — بيانات وهمية للدعم الفني (الصفحة 14)
(function (App) {
"use strict";

const { mockResponse } = App;

const sendProblem = () => mockResponse({ ticketId: 1000 + Math.floor(Math.random() * 9000) });

(App.mocks = App.mocks || {}).support = { sendProblem };
})(window.App = window.App || {});
