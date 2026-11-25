// config.js — وضع التطوير + عنوان API
(function (App) {
"use strict";

const CONFIG = {
  // true  => الخدمات تستعمل js/mocks (تطوير معزول بدون خادم)
  // false => الخدمات ترسل طلبات حقيقية إلى API_BASE_URL
  USE_MOCKS: true,
  API_BASE_URL: "http://localhost:8000/api",
  MOCK_DELAY_MS: 250,
  // true => الصفحات (عدا الدخول وإنشاء الحساب) تتطلب تسجيل دخول
  REQUIRE_AUTH: true,
};

Object.assign(App, { CONFIG });
})(window.App = window.App || {});
