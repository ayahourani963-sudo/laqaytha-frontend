// auth-service.js — إنشاء الحساب وتسجيل الدخول
(function (App) {
"use strict";

const { CONFIG } = App;
const { api } = App;
const mock = App.mocks.auth;

/** data: { firstName, lastName, phone, email, governorate, password } */
function signUp(data) {
  return CONFIG.USE_MOCKS ? mock.signUp(data) : api.post("/auth/signup", data);
}

/** credentials: { identifier (هاتف أو بريد), password } */
function logIn(credentials) {
  return CONFIG.USE_MOCKS ? mock.logIn(credentials) : api.post("/auth/login", credentials);
}
// كلاهما يُرجع: { token, user: { id, firstName, lastName, ... } }

Object.assign(App, { signUp, logIn });
})(window.App = window.App || {});
