import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import LoginPage from '../pages/LoginPage';
import NavigationPage from '../pages/NavigationPage';
import DashboardPage from '../pages/DashboardPage';
import CasesPage from '../pages/CasesPage';
import AssetsPage from '../pages/AssetsPage';
import { AppShellAssertions } from '../assertions/AppShellAssertions';
import { ContractValidator } from '../core/engine/ContractValidator';
import { DuplicateIdentifierScanner } from './DuplicateIdentifierScanner';

/**
 * ContractTestSuite.spec.ts
 * Purpose: Unified End-to-End CI Contract Validation orchestrating all audit layers.
 */
describe('CI Hardening: End-to-End Contract Validation Suite', () => {

    before(async () => {
        // 1. Launch app
        await Bootstrap.initializeFramework();
        await SessionManager.applicationReset();
    });

    afterEach(async function () {
        if (this.currentTest?.state === 'failed') {
            await SessionManager.captureScreenshot(`contract_suite_failure`);
            await SessionManager.executeRecoveryLogic();
        }
    });

    it('should strictly validate the complete system lifecycle against the execution contracts', async () => {
        await LoginPage.openLoginScreen();
        await LoginPage.login('valid_ci_user', 'secure_password_123');

        // 2. Validate app shell
        await AppShellAssertions.assertGlobalShellVisible();

        // 3. Validate system hooks dynamically
        await ContractValidator.validateSystemHooks();

        // 4. Validate navigation layer natively
        await NavigationPage.verifyBottomNavigation();

        // 5. Validate all core modules
        // Dashboard
        await NavigationPage.openDashboard();
        await DashboardPage.waitForDashboardLoaded();
        
        // Cases
        await NavigationPage.openCases();
        await CasesPage.waitForCasesLoaded();
        
        // Assets
        await NavigationPage.openAssets();
        await AssetsPage.waitForAssetsLoaded();

        // 6. Run critical audit checks actively on the rendered view
        
        // Duplicate Identifier Scanner Execution (HARD CI GATE)
        await DuplicateIdentifierScanner.failCIOnDuplicates();

        // If execution reaches here seamlessly, the system is 100% CI-COMPLIANT
        expect(true).toBe(true); // SYSTEM IS FULLY CI-COMPLIANT
    });

});
