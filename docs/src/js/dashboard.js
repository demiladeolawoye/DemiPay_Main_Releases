/**
 * PAY54 v6.2 Hybrid Dashboard
 * NG + Global • Mock client-side behaviour
 */

// Simple global state
const pay54State = {
  balance: 250000, // ₦
  kycLevel: "Tier 2 (BVN Verified)",
  accountNumber: "P54-1029345678",
  user: {
    name: "Demi",
    paytag: "@demi",
    avatar: "./src/assets/avatar-male.png",
  },
  recentTransactions: [],
  savingsGoals: [],
  cards: [],
  defaultCardId: null,
  holdings: [],
  fxRateUsd: 0.0011, // 1 NGN = 0.0011 USD (mock)
  usdToNgn: 1500, // 1 USD = ₦1500 (mock)
  investAssets: {
    stocks: [
      { id: "AAPL", name: "Apple Inc.", priceUsd: 190.23 },
      { id: "MSFT", name: "Microsoft", priceUsd: 380.5 },
      { id: "TSLA", name: "Tesla", priceUsd: 210.1 },
    ],
    investments: [
      { id: "P54YIELD", name: "PAY54 Yield+ (NGN)", priceUsd: 1.0 },
      { id: "AFRIETF", name: "Africa Growth ETF", priceUsd: 32.7 },
    ],
  },
  aiSignals: [
    {
      id: "RISK-101",
      type: "Velocity",
      severity: "Medium",
      detail: "Unusual number of card attempts in 10 minutes.",
      action: "Soft flag • OTP required",
    },
    {
      id: "RISK-204",
      type: "Location",
      severity: "High",
      detail: "Login from new device + foreign IP.",
      action: "Session limited • ID re-check",
    },
    {
      id: "RISK-309",
      type: "Behaviour",
      severity: "Low",
      detail: "Pattern similar to bill-payment bots.",
      action: "Monitor silently",
    },
  ],
};

// Helpers
function formatNaira(amount) {
  const n = Number(amount) || 0;
  return `₦${n.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatUsd(amount) {
  const n = Number(amount) || 0;
  return `$${n.toFixed(2)}`;
}

function showToast(type, message) {
  const toast = document.getElementById("globalToast");
  if (!toast) return;

  let cls = "toast-info";
  if (type === "success") cls = "toast-success";
  else if (type === "error") cls = "toast-error";
  else if (type === "warning") cls = "toast-warning";

  toast.className = `toast ${cls}`;
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 2600);
}

function showSystemToast(type, message) {
  const toast = document.getElementById("systemToast");
  if (!toast) return;

  let cls = "toast-info";
  if (type === "success") cls = "toast-success";
  else if (type === "error") cls = "toast-error";
  else if (type === "warning") cls = "toast-warning";

  toast.className = `toast ${cls}`;
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.opacity = 1;

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 2800);
}

// Modal helpers
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("show");
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("show");
}

function wireCloseButtons() {
  document.querySelectorAll("[data-close]").forEach((btn) => {
    const targetId = btn.getAttribute("data-close");
    btn.addEventListener("click", () => closeModal(targetId));
  });

  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("show");
      }
    });
  });
}

// Receipt rendering
function openReceiptModal(payload) {
  const body = document.getElementById("receiptBody");
  if (!body) return;

  const lines =
    payload.lines ||
    [
      { label: "Amount", value: payload.amount || "" },
      { label: "To / From", value: payload.party || "" },
    ];

  const metaLines =
    payload.meta ||
    [
      { label: "Channel", value: payload.channel || "PAY54 Wallet" },
      { label: "Status", value: payload.status || "SUCCESS (mock)" },
    ];

  body.innerHTML = `
    <div class="receipt-header">
      <div class="receipt-icon">P54</div>
      <p class="receipt-title">${payload.title || "Transaction Successful"}</p>
      <p class="receipt-subtitle">${payload.subtitle || "Mock demo inside PAY54 sandbox"}</p>
    </div>
    <div class="receipt-section">
      ${lines
        .map(
          (row) => `
        <div class="summary-row">
          <span>${row.label}</span>
          <span><strong>${row.value}</strong></span>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="receipt-section">
      ${metaLines
        .map(
          (row) => `
        <div class="summary-row">
          <span>${row.label}</span>
          <span>${row.value}</span>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="share-row">
      <button class="btn btn-secondary btn-share" id="shareWhatsAppBtn">WhatsApp</button>
      <button class="btn btn-secondary btn-share" id="shareSaveBtn">Save</button>
      <button class="btn btn-secondary btn-share" id="shareEmailBtn">Email</button>
    </div>
  `;

  openModal("receiptModal");

  const summaryText = `${payload.title || "PAY54 Transaction"} • ${
    payload.amount || ""
  } • ${payload.party || ""}`;

  document.getElementById("shareWhatsAppBtn").onclick = () => {
    showSystemToast("info", "In live PAY54 this opens WhatsApp with pre-filled receipt.");
    console.log("WhatsApp share text:", summaryText);
  };
  document.getElementById("shareSaveBtn").onclick = () => {
    showSystemToast("success", "Receipt saved (mock) — in production this saves PDF to device.");
  };
  document.getElementById("shareEmailBtn").onclick = () => {
    showSystemToast("info", "In live PAY54 this opens your mail client with the receipt attached.");
  };
}

// Scroll to top
function initScrollToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 220) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Theme toggle
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");

  const saved = localStorage.getItem("pay54_theme");
  if (saved === "light") {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    icon.textContent = "☀️";
    text.textContent = "Dark mode";
  } else {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    icon.textContent = "🌙";
    text.textContent = "Light mode";
  }

  if (!btn) return;

  btn.addEventListener("click", () => {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      icon.textContent = "☀️";
      text.textContent = "Dark mode";
      localStorage.setItem("pay54_theme", "light");
      showSystemToast("success", "PAY54 switched to Light mode.");
    } else {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      icon.textContent = "🌙";
      text.textContent = "Light mode";
      localStorage.setItem("pay54_theme", "dark");
      showSystemToast("success", "PAY54 switched to Dark mode.");
    }
  });
}

// Header & basic bindings
function initHeader() {
  const nameEl = document.getElementById("userDisplayName");
  const avatarEl = document.getElementById("userAvatar");
  const kyc = document.getElementById("kycLevel");
  const balanceEl = document.getElementById("balanceAmount");
  const acctEl = document.getElementById("walletAddress");

  if (nameEl) nameEl.textContent = pay54State.user.name;
  if (avatarEl) avatarEl.src = pay54State.user.avatar;
  if (kyc) kyc.textContent = pay54State.kycLevel;
  if (balanceEl) balanceEl.textContent = formatNaira(pay54State.balance);
  if (acctEl) acctEl.textContent = `Account: ${pay54State.accountNumber}`;

  const brandHome = document.getElementById("brandHome");
  if (brandHome) {
    brandHome.addEventListener("click", () => {
      showSystemToast("info", "In live PAY54 this returns to the main hub.");
    });
  }

  // user menu
  const menuBtn = document.getElementById("userMenuBtn");
  const dropdown = document.getElementById("userMenuDropdown");
  if (menuBtn && dropdown) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && e.target !== menuBtn) {
        dropdown.classList.remove("show");
      }
    });
  }

  const menuProfile = document.getElementById("menuProfile");
  if (menuProfile) {
    menuProfile.addEventListener("click", () => {
      showToast("info", "Profile center will appear here in the live app.");
    });
  }

  const menuSettings = document.getElementById("menuSettings");
  if (menuSettings) {
    menuSettings.addEventListener("click", () => {
      showToast("info", "Settings & preferences hub (mock stub).");
    });
  }

  const menuLogout = document.getElementById("menuLogout");
  if (menuLogout) {
    menuLogout.addEventListener("click", () => {
      showToast("info", "In production this will log you out to the login screen.");
      setTimeout(() => {
        // If you later create login.html, this will navigate there.
        // window.location.href = "login.html";
      }, 900);
    });
  }
}

// Balance refresh
function initBalanceRefresh() {
  const btn = document.getElementById("refreshBalanceBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    // mock: add small random movement
    const delta = (Math.random() - 0.5) * 5000;
    pay54State.balance = Math.max(0, pay54State.balance + delta);
    const balanceEl = document.getElementById("balanceAmount");
    if (balanceEl) balanceEl.textContent = formatNaira(pay54State.balance);

    showToast("success", "Balance refreshed (mock). In production this syncs with PAY54 core.");
  });
}

// Transactions
function seedMockTransactions() {
  pay54State.recentTransactions = [
    {
      id: "TX-001",
      type: "debit",
      title: "Sent to John Doe",
      desc: "P2P transfer",
      amount: -15000,
      status: "success",
      time: "Today • 09:41",
    },
    {
      id: "TX-002",
      type: "credit",
      title: "From Upwork Ltd.",
      desc: "Freelance payout",
      amount: 120000,
      status: "success",
      time: "Yesterday • 16:20",
    },
    {
      id: "TX-003",
      type: "debit",
      title: "Airtime Top-Up",
      desc: "MTN 3GB bundle",
      amount: -3500,
      status: "success",
      time: "2 days ago",
    },
    {
      id: "TX-004",
      type: "debit",
      title: "NEPA Bill",
      desc: "Ikeja Electric",
      amount: -28000,
      status: "success",
      time: "3 days ago",
    },
  ];
}

function renderTransactions() {
  const list = document.getElementById("transactionsList");
  if (!list) return;

  if (!pay54State.recentTransactions.length) {
    list.innerHTML = `
      <div style="text-align:center;font-size:0.82rem;color:#9ca3af;padding:0.6rem 0.2rem;">
        <div style="font-size:1.4rem;margin-bottom:0.25rem;">📭</div>
        No transactions yet. Start by sending or receiving money.
      </div>
    `;
    return;
  }

  list.innerHTML = pay54State.recentTransactions
    .map((tx) => {
      const amountClass = tx.amount < 0 ? "negative" : "positive";
      const iconClass = tx.type === "debit" ? "sent" : "received";
      const iconEmoji = tx.type === "debit" ? "💸" : "📥";
      return `
        <div class="transaction-item">
          <div class="tx-left">
            <div class="tx-icon ${iconClass}">${iconEmoji}</div>
            <div class="tx-text">
              <div class="tx-title">${tx.title}</div>
              <div class="tx-meta">${tx.desc} • ${tx.time}</div>
            </div>
          </div>
          <div class="tx-right">
            <div class="tx-amount ${amountClass}">
              ${tx.amount < 0 ? "-" : "+"}${formatNaira(Math.abs(tx.amount))}
            </div>
            <span class="tx-status">${tx.status}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

// Money Moves logic
function initSendMoney() {
  const btn = document.getElementById("sendMoneyBtn");
  const amountInput = document.getElementById("sendAmount");
  const feeEl = document.getElementById("sendFeeSummary");
  const totalEl = document.getElementById("sendTotalSummary");
  const confirmBtn = document.getElementById("sendConfirmBtn");

  if (!btn || !amountInput || !feeEl || !totalEl || !confirmBtn) return;

  const recalc = () => {
    const amount = Number(amountInput.value) || 0;
    const fee = amount * 0.005;
    const total = amount + fee;
    feeEl.textContent = formatNaira(fee);
    totalEl.textContent = formatNaira(total);
  };

  amountInput.addEventListener("input", recalc);

  btn.addEventListener("click", () => {
    amountInput.value = "";
    recalc();
    document.getElementById("sendRecipient").value = "";
    document.getElementById("sendNote").value = "";
    openModal("sendMoneyModal");
  });

  confirmBtn.addEventListener("click", () => {
    const recipient = document.getElementById("sendRecipient").value.trim();
    const amount = Number(document.getElementById("sendAmount").value) || 0;
    const note = document.getElementById("sendNote").value.trim();

    if (!recipient || amount <= 0) {
      showToast("error", "Enter recipient and a valid amount.");
      return;
    }

    const fee = amount * 0.005;
    const total = amount + fee;

    if (total > pay54State.balance) {
      showToast("error", "Insufficient balance for this transfer.");
      return;
    }

    pay54State.balance -= total;
    document.getElementById("balanceAmount").textContent = formatNaira(pay54State.balance);

    pay54State.recentTransactions.unshift({
      id: "TX-SEND-" + Date.now(),
      type: "debit",
      title: `Sent to ${recipient}`,
      desc: note || "Wallet transfer",
      amount: -amount,
      status: "success",
      time: "Just now",
    });
    renderTransactions();

    closeModal("sendMoneyModal");

    openReceiptModal({
      title: "Money sent successfully",
      subtitle: "PAY54 wallet to wallet (mock)",
      amount: formatNaira(amount),
      party: recipient,
      lines: [
        { label: "Sent to", value: recipient },
        { label: "Amount", value: formatNaira(amount) },
        { label: "Fee", value: formatNaira(fee) },
        { label: "Total debited", value: formatNaira(total) },
      ],
      meta: [
        { label: "Channel", value: "PAY54 Wallet" },
        { label: "Status", value: "SUCCESS (mock)" },
      ],
    });
  });
}

function drawSimpleQr(canvas, text) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, size, size);

  // mock blocks
  const blocks = text.length;
  for (let i = 0; i < blocks; i++) {
    const x = (i * 13) % size;
    const y = (i * 7) % size;
    ctx.fillStyle = i % 2 === 0 ? "#e5e7eb" : "#1e293b";
    ctx.fillRect(x, y, 6, 6);
  }
  ctx.fillStyle = "#020617";
  ctx.font = "bold 12px system-ui";
  ctx.fillText("PAY54", 8, size - 12);
}

function initReceiveMoney() {
  const btn = document.getElementById("receiveMoneyBtn");
  const shareBtn = document.getElementById("sharePaylinkBtn");
  const canvas = document.getElementById("receiveQrCanvas");
  const paylinkDisplay = document.getElementById("paylinkDisplay");

  if (!btn || !shareBtn || !canvas) return;

  btn.addEventListener("click", () => {
    const link = `https://pay54.app/${pay54State.user.paytag}`;
    if (paylinkDisplay) paylinkDisplay.textContent = link;
    drawSimpleQr(canvas, link);
    document.getElementById("receiveFrom").value = "";
    document.getElementById("receiveAmount").value = "";
    document.getElementById("receiveNote").value = "";
    openModal("receiveMoneyModal");
  });

  shareBtn.addEventListener("click", () => {
    const from = document.getElementById("receiveFrom").value.trim() || "Sender";
    const amt = Number(document.getElementById("receiveAmount").value) || 0;
    const link = `https://pay54.app/${pay54State.user.paytag}`;
    const msg = `Hi ${from},\nPlease pay me ${formatNaira(
      amt
    )} via PAY54 using this paylink:\n${link}`;

    console.log("Share payload:", msg);
    showSystemToast(
      "info",
      "In live PAY54 this opens SMS / WhatsApp / email with your paylink details."
    );
  });
}

function initAddWithdraw() {
  const btn = document.getElementById("addWithdrawBtn");
  const confirmBtn = document.getElementById("fundConfirmBtn");

  if (!btn || !confirmBtn) return;

  btn.addEventListener("click", () => {
    document.getElementById("fundAction").value = "add";
    document.getElementById("fundMethod").value = "card";
    document.getElementById("fundAmount").value = "";
    document.getElementById("fundNote").value = "";
    openModal("addWithdrawModal");
  });

  confirmBtn.addEventListener("click", () => {
    const action = document.getElementById("fundAction").value;
    const method = document.getElementById("fundMethod").value;
    const amount = Number(document.getElementById("fundAmount").value) || 0;
    const note = document.getElementById("fundNote").value.trim();

    if (amount <= 0) {
      showToast("error", "Enter a valid amount.");
      return;
    }

    const directionText = action === "add" ? "Added" : "Withdrawn";

    if (action === "add") {
      pay54State.balance += amount;
      pay54State.recentTransactions.unshift({
        id: "TX-FUND-" + Date.now(),
        type: "credit",
        title: `${directionText} via ${method}`,
        desc: note || "Funding wallet",
        amount: amount,
        status: "success",
        time: "Just now",
      });
    } else {
      if (amount > pay54State.balance) {
        showToast("error", "Insufficient balance to withdraw.");
        return;
      }
      pay54State.balance -= amount;
      pay54State.recentTransactions.unshift({
        id: "TX-FUND-" + Date.now(),
        type: "debit",
        title: `${directionText} via ${method}`,
        desc: note || "Withdrawal from wallet",
        amount: -amount,
        status: "success",
        time: "Just now",
      });
    }

    document.getElementById("balanceAmount").textContent = formatNaira(pay54State.balance);
    renderTransactions();
    closeModal("addWithdrawModal");

    openReceiptModal({
      title: `${directionText} successfully`,
      amount: formatNaira(amount),
      party: method.toUpperCase(),
      lines: [
        { label: "Action", value: action === "add" ? "Add money" : "Withdraw" },
        { label: "Method", value: method },
        { label: "Amount", value: formatNaira(amount) },
      ],
      meta: [
        { label: "Channel", value: "PAY54 Hybrid rails (mock)" },
        { label: "Status", value: "SUCCESS (mock)" },
      ],
    });
  });
}

function initBankTransfer() {
  const btn = document.getElementById("bankTransferBtn");
  const confirmBtn = document.getElementById("bankTransferConfirmBtn");

  if (!btn || !confirmBtn) return;

  btn.addEventListener("click", () => {
    document.getElementById("bankRecipientName").value = "";
    document.getElementById("bankName").value = "";
    document.getElementById("bankAccountNumber").value = "";
    document.getElementById("bankAmount").value = "";
    document.getElementById("bankReference").value = "";
    openModal("bankTransferModal");
  });

  confirmBtn.addEventListener("click", () => {
    const name = document.getElementById("bankRecipientName").value.trim();
    const bank = document.getElementById("bankName").value.trim();
    const acct = document.getElementById("bankAccountNumber").value.trim();
    const amount = Number(document.getElementById("bankAmount").value) || 0;
    const ref = document.getElementById("bankReference").value.trim();

    if (!name || !bank || acct.length !== 10 || amount <= 0) {
      showToast("error", "Fill recipient, bank, 10-digit account and amount.");
      return;
    }

    if (amount > pay54State.balance) {
      showToast("error", "Insufficient balance for bank transfer.");
      return;
    }

    pay54State.balance -= amount;
    document.getElementById("balanceAmount").textContent = formatNaira(pay54State.balance);

    pay54State.recentTransactions.unshift({
      id: "TX-BANK-" + Date.now(),
      type: "debit",
      title: `Bank Transfer to ${name}`,
      desc: `${bank} • ${ref || "Wallet-to-bank"}`,
      amount: -amount,
      status: "success",
      time: "Just now",
    });
    renderTransactions();

    closeModal("bankTransferModal");

    openReceiptModal({
      title: "Bank transfer successful",
      amount: formatNaira(amount),
      party: `${name} • ${bank} (${acct})`,
      lines: [
        { label: "Recipient", value: name },
        { label: "Bank", value: bank },
        { label: "Account", value: acct },
        { label: "Amount", value: formatNaira(amount) },
        { label: "Reference", value: ref || "N/A" },
      ],
      meta: [
        { label: "Channel", value: "PAY54 → NGN Bank (mock)" },
        { label: "Status", value: "SUCCESS (mock)" },
      ],
    });
  });
}

// Services: Cross-border
function initCrossBorder() {
  const card = document.getElementById("serviceCrossBorder");
  const confirmBtn = document.getElementById("fxConfirmBtn");
  if (!card || !confirmBtn) return;

  card.addEventListener("click", () => {
    document.getElementById("fxRecipientName").value = "";
    document.getElementById("fxCountry").value = "";
    document.getElementById("fxAmount").value = "";
    document.getElementById("fxReason").value = "";
    document.getElementById("fxNotes").value = "";
    openModal("crossBorderModal");
  });

  confirmBtn.addEventListener("click", () => {
    const name = document.getElementById("fxRecipientName").value.trim();
    const country = document.getElementById("fxCountry").value.trim();
    const amount = Number(document.getElementById("fxAmount").value) || 0;
    const reason = document.getElementById("fxReason").value.trim();
    const notes = document.getElementById("fxNotes").value.trim();

    if (!name || !country || amount <= 0) {
      showToast("error", "Fill recipient, country and amount.");
      return;
    }

    const usd = amount * pay54State.fxRateUsd;

    pay54State.recentTransactions.unshift({
      id: "TX-FX-" + Date.now(),
      type: "debit",
      title: `FX to ${name}`,
      desc: `${country} • ${reason || "Cross-border support"}`,
      amount: -amount,
      status: "success",
      time: "Just now",
    });
    renderTransactions();

    closeModal("crossBorderModal");

    openReceiptModal({
      title: "Cross-border preview (mock)",
      amount: `${formatNaira(amount)} ≈ ${formatUsd(usd)}`,
      party: `${name} • ${country}`,
      lines: [
        { label: "Recipient", value: name },
        { label: "Country", value: country },
        { label: "Send amount", value: formatNaira(amount) },
        { label: "FX equivalent", value: formatUsd(usd) },
        { label: "Reason", value: reason || "N/A" },
      ],
      meta: [
        { label: "Rails", value: "PAY54 hybrid FX partners (mock)" },
        { label: "Status", value: "PREVIEW ONLY" },
      ],
    });
  });
}

// Savings
function renderSavingsGoals() {
  const list = document.getElementById("savingsGoalsList");
  if (!list) return;

  if (!pay54State.savingsGoals.length) {
    list.innerHTML = `<div style="color:#9ca3af;">No goals created yet.</div>`;
    return;
  }

  list.innerHTML = pay54State.savingsGoals
    .map((g) => {
      const pct = Math.min(100, (g.current / g.target) * 100 || 0).toFixed(0);
      return `
        <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.4rem 0.5rem;margin-bottom:0.3rem;">
          <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:0.18rem;">
            <span>${g.name}</span><span>${pct}%</span>
          </div>
          <div style="width:100%;height:6px;border-radius:999px;background:#020617;overflow:hidden;margin-bottom:0.2rem;">
            <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#22c55e,#4ade80);"></div>
          </div>
          <div style="font-size:0.75rem;color:#9ca3af;">
            ${formatNaira(g.current)} / ${formatNaira(g.target)} • SO: ${formatNaira(
        g.so
      )}/month
          </div>
        </div>
      `;
    })
    .join("");
}

function initSavings() {
  const card = document.getElementById("serviceSavings");
  const createBtn = document.getElementById("savingsCreateBtn");
  if (!card || !createBtn) return;

  card.addEventListener("click", () => {
    renderSavingsGoals();
    document.getElementById("savingsGoalName").value = "";
    document.getElementById("savingsTarget").value = "";
    document.getElementById("savingsStandingOrder").value = "";
    openModal("savingsModal");
  });

  createBtn.addEventListener("click", () => {
    const name = document.getElementById("savingsGoalName").value.trim();
    const target = Number(document.getElementById("savingsTarget").value) || 0;
    const so = Number(document.getElementById("savingsStandingOrder").value) || 0;

    if (!name || target <= 0 || so <= 0) {
      showToast("error", "Goal name, target and standing order are required.");
      return;
    }

    const existing = pay54State.savingsGoals.find((g) => g.name === name);
    if (existing) {
      existing.target = target;
      existing.so = so;
    } else {
      pay54State.savingsGoals.push({
        id: "GOAL-" + Date.now(),
        name,
        target,
        current: 0,
        so,
      });
    }

    renderSavingsGoals();
    showToast("success", "Savings goal created / updated (mock).");
  });
}

// Bills
function renderBillFields() {
  const type = document.getElementById("billType").value;
  const container = document.getElementById("billDynamicFields");
  if (!container) return;

  if (type === "airtime") {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">Airtime Provider</label>
        <select id="billProvider" class="form-select">
          <option>MTN</option>
          <option>GLO</option>
          <option>Airtel</option>
          <option>9mobile</option>
          <option>Orange</option>
          <option>Vodacom</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Phone Number</label>
        <input type="tel" class="form-input" id="billPhone" placeholder="e.g. 0803..." />
      </div>
      <div class="form-group">
        <label class="form-label">Amount (₦)</label>
        <input type="number" class="form-input" id="billAmount" placeholder="e.g. 2000" />
      </div>
      <div class="form-group">
        <label class="form-label">Recurring?</label>
        <select id="billRecurring" class="form-select">
          <option value="none">No recurring</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">Account / Meter Number</label>
        <input type="text" class="form-input" id="billAccount" placeholder="Account or meter number" />
      </div>
      ${
        type === "electricity" || type === "water"
          ? `
      <div class="form-group">
        <label class="form-label">Provider</label>
        <input type="text" class="form-input" id="billProvider" placeholder="e.g. Ikeja Electric, Lagos Water" />
      </div>
      `
          : ""
      }
      <div class="form-group">
        <label class="form-label">Plan</label>
        <select id="billPlan" class="form-select">
          <option value="basic">Basic</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Amount (₦)</label>
        <input type="number" class="form-input" id="billAmount" placeholder="e.g. 15000" />
      </div>
      <div class="form-group">
        <label class="form-label">Recurring?</label>
        <select id="billRecurring" class="form-select">
          <option value="none">No recurring</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    `;
  }
}

function initBills() {
  const card = document.getElementById("serviceBills");
  const typeSelect = document.getElementById("billType");
  const payBtn = document.getElementById("billPayBtn");
  if (!card || !typeSelect || !payBtn) return;

  card.addEventListener("click", () => {
    renderBillFields();
    openModal("billsModal");
  });

  typeSelect.addEventListener("change", renderBillFields);

  payBtn.addEventListener("click", () => {
    const type = document.getElementById("billType").value;
    const amount = Number(document.getElementById("billAmount").value) || 0;
    const recurring = document.getElementById("billRecurring").value;

    if (amount <= 0) {
      showToast("error", "Enter a valid amount.");
      return;
    }
    if (amount > pay54State.balance) {
      showToast("error", "Insufficient balance for bill payment.");
      return;
    }

    let label = "";
    if (type === "airtime") {
      const provider = document.getElementById("billProvider").value;
      const phone = document.getElementById("billPhone").value;
      label = `Airtime (${provider}) • ${phone}`;
    } else {
      const account = document.getElementById("billAccount").value;
      const provider =
        (document.getElementById("billProvider") && document.getElementById("billProvider").value) ||
        type.toUpperCase();
      label = `${type.toUpperCase()} • ${provider} • ${account}`;
    }

    pay54State.balance -= amount;
    document.getElementById("balanceAmount").textContent = formatNaira(pay54State.balance);

    pay54State.recentTransactions.unshift({
      id: "TX-BILL-" + Date.now(),
      type: "debit",
      title: "Bill Payment",
      desc: label,
      amount: -amount,
      status: "success",
      time: "Just now",
    });
    renderTransactions();
    closeModal("billsModal");

    openReceiptModal({
      title: "Bill paid successfully",
      amount: formatNaira(amount),
      party: label,
      lines: [
        { label: "Bill type", value: type },
        { label: "Amount", value: formatNaira(amount) },
        { label: "Recurring", value: recurring === "none" ? "One-off" : recurring },
      ],
      meta: [
        { label: "Channel", value: "PAY54 Bills Hub (mock)" },
        { label: "Status", value: "SUCCESS (mock)" },
      ],
    });
  });
}

// Cards
function seedCards() {
  pay54State.cards = [
    {
      id: "VIRTUAL",
      type: "virtual",
      brand: "PAY54 VISA",
      last4: "1122",
      bank: "PAY54",
      contactless: true,
    },
    {
      id: "CARD1",
      type: "linked",
      brand: "VISA",
      last4: "4452",
      bank: "GTBank",
      contactless: true,
    },
    {
      id: "CARD2",
      type: "linked",
      brand: "MASTERCARD",
      last4: "7719",
      bank: "Zenith Bank",
      contactless: true,
    },
    {
      id: "CARD3",
      type: "linked",
      brand: "VERVE",
      last4: "9034",
      bank: "First Bank",
      contactless: true,
    },
  ];
  pay54State.defaultCardId = "VIRTUAL";
}

function renderCards() {
  const primaryContainer = document.getElementById("primaryCardDisplay");
  const allList = document.getElementById("allCardsList");
  if (!primaryContainer || !allList) return;

  const cards = pay54State.cards;
  if (!cards.length) {
    primaryContainer.innerHTML = `<div style="font-size:0.8rem;color:#9ca3af;">No cards linked yet.</div>`;
    allList.innerHTML = "";
    return;
  }

  const defaultCard =
    cards.find((c) => c.id === pay54State.defaultCardId) || cards[0];

  const renderCardHtml = (card, withActions) => {
    const isVirtual = card.type === "virtual";
    const isDefault = card.id === pay54State.defaultCardId;
    return `
      <div style="
        border-radius:14px;
        padding:0.6rem 0.7rem;
        margin-bottom:0.4rem;
        background:linear-gradient(135deg,#1e293b,#020617);
        color:#e5e7eb;
        border:1px solid ${isDefault ? "rgba(59,130,246,0.9)" : "rgba(148,163,184,0.6)"};
      ">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
          <span style="font-size:0.78rem;">${isVirtual ? "Virtual Card" : "Linked Card"}</span>
          <span style="font-size:0.9rem;font-weight:600;">${card.brand}</span>
        </div>
        <div style="font-size:0.9rem;letter-spacing:0.15em;margin-bottom:0.2rem;">
          •••• •••• •••• ${card.last4}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#9ca3af;margin-bottom:0.25rem;">
          <span>${card.bank}</span>
          <span>${card.contactless ? "📶 Tap-to-Pay" : ""}</span>
        </div>
        ${
          withActions
            ? `
        <div style="display:flex;gap:0.3rem;margin-top:0.25rem;">
          <button class="btn btn-secondary" data-set-default="${card.id}" style="font-size:0.75rem;">
            ${isDefault ? "Default ✓" : "Set default"}
          </button>
          ${
            isVirtual
              ? ""
              : `<button class="btn btn-ghost" data-delete-card="${card.id}" style="font-size:0.75rem;">Delete</button>`
          }
        </div>
        `
            : ""
        }
      </div>
    `;
  };

  primaryContainer.innerHTML = renderCardHtml(defaultCard, false);
  allList.innerHTML = cards
    .map((c) => renderCardHtml(c, true))
    .join("");

  // bind buttons
  allList.querySelectorAll("[data-set-default]").forEach((btn) => {
    const id = btn.getAttribute("data-set-default");
    btn.addEventListener("click", () => {
      pay54State.defaultCardId = id;
      renderCards();
      showSystemToast("success", "Default card updated (mock).");
    });
  });

  allList.querySelectorAll("[data-delete-card]").forEach((btn) => {
    const id = btn.getAttribute("data-delete-card");
    btn.addEventListener("click", () => {
      pay54State.cards = pay54State.cards.filter((c) => c.id !== id);
      if (pay54State.defaultCardId === id) {
        pay54State.defaultCardId = "VIRTUAL";
      }
      renderCards();
      showToast("success", "Card removed (mock).");
    });
  });
}

function initCards() {
  const card = document.getElementById("serviceCards");
  const toggleBtn = document.getElementById("toggleAllCardsBtn");
  const addBtn = document.getElementById("cardAddBtn");
  const allList = document.getElementById("allCardsList");

  if (!card || !toggleBtn || !addBtn || !allList) return;

  card.addEventListener("click", () => {
    renderCards();
    allList.style.display = "none";
    toggleBtn.textContent = "Show all cards";
    document.getElementById("cardNumber").value = "";
    document.getElementById("cardExpiry").value = "";
    document.getElementById("cardCvv").value = "";
    openModal("cardsModal");
  });

  toggleBtn.addEventListener("click", () => {
    const visible = allList.style.display !== "none";
    allList.style.display = visible ? "none" : "block";
    toggleBtn.textContent = visible ? "Show all cards" : "Hide cards list";
  });

  addBtn.addEventListener("click", () => {
    const num = document.getElementById("cardNumber").value.replace(/\s+/g, "");
    const exp = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCvv").value.trim();

    if (num.length !== 16 || !exp || cvv.length !== 3) {
      showToast("error", "Enter 16-digit card, expiry and 3-digit CVV.");
      return;
    }

    const last4 = num.slice(-4);
    const newCard = {
      id: "CARD-" + Date.now(),
      type: "linked",
      brand: "VISA",
      last4,
      bank: "Linked Bank",
      contactless: true,
    };
    pay54State.cards.push(newCard);
    pay54State.defaultCardId = newCard.id;
    renderCards();
    showToast("success", "Card linked (mock).");
  });
}

// Shop on the Fly
function initShop() {
  const card = document.getElementById("serviceShop");
  const body = document.getElementById("shopBody");
  if (!card || !body) return;

  card.addEventListener("click", () => {
    body.innerHTML = `
      <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:0.4rem;">
        In live PAY54, these tiles deep-link into partner apps with affiliate rails.
      </div>
      <div style="display:flex;flex-direction:column;gap:0.35rem;">
        <div>
          <strong>🚕 Taxi</strong>
          <div style="font-size:0.78rem;color:#9ca3af;">Bolt • Uber • Local ride partners</div>
          <button class="btn btn-secondary btn-sm" data-shop-cat="taxi" style="margin-top:0.2rem;font-size:0.76rem;">View taxi partners</button>
        </div>
        <div>
          <strong>🍔 Food</strong>
          <div style="font-size:0.78rem;color:#9ca3af;">Dominos • KFC • Local meals</div>
          <button class="btn btn-secondary btn-sm" data-shop-cat="food" style="margin-top:0.2rem;font-size:0.76rem;">View food partners</button>
        </div>
        <div>
          <strong>🎟 Tickets</strong>
          <div style="font-size:0.78rem;color:#9ca3af;">Concerts • Cinema • Football games</div>
          <button class="btn btn-secondary btn-sm" data-shop-cat="tickets" style="margin-top:0.2rem;font-size:0.76rem;">View ticket partners</button>
        </div>
        <div>
          <strong>🛍 Shops</strong>
          <div style="font-size:0.78rem;color:#9ca3af;">Jiji • Jumia • AliExpress • Temu</div>
          <button class="btn btn-secondary btn-sm" data-shop-cat="shops" style="margin-top:0.2rem;font-size:0.76rem;">View shop partners</button>
        </div>
      </div>
    `;
    body.querySelectorAll("[data-shop-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-shop-cat");
        showSystemToast(
          "info",
          `In live PAY54 this opens ${cat} partners with affiliate tracking.`
        );
      });
    });
    openModal("shopModal");
  });
}

// Investments
let currentInvestTab = "stocks";
let currentBuyAsset = null;

function renderInvestList() {
  const list = document.getElementById("investList");
  if (!list) return;

  const assets =
    currentInvestTab === "stocks"
      ? pay54State.investAssets.stocks
      : pay54State.investAssets.investments;

  list.innerHTML = assets
    .map(
      (a) => `
      <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.4rem 0.5rem;margin-bottom:0.3rem;font-size:0.82rem;display:flex;justify-content:space-between;align-items:center;gap:0.4rem;">
        <div>
          <div style="font-weight:600;">${a.id} • ${a.name}</div>
          <div style="font-size:0.76rem;color:#9ca3af;">
            Price: ${formatUsd(a.priceUsd)} • ≈ ${formatNaira(a.priceUsd * pay54State.usdToNgn)}
          </div>
        </div>
        <button class="btn btn-primary" data-invest-id="${a.id}" style="font-size:0.75rem;">Buy now</button>
      </div>
    `
    )
    .join("");

  list.querySelectorAll("[data-invest-id]").forEach((btn) => {
    const id = btn.getAttribute("data-invest-id");
    btn.addEventListener("click", () => {
      const assets =
        currentInvestTab === "stocks"
          ? pay54State.investAssets.stocks
          : pay54State.investAssets.investments;
      currentBuyAsset = assets.find((x) => x.id === id);
      if (!currentBuyAsset) return;

      document.getElementById(
        "investBuyTitle"
      ).textContent = `Buy ${currentBuyAsset.id} (${currentInvestTab})`;
      document.getElementById("investUnits").value = 1;
      document.getElementById("investCurrency").value = "USD";
      document.getElementById("investUnitPriceLabel").textContent = formatUsd(
        currentBuyAsset.priceUsd
      );
      document.getElementById("investTotalLabel").textContent = formatUsd(
        currentBuyAsset.priceUsd
      );
      openModal("investBuyModal");
    });
  });
}

function initInvest() {
  const card = document.getElementById("serviceInvest");
  const tabStocksBtn = document.getElementById("tabStocksBtn");
  const tabInvestmentsBtn = document.getElementById("tabInvestmentsBtn");
  const buyConfirmBtn = document.getElementById("investBuyConfirmBtn");
  const unitsInput = document.getElementById("investUnits");
  const currencySelect = document.getElementById("investCurrency");

  if (!card || !tabStocksBtn || !tabInvestmentsBtn || !buyConfirmBtn) return;

  card.addEventListener("click", () => {
    currentInvestTab = "stocks";
    renderInvestList();
    openModal("investModal");
  });

  tabStocksBtn.addEventListener("click", () => {
    currentInvestTab = "stocks";
    renderInvestList();
  });

  tabInvestmentsBtn.addEventListener("click", () => {
    currentInvestTab = "investments";
    renderInvestList();
  });

  function recalcInvestTotal() {
    if (!currentBuyAsset) return;
    const units = Number(unitsInput.value) || 0;
    const currency = currencySelect.value;
    const base = units * currentBuyAsset.priceUsd;
    if (currency === "USD") {
      document.getElementById("investTotalLabel").textContent = formatUsd(base);
    } else {
      document.getElementById("investTotalLabel").textContent = formatNaira(
        base * pay54State.usdToNgn
      );
    }
  }

  unitsInput.addEventListener("input", recalcInvestTotal);
  currencySelect.addEventListener("change", recalcInvestTotal);

  buyConfirmBtn.addEventListener("click", () => {
    if (!currentBuyAsset) return;
    const units = Number(unitsInput.value) || 0;
    const currency = currencySelect.value;

    if (units <= 0) {
      showToast("error", "Enter units to buy.");
      return;
    }

    const baseUsd = units * currentBuyAsset.priceUsd;
    const totalNgn = baseUsd * pay54State.usdToNgn;
    const payText = currency === "USD" ? formatUsd(baseUsd) : formatNaira(totalNgn);

    // For demo we do NOT actually deduct from wallet to keep it simple
    pay54State.holdings.push({
      id: currentBuyAsset.id,
      name: currentBuyAsset.name,
      units,
      priceUsd: currentBuyAsset.priceUsd,
      currencyPaid: currency,
      totalUsd: baseUsd,
      totalNgn: totalNgn,
      time: "Just now",
    });

    pay54State.recentTransactions.unshift({
      id: "TX-INV-" + Date.now(),
      type: "debit",
      title: `Bought ${currentBuyAsset.id}`,
      desc: `${units} unit(s) • Paid in ${currency}`,
      amount: 0, // not touching main balance in this mock
      status: "success",
      time: "Just now",
    });
    renderTransactions();

    closeModal("investBuyModal");

    openReceiptModal({
      title: "Investment placed (mock)",
      amount: payText,
      party: `${currentBuyAsset.id} • ${currentBuyAsset.name}`,
      lines: [
        { label: "Asset", value: currentBuyAsset.id },
        { label: "Units", value: String(units) },
        { label: "Currency", value: currency },
        { label: "Total (USD)", value: formatUsd(baseUsd) },
        { label: "Total (₦ approx.)", value: formatNaira(totalNgn) },
      ],
      meta: [
        { label: "Channel", value: "PAY54 Invest Hub (mock)" },
        { label: "Status", value: "SUCCESS (mock)" },
      ],
    });
  });
}

// Agent
function initAgent() {
  const card = document.getElementById("serviceAgent");
  const submitBtn = document.getElementById("agentSubmitBtn");
  if (!card || !submitBtn) return;

  card.addEventListener("click", () => {
    document.getElementById("agentFullName").value = "";
    document.getElementById("agentBusinessName").value = "";
    document.getElementById("agentNin").value = "";
    document.getElementById("agentSelfie").value = "";
    openModal("agentModal");
  });

  submitBtn.addEventListener("click", () => {
    const name = document.getElementById("agentFullName").value.trim();
    const biz = document.getElementById("agentBusinessName").value.trim();
    const nin = document.getElementById("agentNin").value.trim();
    const selfie = document.getElementById("agentSelfie").files[0];

    if (!name || !biz || nin.length !== 11 || !selfie) {
      showToast("error", "Full name, business, valid NIN and selfie are required.");
      return;
    }

    closeModal("agentModal");

    openReceiptModal({
      title: "Agent application submitted",
      amount: "",
      party: name,
      lines: [
        { label: "Full name", value: name },
        { label: "Business", value: biz },
        { label: "NIN", value: nin },
      ],
      meta: [
        { label: "Status", value: "Pending KYC review (mock)" },
        { label: "Channel", value: "PAY54 Agent Onboarding" },
      ],
    });
  });
}

// AI Risk Watch
function initAiRisk() {
  const card = document.getElementById("serviceAiRisk");
  const body = document.getElementById("aiRiskBody");
  if (!card || !body) return;

  card.addEventListener("click", () => {
    body.innerHTML = `
      <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:0.4rem;">
        Mock AI dashboard showing how PAY54 flags risky patterns before they hurt the user.
      </div>
      ${pay54State.aiSignals
        .map(
          (s) => `
        <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.4rem 0.5rem;margin-bottom:0.3rem;font-size:0.8rem;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.2rem;">
            <span><strong>${s.id}</strong> • ${s.type}</span>
            <span style="font-size:0.75rem;color:#f97316;">${s.severity}</span>
          </div>
          <div style="font-size:0.78rem;color:#e5e7eb;margin-bottom:0.2rem;">${s.detail}</div>
          <div style="font-size:0.76rem;color:#9ca3af;">Action: ${s.action}</div>
        </div>
      `
        )
        .join("")}
    `;
    openModal("aiRiskModal");
  });
}

// View all transactions (mock)
function initViewAllTx() {
  const btn = document.getElementById("viewAllTxBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    showSystemToast(
      "info",
      "In live PAY54 this opens a full searchable statement view with filters."
    );
  });
}

// Welcome
function showWelcome() {
  showSystemToast("success", `Welcome back, ${pay54State.user.name} — PAY54 hybrid wallet ready.`);
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  seedMockTransactions();
  seedCards();
  renderTransactions();

  initHeader();
  initThemeToggle();
  initBalanceRefresh();
  initScrollToTop();
  wireCloseButtons();

  initSendMoney();
  initReceiveMoney();
  initAddWithdraw();
  initBankTransfer();
  initCrossBorder();
  initSavings();
  initBills();
  initCards();
  initShop();
  initInvest();
  initAgent();
  initAiRisk();
  initViewAllTx();

  showWelcome();
});
