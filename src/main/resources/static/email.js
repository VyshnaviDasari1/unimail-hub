// static/email.js

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("backBtn")?.addEventListener("click", () => {
    window.location.href = "/inbox.html";
  });

  document.getElementById("starBtn")?.addEventListener("click", toggleStar);
  document.getElementById("importantBtn")?.addEventListener("click", toggleImportant);
  document.getElementById("deleteBtn")?.addEventListener("click", deleteEmail);

  loadEmail();
});

let currentEmail = null;

function getId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadEmail() {
  const id = getId();
  if (!id) {
    alert("Missing email id");
    return;
  }

  currentEmail = await api(`/api/emails/${id}`);

  // ✅ Mark as read ONLY when email is opened (real-world behavior)
  if (!currentEmail.read) {
    currentEmail = await api(`/api/emails/${id}/read`, {
      method: "PUT",
    });
  }

  render();
}

function render() {
  document.getElementById("subject").textContent =
    currentEmail.subject || "(no subject)";
  document.getElementById("sender").textContent =
    currentEmail.sender || "(unknown)";
  document.getElementById("receivedAt").textContent =
    fmtDate(currentEmail.receivedAt);
  document.getElementById("body").textContent =
    currentEmail.body || "";

  document.getElementById("starBtn").textContent =
    currentEmail.starred ? "⭐ Starred" : "⭐ Star";

  document.getElementById("importantBtn").textContent =
    currentEmail.important
      ? "🚨 Marked Important"
      : "🚨 Mark Important";
}

async function toggleStar() {
  const updated = await api(
    `/api/emails/${currentEmail.id}/star`,
    { method: "PUT" }
  );
  currentEmail = updated;
  render();
}

async function toggleImportant() {
  const updated = await api(
    `/api/emails/${currentEmail.id}/important`,
    { method: "PUT" }
  );
  currentEmail = updated;
  render();
}

async function deleteEmail() {
  if (!confirm("Delete this email?")) return;

  await api(`/api/emails/${currentEmail.id}`, {
    method: "DELETE",
  });

  window.location.href = "/inbox.html";
}
document.addEventListener("DOMContentLoaded", () => {
  loadAlertBadge();
});
if (!currentEmail.read) {
  currentEmail = await api(`/api/emails/${id}/read`, { method: "PUT" });
  loadAlertBadge(); // 🔴 update badge
}
showToast("Marked as important 🚨", "alert");
await api(`/api/emails/${id}/read`, { method: "PUT" });
loadAlertBadge();
checkForNewAlerts();
