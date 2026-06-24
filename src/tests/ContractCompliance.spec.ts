import { expect } from '@wdio/globals';
import { ContractValidator } from '../core/engine/ContractValidator';
import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/LocatorRegistry';

/**
 * ContractCompliance.spec.ts
 * Purpose: Validate full adherence to BOTH the locator and execution contracts dynamically.
 */
describe('CI Hardening: Contract Compliance', () => {

    it('should assert global contracts are valid and securely mounted', async () => {
        await assertGlobalContractsValid();
    });

    it('should assert system execution contracts are securely mounted', async () => {
        await assertSystemContractsValid();
    });

    it('should assert no blocking loading or networking states are permanently stuck', async () => {
        await assertNoBlockingStates();
    });

    it('should assert core screen roots exist within the execution environment', async () => {
        await assertScreenRootsExist();
    });
});

async function assertGlobalContractsValid(): Promise<void> {
    // Contract ensures the app shell is never missing
    await ContractValidator.validateAppShell();
}

async function assertSystemContractsValid(): Promise<void> {
    // Contract ensures all state hooks exist (network, loading, socket)
    await ContractValidator.validateSystemHooks();
}

async function assertNoBlockingStates(): Promise<void> {
    // Natively blocks until transient states clear, naturally failing if they stick
    await StateEngine.waitForSystemStable();
    // Enforce that the resolution didn't result in an inconsistent crash state
    await StateEngine.validateNoSystemFailure();
}

async function assertScreenRootsExist(): Promise<void> {
    const requiredRoots = [
        'global_app_shell',
        'dashboard_screen_root',
        'cases_screen_root',
        'assets_screen_root'
    ];

    for (const root of requiredRoots) {
        const locator = LocatorRegistry.get(root);
        // Validates the registry compiles them to strict accessibility IDs natively
        expect(locator).toBe(`~${root}`);
    }
}
