let filterMode = "ALL"; // ALL | UNREAD | STARRED

document.addEventListener("DOMContentLoaded", () => {
  loadEmails();
});

// Load emails based on current filter
function loadEmails() {
  let url = "http://localhost:8080/api/emails/inbox";

  if (filterMode === "STARRED") {
    url = "http://localhost:8080/api/emails/starred";
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("emailList");
      list.innerHTML = "";

      let emails = data;
      if (filterMode === "UNREAD") {
        emails = data.filter(e => !e.read);
      }

      if (emails.length === 0) {
        list.innerHTML = "<li>No emails found</li>";
        return;
      }

      emails.forEach(email => {
        const li = document.createElement("li");
        li.style.cursor = "pointer";

        // ⭐ Star
        const star = document.createElement("span");
        star.innerText = email.starred ? "⭐" : "☆";
        star.style.marginRight = "10px";
        star.style.cursor = "pointer";

        star.onclick = (e) => {
          e.stopPropagation();
          toggleStar(email.id);
        };

        // Email text
        const text = document.createElement("span");
        text.innerText = `${email.sender} - ${email.subject}`;
        text.style.fontWeight = email.read ? "normal" : "bold";

        // 🗑 Delete
        const del = document.createElement("button");
        del.innerText = "Delete";
        del.style.marginLeft = "15px";

        del.onclick = (e) => {
          e.stopPropagation();
          deleteEmail(email.id);
        };

        li.appendChild(star);
        li.appendChild(text);
        li.appendChild(del);

        li.onclick = () => {
          window.location.href = `email.html?id=${email.id}`;
        };

        list.appendChild(li);
      });
    })
    .catch(err => console.error("Error loading emails:", err));
}

// Filters
function loadAll() {
  filterMode = "ALL";
  loadEmails();
}

function loadUnread() {
  filterMode = "UNREAD";
  loadEmails();
}

function loadStarred() {
  filterMode = "STARRED";
  loadEmails();
}

// Search
function searchEmails() {
  const keyword = document.getElementById("searchBox").value.trim();

  if (keyword === "") {
    loadEmails();
    return;
  }

  fetch(`http://localhost:8080/api/emails/search?q=${keyword}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("emailList");
      list.innerHTML = "";

      if (data.length === 0) {
        list.innerHTML = "<li>No emails found</li>";
        return;
      }

      data.forEach(email => {
        const li = document.createElement("li");

        const star = document.createElement("span");
        star.innerText = email.starred ? "⭐" : "☆";
        star.style.marginRight = "10px";

        const text = document.createElement("span");
        text.innerText = `${email.sender} - ${email.subject}`;
        text.style.fontWeight = email.read ? "normal" : "bold";

        li.appendChild(star);
        li.appendChild(text);

        li.onclick = () => {
          window.location.href = `email.html?id=${email.id}`;
        };

        list.appendChild(li);
      });
    });
}

// APIs
function toggleStar(id) {
  fetch(`http://localhost:8080/api/emails/${id}/star`, {
    method: "PUT"
  }).then(loadEmails);
}

function deleteEmail(id) {
  fetch(`http://localhost:8080/api/emails/${id}`, {
    method: "DELETE"
  }).then(loadEmails);
}
