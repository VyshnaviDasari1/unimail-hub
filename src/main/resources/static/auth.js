// static/auth.js
function login() {
  const email = document.getElementById("loginEmail")?.value?.trim();
  const password = document.getElementById("loginPassword")?.value?.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  localStorage.setItem("userEmail", email);
  window.location.href = "/index.html";
}

function register() {
  const name = document.getElementById("name")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  localStorage.setItem("userEmail", email);
  window.location.href = "/index.html";
}

function logout() {
  localStorage.removeItem("userEmail");
  window.location.href = "/login.html";
}
