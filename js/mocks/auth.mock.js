// auth.mock.js — بيانات وهمية للمصادقة
(function (App) {
"use strict";

const { mockResponse } = App;

function signUp(data) {
  return mockResponse({
    token: "mock-token",
    user: {
      id: 1, firstName: data.firstName, lastName: data.lastName,
      phone: data.phone, email: data.email, governorate: data.governorate,
    },
  });
}

function logIn({ identifier }) {
  return mockResponse({
    token: "mock-token",
    user: { id: 1, firstName: "مستخدم", lastName: "تجريبي", identifier },
  });
}

(App.mocks = App.mocks || {}).auth = { signUp, logIn };
})(window.App = window.App || {});
