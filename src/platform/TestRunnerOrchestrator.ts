import { Bootstrap } from '../core/engine/Bootstrap';
import { ContractValidator } from '../core/engine/ContractValidator';
import { StateEngine } from '../core/StateEngine';
import { ExecutionContextManager } from './ExecutionContextManager';
import { ExecutionTelemetryReporter } from './ExecutionTelemetryReporter';

export type SuiteType = 'smoke' | 'regression' | 'contract' | 'parallel';

/**
 * TestRunnerOrchestrator.ts
 * Central execution brain for all test runs. Enforces contract gates and
 * system readiness before any suite is allowed to proceed.
 */
export class TestRunnerOrchestrator {

    /**
     * Master entry point for orchestrated suite execution.
     */
    static async runSuite(suiteType: SuiteType): Promise<void> {
        await this.enforcePreRunGates();

        switch (suiteType) {
            case 'smoke':
                return this.runSmoke();
            case 'regression':
                return this.runRegression();
            case 'contract':
                return this.runContractValidation();
            case 'parallel':
                return this.runParallelExecution();
            default:
                throw new Error(`[ORCHESTRATOR] Unknown suite type: ${suiteType}`);
        }
    }

    /**
     * Pre-run system gate: Refuses to proceed if the application is unstable.
     */
    private static async enforcePreRunGates(): Promise<void> {
        console.info('[ORCHESTRATOR] Executing pre-run contract validation gate...');
        
        await Bootstrap.initializeFramework();
        await ContractValidator.validateAppShell();
        await ContractValidator.validateSystemHooks();
        await ContractValidator.validateReadyState();
        await StateEngine.validateNoSystemFailure();

        ExecutionContextManager.resetContext();
        console.info('[ORCHESTRATOR] System gates passed. Execution authorized.');
    }

    /**
     * Executes the minimal CI smoke suite.
     */
    static async runSmoke(): Promise<void> {
        console.info('[ORCHESTRATOR] Initiating SMOKE suite...');
        ExecutionContextManager.updateContext({ activeModule: 'smoke' });
        // WDIO runner is natively invoked via CLI with --suite smoke
        // This method is the programmatic coordination hook
        ExecutionTelemetryReporter.logSuiteStart('smoke');
    }

    /**
     * Executes the full regression suite.
     */
    static async runRegression(): Promise<void> {
        console.info('[ORCHESTRATOR] Initiating REGRESSION suite...');
        ExecutionContextManager.updateContext({ activeModule: 'regression' });
        ExecutionTelemetryReporter.logSuiteStart('regression');
    }

    /**
     * Executes contract validation suite exclusively.
     */
    static async runContractValidation(): Promise<void> {
        console.info('[ORCHESTRATOR] Initiating CONTRACT VALIDATION suite...');
        ExecutionContextManager.updateContext({ activeModule: 'contract' });
        ExecutionTelemetryReporter.logSuiteStart('contract');

        // Enforce contract layer specifically
        await ContractValidator.validateAppShell();
        await ContractValidator.validateSystemHooks();
        await ContractValidator.validateNoSystemFailure();
    }

    /**
     * Triggers parallel device execution via WDIO multi-remote.
     */
    static async runParallelExecution(): Promise<void> {
        console.info('[ORCHESTRATOR] Initiating PARALLEL suite on multi-device pool...');
        ExecutionContextManager.updateContext({ activeModule: 'parallel' });
        ExecutionTelemetryReporter.logSuiteStart('parallel');
    }
}
