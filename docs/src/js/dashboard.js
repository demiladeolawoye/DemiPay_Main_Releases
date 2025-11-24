// PAY54 v6.3 Hybrid Dashboard
// Mobile-first, Hybrid Paytag/Phone/Email, mock-only front-end

(function () {
  // ========= HELPERS =========
  const $ = (id) => document.getElementById(id);

  function showToast(type, message) {
    const toast = $("globalToast");
    if (!toast) return;

    toast.className = "toast";
    toast.style.display = "block";

    let bg;
    switch (type) {
      case "success":
        bg = "toast-success";
        break;
      case "error":
        bg = "toast-error";
        break;
      case "warning":
        bg = "toast-warning";
        break;
      default:
        bg = "toast-info";
    }

    toast.classList.add(bg);
    toast.textContent = message;

    setTimeout(() => {
      toast.style.display = "none";
      toast.className = "toast";
    }, 3000);
  }

  function showSystemToast(type, message) {
    const toast = $("systemToast");
    if (!toast) return;

    toast.className = "toast";
    toast.style.display = "block";

    let bg;
    switch (type) {
      case "success":
        bg = "toast-success";
        break;
      case "error":
        bg = "toast-error";
        break;
      case "warning":
        bg = "toast-warning";
        break;
      default:
        bg = "toast-info";
    }

    toast.classList.add(bg);
    toast.textContent = message;

    setTimeout(() => {
      toast.style.display = "none";
      toast.className = "toast";
    }, 3500);
  }

  function openModal(id) {
    const el = $(id);
    if (!el) return;
    el.classList.add("show");
    el.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const el = $(id);
    if (!el) return;
    el.classList.remove("show");
    el.style.display = "none";
    document.body.style.overflow = "";
  }

  // Shared receipt modal
  function openReceiptModal(config) {
    const modal = $("receiptModal");
    const body = $("receiptBody");
    if (!modal || !body) return;

    const {
      title = "Transaction Receipt",
      icon = "✅",
      subtitle = "",
      amountLabel = "Amount",
      amountValue = "",
      primaryLine = "",
      secondaryLine = "",
      extraLines = [],
      canShare = true,
      shareText = "",
    } = config;

    body.innerHTML = `
      <div class="receipt-header">
        <div class="receipt-icon">${icon}</div>
        <h4 class="receipt-title">${title}</h4>
        <p class="receipt-subtitle">${subtitle}</p>
      </div>
      <div class="receipt-section">
        <div class="summary-row">
          <span>${amountLabel}</span><strong>${amountValue}</strong>
        </div>
        ${
          primaryLine
            ? `<div class="summary-row"><span>To / From</span><span>${primaryLine}</span></div>`
            : ""
        }
        ${
          secondaryLine
            ? `<div class="summary-row"><span>Details</span><span>${secondaryLine}</span></div>`
            : ""
        }
        ${
          extraLines && extraLines.length
            ? extraLines
                .map(
                  (line) =>
                    `<div class="summary-row"><span>${line.label}</span><span>${line.value}</span></div>`
                )
                .join("")
            : ""
        }
      </div>
      ${
        canShare
          ? `
      <div class="receipt-section">
        <div style="font-size:0.78rem;color:#9ca3af;margin-bottom:0.3rem;">
          Share or save this receipt.
        </div>
        <div class="share-row">
          <button class="btn btn-secondary btn-share" id="receiptShareWhatsAppBtn">WhatsApp</button>
          <button class="btn btn-secondary btn-share" id="receiptShareEmailBtn">Email</button>
        </div>
      </div>
      `
          : ""
      }
    `;

    if (canShare && shareText) {
      const waBtn = $("receiptShareWhatsAppBtn");
      const emBtn = $("receiptShareEmailBtn");

      if (waBtn) {
        waBtn.onclick = () => {
          const url =
            "https://wa.me/?text=" + encodeURIComponent(shareText);
          window.open(url, "_blank");
        };
      }

      if (emBtn) {
        emBtn.onclick = () => {
          const url =
            "mailto:?subject=" +
            encodeURIComponent("PAY54 Receipt") +
            "&body=" +
            encodeURIComponent(shareText);
          window.location.href = url;
        };
      }
    }

    openModal("receiptModal");
  }

  // ========= THEME, HEADER, USER =========
  const currentUser = {
    name: "Demi",
    paytag: "@demi",
    paylink: "https://pay54.app/@demi",
    accountNumber: "P54-1029345678",
    kycLevel: "Tier 2 (BVN Verified)",
  };

  function initTheme() {
    const stored = localStorage.getItem("pay54_theme");
    if (stored === "light") {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      updateThemeButton("light");
    } else {
      document.body.classList.add("dark-mode");
      updateThemeButton("dark");
    }

    const toggleBtn = $("themeToggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        if (isDark) {
          document.body.classList.remove("dark-mode");
          document.body.classList.add("light-mode");
          localStorage.setItem("pay54_theme", "light");
          updateThemeButton("light");
          showSystemToast("info", "Light mode on for PAY54");
        } else {
          document.body.classList.remove("light-mode");
          document.body.classList.add("dark-mode");
          localStorage.setItem("pay54_theme", "dark");
          updateThemeButton("dark");
          showSystemToast("success", "Dark mode locked in");
        }
      });
    }
  }

  function updateThemeButton(mode) {
    const icon = $("themeIcon");
    const text = $("themeText");
    if (!icon || !text) return;

    if (mode === "light") {
      icon.textContent = "🌙";
      text.textContent = "Dark mode";
    } else {
      icon.textContent = "☀️";
      text.textContent = "Light mode";
    }
  }

  function initHeader() {
    const nameSpan = $("userDisplayName");
    if (nameSpan) nameSpan.textContent = currentUser.name;

    const avatar = $("userAvatar");
    if (avatar && !avatar.src.includes("avatar")) {
      // Fallback if src missing
      avatar.src = "./src/assets/avatar-male.png";
    }

    const userMenuBtn = $("userMenuBtn");
    const dropdown = $("userMenuDropdown");

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

    const menuProfile = $("menuProfile");
    const menuSettings = $("menuSettings");
    const menuLogout = $("menuLogout");

    if (menuProfile) {
      menuProfile.addEventListener("click", () => {
        showToast("info", "Profile centre coming soon in PAY54 app.");
      });
    }
    if (menuSettings) {
      menuSettings.addEventListener("click", () => {
        showToast("info", "Settings hub coming soon in PAY54 app.");
      });
    }
    if (menuLogout) {
      menuLogout.addEventListener("click", () => {
        showToast("success", "Logged out (mock). In production this returns to login.");
        // window.location.href = "login.html"; // when login page exists
      });
    }
  }

  // ========= BALANCE & TRANSACTIONS =========
  let balanceNaira = 725000; // mock starting balance

  const mockTransactions = [
    {
      id: 1,
      type: "sent",
      title: "To @joshua",
      meta: "Fuel & errands • Today",
      amount: -15000,
      status: "Completed",
    },
    {
      id: 2,
      type: "received",
      title: "From @mumsupport",
      meta: "Family support • Yesterday",
      amount: 50000,
      status: "Completed",
    },
    {
      id: 3,
      type: "sent",
      title: "DSTV Subscription",
      meta: "Bills & TV • 2 days ago",
      amount: -12000,
      status: "Completed",
    },
    {
      id: 4,
      type: "sent",
      title: "Shop on the Fly - Jumia",
      meta: "Online shopping • 3 days ago",
      amount: -45000,
      status: "Completed",
    },
    {
      id: 5,
      type: "received",
      title: "From PAY54 Agent",
      meta: "Cash-in at agent • Last week",
      amount: 30000,
      status: "Completed",
    },
  ];

  function formatNaira(value) {
    const num = Number(value || 0);
    return "₦" + num.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function renderBalance() {
    const balanceEl = $("balanceAmount");
    const walletAddress = $("walletAddress");
    const kycLevel = $("kycLevel");

    if (balanceEl) balanceEl.textContent = formatNaira(balanceNaira);
    if (walletAddress) walletAddress.textContent = "Account: " + currentUser.accountNumber;
    if (kycLevel) kycLevel.textContent = currentUser.kycLevel;
  }

  function initBalance() {
    renderBalance();
    const refreshBtn = $("refreshBalanceBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        // simple mock: wiggle balance slightly
        const delta = Math.round((Math.random() - 0.5) * 20000);
        balanceNaira = Math.max(0, balanceNaira + delta);
        renderBalance();
        showSystemToast("success", "Balance refreshed (mock sync with PAY54 core).");
      });
    }
  }

  function renderTransactions() {
    const container = $("transactionsList");
    if (!container) return;

    if (!mockTransactions.length) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📭</span>
          <p>No transactions yet</p>
          <p class="text-sm">Start by sending or receiving money</p>
        </div>
      `;
      return;
    }

    container.innerHTML = mockTransactions
      .map((tx) => {
        const isNegative = tx.amount < 0;
        const icon = tx.type === "sent" ? "📤" : "📥";
        const iconClass = tx.type === "sent" ? "sent" : "received";

        return `
          <div class="transaction-item">
            <div class="tx-left">
              <div class="tx-icon ${iconClass}">${icon}</div>
              <div class="tx-text">
                <div class="tx-title">${tx.title}</div>
                <div class="tx-meta">${tx.meta}</div>
              </div>
            </div>
            <div class="tx-right">
              <div class="tx-amount ${
                isNegative ? "negative" : "positive"
              }">${isNegative ? "-" : "+"}${formatNaira(Math.abs(tx.amount))}</div>
              <span class="tx-status">${tx.status}</span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  // ========= HYBRID RECIPIENT RESOLVER =========
  function resolveRecipientIdentifier(rawInput) {
    const value = (rawInput || "").trim();
    if (!value) {
      return { type: null, value: null, error: "Recipient is required" };
    }

    // Paytag
    if (value.startsWith("@") && value.length >= 3) {
      return {
        type: "paytag",
        value: value.toLowerCase(),
        error: null,
      };
    }

    // Phone (very simple pattern)
    const phoneClean = value.replace(/\s+/g, "");
    const phoneRegex = /^(\+?\d{10,15})$/;
    if (phoneRegex.test(phoneClean)) {
      return {
        type: "phone",
        value: phoneClean,
        error: null,
      };
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value.toLowerCase())) {
      return {
        type: "email",
        value: value.toLowerCase(),
        error: null,
      };
    }

    return {
      type: null,
      value: null,
      error:
        "Enter a valid Paytag (@user), phone number, or email address.",
    };
  }

  // ========= MONEY MOVES HANDLERS =========

  function initMoneyMoves() {
    const sendBtn = $("sendMoneyBtn");
    const receiveBtn = $("receiveMoneyBtn");
    const addWithdrawBtn = $("addWithdrawBtn");
    const bankTransferBtn = $("bankTransferBtn");

    if (sendBtn) {
      sendBtn.addEventListener("click", () => {
        const input = $("sendRecipient");
        if (input) {
          input.placeholder = "@demi, +2348012345678 or user@pay54.app";
        }
        updateSendSummary();
        openModal("sendMoneyModal");
      });
    }

    if (receiveBtn) {
      receiveBtn.addEventListener("click", () => {
        populateReceiveSection();
        openModal("receiveMoneyModal");
      });
    }

    if (addWithdrawBtn) {
      addWithdrawBtn.addEventListener("click", () => {
        openModal("addWithdrawModal");
      });
    }

    if (bankTransferBtn) {
      bankTransferBtn.addEventListener("click", () => {
        openModal("bankTransferModal");
      });
    }

    // Send modal events
    const sendAmount = $("sendAmount");
    if (sendAmount) {
      sendAmount.addEventListener("input", updateSendSummary);
    }

    const sendConfirm = $("sendConfirmBtn");
    if (sendConfirm) {
      sendConfirm.addEventListener("click", handleSendMoney);
    }

    // Receive modal
    const sharePaylinkBtn = $("sharePaylinkBtn");
    if (sharePaylinkBtn) {
      sharePaylinkBtn.addEventListener("click", handleSharePaylink);
    }

    // Add/Withdraw
    const fundConfirmBtn = $("fundConfirmBtn");
    if (fundConfirmBtn) {
      fundConfirmBtn.addEventListener("click", handleFundAction);
    }

    // Bank Transfer
    const bankConfirm = $("bankTransferConfirmBtn");
    if (bankConfirm) {
      bankConfirm.addEventListener("click", handleBankTransfer);
    }

    // Modal close via [data-close]
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-close");
        closeModal(id);
      });
    });
  }

  function updateSendSummary() {
    const amountField = $("sendAmount");
    const feeField = $("sendFeeSummary");
    const totalField = $("sendTotalSummary");
    const raw = amountField ? Number(amountField.value || 0) : 0;
    const fee = raw * 0.005;
    const total = raw + fee;

    if (feeField) feeField.textContent = formatNaira(fee);
    if (totalField) totalField.textContent = formatNaira(total);
  }

  function handleSendMoney() {
    const rawRecipient = $("sendRecipient")?.value || "";
    const amount = Number($("sendAmount")?.value || 0);
    const note = $("sendNote")?.value || "";

    const recipient = resolveRecipientIdentifier(rawRecipient);
    if (recipient.error) {
      showToast("error", recipient.error);
      return;
    }

    if (!amount || amount <= 0) {
      showToast("error", "Enter a valid amount.");
      return;
    }

    if (amount > balanceNaira) {
      showToast("error", "Insufficient balance.");
      return;
    }

    // Deduct from mock balance
    balanceNaira -= amount;
    renderBalance();

    // Add mock transaction
    mockTransactions.unshift({
      id: Date.now(),
      type: "sent",
      title: `To ${rawRecipient}`,
      meta: `PAY54 ${recipient.type.toUpperCase()} • Just now`,
      amount: -amount,
      status: "Completed",
    });
    renderTransactions();

    showToast(
      "success",
      `Sent ${formatNaira(amount)} to ${rawRecipient} via ${recipient.type}.`
    );

    const shareText =
      `PAY54 Receipt\n\n` +
      `Type: Send Money\n` +
      `To: ${rawRecipient} (${recipient.type})\n` +
      `Amount: ${formatNaira(amount)}\n` +
      (note ? `Note: ${note}\n` : "") +
      `From: ${currentUser.paytag}\n` +
      `Account: ${currentUser.accountNumber}`;

    openReceiptModal({
      title: "Send Money Receipt",
      icon: "💸",
      subtitle: "Mock transfer in PAY54 sandbox",
      amountLabel: "Amount sent",
      amountValue: formatNaira(amount),
      primaryLine: rawRecipient,
      secondaryLine: note || "No note supplied",
      extraLines: [
        { label: "Channel", value: recipient.type.toUpperCase() },
        { label: "From account", value: currentUser.accountNumber },
      ],
      canShare: true,
      shareText,
    });

    closeModal("sendMoneyModal");
  }

  function populateReceiveSection() {
    const paylink = $("paylinkDisplay");
    if (paylink) {
      paylink.textContent = currentUser.paylink;
    }

    // Simple fake QR: just filled square; real QR would need a lib
    const canvas = $("receiveQrCanvas");
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#4b5563";
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(30, 30, 40, 40);
      ctx.fillRect(90, 30, 40, 40);
      ctx.fillRect(30, 90, 40, 40);
      ctx.fillStyle = "#2563eb";
      ctx.fillRect(80, 80, 50, 50);
    }
  }

  function handleSharePaylink() {
    const fromName = $("receiveFrom")?.value || "Sender";
    const amount = Number($("receiveAmount")?.value || 0);
    const note = $("receiveNote")?.value || "";
    const link = currentUser.paylink;

    const text =
      `Hi ${fromName}, please pay me via PAY54:\n\n` +
      `Link: ${link}\n` +
      `Paytag: ${currentUser.paytag}\n` +
      `Amount: ${amount ? formatNaira(amount) : "Any amount"}\n` +
      (note ? `Note: ${note}` : "");

    if (navigator.share) {
      navigator
        .share({
          title: "PAY54 Payment Request",
          text,
          url: link,
        })
        .catch(() => {});
    } else {
      const url = "https://wa.me/?text=" + encodeURIComponent(text);
      window.open(url, "_blank");
    }

    showSystemToast("success", "Paylink shared with sender (mock).");
  }

  function handleFundAction() {
    const action = $("fundAction")?.value || "add";
    const method = $("fundMethod")?.value || "card";
    const amount = Number($("fundAmount")?.value || 0);
    const note = $("fundNote")?.value || "";

    if (!amount || amount <= 0) {
      showToast("error", "Enter a valid amount.");
      return;
    }

    if (action === "add") {
      balanceNaira += amount;
    } else {
      if (amount > balanceNaira) {
        showToast("error", "Insufficient balance to withdraw.");
        return;
      }
      balanceNaira -= amount;
    }
    renderBalance();

    const direction = action === "add" ? "received" : "sent";
    mockTransactions.unshift({
      id: Date.now(),
      type: direction,
      title:
        (action === "add" ? "Add money via " : "Withdraw via ") +
        method.toUpperCase(),
      meta: "PAY54 funding • Just now",
      amount: action === "add" ? amount : -amount,
      status: "Completed",
    });
    renderTransactions();

    const shareText =
      `PAY54 Receipt\n\n` +
      `Type: ${action === "add" ? "Add Money" : "Withdraw"}\n` +
      `Method: ${method.toUpperCase()}\n` +
      `Amount: ${formatNaira(amount)}\n` +
      (note ? `Note: ${note}\n` : "") +
      `Account: ${currentUser.accountNumber}`;

    openReceiptModal({
      title: action === "add" ? "Add Money Receipt" : "Withdraw Receipt",
      icon: action === "add" ? "➕" : "⬇️",
      subtitle: "Mock funding flow in PAY54 sandbox",
      amountLabel: "Amount",
      amountValue: formatNaira(amount),
      primaryLine: method.toUpperCase(),
      secondaryLine: note || "No note supplied",
      extraLines: [
        {
          label: "Direction",
          value: action === "add" ? "Inbound to PAY54" : "Outbound from PAY54",
        },
      ],
      canShare: true,
      shareText,
    });

    closeModal("addWithdrawModal");
  }

  function handleBankTransfer() {
    const name = $("bankRecipientName")?.value || "";
    const bank = $("bankName")?.value || "";
    const account = $("bankAccountNumber")?.value || "";
    const amount = Number($("bankAmount")?.value || 0);
    const ref = $("bankReference")?.value || "";

    if (!name || !bank || !account || !amount || amount <= 0) {
      showToast("error", "Fill in all fields and enter a valid amount.");
      return;
    }

    if (amount > balanceNaira) {
      showToast("error", "Insufficient balance for bank transfer.");
      return;
    }

    balanceNaira -= amount;
    renderBalance();

    mockTransactions.unshift({
      id: Date.now(),
      type: "sent",
      title: `Bank transfer to ${name}`,
      meta: `${bank} • Ref: ${ref || "N/A"} • Just now`,
      amount: -amount,
      status: "Completed",
    });
    renderTransactions();

    const shareText =
      `PAY54 Bank Transfer Receipt\n\n` +
      `Recipient: ${name}\n` +
      `Bank: ${bank}\n` +
      `Account: ${account}\n` +
      `Amount: ${formatNaira(amount)}\n` +
      (ref ? `Reference: ${ref}\n` : "") +
      `From: ${currentUser.accountNumber}`;

    openReceiptModal({
      title: "Bank Transfer Receipt",
      icon: "🏦",
      subtitle: "Mock NUBAN transfer in PAY54 sandbox",
      amountLabel: "Amount",
      amountValue: formatNaira(amount),
      primaryLine: `${name} • ${bank}`,
      secondaryLine: `Acct: ${account} • Ref: ${ref || "N/A"}`,
      canShare: true,
      shareText,
    });

    closeModal("bankTransferModal");
  }

  // ========= SERVICES =========

  // Cross-Border (simple mock)
  function initCrossBorder() {
    const card = $("serviceCrossBorder");
    const confirmBtn = $("fxConfirmBtn");
    if (card) {
      card.addEventListener("click", () => {
        openModal("crossBorderModal");
      });
    }
    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        const name = $("fxRecipientName")?.value || "";
        const country = $("fxCountry")?.value || "";
        const amount = Number($("fxAmount")?.value || 0);
        const reason = $("fxReason")?.value || "";
        const notes = $("fxNotes")?.value || "";

        if (!name || !country || !amount || amount <= 0) {
          showToast("error", "Fill in all fields with a valid amount.");
          return;
        }

        const usdRate = 0.0011; // ₦ -> $
        const approxUsd = amount * usdRate;

        const shareText =
          `PAY54 Cross-Border Preview\n\n` +
          `Recipient: ${name}\n` +
          `Country: ${country}\n` +
          `You send: ${formatNaira(amount)} (approx $${approxUsd.toFixed(2)})\n` +
          (reason ? `Reason: ${reason}\n` : "") +
          (notes ? `Notes: ${notes}\n` : "");

        openReceiptModal({
          title: "FX Preview (Mock)",
          icon: "🌍",
          subtitle:
            "In production, PAY54 will route via licensed FX partners.",
          amountLabel: "You send",
          amountValue: `${formatNaira(amount)} (≈ $${approxUsd.toFixed(2)})`,
          primaryLine: `${name} • ${country}`,
          secondaryLine: reason || "No stated reason",
          extraLines: notes ? [{ label: "Notes", value: notes }] : [],
          canShare: true,
          shareText,
        });

        closeModal("crossBorderModal");
      });
    }
  }

  // Savings & Goals
  const savingsGoals = [];

  function initSavings() {
    const card = $("serviceSavings");
    const createBtn = $("savingsCreateBtn");

    if (card) {
      card.addEventListener("click", () => {
        renderSavingsGoals();
        openModal("savingsModal");
      });
    }

    if (createBtn) {
      createBtn.addEventListener("click", () => {
        const name = $("savingsGoalName")?.value || "";
        const target = Number($("savingsTarget")?.value || 0);
        const so = Number($("savingsStandingOrder")?.value || 0);

        if (!name || !target || target <= 0) {
          showToast("error", "Enter a goal name and valid target amount.");
          return;
        }

        const existingIndex = savingsGoals.findIndex(
          (g) => g.name.toLowerCase() === name.toLowerCase()
        );

        if (existingIndex >= 0) {
          savingsGoals[existingIndex].target = target;
          savingsGoals[existingIndex].standingOrder = so;
        } else {
          savingsGoals.push({
            name,
            target,
            standingOrder: so,
            current: 0, // mock
          });
        }

        renderSavingsGoals();
        showSystemToast("success", "Savings goal saved (mock).");
      });
    }
  }

  function renderSavingsGoals() {
    const list = $("savingsGoalsList");
    if (!list) return;

    if (!savingsGoals.length) {
      list.innerHTML =
        '<span>No goals yet. Create your first savings pot.</span>';
      return;
    }

    list.innerHTML = savingsGoals
      .map((g) => {
        const progress =
          g.target > 0 ? Math.min(100, (g.current / g.target) * 100) : 0;
        return `
          <div style="margin-bottom:0.35rem;">
            <div style="display:flex;justify-content:space-between;font-size:0.8rem;">
              <span>${g.name}</span>
              <span>${formatNaira(g.current)} / ${formatNaira(g.target)}</span>
            </div>
            <div style="background:#111827;border-radius:999px;height:6px;margin-top:2px;">
              <div style="height:6px;border-radius:999px;background:linear-gradient(90deg,#22c55e,#4ade80);width:${progress}%;"></div>
            </div>
            <div style="font-size:0.7rem;color:#9ca3af;margin-top:2px;">
              Standing order: ${g.standingOrder ? formatNaira(g.standingOrder) + "/month" : "Not set"}
            </div>
          </div>
        `;
      })
      .join("");
  }

  // Bills & Top-up
  function initBills() {
    const card = $("serviceBills");
    const billType = $("billType");
    const payBtn = $("billPayBtn");

    if (card) {
      card.addEventListener("click", () => {
        rebuildBillFields();
        openModal("billsModal");
      });
    }

    if (billType) {
      billType.addEventListener("change", rebuildBillFields);
    }

    if (payBtn) {
      payBtn.addEventListener("click", handleBillPay);
    }
  }

  function rebuildBillFields() {
    const container = $("billDynamicFields");
    const billType = $("billType")?.value || "electricity";
    if (!container) return;

    if (billType === "electricity" || billType === "water") {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Provider</label>
          <select id="billProvider" class="form-select">
            <option value="">Select provider</option>
            <option>IKEJA Electric</option>
            <option>EKO Electric</option>
            <option>Abuja Electric</option>
            <option>Jos Electric</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Meter / Account Number</label>
          <input type="text" id="billAccount" class="form-input" placeholder="Meter or customer ID" />
        </div>
        <div class="form-group">
          <label class="form-label">Bundle Amount (₦)</label>
          <select id="billAmount" class="form-select">
            <option value="">Select bundle</option>
            <option value="500">₦500</option>
            <option value="1000">₦1,000</option>
            <option value="2000">₦2,000</option>
            <option value="5000">₦5,000</option>
            <option value="10000">₦10,000</option>
          </select>
        </div>
      `;
    } else if (billType === "dstv") {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Smartcard / Decoder Number</label>
          <input type="text" id="billAccount" class="form-input" placeholder="Smartcard number" />
        </div>
        <div class="form-group">
          <label class="form-label">Bundle Amount (₦)</label>
          <select id="billAmount" class="form-select">
            <option value="">Select bundle</option>
            <option value="2500">₦2,500 (Basic)</option>
            <option value="5000">₦5,000 (Standard)</option>
            <option value="9500">₦9,500 (Premium)</option>
          </select>
        </div>
      `;
    } else if (billType === "airtime") {
      container.innerHTML = `
        <div class="form-group">
          <label class="form-label">Network</label>
          <select id="billProvider" class="form-select">
            <option value="">Select network</option>
            <option>MTN</option>
            <option>GLO</option>
            <option>Airtel</option>
            <option>9mobile</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="text" id="billPhone" class="form-input" placeholder="e.g. 080..." />
        </div>
        <div class="form-group">
          <label class="form-label">Bundle Amount (₦)</label>
          <select id="billAmount" class="form-select">
            <option value="">Select bundle</option>
            <option value="500">₦500</option>
            <option value="750">₦750</option>
            <option value="1000">₦1,000</option>
            <option value="1500">₦1,500</option>
            <option value="2000">₦2,000</option>
            <option value="5000">₦5,000</option>
          </select>
        </div>
      `;
    }
  }

  function handleBillPay() {
    const billType = $("billType")?.value || "electricity";
    const amount = Number($("billAmount")?.value || 0);

    if (!amount || amount <= 0) {
      showToast("error", "Select a valid bundle amount.");
      return;
    }

    if (amount > balanceNaira) {
      showToast("error", "Insufficient balance to pay this bill.");
      return;
    }

    let targetLabel = "";
    if (billType === "electricity" || billType === "water") {
      const provider = $("billProvider")?.value || "";
      const account = $("billAccount")?.value || "";
      if (!provider || !account) {
        showToast("error", "Enter provider and meter/account number.");
        return;
      }
      targetLabel = `${provider} • ${account}`;
    } else if (billType === "dstv") {
      const account = $("billAccount")?.value || "";
      if (!account) {
        showToast("error", "Enter Smartcard/Decoder number.");
        return;
      }
      targetLabel = `DSTV / TV • ${account}`;
    } else if (billType === "airtime") {
      const provider = $("billProvider")?.value || "";
      const phone = $("billPhone")?.value || "";
      if (!provider || !phone) {
        showToast("error", "Enter network and phone number.");
        return;
      }
      targetLabel = `${provider} • ${phone}`;
    }

    balanceNaira -= amount;
    renderBalance();

    mockTransactions.unshift({
      id: Date.now(),
      type: "sent",
      title: `Bill payment: ${billType.toUpperCase()}`,
      meta: `${targetLabel} • Just now`,
      amount: -amount,
      status: "Completed",
    });
    renderTransactions();

    const shareText =
      `PAY54 Bill Payment Receipt\n\n` +
      `Type: ${billType.toUpperCase()}\n` +
      `Target: ${targetLabel}\n` +
      `Amount: ${formatNaira(amount)}\n` +
      `Account: ${currentUser.accountNumber}`;

    openReceiptModal({
      title: "Bill Payment Receipt",
      icon: "💡",
      subtitle: "Mock biller rails in PAY54 sandbox",
      amountLabel: "Amount",
      amountValue: formatNaira(amount),
      primaryLine: targetLabel,
      secondaryLine: billType.toUpperCase(),
      canShare: true,
      shareText,
    });

    closeModal("billsModal");
  }

  // Cards
  let cards = [
    {
      id: "vcard",
      type: "virtual",
      brand: "PAY54 VISA",
      last4: "4452",
      isDefault: true,
      bank: "PAY54",
    },
    {
      id: "gtb",
      type: "linked",
      brand: "GTBank",
      last4: "1023",
      isDefault: false,
      bank: "GTBank",
    },
    {
      id: "zenith",
      type: "linked",
      brand: "Zenith Bank",
      last4: "8890",
      isDefault: false,
      bank: "Zenith",
    },
  ];

  function initCards() {
    const card = $("serviceCards");
    const toggleAllBtn = $("toggleAllCardsBtn");
    const addBtn = $("cardAddBtn");

    if (card) {
      card.addEventListener("click", () => {
        renderCards();
        openModal("cardsModal");
      });
    }

    if (toggleAllBtn) {
      toggleAllBtn.addEventListener("click", () => {
        const list = $("allCardsList");
        if (!list) return;
        const visible = list.style.display === "block";
        list.style.display = visible ? "none" : "block";
        toggleAllBtn.textContent = visible ? "Show all cards" : "Hide cards";
      });
    }

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const number = $("cardNumber")?.value || "";
        const expiry = $("cardExpiry")?.value || "";
        const cvv = $("cardCvv")?.value || "";

        if (!number || number.length < 12 || !expiry || !cvv) {
          showToast("error", "Enter full card details.");
          return;
        }

        const last4 = number.slice(-4);
        cards.push({
          id: "card_" + Date.now(),
          type: "linked",
          brand: "Linked Card",
          last4,
          isDefault: false,
          bank: "Custom",
        });

        $("cardNumber").value = "";
        $("cardExpiry").value = "";
        $("cardCvv").value = "";

        renderCards();
        showSystemToast("success", "Card linked (mock).");
      });
    }
  }

  function renderCards() {
    const primary = $("primaryCardDisplay");
    const all = $("allCardsList");
    if (!primary || !all) return;

    const defaultCard = cards.find((c) => c.isDefault) || cards[0];
    if (!defaultCard && cards.length) {
      cards[0].isDefault = true;
    }

    primary.innerHTML = defaultCard
      ? `
        <div style="border-radius:14px;padding:0.8rem;background:linear-gradient(135deg,#1d4ed8,#0f172a);color:#e5e7eb;position:relative;overflow:hidden;">
          <div style="font-size:0.8rem;margin-bottom:0.3rem;">Default for online</div>
          <div style="font-size:0.95rem;font-weight:600;">${
            defaultCard.brand
          }</div>
          <div style="font-size:0.85rem;margin:0.25rem 0;">**** **** **** ${
            defaultCard.last4
          }</div>
          <div style="font-size:0.75rem;color:#bfdbfe;">${
            defaultCard.bank
          } • Contactless • PAY54</div>
        </div>
      `
      : `<span>No cards yet.</span>`;

    all.innerHTML = cards
      .map(
        (c) => `
        <div style="border-radius:12px;border:1px solid rgba(148,163,184,0.6);padding:0.5rem 0.6rem;margin-bottom:0.3rem;display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;">
          <div>
            <div>${c.brand} • **** ${c.last4}</div>
            <div style="font-size:0.7rem;color:#9ca3af;">${c.bank}</div>
          </div>
          <div style="display:flex;gap:0.35rem;">
            <button class="btn btn-secondary" style="padding:0.2rem 0.5rem;font-size:0.75rem;" data-card-default="${
              c.id
            }">${c.isDefault ? "Default" : "Set default"}</button>
            <button class="btn btn-ghost" style="padding:0.2rem 0.5rem;font-size:0.75rem;color:#f97373;" data-card-delete="${
              c.id
            }">Delete</button>
          </div>
        </div>
      `
      )
      .join("");

    all.querySelectorAll("[data-card-default]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-card-default");
        cards = cards.map((c) => ({ ...c, isDefault: c.id === id }));
        renderCards();
      });
    });

    all.querySelectorAll("[data-card-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-card-delete");
        cards = cards.filter((c) => c.id !== id);
        renderCards();
      });
    });
  }

  // Shop on the Fly
  function initShop() {
    const card = $("serviceShop");
    const body = $("shopBody");
    if (!card || !body) return;

    card.addEventListener("click", () => {
      body.innerHTML = `
        <div style="font-size:0.8rem;color:#9ca3af;margin-bottom:0.4rem;">
          In live PAY54, these tiles deep-link into partner apps/websites with affiliate tracking.
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.4rem;font-size:0.8rem;">
          <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.5rem;">
            <strong>🚕 Taxi</strong><br/>
            <a href="https://bolt.eu" target="_blank">Bolt</a><br/>
            <a href="https://uber.com" target="_blank">Uber</a>
          </div>
          <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.5rem;">
            <strong>🍔 Food</strong><br/>
            <a href="https://glovoapp.com" target="_blank">Glovo</a><br/>
            <a href="https://jiji.ng" target="_blank">Local Vendors</a>
          </div>
          <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.5rem;">
            <strong>🎟️ Tickets</strong><br/>
            <a href="https://www.cinemas.ng" target="_blank">Cinema</a><br/>
            <a href="https://www.eventbrite.com" target="_blank">Events</a>
          </div>
          <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.5rem;">
            <strong>🛍️ Shops</strong><br/>
            <a href="https://www.jumia.com.ng" target="_blank">Jumia</a><br/>
            <a href="https://www.aliexpress.com" target="_blank">AliExpress</a>
          </div>
        </div>
      `;
      openModal("shopModal");
    });
  }

  // Investments & Stocks
  const stockUniverse = [
    { symbol: "AAPL", name: "Apple Inc", priceUsd: 190.23 },
    { symbol: "TSLA", name: "Tesla", priceUsd: 220.5 },
    { symbol: "MSFT", name: "Microsoft", priceUsd: 325.1 },
  ];

  const investUniverse = [
    { id: "p54_saver", name: "PAY54 Saver (NGN)", priceUsd: 1 },
    { id: "p54_dollar", name: "PAY54 Dollar Vault", priceUsd: 1 },
  ];

  const portfolio = [];

  let activeInvestTab = "stocks"; // or "investments"
  let selectedAsset = null;

  function initInvestments() {
    const card = $("serviceInvest");
    const tabStocks = $("tabStocksBtn");
    const tabInvest = $("tabInvestmentsBtn");
    const investList = $("investList");
    const investBuyConfirm = $("investBuyConfirmBtn");

    if (card) {
      card.addEventListener("click", () => {
        activeInvestTab = "stocks";
        renderInvestList();
        openModal("investModal");
      });
    }

    if (tabStocks) {
      tabStocks.addEventListener("click", () => {
        activeInvestTab = "stocks";
        renderInvestList();
      });
    }

    if (tabInvest) {
      tabInvest.addEventListener("click", () => {
        activeInvestTab = "investments";
        renderInvestList();
      });
    }

    if (investBuyConfirm) {
      investBuyConfirm.addEventListener("click", handleInvestBuy);
    }

    function renderInvestList() {
      if (!investList) return;

      const universe =
        activeInvestTab === "stocks" ? stockUniverse : investUniverse;

      const mySection = renderPortfolioSection();

      investList.innerHTML =
        universe
          .map(
            (a) => `
          <div style="border-radius:10px;border:1px solid rgba(148,163,184,0.6);padding:0.5rem 0.6rem;margin-bottom:0.35rem;display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;">
            <div>
              <div style="font-weight:600;">${a.name}</div>
              <div style="font-size:0.75rem;color:#9ca3af;">
                ${
                  a.symbol
                    ? a.symbol
                    : a.id === "p54_saver"
                    ? "NGN Savings"
                    : "FX Vault"
                }
                • $${a.priceUsd.toFixed(2)}/unit
              </div>
            </div>
            <button class="btn btn-primary" style="padding:0.25rem 0.6rem;font-size:0.75rem;" data-invest-buy="${
              a.symbol || a.id
            }">Buy</button>
          </div>
        `
          )
          .join("") +
        mySection;

      investList.querySelectorAll("[data-invest-buy]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-invest-buy");
          selectedAsset =
            stockUniverse.find((s) => s.symbol === id) ||
            investUniverse.find((i) => i.id === id);
          if (!selectedAsset) return;

          $("investUnits").value = "1";
          $("investCurrency").value = "USD";
          updateInvestPrice();
          const title = $("investBuyTitle");
          if (title) {
            title.textContent = `Buy ${
              selectedAsset.symbol || selectedAsset.name
            }`;
          }
          openModal("investBuyModal");
        });
      });

      const unitsInput = $("investUnits");
      const currencySelect = $("investCurrency");
      if (unitsInput) unitsInput.oninput = updateInvestPrice;
      if (currencySelect) currencySelect.onchange = updateInvestPrice;
    }

    function renderPortfolioSection() {
      if (!portfolio.length) {
        return `
          <div style="margin-top:0.6rem;font-size:0.78rem;color:#9ca3af;">
            <strong>My Investments & Stocks</strong><br/>
            No assets yet. Buy your first stock or vault unit.
          </div>
        `;
      }

      const rows = portfolio
        .map(
          (p) =>
            `<div style="display:flex;justify-content:space-between;font-size:0.78rem;">
              <span>${p.label}</span>
              <span>${p.units} units • ${p.currency} ${p.totalFormatted}</span>
            </div>`
        )
        .join("");

      return `
        <div style="margin-top:0.6rem;padding-top:0.4rem;border-top:1px dashed rgba(148,163,184,0.5);font-size:0.78rem;">
          <strong>My Investments & Stocks</strong>
          <div style="margin-top:0.2rem;">${rows}</div>
        </div>
      `;
    }

    function updateInvestPrice() {
      if (!selectedAsset) return;
      const units = Number($("investUnits")?.value || 0);
      const currency = $("investCurrency")?.value || "USD";
      const unitPrice = selectedAsset.priceUsd;
      const totalUsd = units * unitPrice;

      const unitLabel = $("investUnitPriceLabel");
      const totalLabel = $("investTotalLabel");

      if (unitLabel) unitLabel.textContent = `$${unitPrice.toFixed(2)}`;
      if (totalLabel) {
        if (currency === "USD") {
          totalLabel.textContent = `$${totalUsd.toFixed(2)}`;
        } else {
          const rate = 1500; // mock
          const totalNgn = totalUsd * rate;
          totalLabel.textContent = `₦${totalNgn.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;
        }
      }
    }

    function handleInvestBuy() {
      if (!selectedAsset) return;
      const units = Number($("investUnits")?.value || 0);
      const currency = $("investCurrency")?.value || "USD";

      if (!units || units <= 0) {
        showToast("error", "Enter units to buy.");
        return;
      }

      const unitPrice = selectedAsset.priceUsd;
      const totalUsd = units * unitPrice;

      let totalNgn = 0;
      if (currency === "NGN") {
        const rate = 1500;
        totalNgn = totalUsd * rate;
        if (totalNgn > balanceNaira) {
          showToast(
            "error",
            "Insufficient balance in ₦ to complete this purchase."
          );
          return;
        }
        balanceNaira -= totalNgn;
      } else {
        // Paying in USD would be from FX wallet in real app
      }
      renderBalance();

      portfolio.push({
        label: selectedAsset.symbol || selectedAsset.name,
        units,
        currency,
        totalFormatted:
          currency === "USD"
            ? totalUsd.toFixed(2)
            : totalNgn.toLocaleString("en-NG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
      });

      showSystemToast(
        "success",
        `Bought ${units} unit(s) of ${
          selectedAsset.symbol || selectedAsset.name
        } (mock).`
      );

      openReceiptModal({
        title: "Investment Receipt",
        icon: "📈",
        subtitle: "Mock buy in PAY54 sandbox",
        amountLabel: "Total",
        amountValue:
          currency === "USD"
            ? `$${totalUsd.toFixed(2)}`
            : formatNaira(totalNgn),
        primaryLine: selectedAsset.symbol || selectedAsset.name,
        secondaryLine: `${units} unit(s) • Paid in ${currency}`,
        canShare: true,
        shareText:
          `PAY54 Investment Receipt\n\n` +
          `Asset: ${selectedAsset.symbol || selectedAsset.name}\n` +
          `Units: ${units}\n` +
          `Pay currency: ${currency}\n`,
      });

      closeModal("investBuyModal");
      renderInvestList();
    }

    // expose inner function to outer scope
    window.renderInvestList = renderInvestList;
  }

  // Agent
  function initAgent() {
    const card = $("serviceAgent");
    const submitBtn = $("agentSubmitBtn");

    if (card) {
      card.addEventListener("click", () => {
        openModal("agentModal");
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const fullName = $("agentFullName")?.value || "";
        const businessName = $("agentBusinessName")?.value || "";
        const nin = $("agentNin")?.value || "";
        const selfie = $("agentSelfie")?.files[0];

        if (!fullName || !businessName || !nin || nin.length !== 11 || !selfie) {
          showToast(
            "error",
            "All fields are required and NIN must be 11 digits."
          );
          return;
        }

        const shareText =
          `PAY54 Agent Application\n\n` +
          `Name: ${fullName}\n` +
          `Business: ${businessName}\n` +
          `NIN: ${nin}\n` +
          `Selfie: captured (mock only)\n`;

        openReceiptModal({
          title: "Agent Application Submitted",
          icon: "🧍‍♂️",
          subtitle: "Mock onboarding flow in PAY54 sandbox",
          amountLabel: "Status",
          amountValue: "Pending review",
          primaryLine: fullName,
          secondaryLine: businessName,
          extraLines: [{ label: "NIN", value: nin }],
          canShare: true,
          shareText,
        });

        closeModal("agentModal");
      });
    }
  }

  // AI Risk Watch
  function initAiRisk() {
    const card = $("serviceAiRisk");
    const body = $("aiRiskBody");

    if (!card || !body) return;

    card.addEventListener("click", () => {
      body.innerHTML = `
        <div style="font-size:0.8rem;color:#e5e7eb;margin-bottom:0.4rem;">
          PAY54’s AI Risk Watch will monitor transaction patterns and flag suspicious behaviour in real-time.
        </div>
        <ul style="font-size:0.78rem;color:#9ca3af;padding-left:1rem;">
          <li>Unusual device or location patterns</li>
          <li>Rapid-fire P2P to new beneficiaries</li>
          <li>Sudden high-value FX remittances</li>
          <li>Multiple failed PIN or OTP attempts</li>
        </ul>
        <div style="margin-top:0.4rem;font-size:0.78rem;">
          <strong>Mock example:</strong><br/>
          User tried 5 failed transfers to the same foreign account in 2 minutes.
          Risk Watch would <span style="color:#f97373;">lock the channel</span> and require extra KYC.
        </div>
      `;
      openModal("aiRiskModal");
    });
  }

  // ========= SCROLL TO TOP =========
  function initScrollTop() {
    const btn = $("scrollTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 250) {
        btn.classList.add("show");
      } else {
        btn.classList.remove("show");
      }
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ========= INIT =========
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initHeader();
    initBalance();
    renderTransactions();
    initMoneyMoves();
    initCrossBorder();
    initSavings();
    initBills();
    initCards();
    initShop();
    initInvestments();
    initAgent();
    initAiRisk();
    initScrollTop();
  });
})();
