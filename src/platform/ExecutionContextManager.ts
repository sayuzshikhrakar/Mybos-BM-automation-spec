export type FailureClassification =
    | 'SYSTEM_FAILURE'
    | 'CONTRACT_VIOLATION'
    | 'ELEMENT_NOT_FOUND'
    | 'TIMEOUT'
    | 'ASSERTION_ERROR'
    | 'UNKNOWN';

export interface ExecutionContext {
    activeTest: string;
    activeModule: string;
    deviceSessionId: string;
    retryCount: number;
    failureClassification: FailureClassification | null;
    systemStabilitySnapshot: 'STABLE' | 'UNSTABLE' | 'UNKNOWN';
    suiteStartTime: number;
    lastUpdateTime: number;
}

const DEFAULT_CONTEXT: ExecutionContext = {
    activeTest: '',
    activeModule: '',
    deviceSessionId: '',
    retryCount: 0,
    failureClassification: null,
    systemStabilitySnapshot: 'UNKNOWN',
    suiteStartTime: Date.now(),
    lastUpdateTime: Date.now()
};

/**
 * ExecutionContextManager.ts
 * Maintains the runtime state of a single test execution.
 * Acts as the shared memory bus between all platform modules.
 */
export class ExecutionContextManager {
    private static context: ExecutionContext = { ...DEFAULT_CONTEXT };

    /**
     * Resets the runtime context to initial defaults before each test.
     */
    static resetContext(): void {
        this.context = {
            ...DEFAULT_CONTEXT,
            suiteStartTime: Date.now(),
            lastUpdateTime: Date.now()
        };
    }

    /**
     * Merges a partial update into the existing execution context.
     */
    static updateContext(patch: Partial<ExecutionContext>): void {
        this.context = {
            ...this.context,
            ...patch,
            lastUpdateTime: Date.now()
        };
    }

    /**
     * Returns a frozen read-only snapshot of the current execution context.
     */
    static getContext(): Readonly<ExecutionContext> {
        return Object.freeze({ ...this.context });
    }

    /**
     * Increments the retry counter and returns the new value.
     */
    static incrementRetry(): number {
        this.context.retryCount += 1;
        this.context.lastUpdateTime = Date.now();
        return this.context.retryCount;
    }

    /**
     * Classifies the current failure based on the thrown error message.
     */
    static classifyFailureFromError(error: Error): FailureClassification {
        const msg = error.message.toLowerCase();

        if (msg.includes('hard fail') || msg.includes('system_render_failure') || msg.includes('system_ui_inconsistent')) {
            return 'SYSTEM_FAILURE';
        }
        if (msg.includes('contract violation')) {
            return 'CONTRACT_VIOLATION';
        }
        if (msg.includes('not existing') || msg.includes('not found') || msg.includes('not displayed')) {
            return 'ELEMENT_NOT_FOUND';
        }
        if (msg.includes('timeout') || msg.includes('timed out')) {
            return 'TIMEOUT';
        }
        if (msg.includes('expect') || msg.includes('assertion')) {
            return 'ASSERTION_ERROR';
        }
        return 'UNKNOWN';
    }
}
