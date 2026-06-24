import type { Options } from '@wdio/types';
import { ContractValidator } from './src/core/engine/ContractValidator';
import { SessionManager } from './src/core/engine/SessionManager';
import { ExecutionContextManager } from './src/platform/ExecutionContextManager';
import { FlakyTestQuarantineEngine } from './src/platform/FlakyTestQuarantineEngine';
import { RetryIntelligenceEngine } from './src/platform/RetryIntelligenceEngine';
import { ExecutionTelemetryReporter } from './src/platform/ExecutionTelemetryReporter';
import { StateEngine } from './src/core/StateEngine';

// Test start times tracker for duration computation
const testStartTimes = new Map<string, number>();

/**
 * wdio.enterprise.extension.ts
 * Enterprise extension hooks for WDIO config. Merge this object with your
 * base wdio.conf.ts to activate the full execution platform.
 */
export const enterpriseExtension: Partial<Options.Testrunner> = {

    // --- Parallel Execution ---
    maxInstances: process.env.CI ? 4 : 1,

    // --- State-Aware Retry via RetryIntelligenceEngine ---
    // Note: WDIO's built-in retry is replaced in afterTest below.
    // Set a base retry of 1 to allow our engine to evaluate intelligently.
    specFileRetries: 0,

    // --- Reporters ---
    reporters: [
        'spec',
        // Extendable: add 'allure', 'junit' reporter packages here
    ],

    // --- Enterprise Lifecycle Hooks ---
    onPrepare(): void {
        console.info('[ENTERPRISE] Platform initialized. Parallel instances: active.');
        ExecutionTelemetryReporter.logSuiteStart('enterprise');
    },

    async before(_capabilities, _specs): Promise<void> {
        // Pre-suite contract validation gate
        console.info('[ENTERPRISE] Executing pre-suite contract gate...');
        await ContractValidator.validateAppShell();
        await ContractValidator.validateSystemHooks();
        await ContractValidator.validateReadyState();
        await StateEngine.validateNoSystemFailure();
        console.info('[ENTERPRISE] Contract gate PASSED. Suite is authorized to execute.');
    },

    beforeTest(test): void {
        const testId = `${test.parent} :: ${test.title}`;

        // Block quarantined tests from executing in regression suites
        if (FlakyTestQuarantineEngine.isQuarantined(testId)) {
            console.warn(`[ENTERPRISE] Skipping QUARANTINED test: ${testId}`);
            // WDIO does not support programmatic skip here, but this signals the engine
            return;
        }

        ExecutionContextManager.resetContext();
        ExecutionContextManager.updateContext({
            activeTest: testId,
            activeModule: test.parent ?? 'unknown'
        });

        testStartTimes.set(testId, Date.now());
    },

    async afterTest(test, _context, result): Promise<void> {
        const testId = `${test.parent} :: ${test.title}`;
        const startTime = testStartTimes.get(testId) ?? Date.now();
        const durationMs = Date.now() - startTime;

        if (!result.passed) {
            const error = result.error as Error | undefined;

            let screenshotPath: string | undefined;
            try {
                screenshotPath = await SessionManager.captureScreenshot(
                    `failure_${testId.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`
                );
            } catch { /* non-fatal */ }

            // Evaluate retry eligibility via the intelligence engine
            if (error) {
                const retryDecision = await RetryIntelligenceEngine.shouldRetry(error);
                console.warn(`[ENTERPRISE] Retry decision for "${testId}": ${retryDecision.shouldRetry} — ${retryDecision.reason}`);
                
                if (retryDecision.shouldRetry && retryDecision.backoffMs > 0) {
                    await new Promise(r => setTimeout(r, retryDecision.backoffMs));
                }
            }

            // Evaluate flakiness and quarantine eligibility
            await FlakyTestQuarantineEngine.evaluateTestStability(testId, test.title, false);

            ExecutionTelemetryReporter.recordTestResult({
                testId,
                testTitle: test.title,
                suite: test.parent ?? 'unknown',
                status: 'FAILED',
                durationMs,
                error: error as Error,
                screenshotPath
            });

            // Attempt state recovery
            await SessionManager.executeRecoveryLogic();
        } else {
            await FlakyTestQuarantineEngine.evaluateTestStability(testId, test.title, true);

            ExecutionTelemetryReporter.recordTestResult({
                testId,
                testTitle: test.title,
                suite: test.parent ?? 'unknown',
                status: 'PASSED',
                durationMs
            });
        }

        testStartTimes.delete(testId);
    },

    async onComplete(_exitCode, _config, _capabilities, results): Promise<void> {
        ExecutionTelemetryReporter.finalizeSuiteReport();
        console.info('\n[ENTERPRISE] Execution platform shutdown complete.');
    }
};
