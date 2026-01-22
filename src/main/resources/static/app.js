// static/app.js
const API_BASE = "http://localhost:8080";

function requireAuth() {
  const user = localStorage.getItem("userEmail");
  if (!user) window.location.href = "/login.html";
}

function getUserEmail() {
  return localStorage.getItem("userEmail") || "";
}

async function api(path, { method = "GET", body, headers = {} } = {}) {
  const opts = { method, headers: { ...headers } };

  if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) ? (data.message || data.error) : `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function fmtDate(dt) {
  if (!dt) return "";
  try { return new Date(dt).toLocaleString(); }
  catch { return dt; }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function debounce(fn, wait = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/** 🔴 Badge count (FAST) */
async function loadAlertBadge() {
  try {
    const badge = document.getElementById("alertBadge");
    if (!badge) return;

    const count = await api("/api/emails/alerts/count");

    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  } catch (err) {
    console.error("Alert badge failed", err);
  }
}

/** 🔔 Polling + Toast when count increases */
let __lastAlertCount = null;
let __pollingStarted = false;

function startAlertPolling(intervalMs = 8000) {
  if (__pollingStarted) return;
  __pollingStarted = true;

  const tick = async () => {
    try {
      const count = await api("/api/emails/alerts/count");
      await loadAlertBadge();

      if (__lastAlertCount !== null && count > __lastAlertCount) {
        if (typeof showToast === "function") {
          showToast("New alert received 🚨", "alert");
        }
      }
      __lastAlertCount = count;
    } catch (e) {
      // keep silent; don’t spam users
    }
  };

  tick();
  setInterval(tick, intervalMs);
}
