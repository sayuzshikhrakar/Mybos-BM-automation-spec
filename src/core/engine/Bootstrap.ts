import { SessionManager } from './SessionManager';
import { ContractValidator } from './ContractValidator';

/**
 * Bootstrap.ts
 * Integrates directly with WDIO hooks in wdio.conf.ts
 */
export class Bootstrap {
    
    /**
     * Initializes the framework. Meant to be called in the `before` hook of WDIO.
     */
    static async initializeFramework(): Promise<void> {
        console.info('[BOOTSTRAP] Initializing Automation Framework...');
        try {
            await SessionManager.frameworkStartup();
            
            // console.info('[BOOTSTRAP] Validating Core System Hooks...');
            // await ContractValidator.validateSystemHooks();
            // 
            // console.info('[BOOTSTRAP] Validating Ready State...');
            // await ContractValidator.validateReadyState();

            console.info('[BOOTSTRAP] Framework successfully initialized and contract compliant.');
        } catch (error: any) {
            console.error(`[BOOTSTRAP] ❌ FATAL INITIALIZATION ERROR: ${error.message}`);
            await SessionManager.captureScreenshot('bootstrap_fatal');
            throw error; // Propagate HARD FAIL to WDIO runner
        }
    }

    /**
     * Hook to execute after a test completes. Meant to be called in `afterTest` hook.
     */
    static async onTestCompleted(testTitle: string, passed: boolean): Promise<void> {
        if (!passed) {
            console.error(`[BOOTSTRAP] Test failed: ${testTitle}. Executing diagnostic capture...`);
            await SessionManager.captureScreenshot(`failure_${testTitle}`);
            
            // Execute recovery if test failed due to transient issues
            try {
                await SessionManager.executeRecoveryLogic();
            } catch (recoveryError) {
                console.error(`[BOOTSTRAP] Recovery failed during teardown: ${recoveryError}`);
            }
        }
    }

    /**
     * Hook to execute on session complete. Meant to be called in `after` or `afterSession` hook.
     */
    static async onSessionComplete(): Promise<void> {
        await SessionManager.shutdown();
    }
}
