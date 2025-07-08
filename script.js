document.addEventListener("DOMContentLoaded", () => {
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const chatMain = document.querySelector(".chat-main");
  const themeToggle = document.getElementById("theme-toggle");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const messageHistory = document.getElementById("message-history");
  const typingIndicator = document.getElementById("typing-indicator");
  const emojiButton = document.getElementById("emoji-button");
  const fileInput = document.getElementById("file-input");
  const filePreview = document.getElementById("file-preview");
  let typingTimeout;

  // Dynamically create the emoji list
  const emojiList = document.createElement("div");
  emojiList.id = "emoji-list";
  emojiList.className = "emoji-list";
  document.body.appendChild(emojiList);

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

  // Show typing indicator when the user starts typing
  messageInput.addEventListener("input", () => {
    typingIndicator.textContent = "User is typing...";
    typingIndicator.style.display = "block";

    // Reset the timeout to hide the indicator after 2 seconds of inactivity
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      typingIndicator.style.display = "none";
    }, 2000);
  });

  // Populate emoji list
  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "😢", "😎", "🔥", "🙌", "🤔"];
  emojiList.innerHTML = ""; // Clear any existing emojis
  emojis.forEach((emoji) => {
    const button = document.createElement("button");
    button.textContent = emoji;
    button.className = "emoji-item";
    button.addEventListener("click", () => {
      messageInput.value += emoji;
      emojiList.style.display = "none"; // Hide emoji list after selection
    });
    emojiList.appendChild(button);
  });

  // Toggle emoji list visibility
  emojiButton.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from propagating to document
    emojiList.style.display =
      emojiList.style.display === "block" ? "none" : "block";

    // Position emoji list above the emoji button
    const rect = emojiButton.getBoundingClientRect();
    emojiList.style.position = "absolute";
    emojiList.style.top = `${
      rect.top + window.scrollY - emojiList.offsetHeight
    }px`;
    emojiList.style.left = `${rect.left + window.scrollX}px`;
  });

  // Hide emoji list when clicking outside
  document.addEventListener("click", (e) => {
    if (!emojiButton.contains(e.target) && !emojiList.contains(e.target)) {
      emojiList.style.display = "none";
    }
  });

  // Handle file selection and preview
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) {
      filePreview.style.display = "none";
      return;
    }

    filePreview.innerHTML = ""; // Clear previous preview
    filePreview.style.display = "block";

    // Show file name
    const fileName = document.createElement("div");
    fileName.className = "file-name";
    fileName.textContent = `Selected file: ${file.name}`;
    filePreview.appendChild(fileName);

    // Show image preview if the file is an image
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(img.src); // Free memory
      filePreview.appendChild(img);
    }
  });

  // Send message
  sendButton.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = messageInput.value.trim();
    const file = fileInput.files[0];

    if (!text && !file) return;

    const message = document.createElement("div");
    message.className = "message sent";

    // Add text message if present
    if (text) {
      message.innerHTML = `
        ${text}
        <div class="timestamp">${new Date().toLocaleTimeString()}</div>
      `;
    }

    // Add file preview if a file is selected
    if (file) {
      const fileContainer = document.createElement("div");
      fileContainer.className = "file-attachment";

      // Show file name
      const fileName = document.createElement("div");
      fileName.textContent = `File: ${file.name}`;
      fileContainer.appendChild(fileName);

      // Show image preview if the file is an image
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.onload = () => URL.revokeObjectURL(img.src); // Free memory
        fileContainer.appendChild(img);
      }

      message.appendChild(fileContainer);
    }

    messageHistory.appendChild(message);
    messageHistory.scrollTop = messageHistory.scrollHeight;

    // Clear input and preview
    messageInput.value = "";
    fileInput.value = "";
    filePreview.style.display = "none";
    filePreview.innerHTML = "";

    // Hide typing indicator
    typingIndicator.style.display = "none";
    clearTimeout(typingTimeout);
  }
});
