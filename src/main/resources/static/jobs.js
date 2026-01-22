// static/jobs.js
requireAuth();

let jobs = [];

async function loadJobs() {
  try {
    jobs = await api("/api/jobs");
    renderJobs(jobs);
  } catch (e) {
    console.error(e);
  }
}

function renderJobs(list) {
  const container = document.getElementById("jobList");
  const empty = document.getElementById("emptyJobs");

  container.innerHTML = "";

  if (!list.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  for (const j of list) {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <h3>${j.title}</h3>
      <div class="job-meta">${j.company} • ${j.location}</div>
      <div class="job-meta">${j.description || ""}</div>

      <div class="job-actions">
        <button class="btn" onclick="toggleSave(${j.id})">💾 Save</button>
        <button class="btn" onclick="toggleImportant(${j.id})">🚨 Alert</button>
      </div>
    `;

    container.appendChild(card);
  }
}

async function toggleSave(id) {
  await api(`/api/jobs/${id}/save`, { method: "PUT" });
  showToast("Job saved", "success");
}

async function toggleImportant(id) {
  await api(`/api/jobs/${id}/important`, { method: "PUT" });
  loadAlertBadge();
  showToast("Job alert created 🚨", "alert");
}

/* Sidebar navigation */
function goInbox() { window.location.href = "/inbox.html"; }
function goUnread() { window.location.href = "/inbox.html#unread"; }
function goPriority() { window.location.href = "/inbox.html#starred"; }
function goAlerts() { window.location.href = "/inbox.html#important"; }
