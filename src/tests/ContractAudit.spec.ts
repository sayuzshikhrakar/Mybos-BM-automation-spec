import { expect } from '@wdio/globals';
import { Bootstrap } from '../core/engine/Bootstrap';
import { SessionManager } from '../core/engine/SessionManager';
import { ContractValidator } from '../core/engine/ContractValidator';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';

/**
 * ContractAudit.spec.ts
 * Purpose: Validate framework and application contract compliance BEFORE any business tests execute.
 * Adheres strictly to flutter_locator_contract.md and automation_execution_contract.md.
 */
describe('System Contract Audit', () => {

    // Bootstrap execution gate
    before(async () => {
        console.info('[AUDIT] Bootstrapping Execution Framework for Audit...');
        // Note: Bootstrap inherently checks app launch validity and readiness states.
        await Bootstrap.initializeFramework();
    });

    // Enforcement: Hard Fail & Screenshot on violation
    afterEach(async function () {
        if (this.currentTest?.state === 'failed') {
            const safeTestName = this.currentTest.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            console.error(`[AUDIT] HARD FAIL: Contract Violation detected in: ${this.currentTest.title}`);

            await SessionManager.captureScreenshot(`audit_failure_${safeTestName}`);

            // Re-throw to explicitly enforce the HARD FAIL requirement across the runner
            throw new Error(`HARD FAIL: Critical contract violation in ${this.currentTest.title}`);
        }
    });

    it('should validate the presence of the global_app_shell', async () => {
        // Enforces that the root semantics shell is actively attached to the view hierarchy
        await ContractValidator.validateAppShell();
    });

    it('should validate the correct locator registry existence of P0 global components', () => {
        // Validates the locator identifiers exist and are strictly valid under the contract's prefix rules.
        // We do not wait for them to be visible because an error or toast should NOT be visible by default.
        const p0Locators = [
            'global_loading_spinner',
            'global_error_banner',
            'global_toast_message'
        ];

        for (const identifier of p0Locators) {
            const locator = LocatorRegistry.get(identifier);
            // Must purely be an accessibility id selector under the contract
            expect(locator).toBe(`~${identifier}`);
        }
    });

    it('should validate the active presence of mandatory system hooks', async () => {
        // Validates:
        // - system_network_state_active
        // - system_loading_state_active
        // - system_socket_connected
        // - system_socket_disconnected
        // These hooks MUST exist invisibly in the DOM at all times.
        await ContractValidator.validateSystemHooks();
    });

    it('should validate the absence of fatal system failure states', async () => {
        // Validates:
        // - no system_render_failure_detected
        // - no system_ui_inconsistent_state
        await ContractValidator.validateNoSystemFailure();
    });

});
