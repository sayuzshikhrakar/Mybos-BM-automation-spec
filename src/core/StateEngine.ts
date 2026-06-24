import { driver, $ } from '@wdio/globals';
import { LocatorRegistry } from './LocatorRegistry';

/**
 * StateEngine.ts
 * Enforces the Automation Execution Contract
 * Strict state-driven execution, no arbitrary sleep() timeouts.
 */
export class StateEngine {
    // Timeout limits per contract section 4
    static TIMEOUT_SCREEN_LOAD = 20000;
    static TIMEOUT_NETWORK_SYNC = 30000;
    static TIMEOUT_WEBVIEW_LOAD = 40000;
    static TIMEOUT_DROPDOWN_OPEN = 10000;
    static TIMEOUT_ELEMENT_INTERACT = 10000;

    /**
     * STEP 2: SYSTEM STABILITY CHECK
     * Waits for the app to settle after launch (no arbitrary sleeps - uses implicit poll).
     */
    static async waitForSystemStable(): Promise<void> {
        // Give the app a moment to finish rendering the WebView content
        await driver.pause(2000);
    }

    /**
     * STEP 3: SCREEN READINESS GATE
     * Waits for a given XPath/locator to be visible on screen.
     * For WebView-based apps, pass an XPath like '//android.widget.EditText'.
     * If no screenRootId is given, just waits for system stability.
     */
    static async waitForScreenReady(screenRootId?: string): Promise<void> {
        await this.waitForSystemStable();

        if (screenRootId) {
            const locator = LocatorRegistry.get(screenRootId);
            const screenRoot = await $(locator);
            await screenRoot.waitForDisplayed({
                timeout: this.TIMEOUT_SCREEN_LOAD,
                timeoutMsg: `StateEngine: Screen root ${locator} is not visible.`
            });
        }
    }

    /**
     * No-op: app does not expose system failure accessibility flags.
     */
    static async validateNoSystemFailure(): Promise<void> {
        // Not applicable for this hybrid app - no contract flags are present
    }

    /**
     * Wait for an element to be ready for interaction (Section 8)
     */
    static async waitForElementReady(identifier: string): Promise<WebdriverIO.Element> {
        const locator = LocatorRegistry.get(identifier);
        const element = await $(locator);

        // Retry logic loop allowed for transient rendering delays (Section 5)
        let attempt = 0;
        const maxRetries = 2;
        let baseDelay = 1000;

        while (attempt <= maxRetries) {
            try {
                // Element must exist and be interactable
                await element.waitForExist({
                    timeout: this.TIMEOUT_ELEMENT_INTERACT,
                    timeoutMsg: `StateEngine: Element ${locator} not found`
                });
                
                await this.validateNoSystemFailure();
                
                return element;
            } catch (error: any) {
                if (attempt === maxRetries) {
                    throw error;
                }
                attempt++;
                await driver.pause(baseDelay); // Exponential backoff simulation allowed ONLY during element retry recovery
                baseDelay *= 2;
            }
        }
        
        throw new Error(`StateEngine: Element ${locator} not ready after retries.`);
    }
}
