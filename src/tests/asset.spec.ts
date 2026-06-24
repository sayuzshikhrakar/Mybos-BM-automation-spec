import { expect } from '@wdio/globals';
import { SessionManager } from '../core/SessionManager';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import AssetsPage from '../pages/AssetsPage';
import { LocatorRegistry } from '../core/LocatorRegistry';

describe('Assets Flow Module', () => {
    
    before(async () => {
        await SessionManager.validateAppLaunch();
        
        // Setup state: Assumes logged in for these tests.
        // Or implement a programmatic session initialization.
        await LoginPage.waitForScreenReady();
        await LoginPage.login('qa_user', 'password');
        await DashboardPage.waitForScreenReady();
    });

    beforeEach(async () => {
        await DashboardPage.navigateToAssets();
        await AssetsPage.waitForScreenReady();
    });

    it('should create an asset successfully', async () => {
        await AssetsPage.initiateCreation();
        await AssetsPage.createAsset('New Workstation');

        // Check for toast success (Contract Section 12)
        const toastLocator = LocatorRegistry.get(AssetsPage.successToast);
        const toastElement = await $(toastLocator);
        
        await toastElement.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Assets creation toast did not appear'
        });

        // Test returns gracefully - Mocha handles reporting
    });
});
