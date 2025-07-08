document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const chatMain = document.querySelector(".chat-main");
  const themeToggle = document.getElementById("theme-toggle");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const messageHistory = document.getElementById("message-history");

  // Sidebar toggle
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    chatMain.classList.toggle("sidebar-open");
  });

  // Theme toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
  });

  // Load theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Send message
  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const message = document.createElement("div");
    message.className = "message sent";
    message.innerHTML = `
      ${text}
      <div class="timestamp">${new Date().toLocaleTimeString()}</div>
    `;
    messageHistory.appendChild(message);
    messageHistory.scrollTop = messageHistory.scrollHeight;
    messageInput.value = "";
  }
});
