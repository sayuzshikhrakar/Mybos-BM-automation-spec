import { ContractValidator } from './ContractValidator';
import { StateEngine } from '../StateEngine';

/**
 * SessionManager.ts
 * Manages the Appium lifecycle, state recovery, and application reset.
 */
export class SessionManager {
    /**
     * Starts the framework execution safely.
     */
    static async frameworkStartup(): Promise<void> {
        await this.launchValidation();
        // Switch into the WebView context so web selectors work
        await this.switchToWebViewContext();
    }

    /**
     * Switches Appium context to the WebView (CHROMIUM) for web-based interactions.
     */
    static async switchToWebViewContext(): Promise<void> {
        try {
            // Wait a moment for the WebView to fully initialize
            await driver.pause(3000);
            const contexts = await driver.getContexts() as string[];
            console.info('[SessionManager] Available contexts:', contexts);
            // Find the first WEBVIEW context
            const webviewContext = contexts.find((ctx: string) => ctx.startsWith('WEBVIEW'));
            if (webviewContext) {
                await driver.switchContext(webviewContext);
                console.info(`[SessionManager] Switched to context: ${webviewContext}`);
            } else {
                console.warn('[SessionManager] No WEBVIEW context found, staying in NATIVE_APP');
            }
        } catch (err) {
            console.warn('[SessionManager] Context switch failed, staying in NATIVE_APP:', err);
        }
    }

    /**
     * Switches Appium context back to NATIVE_APP.
     */
    static async switchToNativeContext(): Promise<void> {
        await driver.switchContext('NATIVE_APP');
        console.info('[SessionManager] Switched to NATIVE_APP context');
    }

    /**
     * STEP 1 — APP LAUNCH VALIDATION
     */
    static async launchValidation(): Promise<void> {
        // Wait briefly for Appium to inject accessibility tree hooks on cold start
        try {
            // await ContractValidator.validateAppShell();
            // await ContractValidator.validateNoSystemFailure();
        } catch (error: any) {
            await this.captureScreenshot('app_launch_failure');
            throw new Error(`SessionManager: App Launch Validation Failed. ${error.message}`);
        }
    }

    /**
     * Captures a screenshot and saves it to disk.
     */
    static async captureScreenshot(name: string): Promise<string | undefined> {
        try {
            const timestamp = Date.now();
            const safeName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filePath = `./errorShots/${safeName}_${timestamp}.png`;
            await driver.saveScreenshot(filePath);
            return filePath;
        } catch (error) {
            console.error('SessionManager: Failed to capture screenshot', error);
            return undefined;
        }
    }

    /**
     * Recovery Logic: Attempts to return to a stable root state if a soft failure occurs.
     */
    static async executeRecoveryLogic(): Promise<void> {
        console.warn('SessionManager: Executing Recovery Logic...');
        try {
            await ContractValidator.validateNoSystemFailure();
            // Optional: If no system failure, attempt to navigate back to a stable route
            // e.g. await driver.back(); or interacting with a global recovery hook
        } catch (error) {
            // If system failure exists, recovery is impossible. Proceed to reset.
            console.error('SessionManager: Hard system failure detected. Cannot recover normally.');
            await this.applicationReset();
        }
    }

    /**
     * Fully resets the application session state in Appium.
     */
    static async applicationReset(): Promise<void> {
        console.warn('SessionManager: Performing full application reset.');
        await driver.reloadSession();
        await this.frameworkStartup();
    }

    /**
     * Shuts down the active session.
     */
    static async shutdown(): Promise<void> {
        console.info('SessionManager: Shutting down session.');
        // WebdriverIO handles core teardown, but custom cleanup can go here.
    }
}
