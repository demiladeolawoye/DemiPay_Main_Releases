/**
 * DemiPay v5.5 Mock API Service
 * Simulates backend API calls using local JSON database
 */

class MockAPI {
    constructor() {
        this.database = null;
        this.currentUser = null;
        this.currentSession = null;
        this.initialized = false;
    }

    /**
     * Initialize the mock API with database
     */
    async init() {
        try {
            // Load mock database from localStorage or use default
            const stored = localStorage.getItem('demipay_database');
            if (stored) {
                this.database = JSON.parse(stored);
            } else {
                // Load default database
                const response = await fetch('src/data/mockDatabase.json');
                this.database = await response.json();
                this.saveDatabase();
            }
            
            // Check for existing session
            const sessionToken = localStorage.getItem('demipay_session');
            if (sessionToken) {
                this.currentSession = this.findSession(sessionToken);
                if (this.currentSession) {
                    this.currentUser = this.findUserById(this.currentSession.user_id);
                }
            }
            
            this.initialized = true;
            console.log('✅ Mock API initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Mock API:', error);
            return false;
        }
    }

    /**
     * Save database to localStorage
     */
    saveDatabase() {
        localStorage.setItem('demipay_database', JSON.stringify(this.database));
    }

    /**
     * Generate unique ID
     */
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Generate transaction hash
     */
    generateTransactionHash() {
        const date = new Date().toISOString().split('T')[0];
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `TXN-${date}-${random}`;
    }

    // ==================== USER AUTHENTICATION ====================

    /**
     * Login user
     */
    async login(email, password) {
        await this.delay(500); // Simulate network delay
        
        const user = this.database.users.find(u => 
            u.email === email && u.password === password && u.is_active
        );
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Create session
        const session = {
            id: this.generateId('session'),
            user_id: user.id,
            token: this.generateId('token'),
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            ip_address: '127.0.0.1',
            user_agent: navigator.userAgent
        };

        this.database.sessions.push(session);
        this.saveDatabase();

        // Update last login
        user.last_login = new Date().toISOString();
        this.saveDatabase();

        // Store session
        localStorage.setItem('demipay_session', session.token);
        this.currentSession = session;
        this.currentUser = user;

        console.log('✅ Login successful:', user.email);
        return {
            success: true,
            user: this.sanitizeUser(user),
            session: session.token
        };
    }

    /**
     * Register new user
     */
    async register(userData) {
        await this.delay(500);

        // Check if email already exists
        const existingUser = this.database.users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create new user
        const newUser = {
            id: this.generateId('user'),
            email: userData.email,
            password: userData.password, // In real app, this would be hashed
            full_name: userData.full_name,
            phone: userData.phone || '',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            is_active: true,
            profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
            preferences: {
                theme: 'light',
                currency: 'USD',
                notifications: true,
                language: 'en'
            }
        };

        // Create wallet for new user
        const newWallet = {
            id: this.generateId('wallet'),
            user_id: newUser.id,
            balance: 0.00,
            currency: 'USD',
            wallet_address: `DP-${newUser.full_name.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        this.database.users.push(newUser);
        this.database.wallets.push(newWallet);
        this.saveDatabase();

        console.log('✅ Registration successful:', newUser.email);
        return {
            success: true,
            user: this.sanitizeUser(newUser),
            message: 'Registration successful! Please login.'
        };
    }

    /**
     * Logout user
     */
    async logout() {
        await this.delay(200);

        if (this.currentSession) {
            // Remove session from database
            this.database.sessions = this.database.sessions.filter(
                s => s.id !== this.currentSession.id
            );
            this.saveDatabase();
        }

        // Clear local storage
        localStorage.removeItem('demipay_session');
        this.currentSession = null;
        this.currentUser = null;

        console.log('✅ Logout successful');
        return { success: true };
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return this.currentUser !== null && this.currentSession !== null;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
    }

    // ==================== WALLET OPERATIONS ====================

    /**
     * Get wallet balance
     */
    async getBalance() {
        await this.delay(300);

        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const wallet = this.findWalletByUserId(this.currentUser.id);
        if (!wallet) {
            throw new Error('Wallet not found');
        }

        return {
            success: true,
            balance: wallet.balance,
            currency: wallet.currency,
            wallet_address: wallet.wallet_address
        };
    }

    /**
     * Get wallet details
     */
    async getWalletDetails() {
        await this.delay(300);

        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        const wallet = this.findWalletByUserId(this.currentUser.id);
        return {
            success: true,
            wallet: wallet
        };
    }

    // ==================== TRANSACTION OPERATIONS ====================

    /**
     * Send payment
     */
    async sendPayment(recipientEmail, amount, note = '') {
        await this.delay(1000); // Simulate processing time

        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        // Validate amount
        if (amount <= 0) {
            throw new Error('Amount must be greater than 0');
        }

        // Find recipient
        const recipient = this.database.users.find(u => u.email === recipientEmail);
        if (!recipient) {
            throw new Error('Recipient not found');
        }

        if (recipient.id === this.currentUser.id) {
            throw new Error('Cannot send payment to yourself');
        }

        // Get wallets
        const senderWallet = this.findWalletByUserId(this.currentUser.id);
        const recipientWallet = this.findWalletByUserId(recipient.id);

        // Calculate fee (0.5% of amount)
        const fee = amount * 0.005;
        const totalAmount = amount + fee;

        // Check balance
        if (senderWallet.balance < totalAmount) {
            throw new Error('Insufficient balance');
        }

        // Create transaction
        const transaction = {
            id: this.generateId('txn'),
            sender_id: this.currentUser.id,
            recipient_id: recipient.id,
            amount: amount,
            currency: senderWallet.currency,
            type: 'send',
            status: 'completed',
            note: note,
            transaction_hash: this.generateTransactionHash(),
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            fee: fee
        };

        // Update balances
        senderWallet.balance -= totalAmount;
        recipientWallet.balance += amount;
        senderWallet.updated_at = new Date().toISOString();
        recipientWallet.updated_at = new Date().toISOString();

        // Save transaction
        this.database.transactions.push(transaction);
        this.saveDatabase();

        console.log('✅ Payment sent successfully:', transaction.transaction_hash);
        return {
            success: true,
            transaction: transaction,
            new_balance: senderWallet.balance
        };
    }

    /**
     * Receive payment (simulate incoming payment)
     */
    async receivePayment(amount, senderEmail = 'external@example.com', note = '') {
        await this.delay(1000);

        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        // Get wallet
        const wallet = this.findWalletByUserId(this.currentUser.id);

        // Create transaction
        const transaction = {
            id: this.generateId('txn'),
            sender_id: 'external',
            recipient_id: this.currentUser.id,
            amount: amount,
            currency: wallet.currency,
            type: 'receive',
            status: 'completed',
            note: note || 'Incoming payment',
            transaction_hash: this.generateTransactionHash(),
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            fee: 0
        };

        // Update balance
        wallet.balance += amount;
        wallet.updated_at = new Date().toISOString();

        // Save transaction
        this.database.transactions.push(transaction);
        this.saveDatabase();

        console.log('✅ Payment received successfully:', transaction.transaction_hash);
        return {
            success: true,
            transaction: transaction,
            new_balance: wallet.balance
        };
    }

    /**
     * Get transaction history
     */
    async getTransactionHistory(limit = 50, offset = 0) {
        await this.delay(400);

        if (!this.isAuthenticated()) {
            throw new Error('User not authenticated');
        }

        // Get user's transactions
        const transactions = this.database.transactions
            .filter(t => 
                t.sender_id === this.currentUser.id || 
                t.recipient_id === this.currentUser.id
            )
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(offset, offset + limit);

        // Enrich transactions with user details
        const enrichedTransactions = transactions.map(t => {
            const sender = this.findUserById(t.sender_id);
            const recipient = this.findUserById(t.recipient_id);
            
            return {
                ...t,
                sender_name: sender ? sender.full_name : 'External',
                sender_email: sender ? sender.email : 'external@example.com',
                recipient_name: recipient ? recipient.full_name : 'External',
                recipient_email: recipient ? recipient.email : 'external@example.com'
            };
        });

        return {
            success: true,
            transactions: enrichedTransactions,
            total: this.database.transactions.filter(t => 
                t.sender_id === this.currentUser.id || 
                t.recipient_id === this.currentUser.id
            ).length
        };
    }

    /**
     * Get transaction by ID
     */
    async getTransaction(transactionId) {
        await this.delay(300);

        const transaction = this.database.transactions.find(t => t.id === transactionId);
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        return {
            success: true,
            transaction: transaction
        };
    }

    // ==================== HELPER METHODS ====================

    /**
     * Find user by ID
     */
    findUserById(userId) {
        return this.database.users.find(u => u.id === userId);
    }

    /**
     * Find wallet by user ID
     */
    findWalletByUserId(userId) {
        return this.database.wallets.find(w => w.user_id === userId);
    }

    /**
     * Find session by token
     */
    findSession(token) {
        return this.database.sessions.find(s => s.token === token);
    }

    /**
     * Sanitize user object (remove sensitive data)
     */
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }

    /**
     * Simulate network delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Reset database to default
     */
    async resetDatabase() {
        localStorage.removeItem('demipay_database');
        localStorage.removeItem('demipay_session');
        await this.init();
        console.log('✅ Database reset to default');
    }
}

// Create global instance
const mockAPI = new MockAPI();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockAPI;
}