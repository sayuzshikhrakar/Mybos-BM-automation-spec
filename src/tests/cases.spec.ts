import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CasesPage from '../pages/CasesPage';
import CaseDetailPage from '../pages/CaseDetailPage';
import { DashboardAssertions } from '../assertions/DashboardAssertions';
import { CasesAssertions } from '../assertions/CasesAssertions';
import { CaseDetailAssertions } from '../assertions/CaseDetailAssertions';

describe('Cases Module Automation Phase 3', () => {

    before(async () => {
        await Bootstrap.initializeFramework();
    });

    beforeEach(async () => {
        await SessionManager.applicationReset();
    });

    afterEach(async function () {
        if (this.currentTest?.state === 'failed') {
            const safeTestName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            await SessionManager.captureScreenshot(`cases_spec_failure_${safeTestName}`);
            await SessionManager.executeRecoveryLogic();
        }
    });

    it('should fully orchestrate the Cases module navigation and verification flows', async () => {
        // 1. Flow: Smart Authentication
        await LoginPage.ensureAuthenticated('valid_automation_user', 'secure_password_123');

        // 2. Verify dashboard
        await DashboardAssertions.assertDashboardReady();

        // 3. Navigate to Cases
        await DashboardPage.tapCasesModule();

        // 4. Verify Cases screen
        await CasesPage.waitForCasesLoaded();
        await CasesAssertions.assertCasesLoaded();

        // 5. Verify Cases ready
        await CasesPage.verifyCasesReady();
        await CasesAssertions.assertCasesReady();

        // Determine branch dynamically via native element existence 
        // without violating the execution contract (No sleep, no XPath)
        const emptyStateLocator = LocatorRegistry.get(CasesPage.emptyState);
        const emptyStateEl = await $(emptyStateLocator);
        const isListEmpty = await emptyStateEl.isExisting();

        if (isListEmpty) {
            // validate empty state
            await CasesPage.verifyEmptyState();
            await CasesAssertions.assertCasesEmptyState();
        } else {
            // validate first case exists
            await CasesPage.verifyListLoaded();
            await CasesAssertions.assertCasesListVisible();

            // open first case
            await CasesPage.openFirstCase();

            // validate case detail screen
            await CaseDetailPage.verifyCaseDetailLoaded();
            await CaseDetailAssertions.assertCaseDetailLoaded();

            // validate case content
            await CaseDetailPage.verifyContentVisible();
            await CaseDetailAssertions.assertCaseContentVisible();

            // return to cases list
            await CaseDetailPage.goBack();

            await CasesPage.verifyCasesReady();
            await CasesAssertions.assertCasesReady();
        }
    });

});
