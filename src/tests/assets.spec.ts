import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import AssetsPage from '../pages/AssetsPage';
import AssetDetailPage from '../pages/AssetDetailPage';
import { AuthAssertions } from '../assertions/AuthAssertions';
import { DashboardAssertions } from '../assertions/DashboardAssertions';
import { AssetsAssertions } from '../assertions/AssetsAssertions';
import { AssetDetailAssertions } from '../assertions/AssetDetailAssertions';

describe('Assets Module Automation Phase 4', () => {

    before(async () => {
        await Bootstrap.initializeFramework();
    });

    beforeEach(async () => {
        await SessionManager.applicationReset();
    });

    afterEach(async function () {
        if (this.currentTest?.state === 'failed') {
            const safeTestName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            await SessionManager.captureScreenshot(`assets_spec_failure_${safeTestName}`);
            await SessionManager.executeRecoveryLogic();
        }
    });

    it('should fully orchestrate the Assets module navigation and verification flows', async () => {
        // 1. Flow: Smart Authentication
        await LoginPage.ensureAuthenticated('valid_automation_user', 'secure_password_123');

        // 2. Verify Dashboard
        await DashboardAssertions.assertDashboardReady();

        // 3. Navigate to Assets module
        await DashboardPage.tapAssetsModule();

        // 4. Verify Assets screen loaded
        await AssetsPage.waitForAssetsLoaded();
        await AssetsAssertions.assertAssetsLoaded();

        // 5. Verify Assets ready
        await AssetsPage.verifyAssetsReady();
        await AssetsAssertions.assertAssetsReady();

        // Branch logic dynamically based on native element state
        const emptyStateLocator = LocatorRegistry.get(AssetsPage.emptyState);
        const emptyStateEl = await $(emptyStateLocator);
        const isListEmpty = await emptyStateEl.isExisting();

        if (isListEmpty) {
            // validate empty state
            await AssetsPage.verifyEmptyState();
            await AssetsAssertions.assertAssetsEmptyState();
        } else {
            // open first asset
            await AssetsPage.verifyListLoaded();
            await AssetsAssertions.assertAssetsListVisible();
            await AssetsPage.openFirstAsset();

            // verify asset detail screen
            await AssetDetailPage.verifyAssetDetailLoaded();
            await AssetDetailAssertions.assertAssetDetailLoaded();

            // verify content visible
            await AssetDetailPage.verifyContentVisible();
            await AssetDetailAssertions.assertAssetContentVisible();

            // go back to assets list
            await AssetDetailPage.goBack();

            await AssetsPage.verifyAssetsReady();
            await AssetsAssertions.assertAssetsReady();
        }
    });

});
