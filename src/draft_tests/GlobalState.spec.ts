import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import LoginPage from '../pages/LoginPage';
import NavigationPage from '../pages/NavigationPage';
import { NavigationAssertions } from '../assertions/NavigationAssertions';
import { AppShellAssertions } from '../assertions/AppShellAssertions';

describe('Global State & System Stability Validation', () => {

    before(async () => {
        await Bootstrap.initializeFramework();
    });

    beforeEach(async () => {
        await SessionManager.applicationReset();
    });

    afterEach(async function () {
        if (this.currentTest?.state === 'failed') {
            const safeTestName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            await SessionManager.captureScreenshot(`global_state_failure_${safeTestName}`);
            await SessionManager.executeRecoveryLogic();
        }
    });

    it('should natively validate the core global state execution hooks', async () => {
        // 1. App launch & Login
        await LoginPage.openLoginScreen();
        await LoginPage.login('valid_automation_user', 'secure_password_123');

        // 2. Validate app shell
        await AppShellAssertions.assertGlobalShellVisible();

        // 3. Validate no system failure states
        await AppShellAssertions.assertNoSystemFailure();

        // 4. Validate system stability hooks
        await AppShellAssertions.assertGlobalUIStable();

        // 5. Validate bottom navigation exists
        await NavigationPage.verifyBottomNavigation();
        await NavigationAssertions.assertBottomNavigationVisible();

        // 6. Validate navigation works
        await NavigationPage.openDashboard();
        await NavigationAssertions.assertNavigationStable();
        await NavigationAssertions.assertTabActive(NavigationPage.tabDashboard);

        await NavigationPage.openCases();
        await NavigationAssertions.assertNavigationStable();
        await NavigationAssertions.assertTabActive(NavigationPage.tabCases);

        await NavigationPage.openAssets();
        await NavigationAssertions.assertNavigationStable();
        await NavigationAssertions.assertTabActive(NavigationPage.tabAssets);
    });

});
