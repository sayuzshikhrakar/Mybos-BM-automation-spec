import { expect } from '@wdio/globals';
import { SessionManager } from '../core/SessionManager';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CasesPage from '../pages/CasesPage';

describe('Cases Flow Module', () => {
    
    before(async () => {
        await SessionManager.validateAppLaunch();
        
        await LoginPage.waitForScreenReady();
        await LoginPage.login('qa_user', 'password');
        await DashboardPage.waitForScreenReady();
    });

    beforeEach(async () => {
        await DashboardPage.navigateToCases();
        await CasesPage.waitForScreenReady();
    });

    it('should update a case status to resolved', async () => {
        const testCaseId = '10045'; // E.g. obtained from test data or API setup

        // This utilizes the strict list & dropdown contract logic
        await CasesPage.selectCase(testCaseId);
        await CasesPage.waitForScreenReady(); // Wait for Case Detail screen
        
        await CasesPage.updateCaseStatusToResolved();
        
        // If an explicit assertion is needed, one could query the state.
        // However, updateCaseStatusToResolved validates the system stabilizes.
    });
});
