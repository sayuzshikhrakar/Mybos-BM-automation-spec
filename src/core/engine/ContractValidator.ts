import { LocatorRegistry } from '../LocatorRegistry';
import { StateEngine } from '../StateEngine';

/**
 * ContractValidator.ts
 * Enforces strict compliance with flutter_locator_contract.md 
 * and automation_execution_contract.md.
 */
export class ContractValidator {
    /**
     * Validates that the global app shell is present.
     */
    static async validateAppShell(): Promise<void> {
        const locator = LocatorRegistry.get('global_app_shell');
        const element = await $(locator);
        const exists = await element.isExisting();
        if (!exists) {
            throw new Error(`HARD FAIL: Contract Violation. Mandatory P0 identifier missing: global_app_shell`);
        }
    }

    /**
     * Validates the existence of mandatory system hooks.
     */
    static async validateSystemHooks(): Promise<void> {
        const hooks = [
            'system_network_state_active',
            'system_loading_state_active',
            'system_socket_connected',
            'system_socket_disconnected'
        ];

        for (const identifier of hooks) {
            const locator = LocatorRegistry.get(identifier);
            const element = await $(locator);
            
            if (!(await element.isExisting())) {
                throw new Error(`HARD FAIL: Contract Violation. Mandatory system hook missing: ${identifier}`);
            }
        }
    }

    /**
     * Validates that the application is currently in a ready state
     * (not loading, not syncing network).
     */
    static async validateReadyState(): Promise<void> {
        await StateEngine.waitForSystemStable();
        
        const spinner = await $(LocatorRegistry.get('global_loading_spinner'));
        if (await spinner.isExisting()) {
            throw new Error('HARD FAIL: Contract Violation. global_loading_spinner is still active.');
        }
    }

    /**
     * Validates that a specific screen root exists and is visible.
     */
    static async validateScreenRoot(screenRootId: string): Promise<void> {
        const locator = LocatorRegistry.get(screenRootId);
        const element = await $(locator);
        
        await element.waitForDisplayed({
            timeout: StateEngine.TIMEOUT_SCREEN_LOAD,
            timeoutMsg: `HARD FAIL: Contract Violation. Screen root ${screenRootId} not visible.`
        });
    }

    /**
     * Validates the absence of fatal system failure states.
     */
    static async validateNoSystemFailure(): Promise<void> {
        await StateEngine.validateNoSystemFailure();
    }
}
