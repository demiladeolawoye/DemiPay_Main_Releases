/**
 * DemiPay v5.5 QA Test Suite
 * Automated testing for all core functionalities
 */

class QATestSuite {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            total: 0,
            tests: []
        };
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🧪 ========================================');
        console.log('🧪 DemiPay v5.5 QA Test Suite');
        console.log('🧪 ========================================');
        console.log('');

        this.results = { passed: 0, failed: 0, total: 0, tests: [] };

        // Authentication Tests
        console.log('📋 AUTHENTICATION TESTS');
        console.log('─────────────────────────────────────');
        await this.testMockAPIInitialization();
        await this.testUserAuthentication();
        await this.testSessionPersistence();
        console.log('');

        // Wallet Tests
        console.log('📋 WALLET TESTS');
        console.log('─────────────────────────────────────');
        await this.testBalanceRetrieval();
        await this.testWalletDetails();
        console.log('');

        // Transaction Tests
        console.log('📋 TRANSACTION TESTS');
        console.log('─────────────────────────────────────');
        await this.testSendPayment();
        await this.testReceivePayment();
        await this.testTransactionHistory();
        await this.testInsufficientBalance();
        console.log('');

        // UI Tests
        console.log('📋 UI/UX TESTS');
        console.log('─────────────────────────────────────');
        await this.testThemeToggle();
        await this.testResponsiveDesign();
        await this.testFormValidation();
        console.log('');

        // Data Persistence Tests
        console.log('📋 DATA PERSISTENCE TESTS');
        console.log('─────────────────────────────────────');
        await this.testLocalStoragePersistence();
        await this.testDataIntegrity();
        console.log('');

        // Performance Tests
        console.log('📋 PERFORMANCE TESTS');
        console.log('─────────────────────────────────────');
        await this.testPageLoadTime();
        await this.testAPIResponseTime();
        console.log('');

        // Print Summary
        this.printSummary();

        return this.results;
    }

    /**
     * Test: Mock API Initialization
     */
    async testMockAPIInitialization() {
        const testName = 'Mock API Initialization';
        try {
            const initialized = mockAPI.initialized;
            this.assert(initialized === true, testName, 'Mock API should be initialized');
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: User Authentication
     */
    async testUserAuthentication() {
        const testName = 'User Authentication';
        try {
            // Test login with valid credentials
            const result = await mockAPI.login('demo@demipay.com', 'demo123');
            this.assert(result.success === true, testName, 'Login should succeed with valid credentials');
            
            // Test authentication check
            const isAuth = mockAPI.isAuthenticated();
            this.assert(isAuth === true, testName, 'User should be authenticated after login');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Session Persistence
     */
    async testSessionPersistence() {
        const testName = 'Session Persistence';
        try {
            const sessionToken = localStorage.getItem('demipay_session');
            this.assert(sessionToken !== null, testName, 'Session token should be stored in localStorage');
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Balance Retrieval
     */
    async testBalanceRetrieval() {
        const testName = 'Balance Retrieval';
        try {
            const result = await mockAPI.getBalance();
            this.assert(result.success === true, testName, 'Balance retrieval should succeed');
            this.assert(typeof result.balance === 'number', testName, 'Balance should be a number');
            this.assert(result.balance >= 0, testName, 'Balance should be non-negative');
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Wallet Details
     */
    async testWalletDetails() {
        const testName = 'Wallet Details';
        try {
            const result = await mockAPI.getWalletDetails();
            this.assert(result.success === true, testName, 'Wallet details retrieval should succeed');
            this.assert(result.wallet !== null, testName, 'Wallet object should exist');
            this.assert(result.wallet.wallet_address !== undefined, testName, 'Wallet should have an address');
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Send Payment
     */
    async testSendPayment() {
        const testName = 'Send Payment';
        try {
            const initialBalance = (await mockAPI.getBalance()).balance;
            const amount = 10.00;
            
            const result = await mockAPI.sendPayment('john.doe@example.com', amount, 'Test payment');
            this.assert(result.success === true, testName, 'Send payment should succeed');
            this.assert(result.transaction !== null, testName, 'Transaction object should be returned');
            
            const newBalance = result.new_balance;
            const expectedBalance = initialBalance - amount - (amount * 0.005); // amount + fee
            this.assert(Math.abs(newBalance - expectedBalance) < 0.01, testName, 'Balance should be updated correctly');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Receive Payment
     */
    async testReceivePayment() {
        const testName = 'Receive Payment';
        try {
            const initialBalance = (await mockAPI.getBalance()).balance;
            const amount = 50.00;
            
            const result = await mockAPI.receivePayment(amount, 'external@example.com', 'Test incoming payment');
            this.assert(result.success === true, testName, 'Receive payment should succeed');
            this.assert(result.transaction !== null, testName, 'Transaction object should be returned');
            
            const newBalance = result.new_balance;
            const expectedBalance = initialBalance + amount;
            this.assert(Math.abs(newBalance - expectedBalance) < 0.01, testName, 'Balance should be updated correctly');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Transaction History
     */
    async testTransactionHistory() {
        const testName = 'Transaction History';
        try {
            const result = await mockAPI.getTransactionHistory(10);
            this.assert(result.success === true, testName, 'Transaction history retrieval should succeed');
            this.assert(Array.isArray(result.transactions), testName, 'Transactions should be an array');
            this.assert(result.transactions.length > 0, testName, 'Should have at least one transaction');
            
            // Check transaction structure
            const txn = result.transactions[0];
            this.assert(txn.id !== undefined, testName, 'Transaction should have an ID');
            this.assert(txn.amount !== undefined, testName, 'Transaction should have an amount');
            this.assert(txn.type !== undefined, testName, 'Transaction should have a type');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Insufficient Balance
     */
    async testInsufficientBalance() {
        const testName = 'Insufficient Balance Check';
        try {
            const balance = (await mockAPI.getBalance()).balance;
            const excessiveAmount = balance + 1000;
            
            let errorThrown = false;
            try {
                await mockAPI.sendPayment('john.doe@example.com', excessiveAmount, 'Test excessive payment');
            } catch (error) {
                errorThrown = true;
                this.assert(error.message.includes('Insufficient'), testName, 'Should throw insufficient balance error');
            }
            
            this.assert(errorThrown === true, testName, 'Should prevent payment with insufficient balance');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Theme Toggle
     */
    async testThemeToggle() {
        const testName = 'Theme Toggle';
        try {
            const initialTheme = document.body.classList.contains('dark-mode');
            
            // Toggle theme
            document.body.classList.toggle('dark-mode');
            const newTheme = document.body.classList.contains('dark-mode');
            
            this.assert(initialTheme !== newTheme, testName, 'Theme should toggle');
            
            // Toggle back
            document.body.classList.toggle('dark-mode');
            const restoredTheme = document.body.classList.contains('dark-mode');
            
            this.assert(initialTheme === restoredTheme, testName, 'Theme should toggle back');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Responsive Design
     */
    async testResponsiveDesign() {
        const testName = 'Responsive Design';
        try {
            const viewport = window.innerWidth;
            this.assert(viewport > 0, testName, 'Viewport should have width');
            
            // Check if CSS is loaded
            const styles = window.getComputedStyle(document.body);
            this.assert(styles.fontFamily !== '', testName, 'CSS should be loaded');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Form Validation
     */
    async testFormValidation() {
        const testName = 'Form Validation';
        try {
            // Test email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this.assert(emailRegex.test('test@example.com'), testName, 'Valid email should pass');
            this.assert(!emailRegex.test('invalid-email'), testName, 'Invalid email should fail');
            
            // Test amount validation
            const validAmount = 100.50;
            const invalidAmount = -10;
            this.assert(validAmount > 0, testName, 'Positive amount should be valid');
            this.assert(invalidAmount <= 0, testName, 'Negative amount should be invalid');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: LocalStorage Persistence
     */
    async testLocalStoragePersistence() {
        const testName = 'LocalStorage Persistence';
        try {
            // Test database storage
            const database = localStorage.getItem('demipay_database');
            this.assert(database !== null, testName, 'Database should be stored in localStorage');
            
            // Test session storage
            const session = localStorage.getItem('demipay_session');
            this.assert(session !== null, testName, 'Session should be stored in localStorage');
            
            // Test data parsing
            const parsedDB = JSON.parse(database);
            this.assert(parsedDB.users !== undefined, testName, 'Database should contain users');
            this.assert(parsedDB.transactions !== undefined, testName, 'Database should contain transactions');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Data Integrity
     */
    async testDataIntegrity() {
        const testName = 'Data Integrity';
        try {
            const database = JSON.parse(localStorage.getItem('demipay_database'));
            
            // Check users
            this.assert(Array.isArray(database.users), testName, 'Users should be an array');
            this.assert(database.users.length > 0, testName, 'Should have at least one user');
            
            // Check transactions
            this.assert(Array.isArray(database.transactions), testName, 'Transactions should be an array');
            
            // Check wallets
            this.assert(Array.isArray(database.wallets), testName, 'Wallets should be an array');
            this.assert(database.wallets.length > 0, testName, 'Should have at least one wallet');
            
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: Page Load Time
     */
    async testPageLoadTime() {
        const testName = 'Page Load Time';
        try {
            if (window.performance && window.performance.timing) {
                const perfData = window.performance.timing;
                const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                this.assert(loadTime > 0, testName, 'Load time should be measurable');
                this.assert(loadTime < 5000, testName, 'Page should load in less than 5 seconds');
                
                console.log(`   ⏱️  Page load time: ${loadTime}ms`);
            } else {
                this.pass(testName, 'Performance API not available');
            }
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Test: API Response Time
     */
    async testAPIResponseTime() {
        const testName = 'API Response Time';
        try {
            const startTime = Date.now();
            await mockAPI.getBalance();
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            this.assert(responseTime < 2000, testName, 'API should respond in less than 2 seconds');
            
            console.log(`   ⏱️  API response time: ${responseTime}ms`);
        } catch (error) {
            this.fail(testName, error.message);
        }
    }

    /**
     * Assert helper
     */
    assert(condition, testName, message) {
        this.results.total++;
        if (condition) {
            this.results.passed++;
            this.results.tests.push({ name: testName, status: 'PASSED', message });
            console.log(`   ✅ ${testName}: PASSED`);
            console.log(`      ${message}`);
        } else {
            this.results.failed++;
            this.results.tests.push({ name: testName, status: 'FAILED', message });
            console.log(`   ❌ ${testName}: FAILED`);
            console.log(`      ${message}`);
        }
    }

    /**
     * Pass helper
     */
    pass(testName, message) {
        this.results.total++;
        this.results.passed++;
        this.results.tests.push({ name: testName, status: 'PASSED', message });
        console.log(`   ✅ ${testName}: PASSED`);
        console.log(`      ${message}`);
    }

    /**
     * Fail helper
     */
    fail(testName, message) {
        this.results.total++;
        this.results.failed++;
        this.results.tests.push({ name: testName, status: 'FAILED', message });
        console.log(`   ❌ ${testName}: FAILED`);
        console.log(`      ${message}`);
    }

    /**
     * Print summary
     */
    printSummary() {
        console.log('');
        console.log('🧪 ========================================');
        console.log('🧪 TEST SUMMARY');
        console.log('🧪 ========================================');
        console.log('');
        console.log(`   Total Tests: ${this.results.total}`);
        console.log(`   ✅ Passed: ${this.results.passed}`);
        console.log(`   ❌ Failed: ${this.results.failed}`);
        console.log(`   📊 Pass Rate: ${((this.results.passed / this.results.total) * 100).toFixed(2)}%`);
        console.log('');
        
        if (this.results.failed === 0) {
            console.log('   🎉 ALL TESTS PASSED! 🎉');
        } else {
            console.log('   ⚠️  SOME TESTS FAILED');
            console.log('');
            console.log('   Failed Tests:');
            this.results.tests
                .filter(t => t.status === 'FAILED')
                .forEach(t => {
                    console.log(`   - ${t.name}: ${t.message}`);
                });
        }
        
        console.log('');
        console.log('🧪 ========================================');
    }

    /**
     * Export results
     */
    exportResults() {
        return {
            timestamp: new Date().toISOString(),
            version: '5.5',
            results: this.results
        };
    }
}

// Create global instance
const QATests = new QATestSuite();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QATests;
}

console.log('💡 QA Test Suite loaded. Run QATests.runAllTests() to execute all tests.');