document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("login-message");
  
    if (!username || !password) {
      message.textContent = "Please fill in all fields.";
      return;
    }
  
    const users = JSON.parse(localStorage.getItem("users")) || {};
  
    if (users[username]) {
      if (users[username] === password) {
        localStorage.setItem("currentUser", username);
        window.location.href = "index.html";
      } else {
        message.textContent = "Incorrect password.";
      }
    } else {
      users[username] = password;
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", username);
      window.location.href = "index.html";
    }
  });
  