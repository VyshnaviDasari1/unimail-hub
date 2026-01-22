// static/inbox.js
requireAuth();

let currentMode = "inbox"; // inbox | unread | starred | important | search
let allItems = [];
let page = 1;
const pageSize = 10;

const $list = document.getElementById("emailList");
const $title = document.getElementById("listTitle");
const $search = document.getElementById("searchBox");
const $empty = document.getElementById("emptyState");
const $pageInfo = document.getElementById("pageInfo");

document.getElementById("logoutBtn")?.addEventListener("click", logout);

document.getElementById("btnUnread")?.addEventListener("click", (e) => { e.preventDefault(); loadMode("unread"); });
document.getElementById("btnStarred")?.addEventListener("click", (e) => { e.preventDefault(); loadMode("starred"); });
document.getElementById("btnImportant")?.addEventListener("click", (e) => { e.preventDefault(); loadMode("important"); });

document.getElementById("prevPage")?.addEventListener("click", () => {
  if (page > 1) { page--; renderPage(); }
});
document.getElementById("nextPage")?.addEventListener("click", () => {
  const maxPage = Math.max(1, Math.ceil(allItems.length / pageSize));
  if (page < maxPage) { page++; renderPage(); }
});

const onSearch = debounce(async () => {
  const q = $search.value.trim();
  if (!q) return loadMode("inbox");

  currentMode = "search";
  $title.textContent = `Search: "${q}"`;
  page = 1;

  allItems = await api(`/api/emails/search?q=${encodeURIComponent(q)}`);
  sortEmails();
  renderPage();
}, 300);

$search?.addEventListener("input", onSearch);

window.addEventListener("DOMContentLoaded", () => loadMode("inbox"));

async function loadMode(mode) {
  currentMode = mode;
  page = 1;

  if ($search) $search.value = "";

  if (mode === "inbox") {
    $title.textContent = "Inbox";
    allItems = await api("/api/emails/inbox");
  } else if (mode === "unread") {
    $title.textContent = "Unread";
    allItems = await api("/api/emails/unread");
  } else if (mode === "starred") {
    $title.textContent = "Priority ⭐";
    allItems = await api("/api/emails/starred/inbox");
  } else if (mode === "important") {
    $title.textContent = "Alerts 🚨";
    allItems = await api("/api/emails/important/inbox");
  }

  sortEmails();
  renderPage();
  loadAlertBadge();
}

function sortEmails() {
  allItems.sort((a, b) => new Date(b.receivedAt || 0) - new Date(a.receivedAt || 0));
}

function renderPage() {
  const total = allItems.length;
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  page = Math.min(page, maxPage);

  const start = (page - 1) * pageSize;
  const items = allItems.slice(start, start + pageSize);

  $pageInfo.textContent = `${page} / ${maxPage}`;
  $list.innerHTML = "";
  $empty.style.display = items.length ? "none" : "block";

  for (const e of items) $list.appendChild(renderRow(e));
}

function renderRow(e) {
  const li = document.createElement("li");
  li.className = `email-row ${e.read ? "read" : "unread"}`;

  li.innerHTML = `
    <div class="row-left">
      <button class="iconbtn" title="Star" data-act="star">${e.starred ? "⭐" : "☆"}</button>
      <button class="iconbtn" title="Alert" data-act="important">${e.important ? "🚨" : "⚪"}</button>
    </div>

    <div class="row-main" data-act="open">
      <div class="sender">${escapeHtml(e.sender || "(unknown)")}</div>
      <div class="subject">${escapeHtml(e.subject || "(no subject)")}</div>
      <div class="snippet">${escapeHtml((e.body || "").slice(0, 90))}</div>
    </div>

    <div class="row-right">
      <div class="date">${escapeHtml(fmtDate(e.receivedAt))}</div>
      <button class="iconbtn danger" title="Delete" data-act="delete">🗑️</button>
    </div>
  `;

  li.addEventListener("click", async (ev) => {
    const act = ev.target?.dataset?.act || ev.target?.closest("[data-act]")?.dataset?.act;
    if (!act) return;

    try {
      if (act === "open") {
        if (!e.read) {
          const updated = await api(`/api/emails/${e.id}/read`, { method: "PUT" });
          patchLocal(updated);
          loadAlertBadge();
        }
        window.location.href = `/email.html?id=${encodeURIComponent(e.id)}`;
      }

      if (act === "star") {
        ev.preventDefault(); ev.stopPropagation();
        const updated = await api(`/api/emails/${e.id}/star`, { method: "PUT" });
        patchLocal(updated);
        renderPage();
      }

      if (act === "important") {
        ev.preventDefault(); ev.stopPropagation();
        const updated = await api(`/api/emails/${e.id}/important`, { method: "PUT" });
        patchLocal(updated);
        loadAlertBadge();
        renderPage();
      }

      if (act === "delete") {
        ev.preventDefault(); ev.stopPropagation();
        await api(`/api/emails/${e.id}`, { method: "DELETE" });
        allItems = allItems.filter(x => x.id !== e.id);
        loadAlertBadge();
        renderPage();
      }
    } catch (err) {
      alert(err.message);
    }
  });

  return li;
}

function patchLocal(updated) {
  const idx = allItems.findIndex(x => x.id === updated.id);
  if (idx >= 0) allItems[idx] = updated;
}

/** ✉️ Compose modal wiring */
const modal = document.getElementById("composeModal");
document.getElementById("composeFab")?.addEventListener("click", () => modal.classList.remove("hidden"));
document.getElementById("closeCompose")?.addEventListener("click", () => modal.classList.add("hidden"));

document.getElementById("sendBtn")?.addEventListener("click", async () => {
  const to = document.getElementById("toEmail").value.trim();
  const subject = document.getElementById("subjectEmail").value.trim();
  const body = document.getElementById("bodyEmail").value.trim();

  if (!to) return alert("To is required");

  // NOTE: this requires backend POST /api/emails
  const created = await api("/api/emails", {
    method: "POST",
    body: {
      sender: getUserEmail(),
      receiver: to,
      subject,
      body
    }
  });

  modal.classList.add("hidden");
  if (typeof showToast === "function") showToast("Email sent ✅", "success");

  // If file selected: upload it (requires backend)
  const file = document.getElementById("attachFile").files?.[0];
  if (file) {
    try {
      const form = new FormData();
      form.append("file", file);

      await fetch(`${API_BASE}/api/emails/${created.id}/attachments`, {
        method: "POST",
        body: form
      });
      if (typeof showToast === "function") showToast("Attachment uploaded 📎", "info");
    } catch {
      if (typeof showToast === "function") showToast("Attachment upload failed", "alert");
    }
  }

  // refresh inbox
  loadMode("inbox");
});
