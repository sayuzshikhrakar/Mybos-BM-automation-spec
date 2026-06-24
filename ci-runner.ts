#!/usr/bin/env ts-node

import * as path from 'path';
import * as fs from 'fs';
import { execSync, ExecSyncOptions } from 'child_process';
import { FlakyTestQuarantineEngine } from './src/platform/FlakyTestQuarantineEngine';
import { ExecutionTelemetryReporter } from './src/platform/ExecutionTelemetryReporter';

// ============================================================
// CLI ARGUMENT PARSING
// ============================================================
const args = process.argv.slice(2);
const flags: Record<string, string> = {};

for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
        const key = args[i].slice(2);
        flags[key] = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : 'true';
    }
}

const suite = flags['suite'] as 'smoke' | 'regression' | 'contract' | undefined;
const shard = flags['shard'];
const generateQuarantineReport = flags['generate-quarantine-report'] === 'true';

// ============================================================
// ENVIRONMENT INJECTION
// ============================================================
const RETRY_LIMIT = parseInt(process.env.RETRY_LIMIT ?? '2', 10);
const PARALLEL_INSTANCES = parseInt(process.env.PARALLEL_INSTANCES ?? '1', 10);
const ENABLE_QUARANTINE = process.env.ENABLE_QUARANTINE !== 'false';
const ENABLE_TELEMETRY = process.env.ENABLE_TELEMETRY !== 'false';

console.info('============================================================');
console.info(`CI RUNNER — Enterprise Test Execution Platform`);
console.info(`Suite:              ${suite ?? 'N/A'}`);
console.info(`Shard:              ${shard ?? 'none'}`);
console.info(`Retry Limit:        ${RETRY_LIMIT}`);
console.info(`Parallel Instances: ${PARALLEL_INSTANCES}`);
console.info(`Quarantine Active:  ${ENABLE_QUARANTINE}`);
console.info(`Telemetry Active:   ${ENABLE_TELEMETRY}`);
console.info('============================================================\n');

// ============================================================
// QUARANTINE REPORT GENERATION MODE
// ============================================================
if (generateQuarantineReport) {
    generateAndExportQuarantineReport();
    process.exit(0);
}

// ============================================================
// SUITE EXECUTION
// ============================================================
if (!suite) {
    console.error('[CI RUNNER] ERROR: --suite argument is required (smoke | regression | contract)');
    process.exit(1);
}

const WDIO_CONFIG_MAP: Record<string, string> = {
    smoke: 'wdio.smoke.conf.ts',
    regression: 'wdio.regression.conf.ts',
    contract: 'wdio.contract.conf.ts'
};

const configFile = WDIO_CONFIG_MAP[suite];
if (!configFile) {
    console.error(`[CI RUNNER] ERROR: Unknown suite "${suite}"`);
    process.exit(1);
}

const configPath = path.resolve(process.cwd(), configFile);
if (!fs.existsSync(configPath)) {
    // Fall back to the single base config with a suite flag
    console.warn(`[CI RUNNER] WARN: ${configFile} not found. Falling back to wdio.conf.ts with --suite flag.`);
}

const execOptions: ExecSyncOptions = {
    stdio: 'inherit',
    env: {
        ...process.env,
        RETRY_LIMIT: String(RETRY_LIMIT),
        PARALLEL_INSTANCES: String(PARALLEL_INSTANCES),
        ENABLE_QUARANTINE: String(ENABLE_QUARANTINE),
        ENABLE_TELEMETRY: String(ENABLE_TELEMETRY),
        WDIO_SUITE: suite,
        WDIO_SHARD: shard ?? '1'
    }
};

let exitCode = 0;

try {
    const wdioCmd = fs.existsSync(configPath)
        ? `npx wdio run ${configPath}`
        : `npx wdio run wdio.conf.ts --suite ${suite}`;

    console.info(`[CI RUNNER] Executing: ${wdioCmd}`);
    execSync(wdioCmd, execOptions);
    console.info(`\n[CI RUNNER] ✅ Suite "${suite}" completed successfully.`);
} catch (err: any) {
    console.error(`\n[CI RUNNER] ❌ Suite "${suite}" FAILED.`);
    exitCode = err.status ?? 1;
} finally {
    if (ENABLE_TELEMETRY) {
        ExecutionTelemetryReporter.finalizeSuiteReport();
    }
}

process.exit(exitCode);

// ============================================================
// QUARANTINE REPORT HELPER
// ============================================================
function generateAndExportQuarantineReport(): void {
    console.info('[CI RUNNER] Generating quarantine report...');

    const records = FlakyTestQuarantineEngine.getQuarantineReport();
    
    const report = records.map(r => ({
        testName: r.testTitle,
        failureCount: r.failureCount,
        lastFailureReason: r.quarantineReason ?? null,
        stabilityScore: r.quarantined
            ? 0
            : Math.max(0, 1 - r.failureCount / 10),
        status: r.quarantined
            ? 'quarantined'
            : (r.releasedAt ? 'released' : 'active')
    }));

    const reportsDir = path.resolve(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    const outputPath = path.join(reportsDir, 'quarantine-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf-8');

    const quarantinedCount = report.filter(r => r.status === 'quarantined').length;
    console.info(`[CI RUNNER] Quarantine report written: ${outputPath}`);
    console.info(`[CI RUNNER] Quarantined tests: ${quarantinedCount} / ${report.length}`);
}
