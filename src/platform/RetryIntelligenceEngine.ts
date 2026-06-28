import { StateEngine } from '../core/StateEngine';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';
import { ExecutionContextManager, FailureClassification } from './ExecutionContextManager';

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1500;

export interface RetryDecision {
    shouldRetry: boolean;
    reason: string;
    backoffMs: number;
}

/**
 * RetryIntelligenceEngine.ts
 * State-aware retry logic. Prevents retrying into unstable or irrecoverable states.
 * Replaces naive retry loops entirely.
 */
export class RetryIntelligenceEngine {

    /**
     * Primary decision gate. Evaluates whether a retry is safe and permissible.
     */
    static async shouldRetry(error: Error): Promise<RetryDecision> {
        const ctx = ExecutionContextManager.getContext();
        const classification = this.classifyFailure(error);

        ExecutionContextManager.updateContext({ failureClassification: classification });

        // HARD BLOCK: Never retry on fatal system failure states
        const isSystemFail = await this.detectFatalSystemState();
        if (isSystemFail) {
            return {
                shouldRetry: false,
                reason: 'HARD BLOCK: Fatal system state detected. Retry would cause cascading failures.',
                backoffMs: 0
            };
        }

        // HARD BLOCK: Never retry contract violations — they are deterministic failures
        if (classification === 'SYSTEM_FAILURE' || classification === 'CONTRACT_VIOLATION') {
            return {
                shouldRetry: false,
                reason: `HARD BLOCK: Classification [${classification}] is non-retryable by policy.`,
                backoffMs: 0
            };
        }

        // RETRY CAP: Do not exceed the maximum retry ceiling
        if (ctx.retryCount >= MAX_RETRIES) {
            return {
                shouldRetry: false,
                reason: `Retry limit of ${MAX_RETRIES} exhausted.`,
                backoffMs: 0
            };
        }

        // STABILITY CHECK: Only retry if the system is currently stable
        try {
            await StateEngine.waitForSystemStable();
        } catch {
            return {
                shouldRetry: false,
                reason: 'System is not stable. Retry suppressed to prevent cascading flakiness.',
                backoffMs: 0
            };
        }

        const newRetryCount = ExecutionContextManager.incrementRetry();
        const backoffMs = this.calculateBackoff(newRetryCount);

        return {
            shouldRetry: true,
            reason: `Classification [${classification}] is retry-eligible. Attempt ${newRetryCount}/${MAX_RETRIES}.`,
            backoffMs
        };
    }

    /**
     * Detects the presence of fatal system states that block all retries.
     */
    private static async detectFatalSystemState(): Promise<boolean> {
        try {
            const renderFailLocator = LocatorRegistry.get('system_render_failure_detected');
            const uiInconsistentLocator = LocatorRegistry.get('system_ui_inconsistent_state');

            const renderFail = await $(renderFailLocator);
            const uiInconsistent = await $(uiInconsistentLocator);

            return (await renderFail.isExisting()) || (await uiInconsistent.isExisting());
        } catch {
            return false;
        }
    }

    /**
     * Exponential backoff strategy capped at 10 seconds.
     */
    static calculateBackoff(attemptNumber: number): number {
        const backoff = BASE_BACKOFF_MS * Math.pow(2, attemptNumber - 1);
        return Math.min(backoff, 10000);
    }

    /**
     * Classifies a thrown error for routing and policy decisions.
     */
    static classifyFailure(error: Error): FailureClassification {
        return ExecutionContextManager.classifyFailureFromError(error);
    }
}
