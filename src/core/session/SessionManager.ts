import { LocatorRegistry } from '../LocatorRegistry';
import { StateEngine } from '../StateEngine';

/**
 * SessionManager.ts
 * 
 * Implements the Global Execution Flow defined in the Automation Execution Contract.
 * Ensures the automation session starts deterministically.
 */
export class SessionManager {

    /**
     * Single entry point executed before every test suite.
     * Implements the strict boot sequence defined in the Execution Contract.
     */
    static async initialize(): Promise<void> {
        await this.validateAppLaunch();
        await this.validateSystemStable();
    }

    /**
     * STEP 1 — APP LAUNCH VALIDATION
     * Ensures the global shell is present and no catastrophic rendering failures exist.
     */
    static async validateAppLaunch(): Promise<void> {
        const appShellLocator = LocatorRegistry.get('global_app_shell');
        const appShell = await $(appShellLocator);

        try {
            await appShell.waitForExist({
                timeout: StateEngine.TIMEOUT_SCREEN_LOAD,
                timeoutMsg: 'SessionManager: global_app_shell did not appear within timeout.'
            });
        } catch (error: any) {
            throw new Error(`HARD FAIL: App failed to launch properly. ${error.message}`);
        }

        // Validate no system failures detected right after launch
        try {
            await StateEngine.validateNoSystemFailure();
        } catch (error: any) {
            throw new Error(`HARD FAIL: System failure detected during app launch. ${error.message}`);
        }
    }

    /**
     * STEP 2 — SYSTEM STABILITY CHECK
     * Validates socket connection, and absence of loading/network activity.
     */
    static async validateSystemStable(): Promise<void> {
        // Enforce socket connection constraint
        const socketLocator = LocatorRegistry.get('system_socket_connected');
        const socketConnected = await $(socketLocator);
        
        try {
            await socketConnected.waitForExist({
                timeout: StateEngine.TIMEOUT_NETWORK_SYNC,
                timeoutMsg: 'SessionManager: system_socket_connected hook not found or socket failed to connect.'
            });
        } catch (error: any) {
            throw new Error(`HARD FAIL: System socket failed to stabilize. ${error.message}`);
        }

        // Reuse StateEngine's system stability logic for loading and network states
        try {
            await StateEngine.waitForSystemStable();
        } catch (error: any) {
            throw new Error(`HARD FAIL: System failed to reach stable state. ${error.message}`);
        }
    }

    /**
     * Resets the application session state.
     * Enforces automatic recovery to root screen on failure (Section 14).
     */
    static async resetSession(): Promise<void> {
        // Appium specific: Restarts the underlying application session entirely
        await driver.reloadSession();
        
        // Re-validate everything from scratch after a hard reset
        await this.initialize();
    }
}
