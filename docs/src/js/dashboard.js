// PAY54 v6.1 Hybrid Dashboard
// CTO edition – mock, interactive, click-ready

// --- GLOBAL STATE ---
let currentUser = {
  id: "user-001",
  full_name: "Demi Olawoye",
  email: "demo@pay54.app",
  wallet_address: "P54-8892-4410-1123",
  account_number: "8892441011",
  kyc_level: "Tier 2 (Verified)",
  avatar: "./src/assets/user.png",
  preferences: {
    theme: "light",
  },
};

let currentBalance = 250000; // ₦
let transactions = [];
let cards = [];
let holdings = {
  stocks: [],
  investments: [],
};

// --- DOM READY ---
document.addEventListener("DOMContentLoaded", () => {
  smartLoader();
  applyThemeFromStorage();
  initUserUI();
  initBalanceAndTx();
  wireNavbar();
  wireMoneyMoves();
  wireServices();
  wireBillsFormLogic();
});

// =============== SMART LOADER ===============
function smartLoader() {
  const splash = document.getElementById("splashOverlay");
  if (!splash) return;

  // Simulate brief load then reveal dashboard
  setTimeout(() => {
    splash.classList.add("hidden");
    setTimeout(() => {
      splash.style.display = "none";
      showWelcomeToast();
    }, 520);
  }, 1200);
}

// =============== THEME ===============
function applyThemeFromStorage() {
  const saved = localStorage.getItem("pay54_theme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
  }
  updateThemeUI();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("pay54_theme", isDark ? "dark" : "light");
  updateThemeUI();
  showToast(
    "success",
    isDark ? "🌙 Dark mode locked in." : "☀️ Light mode restored."
  );
}

function updateThemeUI() {
  const isDark = document.body.classList.contains("dark-mode");
  const icon = document.getElementById("themeIcon");
  const text = document.getElementById("themeText");
  if (!icon || !text) return;
  icon.textContent = isDark ? "☀️" : "🌙";
  text.textContent = isDark ? "Light Mode" : "Dark Mode";
}

// =============== USER + BALANCE + TX ===============
function initUserUI() {
  const userName = document.getElementById("userName");
  const welcomeName = document.getElementById("welcomeName");
  const avatar = document.getElementById("userAvatar");

  if (userName) userName.textContent = currentUser.full_name.split(" ")[0];
  if (welcomeName) welcomeName.textContent = currentUser.full_name.split(" ")[0];
  if (avatar) avatar.src = currentUser.avatar;
}

function initBalanceAndTx() {
  // Mock starting balance
  updateBalanceDisplay();

  // Mock transactions
  transactions = [
    {
      id: "tx1",
      type: "debit",
      title: "Sent to John Doe",
      desc: "P2P Transfer",
      amount: -15000,
      tag: "P2P",
      date: "Today • 09:20",
    },
    {
      id: "tx2",
      type: "credit",
      title: "From Upwork Ltd",
      desc: "Freelance payment",
      amount: 85000,
      tag: "Income",
      date: "Yesterday • 18:04",
    },
    {
      id: "tx3",
      type: "debit",
      title: "IKEJA Electric",
      desc: "Electricity bill (recurring)",
      amount: -22000,
      tag: "Bills",
      date: "2 days ago",
    },
    {
      id: "tx4",
      type: "debit",
      title: "Spotify NG",
      desc: "Card charge",
      amount: -1900,
      tag: "Cards",
      date: "3 days ago",
    },
  ];

  renderTransactions();

  // Mock cards
  cards = [
    {
      id: "virtual",
      label: "PAY54 Virtual VISA",
      type: "virtual",
      masked: "**** **** **** 4452",
      brand: "VISA",
      bank: "PAY54",
      default: true,
    },
    {
      id: "gtb",
      label: "GTBank Naira Debit",
      type: "linked",
      masked: "**** **** **** 1203",
      brand: "VISA",
      bank: "GTBank",
      default: false,
    },
    {
      id: "zenith",
      label: "Zenith MasterCard",
      type: "linked",
      masked: "**** **** **** 7788",
      brand: "Mastercard",
      bank: "Zenith",
      default: false,
    },
    {
      id: "access",
      label: "Access Contactless",
      type: "linked",
      masked: "**** **** **** 3399",
      brand: "VISA",
      bank: "Access",
      default: false,
    },
  ];
}

// helper
function updateBalanceDisplay() {
  const el = document.getElementById("balanceAmount");
  const walletEl = document.getElementById("walletAddress");
  const acctEl = document.getElementById("walletAccount");
  const kycEl = document.getElementById("kycLevel");

  if (el) el.textContent = formatNaira(currentBalance);
  if (walletEl)
    walletEl.textContent = `Wallet: ${currentUser.wallet_address}`;
  if (acctEl) acctEl.textContent = currentUser.account_number;
  if (kycEl) kycEl.textContent = currentUser.kyc_level;
}

// =============== NAVBAR EVENTS ===============
function wireNavbar() {
  const themeToggle = document.getElementById("themeToggle");
  const userMenuBtn = document.getElementById("userMenuBtn");
  const dropdown = document.getElementById("userMenuDropdown");
  const profileBtn = document.getElementById("profileBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

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

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      showSystemToast(
        "info",
        "👤 Profile: In MVP, this will show personal info, limits & KYC documents."
      );
    });
  }
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      showSystemToast(
        "info",
        "⚙️ Settings: In production this controls PIN, devices, alerts & security."
      );
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // For now, just simulate logout; in real build, redirect to /login.html
      showToast("success", "🚪 You’ve been safely logged out (demo).");
      setTimeout(() => {
        // window.location.href = "src/pages/login.html";
      }, 800);
    });
  }
}

// =============== MONEY MOVES ===============
function wireMoneyMoves() {
  const sendBtn = document.getElementById("sendMoneyBtn");
  const receiveBtn = document.getElementById("receiveMoneyBtn");
  const addBtn = document.getElementById("addMoneyBtn");
  const bankBtn = document.getElementById("bankTransferBtn");
  const refreshBtn = document.getElementById("refreshBalanceBtn");
  const viewAllBtn = document.getElementById("viewAllBtn");

  if (sendBtn)
    sendBtn.addEventListener("click", () => openModal("sendMoneyModal"));
  if (receiveBtn)
    receiveBtn.addEventListener("click", () =>
      openModal("receiveMoneyModal")
    );
  if (addBtn)
    addBtn.addEventListener("click", () => {
      showSystemToast(
        "info",
        "➕ In production this will let you add money from cards, bank and agents."
      );
    });
  if (bankBtn)
    bankBtn.addEventListener("click", () => openModal("bankTransferModal"));
  if (refreshBtn)
    refreshBtn.addEventListener("click", () => {
      showSystemToast("success", "🔄 Balance refreshed (mock).");
      updateBalanceDisplay();
    });
  if (viewAllBtn)
    viewAllBtn.addEventListener("click", () =>
      showSystemToast(
        "info",
        "📊 Full statement view will live here in the production build."
      )
    );

  // Confirm buttons
  const confirmSendBtn = document.getElementById("confirmSendBtn");
  const confirmReceiveBtn = document.getElementById("confirmReceiveBtn");
  const confirmBankBtn = document.getElementById("confirmBankTransferBtn");

  if (confirmSendBtn)
    confirmSendBtn.addEventListener("click", handleSendMoney);
  if (confirmReceiveBtn)
    confirmReceiveBtn.addEventListener("click", handleReceiveMoney);
  if (confirmBankBtn)
    confirmBankBtn.addEventListener("click", handleBankTransfer);

  // live fee preview for send
  const sendAmount = document.getElementById("sendAmount");
  if (sendAmount) sendAmount.addEventListener("input", updateSendSummary);
}

function handleSendMoney() {
  const recipient = document.getElementById("sendRecipient").value.trim();
  const amountRaw = parseFloat(
    document.getElementById("sendAmount").value || "0"
  );
  const note = document.getElementById("sendNote").value.trim();
  const alertBox = document.getElementById("sendAlert");

  if (!recipient || !amountRaw || amountRaw <= 0) {
    if (alertBox)
      alertBox.textContent = "Recipient and a valid amount are required.";
    return;
  }

  const fee = amountRaw * 0.005;
  const total = amountRaw + fee;

  if (total > currentBalance) {
    if (alertBox)
      alertBox.textContent =
        "Insufficient balance for this transfer including fees.";
    return;
  }

  currentBalance -= total;
  updateBalanceDisplay();

  transactions.unshift({
    id: "tx-" + Date.now(),
    type: "debit",
    title: `Sent to ${recipient}`,
    desc: note || "PAY54 P2P transfer",
    amount: -amountRaw,
    tag: "P2P",
    date: "Just now",
  });
  renderTransactions();

  if (alertBox) alertBox.textContent = "";
  closeModal("sendMoneyModal");
  showToast(
    "success",
    `💸 Sent ${formatNaira(amountRaw)} to ${recipient} (₦${fee.toFixed(
      2
    )} fee)`
  );

  // reset fields
  document.getElementById("sendRecipient").value = "";
  document.getElementById("sendAmount").value = "";
  document.getElementById("sendNote").value = "";
  updateSendSummary();
}

function updateSendSummary() {
  const amountRaw = parseFloat(
    document.getElementById("sendAmount")?.value || "0"
  );
  const summary = document.getElementById("sendSummary");
  if (!summary) return;

  if (!amountRaw || amountRaw <= 0) {
    summary.textContent = "Enter an amount to see fee (0.5%) and total.";
    return;
  }

  const fee = amountRaw * 0.005;
  const total = amountRaw + fee;
  summary.textContent = `Fee: ${formatNaira(
    fee
  )} • Total: ${formatNaira(total)} • Wallet after: ${formatNaira(
    currentBalance - total
  )}`;
}

function handleReceiveMoney() {
  const from = document.getElementById("receiveFrom").value.trim();
  const amountRaw = parseFloat(
    document.getElementById("receiveAmount").value || "0"
  );
  const note = document.getElementById("receiveNote").value.trim();
  const alertBox = document.getElementById("receiveAlert");

  if (!amountRaw || amountRaw <= 0) {
    if (alertBox)
      alertBox.textContent = "Please enter a valid amount to mark received.";
    return;
  }

  currentBalance += amountRaw;
  updateBalanceDisplay();

  transactions.unshift({
    id: "tx-" + Date.now(),
    type: "credit",
    title: `From ${from || "External sender"}`,
    desc: note || "PAY54 received",
    amount: amountRaw,
    tag: "Incoming",
    date: "Just now",
  });
  renderTransactions();

  if (alertBox) alertBox.textContent = "";
  closeModal("receiveMoneyModal");
  showToast(
    "success",
    `📥 Received ${formatNaira(amountRaw)} from ${from || "External sender"}`
  );

  document.getElementById("receiveFrom").value = "";
  document.getElementById("receiveAmount").value = "";
  document.getElementById("receiveNote").value = "";
}

function handleBankTransfer() {
  const name = document.getElementById("bankRecipientName").value.trim();
  const bank = document.getElementById("bankName").value.trim();
  const acct = document.getElementById("bankAccountNumber").value.trim();
  const amountRaw = parseFloat(
    document.getElementById("bankAmount").value || "0"
  );
  const ref = document
    .getElementById("bankReference")
    .value.trim()
    .slice(0, 60);
  const alertBox = document.getElementById("bankAlert");

  if (!name || !bank || !acct || acct.length < 10 || !amountRaw || amountRaw <= 0) {
    if (alertBox)
      alertBox.textContent =
        "Please fill in recipient, bank, valid account (10 digits) and amount.";
    return;
  }

  if (amountRaw > currentBalance) {
    if (alertBox)
      alertBox.textContent = "Insufficient wallet balance for this transfer.";
    return;
  }

  currentBalance -= amountRaw;
  updateBalanceDisplay();

  transactions.unshift({
    id: "tx-" + Date.now(),
    type: "debit",
    title: `${bank} • ${name}`,
    desc: ref || "Bank transfer",
    amount: -amountRaw,
    tag: "Bank",
    date: "Just now",
  });
  renderTransactions();

  if (alertBox) alertBox.textContent = "";
  closeModal("bankTransferModal");
  showToast(
    "success",
    `🏦 Bank transfer of ${formatNaira(
      amountRaw
    )} to ${name} (${bank}) queued (mock).`
  );

  document.getElementById("bankRecipientName").value = "";
  document.getElementById("bankName").value = "";
  document.getElementById("bankAccountNumber").value = "";
  document.getElementById("bankAmount").value = "";
  document.getElementById("bankReference").value = "";
}

// =============== SERVICES ===============
function wireServices() {
  const cardsMap = {
    fx: () => handleFXModal(),
    savings: () => handleSavingsModal(),
    bills: () => openModal("billsModal"),
    cards: () => handleCardsModal(),
    shop: () => handleShopClick(),
    invest: () => handleInvestModal(),
    agent: () => openModal("agentModal"),
    aiwatch: () =>
      showSystemToast(
        "info",
        "🤖 AI Risk Watch: In production this surfaces suspicious patterns and locks risky flows."
      ),
  };

  document.querySelectorAll(".service-card").forEach((card) => {
    const key = card.dataset.service;
    card.addEventListener("click", () => {
      const fn = cardsMap[key];
      if (fn) fn();
    });
  });

  // Agent submit
  const submitAgentBtn = document.getElementById("submitAgentBtn");
  if (submitAgentBtn)
    submitAgentBtn.addEventListener("click", () => {
      const biz = document.getElementById("agentBusiness").value.trim();
      const name = document.getElementById("agentFullName").value.trim();
      const nin = document.getElementById("agentNIN").value.trim();
      const photo = document.getElementById("agentPhoto").files[0];
      const alertBox = document.getElementById("agentAlert");

      if (!biz || !name || nin.length !== 11 || !photo) {
        if (alertBox)
          alertBox.textContent =
            "Business name, full name, valid 11-digit NIN and photo are required.";
        return;
      }

      if (alertBox) alertBox.textContent = "";
      closeModal("agentModal");
      showToast(
        "success",
        "🧍‍♂️ Agent application submitted (mock). Compliance review in 24–48h."
      );

      document.getElementById("agentBusiness").value = "";
      document.getElementById("agentFullName").value = "";
      document.getElementById("agentNIN").value = "";
      document.getElementById("agentPhoto").value = "";
    });
}

// FX modal – uses sendMoneyModal UI for now with explanation toast
function handleFXModal() {
  showSystemToast(
    "info",
    "🌍 FX remittance: In live build this screens recipient, applies FX, and routes via licensed partners."
  );
}

// Savings – for now, just show toast
function handleSavingsModal() {
  showSystemToast(
    "info",
    "💰 Savings & goals: In live PAY54 this will create pots, standing orders and pie-chart breakdown."
  );
}

// Shop – demo categories
function handleShopClick() {
  showSystemToast(
    "info",
    "🏬 Shop on the Fly: Live version deep-links into Taxi, Food, Tickets & Shops with affiliate rails."
  );
}

// Cards modal
function handleCardsModal() {
  const body = document.getElementById("cardsModalBody");
  if (!body) return;

  body.innerHTML = `
    <div style="font-size:12px;color:#64748b;margin-bottom:6px;">
      Select a default card for online & recurring payments. Virtual PAY54 VISA stays in-app only.
    </div>
    <div style="display:grid;grid-template-columns:1fr;gap:8px;">
      ${cards
        .map(
          (card) => `
        <div class="card-tile" data-card-id="${card.id}" 
          style="
            border-radius:14px;
            padding:10px 12px;
            background:${
              card.type === "virtual" ? "#0f172a" : "#020617"
            };
            color:#e5e7eb;
            position:relative;
            cursor:pointer;
            box-shadow:0 14px 30px rgba(15,23,42,0.45);
            border:${card.default ? "1px solid #22c55e" : "1px solid #1f2937"};
          ">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;opacity:0.9;">
              ${card.type === "virtual" ? "PAY54 VIRTUAL" : "Linked card"}
            </div>
            <div style="font-size:10px;opacity:0.75;">
              ${card.brand} • ${card.bank}
            </div>
          </div>
          <div style="font-size:14px;font-weight:600;margin-bottom:2px;">
            ${card.label}
          </div>
          <div style="font-size:13px;letter-spacing:0.16em;margin-bottom:6px;">
            ${card.masked}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;">
            <span>${
              card.default ? "✅ Default for online" : "Set as default"
            }</span>
            <span style="font-size:15px;">📶</span>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  // Click handlers to set default
  body.querySelectorAll(".card-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      const id = tile.dataset.cardId;
      cards = cards.map((c) => ({ ...c, default: c.id === id }));
      handleCardsModal();
      showToast(
        "success",
        `💳 ${cards.find((c) => c.id === id)?.label} set as default.`
      );
    });
  });

  // Add card button
  const addCardBtn = document.getElementById("addCardBtn");
  if (addCardBtn) {
    addCardBtn.onclick = () => {
      const alias = prompt("Bank / card label (eg. UBA Naira Debit):");
      if (!alias) return;
      const last4 = prompt("Last 4 digits (for display only):") || "0000";
      const id = "card-" + Date.now();
      cards.push({
        id,
        label: alias,
        type: "linked",
        masked: "**** **** **** " + last4,
        brand: "VISA",
        bank: alias.split(" ")[0] || "Bank",
        default: false,
      });
      handleCardsModal();
      showSystemToast("success", "New linked card added (demo only).");
    };
  }

  openModal("cardsModal");
}

// Investments modal
function handleInvestModal() {
  const body = document.getElementById("investModalBody");
  if (!body) return;

  const sampleStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 190.23 },
    { symbol: "MSFT", name: "Microsoft", price: 420.11 },
  ];
  const sampleInvests = [
    { id: "farm1", name: "AgriYield Farm Basket", apy: 12 },
    { id: "usdt1", name: "USDT Stable Pool", apy: 6 },
  ];

  body.innerHTML = `
    <div style="font-size:12px;color:#64748b;margin-bottom:8px;">
      Prices & yields in <strong>USD</strong>. At checkout, PAY54 lets users pay in <strong>₦ or $</strong> based on FX rails.
    </div>
    <div style="display:flex;gap:6px;margin-bottom:10px;">
      <button id="tabStocks" class="btn-secondary" style="flex:1;">Stocks</button>
      <button id="tabInvest" class="btn-secondary" style="flex:1;">Investments</button>
    </div>
    <div id="investTabContent"></div>
    <div style="margin-top:10px;">
      <div style="font-size:12px;font-weight:600;margin-bottom:4px;">My Holdings (mock)</div>
      <div id="myHoldings" style="font-size:12px;color:#6b7280;">
        No assets yet – buy any stock or investment above to see holdings here.
      </div>
    </div>
  `;

  function renderHoldings() {
    const el = document.getElementById("myHoldings");
    if (!el) return;
    if (!holdings.stocks.length && !holdings.investments.length) {
      el.textContent =
        "No assets yet – buy any stock or investment above to see holdings here.";
      return;
    }
    const stocksText = holdings.stocks
      .map((s) => `${s.symbol} (${s.units}u)`)
      .join(", ");
    const invText = holdings.investments
      .map((i) => `${i.name} (${i.units}u)`)
      .join(", ");
    el.textContent = [
      stocksText && `Stocks: ${stocksText}`,
      invText && `Investments: ${invText}`,
    ]
      .filter(Boolean)
      .join(" • ");
  }

  function renderStocksTab() {
    const tab = document.getElementById("investTabContent");
    if (!tab) return;
    tab.innerHTML = sampleStocks
      .map(
        (s) => `
      <div style="
        padding:8px 10px;
        border-radius:12px;
        border:1px solid #e5e7eb;
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:6px;
        background:white;
      ">
        <div>
          <div style="font-size:13px;font-weight:600;">${s.symbol} • ${
          s.name
        }</div>
          <div style="font-size:12px;color:#64748b;">Price: $${s.price.toFixed(
            2
          )}</div>
        </div>
        <button class="btn-primary buy-stock-btn" data-symbol="${
          s.symbol
        }" style="padding:5px 10px;font-size:12px;">
          Buy now
        </button>
      </div>
    `
      )
      .join("");

    tab.querySelectorAll(".buy-stock-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const symbol = btn.dataset.symbol;
        const asset = sampleStocks.find((s) => s.symbol === symbol);
        if (!asset) return;
        const units = 1;
        holdings.stocks.push({ symbol, units });
        showToast(
          "success",
          `📈 Bought ${units} unit of ${symbol} at $${asset.price.toFixed(
            2
          )} (mock).`
        );
        renderHoldings();
      });
    });
  }

  function renderInvestTab() {
    const tab = document.getElementById("investTabContent");
    if (!tab) return;
    tab.innerHTML = sampleInvests
      .map(
        (i) => `
      <div style="
        padding:8px 10px;
        border-radius:12px;
        border:1px solid #e5e7eb;
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:6px;
        background:white;
      ">
        <div>
          <div style="font-size:13px;font-weight:600;">${i.name}</div>
          <div style="font-size:12px;color:#16a34a;">APY: ${i.apy}%</div>
        </div>
        <button class="btn-primary buy-invest-btn" data-id="${
          i.id
        }" style="padding:5px 10px;font-size:12px;">
          Invest
        </button>
      </div>
    `
      )
      .join("");

    tab.querySelectorAll(".buy-invest-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const asset = sampleInvests.find((i) => i.id === id);
        if (!asset) return;
        holdings.investments.push({ id, name: asset.name, units: 1 });
        showToast(
          "success",
          `💼 Joined ${asset.name} at ${asset.apy}% APY (mock).`
        );
        renderHoldings();
      });
    });
  }

  const tabStocks = document.getElementById("tabStocks");
  const tabInvest = document.getElementById("tabInvest");
  if (tabStocks && tabInvest) {
    tabStocks.addEventListener("click", () => {
      renderStocksTab();
    });
    tabInvest.addEventListener("click", () => {
      renderInvestTab();
    });
  }

  renderStocksTab();
  renderHoldings();
  openModal("investModal");
}

// Bills dynamic fields
function wireBillsFormLogic() {
  const billType = document.getElementById("billType");
  if (!billType) return;

  billType.addEventListener("change", () => {
    const val = billType.value;
    const sharedAccount = document.querySelector(".shared-account");
    const sharedProvider = document.querySelector(".shared-provider");
    const airtimeOnly = document.querySelectorAll(".airtime-only");

    const showShared = val === "water" || val === "electricity" || val === "tv";
    const showProvider = val === "water" || val === "electricity";
    const showAirtime = val === "airtime";

    toggleField(sharedAccount, showShared);
    toggleField(sharedProvider, showProvider);
    airtimeOnly.forEach((el) => toggleField(el, showAirtime));
  });

  const confirmBillsBtn = document.getElementById("confirmBillsBtn");
  if (confirmBillsBtn)
    confirmBillsBtn.addEventListener("click", () => {
      const type = billType.value;
      const amountRaw = parseFloat(
        document.getElementById("billAmount").value || "0"
      );
      const recurring = document.getElementById("billRecurring").value;
      const alertBox = document.getElementById("billsAlert");

      if (!type || !amountRaw || amountRaw <= 0) {
        if (alertBox)
          alertBox.textContent = "Please choose a bill type and valid amount.";
        return;
      }

      if (amountRaw > currentBalance) {
        if (alertBox)
          alertBox.textContent = "Insufficient balance to pay this bill.";
        return;
      }

      currentBalance -= amountRaw;
      updateBalanceDisplay();

      transactions.unshift({
        id: "tx-" + Date.now(),
        type: "debit",
        title:
          type === "airtime"
            ? "Airtime purchase"
            : type === "water"
            ? "Water bill"
            : type === "electricity"
            ? "Electricity bill"
            : "TV subscription",
        desc:
          recurring === "none"
            ? "One-off bill payment"
            : `Recurring ${recurring} payment`,
        amount: -amountRaw,
        tag: "Bills",
        date: "Just now",
      });
      renderTransactions();

      if (alertBox) alertBox.textContent = "";
      closeModal("billsModal");
      showToast(
        "success",
        `💡 Bill of ${formatNaira(
          amountRaw
        )} paid${recurring !== "none" ? " (recurring set)" : ""}.`
      );

      document.getElementById("billAmount").value = "";
      document.getElementById("billAccountNumber").value = "";
      document.getElementById("billProvider").value = "";
      document.getElementById("airtimePhone").value = "";
      document.getElementById("airtimeNetwork").value = "";
      billType.value = "";
    });
}

function toggleField(el, show) {
  if (!el) return;
  if (show) el.classList.remove("d-none");
  else el.classList.add("d-none");
}

// =============== TRANSACTIONS RENDER ===============
function renderTransactions() {
  const container = document.getElementById("transactionsList");
  if (!container) return;

  if (!transactions.length) {
    container.innerHTML = `
      <div style="padding:12px;text-align:center;font-size:12px;color:#6b7280;">
        📭 No transactions yet. Start by sending, receiving or paying a bill.
      </div>
    `;
    return;
  }

  container.innerHTML = transactions
    .map((tx) => {
      const signClass = tx.amount >= 0 ? "positive" : "negative";
      const icon = tx.amount >= 0 ? "📥" : "💸";
      return `
      <div class="transaction-item">
        <div class="tx-main">
          <div class="tx-icon">${icon}</div>
          <div class="tx-text">
            <h4>${tx.title}</h4>
            <p>${tx.desc}</p>
          </div>
        </div>
        <div class="tx-amount">
          <div class="value ${signClass}">${formatNaira(tx.amount)}</div>
          <div class="meta">${tx.tag} • ${tx.date}</div>
        </div>
      </div>
    `;
    })
    .join("");
}

// =============== MODAL HELPERS ===============
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("show");
  document.body.style.overflow = "hidden";

  // attach close buttons generically
  el.querySelectorAll("[data-close]").forEach((btn) => {
    btn.onclick = () => closeModal(id);
  });
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("show");
  document.body.style.overflow = "";
}

// =============== TOASTS ===============
function showToast(type, message) {
  let toast = document.getElementById("globalToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "globalToast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = "block";
  toast.style.position = "fixed";
  toast.style.top = "18px";
  toast.style.right = "18px";
  toast.style.padding = "10px 14px";
  toast.style.borderRadius = "12px";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "500";
  toast.style.color = "#ffffff";
  toast.style.boxShadow = "0 12px 30px rgba(15,23,42,0.35)";
  toast.style.zIndex = "9999";

  const bg =
    type === "success"
      ? "linear-gradient(135deg,#16a34a,#22c55e)"
      : type === "error"
      ? "linear-gradient(135deg,#ef4444,#dc2626)"
      : "linear-gradient(135deg,#0ea5e9,#2563eb)";
  toast.style.background = bg;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

function showSystemToast(type, message) {
  let toast = document.getElementById("systemToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "systemToast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.display = "flex";
  toast.style.position = "fixed";
  toast.style.bottom = "18px";
  toast.style.left = "18px";
  toast.style.padding = "10px 14px";
  toast.style.borderRadius = "12px";
  toast.style.fontSize = "12px";
  toast.style.fontWeight = "500";
  toast.style.color = "#ffffff";
  toast.style.boxShadow = "0 12px 30px rgba(15,23,42,0.35)";
  toast.style.zIndex = "9999";
  toast.style.maxWidth = "280px";

  const bg =
    type === "success"
      ? "linear-gradient(135deg,#15803d,#22c55e)"
      : type === "error"
      ? "linear-gradient(135deg,#b91c1c,#ef4444)"
      : "linear-gradient(135deg,#4b5563,#0f172a)";
  toast.style.background = bg;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}

function showWelcomeToast() {
  const toast = document.getElementById("welcomeToast");
  if (!toast) return;
  const first = currentUser.full_name.split(" ")[0] || "User";
  toast.innerHTML = `👋 Welcome back, <strong>${first}</strong> — PAY54 hybrid rails are synced.`;
  toast.style.display = "flex";
  toast.style.position = "fixed";
  toast.style.bottom = "70px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.padding = "9px 16px";
  toast.style.borderRadius = "999px";
  toast.style.fontSize = "12px";
  toast.style.color = "#ffffff";
  toast.style.background = "linear-gradient(135deg,#2563eb,#22c55e)";
  toast.style.boxShadow = "0 14px 35px rgba(15,23,42,0.45)";
  toast.style.zIndex = "9999";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}

// =============== UTILITIES ===============
function formatNaira(amount) {
  const val = Number(amount) || 0;
  const prefix = val < 0 ? "-₦" : "₦";
  return prefix + Math.abs(val).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
