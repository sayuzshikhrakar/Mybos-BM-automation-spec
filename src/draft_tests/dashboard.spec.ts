import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import { DashboardAssertions } from '../assertions/DashboardAssertions';

/**
 * dashboard.spec.ts
 * End-to-End validation of the Dashboard Flow utilizing the fully state-driven
 * architecture. Strictly adheres to the flutter locator and execution contracts.
 */
describe('Dashboard Automation Layer', () => {

    // Global Execution Flow - Framework Bootstrapping
    before(async () => {
        console.info('[TEST] Bootstrapping Execution Framework...');
        // Inherently validates app launch and system hook initialization
        await Bootstrap.initializeFramework();
    });

    // Pre-test Isolation & Teardown Handlers
    beforeEach(async () => {
        console.info('[TEST] Resetting session for clean test state...');
        // Ensure a clean session without residual data before executing tests
        await SessionManager.applicationReset();
    });

    afterEach(async function () {
        // Automatically captures failure screenshots and attempts state recovery natively
        if (this.currentTest?.state === 'failed') {
            const safeTestName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            console.error(`[TEST] Failure detected in: ${this.currentTest.title}`);
            await SessionManager.captureScreenshot(`dashboard_spec_failure_${safeTestName}`);
            await SessionManager.executeRecoveryLogic();
        }
    });

    it('should explicitly load and render the dashboard after successful authentication', async () => {
        // 1. Flow: Smart Authentication
        // Dynamically checks if we need to login or if we are already on the dashboard
        await LoginPage.ensureAuthenticated('James', 'asdfasdf');

        // 2. Flow: Verify dashboard loaded
        // Asserts explicitly that the defined root 'dashboard_screen_root' mounts
        await DashboardAssertions.assertDashboardLoaded();

        // 3. Flow: Verify dashboard ready
        // Compound assertion resolving system stability, loading hooks, and screen gates
        await DashboardAssertions.assertDashboardReady();

        // 4. Flow: Verify bottom navigation visible
        // Explicitly validates the structural 'global_bottom_nav' semantic node
        await DashboardAssertions.assertBottomNavigationVisible();
    });

});
