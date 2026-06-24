import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import LoginPage from '../pages/LoginPage';
import NavigationPage from '../pages/NavigationPage';
import { NavigationAssertions } from '../assertions/NavigationAssertions';
import { AppShellAssertions } from '../assertions/AppShellAssertions';

describe('Navigation Smoke Test', () => {

    before(async () => {
        await Bootstrap.initializeFramework();
    });

    beforeEach(async () => {
        await SessionManager.applicationReset();
    });

    afterEach(async function () {
        if (this.currentTest?.state === 'failed') {
            const safeTestName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            await SessionManager.captureScreenshot(`nav_smoke_failure_${safeTestName}`);
            await SessionManager.executeRecoveryLogic();
        }
    });

    it('should successfully execute a full navigation smoke flow natively', async () => {
        // 1. Launch app & Login
        await LoginPage.openLoginScreen();
        await LoginPage.login('valid_automation_user', 'secure_password_123');

        // 2. Verify shell
        await AppShellAssertions.assertGlobalShellVisible();
        await NavigationAssertions.assertNavigationReady();

        // 3. Open each tab
        await NavigationPage.openDashboard();
        await NavigationAssertions.assertTabActive(NavigationPage.tabDashboard);

        await NavigationPage.openCases();
        await NavigationAssertions.assertTabActive(NavigationPage.tabCases);

        await NavigationPage.openAssets();
        await NavigationAssertions.assertTabActive(NavigationPage.tabAssets);

        // 4. Return to Dashboard
        await NavigationPage.openDashboard();
        await NavigationAssertions.assertTabActive(NavigationPage.tabDashboard);

        // 5. Assert no system failure states
        await AppShellAssertions.assertNoSystemFailure();
        await AppShellAssertions.assertGlobalUIStable();
    });

});
