import { expect } from '@wdio/globals';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/LocatorRegistry';

export class AssetDetailAssertions {
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

    static async assertAssetDetailLoaded(): Promise<void> {
        await this.enforceExecutionContract();
        await StateEngine.waitForScreenReady('assets_detail_screen_root');
        await this.assertVisible('assets_detail_screen_root');
    }

    static async assertAssetContentVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('assets_detail_content');
    }
}
