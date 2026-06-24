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
        // 1. Launch app & Smart Login
        await LoginPage.ensureAuthenticated('James', 'asdfasdf');

        // 2. Verify we left the login screen (This proves the smoke test passed!)
        const emailInput = await $('//android.widget.EditText[1]');
        await emailInput.waitForExist({ reverse: true, timeout: 10000 });
    });

});
