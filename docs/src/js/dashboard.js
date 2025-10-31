/**
 * DemiPay v5.5 Dashboard JavaScript
 * Handles all dashboard functionality
 */

// Global state
let currentUser = null;
let currentBalance = 0;
let transactions = [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DemiPay v5.5 Dashboard Loading...');
    
    try {
        // Initialize Mock API
        await mockAPI.init();
        
        // Check authentication
        if (!mockAPI.isAuthenticated()) {
            window.location.href = 'src/pages/login.html';
            return;
            // ===============================
// MOCK TRANSACTIONS + LOAD MORE
// ===============================
const mockTxContainer = document.getElementById('transactionsList');
let mockData = [
  { type: "Sent", name: "John Doe", desc: "P2P Transfer", amount: -150.00, status: "completed" },
  { type: "Received", name: "Jane Smith", desc: "Refund", amount: 320.00, status: "completed" },
  { type: "Sent", name: "Netflix", desc: "Monthly Subscription", amount: -45.99, status: "pending" },
  { type: "Received", name: "Upwork Ltd", desc: "Freelance Payment", amount: 500.00, status: "completed" },
  { type: "Sent", name: "Bolt", desc: "Ride Payment", amount: -17.80, status: "completed" }
];

// Render mock transactions
function renderMockTransactions() {
  mockTxContainer.innerHTML = mockData.map(tx => `
    <div class="transaction-item ${tx.amount < 0 ? 'debit' : 'credit'}">
      <div class="tx-info">
        <strong>${tx.type} ${tx.name}</strong>
        <p>${tx.desc}</p>
      </div>
      <div class="tx-amount">
        <span>${tx.amount < 0 ? '-' : '+'}$${Math.abs(tx.amount).toFixed(2)}</span>
        <small class="${tx.status}">${tx.status}</small>
      </div>
    </div>
  `).join("");
}

// Load More button
const loadMoreBtn = document.createElement("button");
loadMoreBtn.textContent = "Load More Transactions";
loadMoreBtn.className = "btn btn-secondary btn-sm";
loadMoreBtn.style.marginTop = "10px";
loadMoreBtn.addEventListener("click", () => {
  const newTx = [
    { type: "Received", name: "Stripe Payout", desc: "Business income", amount: 1200.00, status: "completed" },
    { type: "Sent", name: "Spotify", desc: "Music subscription", amount: -9.99, status: "completed" }
  ];
  mockData = [...mockData, ...newTx];
  renderMockTransactions();
});

mockTxContainer.after(loadMoreBtn);
renderMockTransactions();

        }
        
        // Get current user
        currentUser = mockAPI.getCurrentUser();
        
        // Initialize dashboard
        await initializeDashboard();
        
        // Hide loading overlay
        document.getElementById('loadingOverlay').style.display = 'none';
        
        console.log('✅ Dashboard initialized successfully');
        
    } catch (error) {
        console.error('❌ Dashboard initialization failed:', error);
        showToast('error', 'Failed to load dashboard');
    }
});

// Initialize dashboard components
async function initializeDashboard() {
    // Load user data
    await loadUserData();
    
    // Load balance
    await loadBalance();
    
    // Load transactions
    await loadTransactions();
    
    // Setup event listeners
    setupEventListeners();
    
    // Apply saved theme
    applySavedTheme();
}

// Load user data
async function loadUserData() {
    document.getElementById('userName').textContent = currentUser.full_name;
    document.getElementById('welcomeName').textContent = currentUser.full_name.split(' ')[0];
    document.getElementById('userAvatar').src = currentUser.profile_picture;
}

// Load balance
async function loadBalance() {
    try {
        const result = await mockAPI.getBalance();
        currentBalance = result.balance;
        
        document.getElementById('balanceAmount').textContent = formatCurrency(result.balance);
        document.getElementById('walletAddress').textContent = `Wallet: ${result.wallet_address}`;
        
    } catch (error) {
        console.error('Failed to load balance:', error);
        showToast('error', 'Failed to load balance');
    }
}

// Load transactions
async function loadTransactions() {
    try {
        const result = await mockAPI.getTransactionHistory(5);
        transactions = result.transactions;
        
        renderTransactions(transactions);
        
    } catch (error) {
        console.error('Failed to load transactions:', error);
        showToast('error', 'Failed to load transactions');
    }
}

// Render transactions
function renderTransactions(txns) {
    const container = document.getElementById('transactionsList');
    
    if (txns.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>No transactions yet</p>
                <p class="text-sm">Start by sending or receiving money</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = txns.map(txn => {
        const isSent = txn.sender_id === currentUser.id;
        const isReceived = txn.recipient_id === currentUser.id;
        const amount = isSent ? -txn.amount : txn.amount;
        const otherParty = isSent ? txn.recipient_name : txn.sender_name;
        
        return `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${isSent ? 'send' : 'receive'}">
                        ${isSent ? '💸' : '📥'}
                    </div>
                    <div class="transaction-details">
                        <h4>${isSent ? 'Sent to' : 'Received from'} ${otherParty}</h4>
                        <p>${txn.note || 'No description'}</p>
                        <p class="text-sm">${formatDate(txn.created_at)}</p>
                    </div>
                </div>
                <div class="transaction-amount">
                    <div class="amount ${amount > 0 ? 'positive' : 'negative'}">
                        ${amount > 0 ? '+' : ''}${formatCurrency(Math.abs(amount))}
                    </div>
                    <span class="status ${txn.status}">${txn.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // User menu
    document.getElementById('userMenuBtn').addEventListener('click', toggleUserMenu);
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Refresh balance
    document.getElementById('refreshBalanceBtn').addEventListener('click', loadBalance);
    
    // Quick actions
    document.getElementById('sendMoneyBtn').addEventListener('click', () => openModal('sendMoneyModal'));
    document.getElementById('receiveMoneyBtn').addEventListener('click', () => openModal('receiveMoneyModal'));
    document.getElementById('viewHistoryBtn').addEventListener('click', () => alert('Transaction history page coming soon!'));
    document.getElementById('addContactBtn').addEventListener('click', () => alert('Contacts page coming soon!'));
    
    // Send money modal
    document.getElementById('closeSendModal').addEventListener('click', () => closeModal('sendMoneyModal'));
    document.getElementById('cancelSendBtn').addEventListener('click', () => closeModal('sendMoneyModal'));
    document.getElementById('confirmSendBtn').addEventListener('click', handleSendMoney);
    document.getElementById('sendAmount').addEventListener('input', updateSendSummary);
    
    // Receive money modal
    document.getElementById('closeReceiveModal').addEventListener('click', () => closeModal('receiveMoneyModal'));
    document.getElementById('cancelReceiveBtn').addEventListener('click', () => closeModal('receiveMoneyModal'));
    document.getElementById('confirmReceiveBtn').addEventListener('click', handleReceiveMoney);
    
    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });
}

// Theme toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
    document.getElementById('themeText').textContent = isDark ? 'Light Mode' : 'Dark Mode';
    
    // Save preference
    localStorage.setItem('demipay_theme', isDark ? 'dark' : 'light');
    
    console.log(`🎨 Theme changed to: ${isDark ? 'dark' : 'light'}`);
}

// Apply saved theme
function applySavedTheme() {
    const savedTheme = localStorage.getItem('demipay_theme') || currentUser.preferences.theme;
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').textContent = '☀️';
        document.getElementById('themeText').textContent = 'Light Mode';
    }
}

// Toggle user menu
function toggleUserMenu() {
    const dropdown = document.getElementById('userMenuDropdown');
    dropdown.classList.toggle('show');
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userMenuDropdown');
    
    if (!userMenu.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Handle logout
async function handleLogout(e) {
    e.preventDefault();
    
    try {
        await mockAPI.logout();
        window.location.href = 'src/pages/login.html';
    } catch (error) {
        console.error('Logout failed:', error);
        showToast('error', 'Logout failed');
    }
}

// Open modal
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('d-none');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('d-none');
    document.body.style.overflow = 'auto';
    
    // Reset forms
    if (modalId === 'sendMoneyModal') {
        document.getElementById('sendMoneyForm').reset();
        updateSendSummary();
        document.getElementById('sendAlertContainer').innerHTML = '';
    } else if (modalId === 'receiveMoneyModal') {
        document.getElementById('receiveMoneyForm').reset();
        document.getElementById('receiveAlertContainer').innerHTML = '';
    }
}

// Update send summary
function updateSendSummary() {
    const amount = parseFloat(document.getElementById('sendAmount').value) || 0;
    const fee = amount * 0.005;
    const total = amount + fee;
    
    document.getElementById('summaryAmount').textContent = formatCurrency(amount);
    document.getElementById('summaryFee').textContent = formatCurrency(fee);
    document.getElementById('summaryTotal').textContent = formatCurrency(total);
}

// Handle send money
async function handleSendMoney() {
    const recipientEmail = document.getElementById('recipientEmail').value;
    const amount = parseFloat(document.getElementById('sendAmount').value);
    const note = document.getElementById('sendNote').value;
    
    const btn = document.getElementById('confirmSendBtn');
    const btnText = document.getElementById('sendBtnText');
    const btnSpinner = document.getElementById('sendBtnSpinner');
    const alertContainer = document.getElementById('sendAlertContainer');
    
    // Validate
    if (!recipientEmail || !amount || amount <= 0) {
        showModalAlert('sendAlertContainer', 'error', 'Please fill in all required fields');
        return;
    }
    
    // Check balance
    const fee = amount * 0.005;
    const total = amount + fee;
    if (total > currentBalance) {
        showModalAlert('sendAlertContainer', 'error', 'Insufficient balance');
        return;
    }
    
    // Show loading
    btn.disabled = true;
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');
    
    try {
        const result = await mockAPI.sendPayment(recipientEmail, amount, note);
        
        // Update balance
        currentBalance = result.new_balance;
        document.getElementById('balanceAmount').textContent = formatCurrency(currentBalance);
        
        // Reload transactions
        await loadTransactions();
        
        // Show success
        showToast('success', `Successfully sent ${formatCurrency(amount)} to ${recipientEmail}`);
        
        // Close modal
        closeModal('sendMoneyModal');
        
        console.log('✅ Payment sent:', result.transaction.transaction_hash);
        
    } catch (error) {
        showModalAlert('sendAlertContainer', 'error', error.message);
        console.error('❌ Send payment failed:', error);
    } finally {
        btn.disabled = false;
        btnText.classList.remove('d-none');
        btnSpinner.classList.add('d-none');
    }
}

// Handle receive money
async function handleReceiveMoney() {
    const amount = parseFloat(document.getElementById('receiveAmount').value);
    const senderName = document.getElementById('senderName').value || 'External sender';
    const note = document.getElementById('receiveNote').value;
    
    const btn = document.getElementById('confirmReceiveBtn');
    const btnText = document.getElementById('receiveBtnText');
    const btnSpinner = document.getElementById('receiveBtnSpinner');
    
    // Validate
    if (!amount || amount <= 0) {
        showModalAlert('receiveAlertContainer', 'error', 'Please enter a valid amount');
        return;
    }
    
    // Show loading
    btn.disabled = true;
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');
    
    try {
        const result = await mockAPI.receivePayment(amount, senderName, note);
        
        // Update balance
        currentBalance = result.new_balance;
        document.getElementById('balanceAmount').textContent = formatCurrency(currentBalance);
        
        // Reload transactions
        await loadTransactions();
        
        // Show success
        showToast('success', `Successfully received ${formatCurrency(amount)}`);
        
        // Close modal
        closeModal('receiveMoneyModal');
        
        console.log('✅ Payment received:', result.transaction.transaction_hash);
        
    } catch (error) {
        showModalAlert('receiveAlertContainer', 'error', error.message);
        console.error('❌ Receive payment failed:', error);
    } finally {
        btn.disabled = false;
        btnText.classList.remove('d-none');
        btnSpinner.classList.add('d-none');
    }
}

// Show modal alert
function showModalAlert(containerId, type, message) {
    const container = document.getElementById(containerId);
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    
    container.innerHTML = `
        <div class="alert ${alertClass}">
            <span>${type === 'success' ? '✅' : '❌'}</span>
            <span>${message}</span>
        </div>
    `;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Show toast notification
function showToast(type, message) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        return 'Today at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
        return 'Yesterday at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
        return days + ' days ago';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

console.log('💡 Dashboard script loaded');
// ------------------------------
// QUICK ACTIONS BUTTON LOGIC
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendMoneyBtn");
  const receiveBtn = document.getElementById("receiveMoneyBtn");
  const historyBtn = document.getElementById("viewHistoryBtn");
  const contactBtn = document.getElementById("addContactBtn");

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      alert("💸 Send Money feature coming soon! (mock screen)");
    });
  }

  if (receiveBtn) {
    receiveBtn.addEventListener("click", () => {
      alert("📥 Receive Money (QR + Account Share) demo launching soon!");
    });
  }

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      alert("📊 Transaction History (mock API data)");
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      alert("👥 Manage Contacts — feature under testing");
    });
  }
});
// ------------------------------
// QUICK SERVICES MODAL LOGIC
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("serviceModal");
  const closeBtn = modal.querySelector(".close");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  const services = document.querySelectorAll(".service-card");

  const serviceData = {
    send: { title: "Send P2P", body: "Enter recipient, amount, and note. Demo transfer simulated ⚙️" },
    receive: { title: "Receive Money", body: "Display QR or share account link. Demo receive active ✅" },
    fx: { title: "Cross-Border Remittance", body: "Preview FX rate ₦1 = $0.0012 USD (Mock)" },
    agent: { title: "Become an Agent", body: "Upload ID + photo (mock validation passed ✅)" },
    bills: { title: "Pay Bills & Top-Up", body: "Select plan ₦500 – ₦5 000. Demo payment complete 💡" },
    cards: { title: "Virtual & Linked Cards", body: "Linked Visa **** 4452 (Active Card)" },
    addmoney: { title: "Add Money", body: "Funding wallet via card... Mock success ₦10 000 added ✅" },
    savings: { title: "Savings", body: "Demo savings created @ 10% APY (Standing Order set)" },
    invest: { title: "Investments & Stocks", body: "Purchased 2 shares of DemiTech PLC ($120 mock update)" },
  };

  services.forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.service;
      modalTitle.textContent = serviceData[key].title;
      modalBody.textContent = serviceData[key].body;
      modal.style.display = "block";
    });
  });

  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
});
}); // ← end of your QUICK SERVICES MODAL LOGIC

// ------------------------------
// AGENT MODAL LOGIC (FULL FORM)
// ------------------------------
const agentCard = document.querySelector('[data-service="agent"]');
if (agentCard) {
  agentCard.addEventListener("click", () => {
    document.getElementById("agentModal").classList.remove("d-none");
    document.body.style.overflow = "hidden";
  });
}

document.getElementById("closeAgentModal").addEventListener("click", () => {
  document.getElementById("agentModal").classList.add("d-none");
  document.body.style.overflow = "auto";
});

document.getElementById("cancelAgentBtn").addEventListener("click", () => {
  document.getElementById("agentModal").classList.add("d-none");
  document.body.style.overflow = "auto";
});

// ✅ AGENT FORM SUBMISSION (with smooth success popup)
document.getElementById("submitAgentBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const fullName = document.getElementById("agentFullName").value.trim();
  const nin = document.getElementById("agentNIN").value.trim();
  const photo = document.getElementById("agentPhoto").files[0];
  
  if (!fullName || !nin || !photo) {
    alert("⚠️ All fields are required before submission.");
    return;
  }

  // ✅ SUCCESS POPUP REPLACES ALERT
  const successPopup = document.createElement("div");
  successPopup.className = "success-popup";
  successPopup.innerHTML = `
    <div class="success-icon">✅</div>
    <div class="success-text">Agent Application Submitted Successfully</div>
  `;
  document.body.appendChild(successPopup);

  // Animate fade in/out
  setTimeout(() => successPopup.classList.add("show"), 100);
  setTimeout(() => successPopup.classList.remove("show"), 2500);
  setTimeout(() => successPopup.remove(), 3000);

  // ✅ Close modal and reset form
  document.getElementById("agentModal").classList.add("d-none");
  document.getElementById("agentForm").reset();
  document.body.style.overflow = "auto";
});
