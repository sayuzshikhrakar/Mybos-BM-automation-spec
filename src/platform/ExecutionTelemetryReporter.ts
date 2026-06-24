import * as fs from 'fs';
import * as path from 'path';
import { ExecutionContextManager, FailureClassification } from './ExecutionContextManager';

export interface TelemetryRecord {
    testId: string;
    testTitle: string;
    suite: string;
    status: 'PASSED' | 'FAILED' | 'QUARANTINED' | 'SKIPPED';
    durationMs: number;
    failureReason: string | null;
    failureClassification: FailureClassification | null;
    retryCount: number;
    flakinessScore: number;
    systemStabilitySnapshot: string;
    screenshotPath: string | null;
    timestamp: string;
}

const TELEMETRY_OUTPUT_DIR = path.resolve(process.cwd(), 'reports');

/**
 * ExecutionTelemetryReporter.ts
 * Observability layer capturing runtime metrics for CI integration and trend analysis.
 */
export class ExecutionTelemetryReporter {
    private static records: TelemetryRecord[] = [];
    private static suiteStartTime: number = Date.now();

    /**
     * Signals the start of a named suite.
     */
    static logSuiteStart(suiteName: string): void {
        this.suiteStartTime = Date.now();
        console.info(`\n[TELEMETRY] ▶ Suite started: ${suiteName} @ ${new Date().toISOString()}`);
    }

    /**
     * Records a test result and computes derived metrics.
     */
    static recordTestResult(params: {
        testId: string;
        testTitle: string;
        suite: string;
        status: TelemetryRecord['status'];
        durationMs: number;
        error?: Error;
        screenshotPath?: string;
    }): void {
        const ctx = ExecutionContextManager.getContext();

        const flakinessScore = Math.min(1, ctx.retryCount / 3);

        const record: TelemetryRecord = {
            testId: params.testId,
            testTitle: params.testTitle,
            suite: params.suite,
            status: params.status,
            durationMs: params.durationMs,
            failureReason: params.error?.message ?? null,
            failureClassification: params.error
                ? ExecutionContextManager.classifyFailureFromError(params.error)
                : null,
            retryCount: ctx.retryCount,
            flakinessScore,
            systemStabilitySnapshot: ctx.systemStabilitySnapshot,
            screenshotPath: params.screenshotPath ?? null,
            timestamp: new Date().toISOString()
        };

        this.records.push(record);
        this.printRecord(record);
    }

    /**
     * Prints a formatted record to the CI console output.
     */
    private static printRecord(record: TelemetryRecord): void {
        const icon = record.status === 'PASSED' ? '✅' : record.status === 'FAILED' ? '❌' : '⚠️';
        console.info(`[TELEMETRY] ${icon} [${record.status}] ${record.testTitle} | ${record.durationMs}ms | Retries: ${record.retryCount} | Flakiness: ${(record.flakinessScore * 100).toFixed(0)}%`);
        if (record.failureReason) {
            console.error(`           └─ Failure: ${record.failureReason}`);
        }
    }

    /**
     * Exports all accumulated telemetry records to a JSON file for CI artifact upload.
     */
    static exportJSON(): void {
        if (!fs.existsSync(TELEMETRY_OUTPUT_DIR)) {
            fs.mkdirSync(TELEMETRY_OUTPUT_DIR, { recursive: true });
        }
        
        const totalDuration = Date.now() - this.suiteStartTime;
        const passed = this.records.filter(r => r.status === 'PASSED').length;
        const failed = this.records.filter(r => r.status === 'FAILED').length;

        const payload = {
            generatedAt: new Date().toISOString(),
            totalDurationMs: totalDuration,
            summary: { total: this.records.length, passed, failed },
            records: this.records
        };

        const outputPath = path.join(TELEMETRY_OUTPUT_DIR, `telemetry-${Date.now()}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
        console.info(`\n[TELEMETRY] Report exported to: ${outputPath}`);
    }

    /**
     * Prints the full suite summary to stdout and exports JSON.
     */
    static finalizeSuiteReport(): void {
        const passed = this.records.filter(r => r.status === 'PASSED').length;
        const failed = this.records.filter(r => r.status === 'FAILED').length;
        const totalDuration = Date.now() - this.suiteStartTime;

        console.info('\n[TELEMETRY] ============== SUITE SUMMARY ==============');
        console.info(`[TELEMETRY] Total:    ${this.records.length}`);
        console.info(`[TELEMETRY] Passed:   ${passed}`);
        console.info(`[TELEMETRY] Failed:   ${failed}`);
        console.info(`[TELEMETRY] Duration: ${(totalDuration / 1000).toFixed(2)}s`);
        console.info('[TELEMETRY] ==========================================\n');

        this.exportJSON();
    }
}
