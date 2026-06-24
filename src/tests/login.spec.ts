import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import { ContractValidator } from '../core/engine/ContractValidator';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';

/**
 * login.spec.ts
 * End-to-End validation of the Login Flow using the State-Driven Architecture.
 */
describe('Login Automation Layer', () => {

    // Global Execution Flow - Step 1 & 2
    before(async () => {
        console.info('[TEST] Bootstrapping Execution Framework...');
        // 1. Initialize framework (validates app launch, system stability, and P0 locators)
        await Bootstrap.initializeFramework();
        
        // Double check readiness gate explicitly as requested
        await ContractValidator.validateReadyState();
    });

    beforeEach(async () => {
        console.info('[TEST] Resetting session for clean test state...');
        // Ensure we are on the login screen with a clean session before every test
        await SessionManager.applicationReset();
        
        // 2. Wait for login_screen_root
        await LoginPage.openLoginScreen();
    });

    afterEach(async function () {
        // MUST capture failure via SessionManager
        if (this.currentTest?.state === 'failed') {
            console.error(`[TEST] Failure detected in: ${this.currentTest.title}`);
            await SessionManager.captureScreenshot(`login_spec_failure`);
            
            // Execute recovery logic to attempt to gracefully handle the failure
            await SessionManager.executeRecoveryLogic();
        }
    });

    it('should successfully login with valid credentials', async () => {
        // 3. Enter username
        // 4. Enter password
        // 5. Tap login button
        // (All handled inside the state-driven login method without sleep())
        await LoginPage.login('valid_automation_user', 'secure_password_123');

        // 6. Validate dashboard_screen_root OR success hook
        // StateEngine blocks until dashboard is strictly ready
        await DashboardPage.waitForScreenReady();
        await DashboardPage.verifyScreen();
        
        // Additionally verify the login screen has transitioned away
        await LoginPage.verifyLoginSuccess();
    });

    it('should fail login with invalid credentials and display error state', async () => {
        // 1. Enter wrong credentials
        // 2. Tap login
        await LoginPage.login('invalid_user', 'wrong_password_999');

        // 3. Validate login_error_state OR error banner
        // StateEngine waits for the element to appear natively
        await LoginPage.verifyLoginFailure();
        
        // Ensure we are still bound to the login root and didn't transition
        await LoginPage.verifyScreen();
    });
});
