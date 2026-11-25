// api.js — طبقة HTTP المشتركة (كل الخدمات تمرّ من هنا)
(function (App) {
"use strict";

const { CONFIG } = App;
const { getSession } = App;

class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const session = getSession();
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;

  let res;
  try {
    res = await fetch(CONFIG.API_BASE_URL + path, {
      method, headers, body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("تعذّر الاتصال بالخادم. تحقق من الاتصال وحاول مجدداً.");
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(data?.message || "حدث خطأ غير متوقع.", res.status);
  return data;
}

const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};

/** يحاكي ردّ الخادم في وضع mocks (يُستعمل من js/mocks فقط) */
const mockResponse = (data) =>
  new Promise((resolve) =>
    setTimeout(() => resolve(structuredClone(data)), CONFIG.MOCK_DELAY_MS));

/** يحاكي خطأ من الخادم في وضع mocks */
const mockError = (message, status = 400) =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new ApiError(message, status)), CONFIG.MOCK_DELAY_MS));

Object.assign(App, { ApiError, api, mockResponse, mockError });
})(window.App = window.App || {});
