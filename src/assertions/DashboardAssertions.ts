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
     * Asserts that the explicitly named dashboard root has successfully 
     * loaded into the accessibility hierarchy.
     */
    static async assertDashboardLoaded(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('dashboard_screen_root');
    }

    /**
     * Asserts the explicit visibility of the global bottom navigation semantic container.
     */
    static async assertBottomNavigationVisible(): Promise<void> {
        await this.enforceExecutionContract();
        await this.assertVisible('global_bottom_nav');
    }

    /**
     * Compound assertion verifying the dashboard is fully stabilized, 
     * the root is rendered, and the UI has settled safely.
     */
    static async assertDashboardReady(): Promise<void> {
        await this.enforceExecutionContract();
        
        // Enforce the atomic readiness gate for the dashboard specifically
        await StateEngine.waitForScreenReady('dashboard_screen_root');
        
        // Verify visual components are natively attached
        await this.assertDashboardLoaded();
        await this.assertBottomNavigationVisible();
    }
}
