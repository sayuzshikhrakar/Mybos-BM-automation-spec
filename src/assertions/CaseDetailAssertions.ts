import { expect } from '@wdio/globals';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';

export class CaseDetailAssertions {
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

    static async assertCaseDetailLoaded(): Promise<void> {
        await this.enforceExecutionContract();
        await StateEngine.waitForScreenReady('cases_detail_screen_root');
        await this.assertVisible('cases_detail_screen_root');
    }

    static async assertCaseContentVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('cases_detail_content');
    }
}
