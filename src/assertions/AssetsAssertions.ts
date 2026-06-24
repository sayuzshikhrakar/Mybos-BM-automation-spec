import { expect } from '@wdio/globals';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/LocatorRegistry';

export class AssetsAssertions {
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

    static async assertAssetsLoaded(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('assets_screen_root');
    }

    static async assertAssetsReady(): Promise<void> {
        await this.enforceExecutionContract();
        await StateEngine.waitForScreenReady('assets_screen_root');
        await this.assertAssetsLoaded();
    }

    static async assertAssetsListVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('assets_list_container');
    }

    static async assertAssetsEmptyState(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('assets_state_empty');
    }

    static async assertAssetsErrorState(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('assets_state_error');
    }

    static async assertAssetVisible(assetId: string): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible(`assets_list_item_${assetId}`);
    }
}
