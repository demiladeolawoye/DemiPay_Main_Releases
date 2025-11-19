/**
 * PAY54 v6.1 Hybrid Dashboard
 * Standalone, no backend – perfect for GitHub Pages demo
 * CTO-ready ✅
 */

/* ======================
   GLOBAL STATE (MOCK DATA)
   ====================== */

const pay54User = {
  id: "user-001",
  fullName: "Demilade Olawoye",
  firstName: "Demi",
  avatar: "./src/assets/user.png", // you can replace later
};

let pay54State = {
  balanceNaira: 152340.75,
  savingsTotal: 45000,
  investmentsUsd: 1250.5,
  cards: [
    {
      id: "virtual-p54",
      type: "virtual",
      brand: "PAY54 VISA",
      last4: "4454",
      default: true,
    },
    {
      id: "gtb-001",
      type: "linked",
      brand: "GTBank",
      last4: "8821",
      default: false,
    },
    {
      id: "zenith-001",
      type: "linked",
      brand: "Zenith Bank",
      last4: "1034",
      default: false,
    },
  ],
  transactions: [
    {
      id: 1,
      type: "debit",
      title: "Transfer to John Doe",
      subtitle: "P2P – Food contribution",
      amountNaira: -15000,
      time: "Today • 09:24",
    },
    {
      id: 2,
      type: "credit",
      title: "Salary – PAY54 Ltd",
      subtitle: "Monthly salary",
      amountNaira: 220000,
      time: "Yesterday • 18:03",
    },
    {
      id: 3,
      type: "debit",
      title: "Electricity – Ikeja Electric",
      subtitle: "Prepaid token",
      amountNaira: -18500,
      time: "2 days ago",
    },
    {
      id: 4,
      type: "debit",
      title: "Netflix Subscription",
      subtitle: "Entertainment",
      amountNaira: -5500,
      time: "3 days ago",
    },
    {
      id: 5,
      type: "credit",
      title: "P2P from Mary",
      subtitle: "Refund for fuel",
      amountNaira: 12000,
      time: "Last week",
    },
  ],
};

/* ======================
   HELPERS
   ====================== */

// Format Naira nicely
function formatNaira(amount) {
  const sign = amount < 0 ? "-" : "";
  const abs = Math.abs(amount);
  return `${sign}₦${abs.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Format USD for investments
function formatUsd(amount) {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Top-right toast
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
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
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
  }, 30);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => (toast.style.display = "none"), 400);
  }, 3000);
}

// Bottom-left system toast (for background events)
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
  }, 30);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(30px)";
    setTimeout(() => (toast.style.display = "none"), 400);
  }, 3500);
}

/* ======================
   THEME + NAVBAR
   ====================== */

function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");

  const saved = localStorage.getItem("pay54_theme") || "light";
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "☀️";
    themeText.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark-mode");
    themeIcon.textContent = "🌙";
    themeText.textContent = "Dark Mode";
  }

  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("pay54_theme", isDark ? "dark" : "light");

    themeIcon.textContent = isDark ? "☀️" : "🌙";
    themeText.textContent = isDark ? "Light Mode" : "Dark Mode";

    showToast(
      "success",
      isDark ? "🌙 Dark Mode enabled for Pay54" : "☀️ Light Mode restored"
    );
  });

  // sticky navbar effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  });
}

function initUserMenu() {
  const userName = document.getElementById("userName");
  const avatar = document.getElementById("userAvatar");
  const welcomeHeading = document.querySelector(".welcome-section h1");
  const userMenuBtn = document.getElementById("userMenuBtn");
  const userMenuDropdown = document.getElementById("userMenuDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userName) userName.textContent = pay54User.firstName;
  if (avatar) avatar.src = pay54User.avatar;

  if (welcomeHeading) {
    welcomeHeading.innerHTML = `Hi ${pay54User.firstName}, good to see you 👋`;
  }

  userMenuBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenuDropdown?.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!userMenuDropdown) return;
    if (!userMenuDropdown.contains(e.target) && e.target !== userMenuBtn) {
      userMenuDropdown.classList.remove("show");
    }
  });

  // Profile (mock)
  const profileItem = document.querySelector(".menu-item.profile-link");
  profileItem?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("info", "Profile center is coming soon in v6.2");
  });

  // Settings (mock)
  const settingsItem = document.querySelector(".menu-item.settings-link");
  settingsItem?.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("info", "Settings screen is coming soon in v6.2");
  });

  // Logout (mock)
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    showSystemToast("success", "You have logged out (demo only, no real session).");
  });
}

/* ======================
   BALANCE + TRANSACTIONS
   ====================== */

function renderBalances() {
  const balanceEl = document.getElementById("balanceAmount");
  const walletAddressEl = document.getElementById("walletAddress");

  if (balanceEl) balanceEl.textContent = formatNaira(pay54State.balanceNaira);
  if (walletAddressEl)
    walletAddressEl.textContent = "Wallet: P54-1029-3456-78";

  // If you later add savings/investment widgets, hook here
}

function renderTransactions() {
  const container = document.getElementById("transactionsList");
  if (!container) return;

  if (!pay54State.transactions.length) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">📭</span>
        <p>No transactions yet</p>
        <p class="text-sm">Start by sending or receiving money</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pay54State.transactions
    .map((tx) => {
      const signClass = tx.amountNaira >= 0 ? "positive" : "negative";
      const signSymbol = tx.amountNaira >= 0 ? "+" : "";
      return `
      <div class="transaction-item">
        <div class="transaction-main">
          <div class="transaction-title-row">
            <span class="tx-title">${tx.title}</span>
            <span class="tx-amount ${signClass}">
              ${signSymbol}${formatNaira(tx.amountNaira)}
            </span>
          </div>
          <div class="transaction-meta-row">
            <span class="tx-subtitle">${tx.subtitle}</span>
            <span class="tx-time">${tx.time}</span>
          </div>
        </div>
      </div>
    `;
    })
    .join("");
}

/* ======================
   MODAL UTILITIES
   ====================== */

function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.remove("d-none");
  document.body.style.overflow = "hidden";
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;
  overlay.classList.add("d-none");
  document.body.style.overflow = "auto";
}

/* Generic feature modal (for simple demo content) */

function bindGenericFeatureModal() {
  const modal = document.getElementById("featureModal");
  if (!modal) return;

  const titleEl = document.getElementById("featureModalTitle");
  const bodyEl = document.getElementById("featureModalBody");
  const footerEl = document.getElementById("featureModalFooter");
  const closeBtn = document.getElementById("featureModalClose");

  function showFeature(title, bodyHtml, footerHtml = "") {
    titleEl.innerHTML = title;
    bodyEl.innerHTML = bodyHtml;
    footerEl.innerHTML = footerHtml;
    modal.classList.remove("d-none");
    document.body.style.overflow = "hidden";
  }

  closeBtn?.addEventListener("click", () => {
    modal.classList.add("d-none");
    document.body.style.overflow = "auto";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("d-none");
      document.body.style.overflow = "auto";
    }
  });

  // Expose globally for other handlers
  window.showFeatureModal = showFeature;
}

/* ======================
   MONEY MOVES (TOP ROW)
   ====================== */

function initMoneyMoves() {
  const sendBtn = document.getElementById("sendMoneyBtn");
  const receiveBtn = document.getElementById("receiveMoneyBtn");
  const addMoneyBtn = document.getElementById("addMoneyBtn");
  const bankTransferBtn = document.getElementById("bankTransferBtn");

  // SEND MONEY
  sendBtn?.addEventListener("click", () => {
    window.showFeatureModal(
      "Send Money (P2P)",
      `
      <form id="sendMoneyForm" class="modal-form">
        <label>Recipient Email / Phone</label>
        <input type="text" id="sendRecipient" placeholder="e.g. john@example.com" />

        <label>Amount (₦)</label>
        <input type="number" id="sendAmount" placeholder="e.g. 5000" />

        <label>Note / Description</label>
        <textarea id="sendNote" placeholder="What is this for?"></textarea>
      </form>
    `,
      `
      <button class="btn btn-secondary" id="cancelSendBtn">Cancel</button>
      <button class="btn btn-primary" id="confirmSendBtn">Send</button>
    `
    );

    const cancelBtn = document.getElementById("cancelSendBtn");
    const confirmBtn = document.getElementById("confirmSendBtn");

    cancelBtn?.addEventListener("click", () =>
      document.getElementById("featureModal").classList.add("d-none")
    );

    confirmBtn?.addEventListener("click", () => {
      const recipient = document.getElementById("sendRecipient").value.trim();
      const amount = parseFloat(document.getElementById("sendAmount").value);
      const note = document.getElementById("sendNote").value.trim();

      if (!recipient || !amount || amount <= 0) {
        showToast("error", "Please enter a valid recipient and amount.");
        return;
      }

      pay54State.balanceNaira -= amount;
      pay54State.transactions.unshift({
        id: Date.now(),
        type: "debit",
        title: `Transfer to ${recipient}`,
        subtitle: note || "P2P Transfer",
        amountNaira: -amount,
        time: "Just now",
      });

      renderBalances();
      renderTransactions();

      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
      showToast("success", `Sent ${formatNaira(amount)} to ${recipient} (demo).`);
    });
  });

  // RECEIVE MONEY (QR + Copy)
  receiveBtn?.addEventListener("click", () => {
    const accountNumber = "1029 3456 7821";
    const qrPlaceholder =
      "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PAY54-" +
      encodeURIComponent(accountNumber);

    window.showFeatureModal(
      "Receive Money",
      `
      <div class="receive-section">
        <p>Show this QR code or share your PAY54 account.</p>
        <div class="qr-box">
          <img src="${qrPlaceholder}" alt="PAY54 QR" />
        </div>
        <div class="receive-details">
          <p><strong>Account Name:</strong> ${pay54User.fullName}</p>
          <p><strong>Account Number:</strong> ${accountNumber}</p>
          <p><strong>Bank:</strong> PAY54 MicroWallet</p>
        </div>
      </div>
    `,
      `
      <button class="btn btn-secondary" id="closeReceiveBtn">Close</button>
      <button class="btn btn-primary" id="copyAccountBtn">Copy Account</button>
    `
    );

    document
      .getElementById("closeReceiveBtn")
      ?.addEventListener("click", () => {
        document.getElementById("featureModal").classList.add("d-none");
        document.body.style.overflow = "auto";
      });

    document.getElementById("copyAccountBtn")?.addEventListener("click", () => {
      navigator.clipboard
        .writeText(`${accountNumber} - ${pay54User.fullName}`)
        .then(() => {
          showToast("success", "Account details copied 📋");
        })
        .catch(() => {
          showToast("warning", "Unable to copy on this device.");
        });
    });
  });

  // ADD / WITHDRAW
  addMoneyBtn?.addEventListener("click", () => {
    window.showFeatureModal(
      "Add / Withdraw Funds",
      `
      <form id="addMoneyForm" class="modal-form">
        <label>Action</label>
        <select id="addAction">
          <option value="add">Add Money</option>
          <option value="withdraw">Withdraw Money</option>
        </select>

        <label>Funding Source</label>
        <select id="addSource">
          <option value="card">Linked Card</option>
          <option value="bank">Bank Account</option>
          <option value="agent">Pay54 Agent</option>
        </select>

        <label>Amount (₦)</label>
        <input type="number" id="addAmount" placeholder="e.g. 10000" />
      </form>
    `,
      `
      <button class="btn btn-secondary" id="cancelAddBtn">Cancel</button>
      <button class="btn btn-primary" id="confirmAddBtn">Confirm</button>
    `
    );

    document.getElementById("cancelAddBtn")?.addEventListener("click", () => {
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
    });

    document.getElementById("confirmAddBtn")?.addEventListener("click", () => {
      const action = document.getElementById("addAction").value;
      const amount = parseFloat(document.getElementById("addAmount").value);

      if (!amount || amount <= 0) {
        showToast("error", "Enter a valid amount.");
        return;
      }

      if (action === "add") {
        pay54State.balanceNaira += amount;
        pay54State.transactions.unshift({
          id: Date.now(),
          type: "credit",
          title: "Wallet Funding",
          subtitle: "Card / Bank (mock)",
          amountNaira: amount,
          time: "Just now",
        });
        showToast("success", `Wallet funded with ${formatNaira(amount)} (demo).`);
      } else {
        pay54State.balanceNaira -= amount;
        pay54State.transactions.unshift({
          id: Date.now(),
          type: "debit",
          title: "Withdrawal",
          subtitle: "To bank (mock)",
          amountNaira: -amount,
          time: "Just now",
        });
        showToast("success", `Withdrew ${formatNaira(amount)} (demo).`);
      }

      renderBalances();
      renderTransactions();
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
    });
  });

  // BANK TRANSFER
  bankTransferBtn?.addEventListener("click", () => {
    window.showFeatureModal(
      "Bank Transfer",
      `
      <form id="bankTransferForm" class="modal-form">
        <label>Recipient Name</label>
        <input type="text" id="bankRecipient" placeholder="e.g. John Doe" />

        <label>Bank Name</label>
        <input type="text" id="bankName" placeholder="e.g. Access Bank" />

        <label>Account Number</label>
        <input type="text" id="bankAccount" placeholder="10-digit account number" maxlength="10" />

        <label>Amount (₦)</label>
        <input type="number" id="bankAmount" placeholder="e.g. 25000" />

        <label>Note / Reference</label>
        <input type="text" id="bankNote" placeholder="Optional reference" />
      </form>
    `,
      `
      <button class="btn btn-secondary" id="cancelBankBtn">Cancel</button>
      <button class="btn btn-primary" id="confirmBankBtn">Send</button>
    `
    );

    document.getElementById("cancelBankBtn")?.addEventListener("click", () => {
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
    });

    document.getElementById("confirmBankBtn")?.addEventListener("click", () => {
      const name = document.getElementById("bankRecipient").value.trim();
      const bank = document.getElementById("bankName").value.trim();
      const acc = document.getElementById("bankAccount").value.trim();
      const amount = parseFloat(document.getElementById("bankAmount").value);
      const note = document.getElementById("bankNote").value.trim();

      if (!name || !bank || acc.length < 8 || !amount || amount <= 0) {
        showToast("error", "Please fill in all required fields correctly.");
        return;
      }

      pay54State.balanceNaira -= amount;
      pay54State.transactions.unshift({
        id: Date.now(),
        type: "debit",
        title: `Bank Transfer to ${name}`,
        subtitle: `${bank} • ${note || "Instant transfer"}`,
        amountNaira: -amount,
        time: "Just now",
      });

      renderBalances();
      renderTransactions();
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
      showToast(
        "success",
        `Sent ${formatNaira(amount)} to ${name} at ${bank} (demo).`
      );
    });
  });
}

/* ======================
   SERVICES GRID
   ====================== */

function initServices() {
  const serviceCards = document.querySelectorAll(".service-card");
  if (!serviceCards.length) return;

  serviceCards.forEach((card) => {
    const key = card.dataset.service;
    card.addEventListener("click", () => handleServiceClick(key));
  });

  // 🧍 Become an Agent (separate dedicated modal)
  initAgentModal();
}

function handleServiceClick(serviceKey) {
  switch (serviceKey) {
    case "fx":
      handleCrossBorderRemittance();
      break;
    case "savings":
      handleSavings();
      break;
    case "bills":
      handleBills();
      break;
    case "cards":
      handleCards();
      break;
    case "payonline":
      handlePayOnline();
      break;
    case "shop":
      handleShopOnTheFly();
      break;
    case "invest":
      handleInvestments();
      break;
    case "agent":
      openModal("agentModal");
      break;
    default:
      showToast("warning", "This feature is still in the lab 👨‍💻");
  }
}

/* ---- Individual Service Handlers ---- */

function handleCrossBorderRemittance() {
  window.showFeatureModal(
    "Cross-Border Remittance",
    `
    <form id="fxForm" class="modal-form">
      <label>Recipient Name</label>
      <input type="text" id="fxRecipient" placeholder="e.g. Jane Doe" />

      <label>Recipient Account Number / Wallet ID</label>
      <input type="text" id="fxAccount" placeholder="Account / Mobile Money ID" />

      <label>Reason for Sending</label>
      <input type="text" id="fxReason" placeholder="e.g. Family Support" />

      <label>Amount to Send (₦)</label>
      <input type="number" id="fxAmount" placeholder="e.g. 50000" />

      <label>Notes (optional)</label>
      <textarea id="fxNotes" placeholder="Add more details if needed"></textarea>

      <div class="fx-rate-box">
        <p><strong>Live FX (demo):</strong> 1 USD ≈ ₦1,500</p>
        <p>Est. USD received: <span id="fxUsdEstimate">$0.00</span></p>
      </div>
    </form>
  `,
    `
    <button class="btn btn-secondary" id="cancelFxBtn">Cancel</button>
    <button class="btn btn-primary" id="confirmFxBtn">Send</button>
  `
  );

  const amountInput = document.getElementById("fxAmount");
  const usdEstimate = document.getElementById("fxUsdEstimate");

  amountInput?.addEventListener("input", () => {
    const amount = parseFloat(amountInput.value) || 0;
    const usd = amount / 1500;
    usdEstimate.textContent = formatUsd(usd);
  });

  document.getElementById("cancelFxBtn")?.addEventListener("click", () => {
    document.getElementById("featureModal").classList.add("d-none");
    document.body.style.overflow = "auto";
  });

  document.getElementById("confirmFxBtn")?.addEventListener("click", () => {
    const recipient = document.getElementById("fxRecipient").value.trim();
    const acc = document.getElementById("fxAccount").value.trim();
    const amount = parseFloat(document.getElementById("fxAmount").value);

    if (!recipient || !acc || !amount || amount <= 0) {
      showToast("error", "Please fill in all required fields correctly.");
      return;
    }

    pay54State.balanceNaira -= amount;
    pay54State.transactions.unshift({
      id: Date.now(),
      type: "debit",
      title: `FX to ${recipient}`,
      subtitle: `Cross-border remittance • ${acc}`,
      amountNaira: -amount,
      time: "Just now",
    });

    renderBalances();
    renderTransactions();
    document.getElementById("featureModal").classList.add("d-none");
    document.body.style.overflow = "auto";
    showToast(
      "success",
      `Cross-border transfer of ${formatNaira(amount)} created (demo).`
    );
  });
}

function handleSavings() {
  window.showFeatureModal(
    "Savings & Goals",
    `
    <div class="savings-summary">
      <p><strong>Total Savings (demo):</strong> ${formatNaira(
        pay54State.savingsTotal
      )}</p>
      <div class="savings-pie-hint">
        💡 In a real app, this section shows pie charts and progress bars for each goal.
      </div>
    </div>

    <form id="savingsForm" class="modal-form">
      <label>Goal Name</label>
      <input type="text" id="savingsGoal" placeholder="e.g. Rent, New Phone" />

      <label>Monthly Standing Order (₦)</label>
      <input type="number" id="savingsAmount" placeholder="e.g. 20000" />

      <label>Standing Order Date</label>
      <input type="number" id="savingsDay" min="1" max="28" placeholder="e.g. 25" />
    </form>

    <div class="savings-note">
      Standing orders (auto-savings) will debit your linked card or wallet every month on the selected day (demo logic only here).
    </div>
  `,
    `
    <button class="btn btn-secondary" id="cancelSavingsBtn">Close</button>
    <button class="btn btn-primary" id="saveSavingsBtn">Create Goal</button>
  `
  );

  document
    .getElementById("cancelSavingsBtn")
    ?.addEventListener("click", () => {
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
    });

  document.getElementById("saveSavingsBtn")?.addEventListener("click", () => {
    const goal = document.getElementById("savingsGoal").value.trim();
    const amount = parseFloat(document.getElementById("savingsAmount").value);
    const day = parseInt(document.getElementById("savingsDay").value, 10);

    if (!goal || !amount || amount <= 0 || !day || day < 1 || day > 28) {
      showToast("error", "Please fill in goal, amount and valid day (1–28).");
      return;
    }

    pay54State.savingsTotal += amount;
    renderBalances();

    showToast(
      "success",
      `Savings goal "${goal}" with ₦${amount.toLocaleString()} standing order created (demo).`
    );

    document.getElementById("featureModal").classList.add("d-none");
    document.body.style.overflow = "auto";
  });
}

function handleBills() {
  window.showFeatureModal(
    "Pay Bills & Top-Up",
    `
    <form id="billsForm" class="modal-form">
      <label>Bill Type</label>
      <select id="billType">
        <option value="electricity">Electricity</option>
        <option value="water">Water</option>
        <option value="dstv">DSTV / Cable TV</option>
        <option value="airtime">Airtime</option>
        <option value="data">Data Bundle</option>
      </select>

      <div id="billsDynamicFields"></div>

      <label>Plan / Amount</label>
      <select id="billPlan">
        <option value="500">₦500</option>
        <option value="2000">₦2,000</option>
        <option value="5000">₦5,000</option>
        <option value="10000">₦10,000</option>
      </select>

      <label>Make this recurring?</label>
      <select id="billRecurring">
        <option value="no">No</option>
        <option value="monthly">Monthly</option>
        <option value="weekly">Weekly</option>
      </select>
    </form>

    <div class="bills-note">
      For recurring bills, PAY54 can auto-debit your wallet or default card on schedule (demo only here).
    </div>
  `,
    `
    <button class="btn btn-secondary" id="cancelBillsBtn">Cancel</button>
    <button class="btn btn-primary" id="confirmBillsBtn">Pay Now</button>
  `
  );

  const typeSelect = document.getElementById("billType");
  const dynamicFields = document.getElementById("billsDynamicFields");

  function renderBillFields(type) {
    if (!dynamicFields) return;

    if (type === "electricity" || type === "water" || type === "dstv") {
      dynamicFields.innerHTML = `
        <label>Account / Meter Number</label>
        <input type="text" id="billAccount" placeholder="e.g. 1234567890" />

        <label>Provider</label>
        <select id="billProvider">
          <option value="ikeja">Ikeja Electric</option>
          <option value="eko">Eko Electric</option>
          <option value="lagoswater">Lagos Water</option>
          <option value="dstv">DSTV</option>
          <option value="gotv">GOtv</option>
        </select>
      `;
    } else if (type === "airtime" || type === "data") {
      dynamicFields.innerHTML = `
        <label>Mobile Network</label>
        <select id="billNetwork">
          <option value="mtn">MTN</option>
          <option value="airtel">Airtel</option>
          <option value="glo">Glo</option>
          <option value="9mobile">9mobile</option>
        </select>

        <label>Phone Number</label>
        <input type="tel" id="billPhone" placeholder="e.g. 0803..." />
      `;
    }
  }

  renderBillFields(typeSelect.value);

  typeSelect?.addEventListener("change", () =>
    renderBillFields(typeSelect.value)
  );

  document
    .getElementById("cancelBillsBtn")
    ?.addEventListener("click", () => {
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
    });

  document.getElementById("confirmBillsBtn")?.addEventListener("click", () => {
    const type = typeSelect.value;
    const plan = parseFloat(document.getElementById("billPlan").value);
    const recurring = document.getElementById("billRecurring").value;

    if (!plan || plan <= 0) {
      showToast("error", "Select a valid plan/amount.");
      return;
    }

    pay54State.balanceNaira -= plan;
    pay54State.transactions.unshift({
      id: Date.now(),
      type: "debit",
      title: `Bill Payment – ${type.toUpperCase()}`,
      subtitle:
        recurring === "no"
          ? "One-time payment"
          : `Recurring: ${recurring.toUpperCase()}`,
      amountNaira: -plan,
      time: "Just now",
    });

    renderBalances();
    renderTransactions();
    showToast("success", `Bill of ${formatNaira(plan)} paid (demo).`);
    document.getElementById("featureModal").classList.add("d-none");
    document.body.style.overflow = "auto";
  });
}

function handleCards() {
  const cardsHtml = pay54State.cards
    .map(
      (card) => `
    <div class="card-item ${card.default ? "card-default" : ""}">
      <div class="card-row">
        <span class="card-brand">${card.brand}</span>
        <span class="card-type">${card.type === "virtual" ? "Virtual" : "Linked"}</span>
      </div>
      <div class="card-row">
        <span class="card-number">•••• ${card.last4}</span>
        ${
          card.default
            ? '<span class="card-badge">Default</span>'
            : '<button class="set-default-btn" data-cardid="' +
              card.id +
              '">Set Default</button>'
        }
      </div>
    </div>
  `
    )
    .join("");

  window.showFeatureModal(
    "Virtual & Linked Cards",
    `
    <div class="cards-container">
      ${cardsHtml || "<p>No cards yet (demo).</p>"}
    </div>

    <div class="add-card-hint">
      Add or link cards to control which one is used at checkout (demo only).
    </div>
  `,
    `
    <button class="btn btn-secondary" id="closeCardsBtn">Close</button>
    <button class="btn btn-primary" id="addCardBtn">Add / Link Card</button>
  `
  );

  document.getElementById("closeCardsBtn")?.addEventListener("click", () => {
    document.getElementById("featureModal").classList.add("d-none");
    document.body.style.overflow = "auto";
  });

  document.getElementById("addCardBtn")?.addEventListener("click", () => {
    showToast("info", "Card linking flow will be fully implemented in v6.2.");
  });

  document.querySelectorAll(".set-default-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.cardid;
      pay54State.cards.forEach((c) => (c.default = c.id === id));
      handleCards();
      showToast("success", "Default card updated (demo).");
    });
  });
}

function handlePayOnline() {
  window.showFeatureModal(
    "Pay Online",
    `
    <p>This simulates a Pay54 Checkout screen.</p>
    <ul class="bullet-list">
      <li>Customer picks virtual or linked card</li>
      <li>Chooses to pay in ₦ or USD (for FX merchants)</li>
      <li>Strong customer authentication & risk checks (AI Risk Watch)</li>
    </ul>
  `,
    `
    <button class="btn btn-secondary" id="closePayOnlineBtn">Close</button>
  `
  );

  document
    .getElementById("closePayOnlineBtn")
    ?.addEventListener("click", () => {
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
    });
}

function handleShopOnTheFly() {
  window.showFeatureModal(
    "Shop on the Fly",
    `
    <p>Affiliate marketplace categories (demo):</p>
    <ul class="bullet-list">
      <li><strong>Taxi & Ride:</strong> Uber, Bolt, local partners</li>
      <li><strong>Entertainment:</strong> Cinema, concerts, events</li>
      <li><strong>Shopping:</strong> Jiji, AliExpress, Temu, ASOS</li>
      <li><strong>Food:</strong> Domino's, KFC, local restaurants</li>
    </ul>
    <p>Each purchase gives Pay54 a small commission (ROI engine).</p>
  `,
    `
    <button class="btn btn-secondary" id="closeShopBtn">Close</button>
  `
  );

  document.getElementById("closeShopBtn")?.addEventListener("click", () => {
    document.getElementById("featureModal").classList.add("d-none");
    document.body.style.overflow = "auto";
  });
}

function handleInvestments() {
  window.showFeatureModal(
    "Investments & Stocks",
    `
    <div class="invest-toggle">
      <button class="btn btn-primary btn-sm" disabled>Stocks (USD)</button>
      <button class="btn btn-secondary btn-sm" disabled>Local Investments</button>
    </div>

    <div class="invest-summary">
      <p><strong>Portfolio (demo):</strong> ${formatUsd(
        pay54State.investmentsUsd
      )}</p>
      <p><small>At checkout, user can pay in <strong>USD</strong> or auto-convert from <strong>₦</strong>.</small></p>
    </div>

    <div class="invest-list">
      <div class="invest-item">
        <div>
          <strong>P54 TECH FUND</strong>
          <p>AI & fintech innovation basket</p>
        </div>
        <div class="invest-cta">
          <span>${formatUsd(120)}</span>
          <button class="btn btn-primary btn-xs" disabled>Buy (demo)</button>
        </div>
      </div>
      <div class="invest-item">
        <div>
          <strong>US BLUE-CHIP ETF</strong>
          <p>Top US companies tracker</p>
        </div>
        <div class="invest-cta">
          <span>${formatUsd(85)}</span>
          <button class="btn btn-primary btn-xs" disabled>Buy (demo)</button>
        </div>
      </div>
    </div>
  `,
    `
    <button class="btn btn-secondary" id="closeInvestBtn">Close</button>
  `
  );

  document
    .getElementById("closeInvestBtn")
    ?.addEventListener("click", () => {
      document.getElementById("featureModal").classList.add("d-none");
      document.body.style.overflow = "auto";
    });
}

/* ======================
   BECOME AN AGENT MODAL
   ====================== */

function initAgentModal() {
  const agentModal = document.getElementById("agentModal");
  if (!agentModal) return;

  const closeBtn = document.getElementById("closeAgentModal");
  const cancelBtn = document.getElementById("cancelAgentBtn");
  const submitBtn = document.getElementById("submitAgentBtn");
  const form = document.getElementById("agentForm");

  function closeAgent() {
    agentModal.classList.add("d-none");
    document.body.style.overflow = "auto";
    form?.reset();
  }

  closeBtn?.addEventListener("click", closeAgent);
  cancelBtn?.addEventListener("click", closeAgent);

  submitBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("agentFullName").value.trim();
    const businessName = document.getElementById("agentBusinessName")
      ? document.getElementById("agentBusinessName").value.trim()
      : "";
    const nin = document.getElementById("agentNIN").value.trim();
    const photo = document.getElementById("agentPhoto").files[0];

    if (!fullName || !nin || !photo) {
      showToast("error", "Full name, NIN and photo are required.");
      return;
    }

    // Simple success popup
    const successPopup = document.createElement("div");
    successPopup.className = "success-popup";
    successPopup.innerHTML = `
      <div class="success-icon">✅</div>
      <div class="success-text">Agent application submitted (demo).</div>
    `;
    document.body.appendChild(successPopup);

    setTimeout(() => successPopup.classList.add("show"), 50);
    setTimeout(() => successPopup.classList.remove("show"), 2500);
    setTimeout(() => successPopup.remove(), 3100);

    closeAgent();
  });
}

/* ======================
   WELCOME TOAST + SCROLL TOP
   ====================== */

function initWelcomeToast() {
  const toast = document.getElementById("welcomeToast");
  if (!toast) return;

  toast.innerHTML = `👋 Welcome back, <strong>${pay54User.firstName}</strong> — your Pay54 wallet is live (demo).`;
  toast.style.display = "flex";
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.transition = "opacity 0.6s ease";
    toast.style.opacity = "0";
    setTimeout(() => (toast.style.display = "none"), 600);
  }, 3500);
}

function initScrollTopButton() {
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

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

/* ======================
   INIT
   ====================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initUserMenu();
  bindGenericFeatureModal();
  renderBalances();
  renderTransactions();
  initMoneyMoves();
  initServices();
  initAgentModal();
  initWelcomeToast();
  initScrollTopButton();

  console.log("✅ PAY54 v6.1 dashboard initialised (standalone).");
});
