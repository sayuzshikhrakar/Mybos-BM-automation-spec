import * as fs from 'fs';
import * as path from 'path';

interface QuarantineRecord {
    testId: string;
    testTitle: string;
    failureCount: number;
    successSinceQuarantine: number;
    quarantined: boolean;
    quarantinedAt: string | null;
    quarantineReason: string | null;
    releasedAt: string | null;
}

const QUARANTINE_STORE_PATH = path.resolve(process.cwd(), '.quarantine-store.json');
const FAILURE_THRESHOLD = 3;
const RELEASE_SUCCESS_THRESHOLD = 5;

/**
 * FlakyTestQuarantineEngine.ts
 * Automatically isolates tests that demonstrate unstable execution patterns.
 */
export class FlakyTestQuarantineEngine {
    private static store: Map<string, QuarantineRecord> = new Map();

    private static load(): void {
        if (fs.existsSync(QUARANTINE_STORE_PATH)) {
            const raw = JSON.parse(fs.readFileSync(QUARANTINE_STORE_PATH, 'utf-8')) as Record<string, QuarantineRecord>;
            this.store = new Map(Object.entries(raw));
        }
    }

    private static persist(): void {
        const obj = Object.fromEntries(this.store.entries());
        fs.writeFileSync(QUARANTINE_STORE_PATH, JSON.stringify(obj, null, 2), 'utf-8');
    }

    /**
     * Evaluates whether a test is stable or trending toward quarantine.
     */
    static async evaluateTestStability(testId: string, testTitle: string, passed: boolean): Promise<void> {
        this.load();
        const existing = this.store.get(testId) ?? {
            testId,
            testTitle,
            failureCount: 0,
            successSinceQuarantine: 0,
            quarantined: false,
            quarantinedAt: null,
            quarantineReason: null,
            releasedAt: null
        };

        if (passed) {
            if (existing.quarantined) {
                existing.successSinceQuarantine += 1;
                console.info(`[QUARANTINE] ${testId} passed. Success streak: ${existing.successSinceQuarantine}/${RELEASE_SUCCESS_THRESHOLD}`);
                if (existing.successSinceQuarantine >= RELEASE_SUCCESS_THRESHOLD) {
                    await this.releaseTestFromQuarantine(testId);
                    return;
                }
            } else {
                existing.failureCount = Math.max(0, existing.failureCount - 1);
            }
        } else {
            existing.failureCount += 1;
            existing.successSinceQuarantine = 0;
            console.warn(`[QUARANTINE] ${testId} failure count: ${existing.failureCount}/${FAILURE_THRESHOLD}`);
            if (!existing.quarantined && existing.failureCount >= FAILURE_THRESHOLD) {
                await this.quarantineTest(testId, `Exceeded failure threshold of ${FAILURE_THRESHOLD}`);
                return;
            }
        }

        this.store.set(testId, existing);
        this.persist();
    }

    /**
     * Moves a test into quarantine, excluding it from regression suites.
     */
    static async quarantineTest(testId: string, reason: string): Promise<void> {
        this.load();
        const existing = this.store.get(testId);

        if (!existing) {
            console.warn(`[QUARANTINE] Cannot quarantine unknown testId: ${testId}`);
            return;
        }

        existing.quarantined = true;
        existing.quarantinedAt = new Date().toISOString();
        existing.quarantineReason = reason;
        existing.successSinceQuarantine = 0;

        this.store.set(testId, existing);
        this.persist();
        console.error(`[QUARANTINE] Test QUARANTINED: ${testId} | Reason: ${reason}`);
    }

    /**
     * Releases a test from quarantine once stability is demonstrated.
     */
    static async releaseTestFromQuarantine(testId: string): Promise<void> {
        this.load();
        const existing = this.store.get(testId);

        if (!existing || !existing.quarantined) {
            return;
        }

        existing.quarantined = false;
        existing.releasedAt = new Date().toISOString();
        existing.failureCount = 0;
        existing.successSinceQuarantine = 0;

        this.store.set(testId, existing);
        this.persist();
        console.info(`[QUARANTINE] Test RELEASED from quarantine: ${testId}`);
    }

    /**
     * Returns a full snapshot of the current quarantine state.
     */
    static getQuarantineReport(): QuarantineRecord[] {
        this.load();
        return Array.from(this.store.values());
    }

    /**
     * Returns whether a given test is currently quarantined.
     */
    static isQuarantined(testId: string): boolean {
        this.load();
        return this.store.get(testId)?.quarantined ?? false;
    }
}
