// Register user
function register() {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!username || !password) {
    showMessage("Please enter both username and password.");
    return;
  }

  if (localStorage.getItem(username)) {
    showMessage("Username already exists. Try another one.");
  } else {
    // Store user as JSON
    localStorage.setItem(username, JSON.stringify({ password }));
    showMessage("Registration successful! You can now login.");
  }
}

// Login user
function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  const storedUser = localStorage.getItem(username);
  if (!storedUser) {
    showMessage("User not found. Please register first.");
    return;
  }

  const user = JSON.parse(storedUser);
  if (user.password === password) {
    // Save session info
    sessionStorage.setItem("loggedInUser", username);
    window.location.href = "dashboard.html";
  } else {
    showMessage("Incorrect password. Try again.");
  }
}

// Show feedback message
function showMessage(msg) {
  document.getElementById("message").textContent = msg;
}
