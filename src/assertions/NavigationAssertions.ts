import { expect } from '@wdio/globals';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';

export class NavigationAssertions {
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

    static async assertAppShellVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('global_app_shell');
    }

    static async assertBottomNavigationVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('global_bottom_nav');
    }

    static async assertNavigationReady(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertAppShellVisible();
        await this.assertBottomNavigationVisible();
    }

    static async assertTabActive(tabId: string): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible(`${tabId}_active`);
    }

    static async assertNavigationStable(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertNavigationReady();
    }
}
