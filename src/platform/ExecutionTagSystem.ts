export type ExecutionTag =
    | '@smoke'
    | '@regression'
    | '@contract'
    | '@navigation'
    | '@critical';

export interface TaggedTest {
    testId: string;
    testTitle: string;
    tags: ExecutionTag[];
}

// Internal registry of all tagged tests
const tagRegistry: Map<string, TaggedTest> = new Map();

/**
 * ExecutionTagSystem.ts
 * Enables test grouping and CI-level filtering by execution tag.
 */
export class ExecutionTagSystem {

    /**
     * Assigns one or more tags to a test ID.
     */
    static assignTags(testId: string, testTitle: string, tags: ExecutionTag[]): void {
        const existing = tagRegistry.get(testId);
        if (existing) {
            const merged = Array.from(new Set([...existing.tags, ...tags])) as ExecutionTag[];
            tagRegistry.set(testId, { testId, testTitle, tags: merged });
        } else {
            tagRegistry.set(testId, { testId, testTitle, tags });
        }
    }

    /**
     * Returns all tests that match the given tags.
     * Performs an OR match — tests with ANY of the requested tags are included.
     */
    static filterTestsByTag(...requestedTags: ExecutionTag[]): TaggedTest[] {
        const results: TaggedTest[] = [];
        
        for (const test of tagRegistry.values()) {
            const hasTag = requestedTags.some(tag => test.tags.includes(tag));
            if (hasTag) {
                results.push(test);
            }
        }
        
        return results;
    }

    /**
     * Returns all registered tests without filtering.
     */
    static getAllTests(): TaggedTest[] {
        return Array.from(tagRegistry.values());
    }

    /**
     * Validates that all critical tests have been properly tagged.
     */
    static validateTagCoverage(): void {
        const criticalTests = this.filterTestsByTag('@critical');
        const smokeTests = this.filterTestsByTag('@smoke');

        if (criticalTests.length === 0) {
            throw new Error('[TAG SYSTEM] VALIDATION FAILED: No tests tagged as @critical. At least one is required.');
        }
        if (smokeTests.length === 0) {
            throw new Error('[TAG SYSTEM] VALIDATION FAILED: No tests tagged as @smoke. Smoke suite cannot be empty.');
        }

        console.info(`[TAG SYSTEM] Tag coverage valid. Critical: ${criticalTests.length}, Smoke: ${smokeTests.length}`);
    }

    /**
     * Prints a human-readable tag coverage summary to stdout.
     */
    static printTagSummary(): void {
        const tags: ExecutionTag[] = ['@smoke', '@regression', '@contract', '@navigation', '@critical'];
        console.info('\n[TAG SYSTEM] === Tag Coverage Summary ===');
        for (const tag of tags) {
            const count = this.filterTestsByTag(tag).length;
            console.info(`  ${tag.padEnd(14)} : ${count} test(s)`);
        }
        console.info('=========================================\n');
    }
}
