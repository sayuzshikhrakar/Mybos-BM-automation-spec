import { expect } from '@wdio/globals';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/LocatorRegistry';

export class CasesAssertions {
    private static async enforceExecutionContract(): Promise<void> {
        await StateEngine.waitForSystemStable();
        await StateEngine.validateNoSystemFailure();
    }

    private static async assertVisible(identifier: string): Promise<void> {
        const locator = LocatorRegistry.get(identifier);
        const element = await $(locator);
        
        await element.waitForDisplayed({
            timeout: StateEngine.TIMEOUT_SCREEN_LOAD,
            timeoutMsg: `Assertion Failed: Element ${identifier} was not visibly mounted.`
        });
        
        await expect(element).toBeDisplayed();
    }

    static async assertCasesLoaded(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('cases_screen_root');
    }

    static async assertCasesReady(): Promise<void> {
        await this.enforceExecutionContract();
        await StateEngine.waitForScreenReady('cases_screen_root');
        await this.assertCasesLoaded();
    }

    static async assertCasesListVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('cases_list_container');
    }

    static async assertCasesEmptyState(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('cases_state_empty');
    }

    static async assertCasesErrorState(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('cases_state_error');
    }

    static async assertCaseVisible(caseId: string): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible(`cases_list_item_${caseId}`);
    }
}
