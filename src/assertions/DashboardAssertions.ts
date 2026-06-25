import { expect } from '@wdio/globals';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/LocatorRegistry';

/**
 * DashboardAssertions.ts
 * Centralized assertions for the Dashboard Flow natively enforcing the 
 * state-driven execution capabilities.
 */
export class DashboardAssertions {

    /**
     * Natively blocks execution until both system_loading_state_active 
     * and system_network_state_active have fully dissipated.
     */
    private static async enforceExecutionContract(): Promise<void> {
        await StateEngine.waitForSystemStable();
        await StateEngine.validateNoSystemFailure();
    }

    /**
     * Helper to assert visibility safely mapped via the LocatorRegistry.
     */
    private static async assertVisible(identifier: string): Promise<void> {
        const locator = LocatorRegistry.get(identifier);
        const element = await $(locator);

        await element.waitForDisplayed({
            timeout: StateEngine.TIMEOUT_SCREEN_LOAD,
            timeoutMsg: `Assertion Failed: Element ${identifier} was not visibly mounted.`
        });

        await expect(element).toBeDisplayed();
    }


    /**
     * Asserts the explicit visibility of the dashboard navigation tab.
     */
    static async assertDashboardTabVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('Home');
    }

    /**
     * Asserts that all provided dashboard modules are fully visible.
     */
    static async assertDashboardModulesVisible(modules: string[]): Promise<void> {
        await this.enforceExecutionContract();
        for (const module of modules) {
            await this.assertVisible(module);
        }
    }

    /**
     * Asserts that the hamburger menu icon is visible on the top left.
     */
    static async assertHamburgerMenuVisible(): Promise<void> {
        await this.enforceExecutionContract();
        // Since the hamburger ImageView has no content-desc or resource-id, 
        // we use native UIAutomator to target the very first ImageView rendered on screen.
        const hamburgerLocator = '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(0)';
        await this.assertVisible(hamburgerLocator);
    }

    /**
     * Asserts that the correct building name is prominently displayed.
     */
    static async assertBuildingNameVisible(buildingName: string): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible(buildingName);
    }

    /**
     * Compound assertion verifying the dashboard is fully stabilized, 
     * the root is rendered, and the UI has settled safely.
     */
    static async assertDashboardReady(): Promise<void> {
        await this.enforceExecutionContract();
        // Enforce the atomic readiness gate for the dashboard using a realistic UI component
        await StateEngine.waitForScreenReady('Home');

        // Verify visual components are natively attached
        await this.assertDashboardTabVisible();
    }
}
