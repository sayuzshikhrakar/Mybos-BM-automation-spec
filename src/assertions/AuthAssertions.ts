import { expect } from '@wdio/globals';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/LocatorRegistry';

/**
 * AuthAssertions.ts
 * Centralized assertions for authentication-related flows.
 * Strictly adheres to flutter_locator_contract.md and automation_execution_contract.md.
 */
export class AuthAssertions {

    /**
     * Helper to perform mandatory pre-assertion validation hooks.
     * Guarantees the system is stable and has no fatal crashes.
     */
    private static async executePreAssertionHooks(): Promise<void> {
        // Enforce Contract: Block until network/loading states settle
        await StateEngine.waitForSystemStable();
        // Enforce Contract: Ensure no render or UI inconsistency failures exist
        await StateEngine.validateNoSystemFailure();
    }

    /**
     * Helper to assert visibility safely via the LocatorRegistry.
     */
    private static async assertVisible(identifier: string): Promise<void> {
        const locator = LocatorRegistry.get(identifier);
        const element = await $(locator);
        
        // Wait briefly for element to appear natively
        await element.waitForDisplayed({
            timeout: StateEngine.TIMEOUT_SCREEN_LOAD,
            timeoutMsg: `Assertion Failed: Element ${identifier} was not visible.`
        });
        
        await expect(element).toBeDisplayed();
    }

    /**
     * Asserts that a login attempt was fully successful.
     */
    static async expectLoginSuccessful(): Promise<void> {
        await this.executePreAssertionHooks();
        // A successful login inherently transitions to the dashboard root
        await this.assertVisible('module_dashboard_screen_root');
    }

    /**
     * Asserts that a login attempt definitively failed.
     */
    static async expectLoginFailed(): Promise<void> {
        await this.executePreAssertionHooks();
        
        // Check for either the specific login error state or a global error banner
        const loginErrorLocator = LocatorRegistry.get('module_login_state_error');
        const globalErrorLocator = LocatorRegistry.get('global_error_banner');
        
        const loginError = await $(loginErrorLocator);
        const globalError = await $(globalErrorLocator);
        
        // Wait for either to exist
        await browser.waitUntil(async () => {
            return (await loginError.isDisplayed()) || (await globalError.isDisplayed());
        }, {
            timeout: StateEngine.TIMEOUT_ELEMENT_READY,
            timeoutMsg: 'Assertion Failed: Neither module_login_state_error nor global_error_banner were displayed.'
        });

        // We know at least one is displayed now, but let's assert for WDIO reporting
        const isLoginErrorDisplayed = await loginError.isDisplayed();
        if (isLoginErrorDisplayed) {
            await expect(loginError).toBeDisplayed();
        } else {
            await expect(globalError).toBeDisplayed();
        }
    }

    /**
     * Asserts that the user logged out successfully.
     */
    static async expectLogoutSuccessful(): Promise<void> {
        await this.executePreAssertionHooks();
        // A successful logout forcefully mounts the login screen root
        await this.assertVisible('module_login_screen_root');
    }

    /**
     * Asserts that the authenticated Dashboard is fully loaded.
     */
    static async expectDashboardLoaded(): Promise<void> {
        await this.executePreAssertionHooks();
        // Uses StateEngine screen readiness gate to explicitly validate the root
        await StateEngine.waitForScreenReady('module_dashboard_screen_root');
        await this.assertVisible('module_dashboard_screen_root');
    }

    /**
     * Asserts that the Login Screen is explicitly visible.
     */
    static async expectLoginScreenVisible(): Promise<void> {
        await this.executePreAssertionHooks();
        // Uses StateEngine screen readiness gate
        await StateEngine.waitForScreenReady('module_login_screen_root');
        await this.assertVisible('module_login_screen_root');
    }

    /**
     * Asserts that a previously authenticated session persisted successfully
     * without requiring a manual re-login.
     */
    static async expectSessionPersisted(): Promise<void> {
        await this.executePreAssertionHooks();
        
        // The app shell must exist natively
        await this.assertVisible('global_app_shell');
        
        // Ensure the session successfully bypassed the login wall and restored the dashboard root
        await this.assertVisible('module_dashboard_screen_root');
        
        const loginLocator = LocatorRegistry.get('module_login_screen_root');
        const loginRoot = await $(loginLocator);
        
        // Double check login root is definitely NOT displayed
        await expect(loginRoot).not.toBeDisplayed();
    }
}
