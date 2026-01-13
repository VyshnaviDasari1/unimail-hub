// REGISTER
function register() {
  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  fetch(BASE_URL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => {
      if (!res.ok) throw new Error("Registration failed");
      return res.json();
    })
    .then(data => {
      alert("Registration successful");
      window.location.href = "login.html";
    })
    .catch(err => {
      alert(err.message);
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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(res => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then(data => {
      alert("Login successful");
      console.log("Logged user:", data);
      // later → redirect to inbox.html
    })
    .catch(err => {
      alert(err.message);
    });
}
