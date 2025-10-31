/* ===============================
   DEMIPAY v5.5 — CORE MAIN.JS
   Includes: Theme Memory + Toast Prep
   =============================== */

// 1️⃣ Load saved theme on startup
document.addEventListener("DOMContentLoaded", function() {
  const savedTheme = localStorage.getItem("demipay-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    updateThemeIcon(true);
  }
});

// 2️⃣ Toggle theme and remember it
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("demipay-theme", isDark ? "dark" : "light");
    updateThemeIcon(isDark);
    showToast(isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Restored");
  });
}

// 3️⃣ Update icon and label dynamically
function updateThemeIcon(isDark) {
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");
  if (!icon || !text) return;
  if (isDark) {
    icon.textContent = "☀️";
    text.textContent = "Light Mode";
  } else {
    icon.textContent = "🌙";
    text.textContent = "Dark Mode";
  }
}

// 4️⃣ Prepare toast container
let toastBox = document.createElement("div");
toastBox.id = "toastBox";
toastBox.style.position = "fixed";
toastBox.style.top = "20px";
toastBox.style.right = "20px";
toastBox.style.zIndex = "9999";
document.body.appendChild(toastBox);

// 5️⃣ Toast notification function
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.background = "linear-gradient(90deg, #2dd4bf, #3b82f6)";
  toast.style.color = "#fff";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "8px";
  toast.style.marginBottom = "10px";
  toast.style.fontWeight = "600";
  toast.style.fontSize = "0.9rem";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-10px)";
  toast.style.transition = "all 0.4s ease";

  toastBox.appendChild(toast);

  // Fade-in
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  // Auto-remove after 2.5s
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}
/* ===============================
   TOAST NOTIFICATION FIX (v5.5)
   =============================== */

document.addEventListener("DOMContentLoaded", function () {
  // Create toast container only after DOM is ready
  const toastBox = document.createElement("div");
  toastBox.id = "toastBox";
  toastBox.style.position = "fixed";
  toastBox.style.top = "20px";
  toastBox.style.right = "20px";
  toastBox.style.zIndex = "9999";
  toastBox.style.display = "flex";
  toastBox.style.flexDirection = "column";
  toastBox.style.alignItems = "flex-end";
  document.body.appendChild(toastBox);

  // Global toast function
  window.showToast = function (message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.background = "linear-gradient(90deg, #2dd4bf, #3b82f6)";
    toast.style.color = "#fff";
    toast.style.padding = "10px 16px";
    toast.style.borderRadius = "8px";
    toast.style.marginTop = "8px";
    toast.style.fontWeight = "600";
    toast.style.fontSize = "0.9rem";
    toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.5s ease";

    toastBox.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    });

    // Auto fade out
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  };
});
