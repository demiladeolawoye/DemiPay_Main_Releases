/**
 * PAY54 v6.1 Hybrid Dashboard
 * Simple front-end only implementation
 * - Naira-first UI (₦)
 * - USD for investments display
 * - All main buttons wired with mock logic
 */

console.log("🚀 PAY54 v6.1 dashboard.js loaded");

// ------------------------------
// BASIC MOCK STATE
// ------------------------------
const mockUser = {
  id: "user_001",
  fullName: "Demi Olawoye",
  avatar: "./src/assets/user.png",
};

let nairaBalance = 250000; // ₦
let transactions = [
  {
    id: 1,
    type: "debit",
    title: "Sent to John Doe",
    desc: "P2P Transfer",
    amount: -15000,
    status: "Completed",
    time: "Today • 10:32",
  },
  {
    id: 2,
    type: "credit",
    title: "Received from Upwork Ltd",
    desc: "Freelance payment",
    amount: 82000,
    status: "Completed",
    time: "Yesterday • 18:20",
  },
  {
    id: 3,
    type: "debit",
    title: "Netflix Subscription",
    desc: "Entertainment",
    amount: -4500,
    status: "Completed",
    time: "Mon • 07:02",
  },
  {
    id: 4,
    type: "debit",
    title: "Bolt Ride",
    desc: "Transport",
    amount: -2300,
    status: "Completed",
    time: "Sun • 21:15",
  },
  {
    id: 5,
    type: "credit",
    title: "Salary",
    desc: "Monthly inflow",
    amount: 200000,
    status: "Completed",
    time: "Fri • 09:00",
  },
];

// Simple card list
let linkedCards = [
  {
    id: "v1",
    type: "virtual",
    label: "PAY54 Virtual Visa",
    masked: "**** **** **** 1454",
    brand: "visa",
    isDefault: true,
  },
  {
    id: "c1",
    type: "linked",
    label: "GTBank • Main",
    masked: "**** **** **** 9821",
    brand: "gtb",
    isDefault: false,
  },
  {
    id: "c2",
    type: "linked",
    label: "Access Bank • Bills",
    masked: "**** **** **** 4410",
    brand: "access",
    isDefault: false,
  },
];

// ------------------------------
// HELPERS
// ------------------------------
function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
}

function formatUSD(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// ------------------------------
// TOASTS
// ------------------------------
function showToast(type, message) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${
      type === "success"
        ? "linear-gradient(90deg, #22c55e, #16a34a)"
        : type === "warning"
        ? "linear-gradient(90deg, #facc15, #f59e0b)"
        : "linear-gradient(90deg, #ef4444, #dc2626)"
    };
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    font-weight: 500;
    font-size: 15px;
    z-index: 9999;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.4s ease;
  `;

  toast.style.display = "block";
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => (toast.style.display = "none"), 500);
  }, 3000);
}

function showSystemToast(type, message) {
  let toast = document.getElementById("systemToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "systemToast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = message;
  toast.className = `toast-bottom toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 12px 18px;
    border-radius: 10px;
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    z-index: 9999;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.3s ease;
    background: ${
      type === "success"
        ? "linear-gradient(90deg, #16a34a, #22c55e)"
        : type === "warning"
        ? "linear-gradient(90deg, #facc15, #f59e0b)"
        : "linear-gradient(90deg, #dc2626, #ef4444)"
    };
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    display: flex;
    align-items: center;
    gap: 8px;
  `;

  toast.style.display = "flex";
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  }, 50);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(30px)";
    setTimeout(() => (toast.style.display = "none"), 400);
  }, 3500);
}

// ------------------------------
// RENDER FUNCTIONS
// ------------------------------
function renderUser() {
  const nameEl = document.getElementById("userName");
  const avatarEl = document.getElementById("userAvatar");
  if (nameEl) nameEl.textContent = mockUser.fullName.split(" ")[0] || "User";
  if (avatarEl) avatarEl.src = mockUser.avatar;
}

function renderBalance() {
  const balanceEl = document.getElementById("balanceAmount");
  const walletEl = document.getElementById("walletAddress");
  if (balanceEl) balanceEl.textContent = formatNaira(nairaBalance);
  if (walletEl)
    walletEl.textContent = "Wallet: P54-1029-3456-78"; // mock wallet
}

function renderTransactions() {
  const container = document.getElementById("transactionsList");
  if (!container) return;

  if (!transactions.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📭</span>
        <p>No transactions yet</p>
        <p class="text-sm">Start by sending or receiving money</p>
      </div>
    `;
    return;
  }

  container.innerHTML = transactions
    .slice(0, 6)
    .map((tx) => {
      const sign = tx.amount > 0 ? "+" : "";
      const amountClass = tx.amount > 0 ? "positive" : "negative";
      return `
        <div class="transaction-item">
          <div class="transaction-info">
            <div class="transaction-icon ${
              tx.amount > 0 ? "receive" : "send"
            }">
              ${tx.amount > 0 ? "📥" : "💸"}
            </div>
            <div class="transaction-details">
              <h4>${tx.title}</h4>
              <p>${tx.desc}</p>
              <p class="text-sm">${tx.time}</p>
            </div>
          </div>
          <div class="transaction-amount">
            <div class="amount ${amountClass}">
              ${sign}${formatNaira(Math.abs(tx.amount))}
            </div>
            <span class="status">${tx.status}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

// Simple render for cards (if you have a cards section later)
function renderCards() {
  const section = document.querySelector(".cards-list");
  if (!section) return;

  section.innerHTML = linkedCards
    .map((c) => {
      return `
        <div class="card-item ${c.isDefault ? "card-default" : ""}" data-card-id="${c.id}">
          <div class="card-row">
            <span class="card-label">${c.label}</span>
            <span class="card-brand">${c.brand.toUpperCase()}</span>
          </div>
          <div class="card-row">
            <span class="card-masked">${c.masked}</span>
            ${
              c.isDefault
                ? '<span class="card-badge">Default</span>'
                : '<button class="btn btn-ghost btn-xs set-default-btn">Set default</button>'
            }
          </div>
        </div>
      `;
    })
    .join("");

  section.querySelectorAll(".set-default-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cardItem = e.target.closest(".card-item");
      if (!cardItem) return;
      const id = cardItem.getAttribute("data-card-id");
      linkedCards = linkedCards.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }));
      renderCards();
      showToast("success", "✅ Default card updated.");
    });
  });
}

// ------------------------------
// MONEY MOVES LOGIC
// ------------------------------
function handleSendMoney() {
  showSystemToast(
    "success",
    "💸 Send Money flow (mock) — in full app this opens the send sheet with recipient, amount & note."
  );
}

function handleReceiveMoney() {
  showSystemToast(
    "success",
    "📥 Receive Money — in full app this would show a QR code & shareable PAY54 tag."
  );
}

function handleAddMoney() {
  showSystemToast(
    "success",
    "➕ Add / Withdraw — mock: choose source (bank / card / agent) and confirm."
  );
}

function handleBankTransfer() {
  showSystemToast(
    "success",
    "🏦 Bank Transfer — mock: enter recipient name, bank, account & note."
  );
}

// ------------------------------
// SERVICES LOGIC
// ------------------------------
function handleCrossBorder() {
  showSystemToast(
    "success",
    "🌍 Cross-Border Remittance — mock: SEND ₦ with live FX preview & reason for payment."
  );
}

function handleSavings() {
  showSystemToast(
    "success",
    "💰 Savings — mock: create a goal, set standing order & view pie chart of goals."
  );
}

function handleBills() {
  showSystemToast(
    "success",
    "💡 Bills & Top-Up — mock: choose service (Electricity, Water, Airtime, DSTV), provider & recurring options."
  );
}

function handleCardsService() {
  showSystemToast(
    "success",
    "💳 Virtual & Linked Cards — mock: link new card or switch default payment card."
  );
}

function handlePayOnline() {
  showSystemToast(
    "success",
    "🛒 Pay Online — mock checkout for merchants using PAY54 wallet / cards."
  );
}

function handleShopOnTheFly() {
  showSystemToast(
    "success",
    "🏬 Shop on the Fly — mock: category-based affiliate shopping (rides, food, tickets, e-commerce)."
  );
}

function handleInvestments() {
  showSystemToast(
    "success",
    "📈 Investments & Stocks — mock: browse USD stocks/funds, pay in ₦ or $ from PAY54."
  );
}

// Become an Agent
function openAgentModal() {
  const modal = document.getElementById("agentModal");
  if (!modal) return;
  modal.classList.remove("d-none");
  document.body.style.overflow = "hidden";
}

function closeAgentModal() {
  const modal = document.getElementById("agentModal");
  if (!modal) return;
  modal.classList.add("d-none");
  document.body.style.overflow = "auto";
}

function initAgentForm() {
  const submitBtn = document.getElementById("submitAgentBtn");
  const cancelBtn = document.getElementById("cancelAgentBtn");
  const closeBtn = document.getElementById("closeAgentModal");
  const form = document.getElementById("agentForm");

  if (cancelBtn) cancelBtn.addEventListener("click", closeAgentModal);
  if (closeBtn) closeBtn.addEventListener("click", closeAgentModal);

  if (!submitBtn || !form) return;

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const fullName = document
      .getElementById("agentFullName")
      .value.trim();
    const nin = document.getElementById("agentNIN").value.trim();
    const photo = document.getElementById("agentPhoto").files[0];

    if (!fullName || !nin || nin.length !== 11 || !photo) {
      showToast(
        "error",
        "⚠️ Full Name, valid 11-digit NIN & Photo are required."
      );
      return;
    }

    showSystemToast(
      "success",
      "✅ Agent application submitted (mock). PAY54 team will review."
    );
    form.reset();
    closeAgentModal();
  });
}

// ------------------------------
// THEME TOGGLE
// ------------------------------
function initTheme() {
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");

  const saved = localStorage.getItem("pay54_theme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    if (icon) icon.textContent = "☀️";
    if (text) text.textContent = "Light Mode";
  }

  if (!btn) return;

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("pay54_theme", isDark ? "dark" : "light");
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (text) text.textContent = isDark ? "Light Mode" : "Dark Mode";

    showToast(
      "success",
      isDark ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Restored"
    );
  });
}

// ------------------------------
// NAV USER MENU (PROFILE / SETTINGS / LOGOUT)
// ------------------------------
function initUserMenu() {
  const userMenuBtn = document.getElementById("userMenuBtn");
  const dropdown = document.getElementById("userMenuDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userMenuBtn && dropdown) {
    userMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && e.target !== userMenuBtn) {
        dropdown.classList.remove("show");
      }
    });
  }

  // Profile / Settings click handlers (just mock toasts for now)
  const profileLink = dropdown?.querySelector(".menu-item:nth-child(1)");
  const settingsLink = dropdown?.querySelector(".menu-item:nth-child(2)");

  if (profileLink) {
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();
      showSystemToast(
        "success",
        "👤 Profile — in full app this opens your PAY54 profile & KYC details."
      );
    });
  }

  if (settingsLink) {
    settingsLink.addEventListener("click", (e) => {
      e.preventDefault();
      showSystemToast(
        "success",
        "⚙️ Settings — in full app this manages security, devices & notifications."
      );
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("success", "🚪 Logged out (mock).");
      setTimeout(() => {
        window.location.href = "src/pages/login.html";
      }, 800);
    });
  }
}

// ------------------------------
// FLOATING FAB (P54 BUTTON)
// ------------------------------
function initFab() {
  const fab = document.getElementById("pay54Fab");
  if (!fab) return;

  fab.addEventListener("click", () => {
    showSystemToast(
      "success",
      "💜 PAY54 Quick Action — choose Send, Pay Bills or Scan to Pay in the full app."
    );
  });
}

// ------------------------------
// MONEY MOVES + SERVICES BINDINGS
// ------------------------------
function initButtons() {
  // Money Moves
  document
    .getElementById("sendMoneyBtn")
    ?.addEventListener("click", handleSendMoney);
  document
    .getElementById("receiveMoneyBtn")
    ?.addEventListener("click", handleReceiveMoney);
  document
    .getElementById("addMoneyBtn")
    ?.addEventListener("click", handleAddMoney);
  document
    .getElementById("bankTransferBtn")
    ?.addEventListener("click", handleBankTransfer);

  // Services grid
  document
    .querySelector('[data-service="fx"]')
    ?.addEventListener("click", handleCrossBorder);
  document
    .querySelector('[data-service="savings"]')
    ?.addEventListener("click", handleSavings);
  document
    .querySelector('[data-service="bills"]')
    ?.addEventListener("click", handleBills);
  document
    .querySelector('[data-service="cards"]')
    ?.addEventListener("click", handleCardsService);
  document
    .querySelector('[data-service="payonline"]')
    ?.addEventListener("click", handlePayOnline);
  document
    .querySelector('[data-service="shop"]')
    ?.addEventListener("click", handleShopOnTheFly);
  document
    .querySelector('[data-service="invest"]')
    ?.addEventListener("click", handleInvestments);
  document
    .querySelector('[data-service="agent"]')
    ?.addEventListener("click", openAgentModal);

  // View all transactions (mock)
  document.getElementById("viewAllBtn")?.addEventListener("click", () => {
    showSystemToast(
      "success",
      "📊 In full app this opens complete transaction history with filters & export."
    );
  });
}

// ------------------------------
// WELCOME TOAST
// ------------------------------
function showWelcomeToast() {
  const toast = document.getElementById("welcomeToast");
  if (!toast) return;

  const firstName = mockUser.fullName.split(" ")[0] || "User";
  toast.innerHTML = `👋 Welcome back, <strong>${firstName}</strong> — your PAY54 wallet is synced.`;
  toast.style.display = "flex";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.transition = "opacity 0.6s ease";
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 600);
  }, 3500);
}

// ------------------------------
// INIT
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Spacing correction between sections (in case CSS missed it)
  document
    .querySelectorAll(
      ".welcome-section, .balance-section, .banner, .money-moves, .quick-services, .transactions-section"
    )
    .forEach((sec) => {
      sec.style.marginBottom = "20px";
    });

  renderUser();
  renderBalance();
  renderTransactions();
  renderCards();

  initTheme();
  initUserMenu();
  initButtons();
  initFab();
  initAgentForm();

  // Scroll shadow on navbar (sticky)
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  });

  // Scroll-to-top button (if present)
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  setTimeout(showWelcomeToast, 800);
});
