const BASE_URL = "http://localhost:8080/users";

// REGISTER
function register() {
  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  fetch(BASE_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("message").innerText =
      data.error || "Registration successful";
  });
}

// LOGIN
function login() {
  const user = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  fetch(BASE_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("loginMessage").innerText =
      data.error || "Login successful";
  });
}
