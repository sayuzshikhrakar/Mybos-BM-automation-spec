import { expect } from '@wdio/globals';

/**
 * DuplicateIdentifierScanner.ts
 * Purpose: Runtime semantic duplication detection engine utilizing DOM XML trees.
 */
export class DuplicateIdentifierScanner {

    /**
     * Extracts the raw UI XML hierarchy directly from the native Appium execution context.
     */
    static async scanAccessibilityTree(): Promise<string> {
        // Appium's native approach to dumping the structural hierarchy without XPath execution
        return await driver.getPageSource();
    }

    /**
     * Natively parses the accessibility tree detecting any semantic identifiers
     * matching the framework contract.
     */
    static async detectDuplicateSemanticsIdentifiers(): Promise<Map<string, number>> {
        const source = await this.scanAccessibilityTree();
        
        // Matches standard Flutter semantic attachments on both OS targets
        const identifierRegex = /(?:content-desc|name|label)="([^"]+)"/g;
        let match;
        const occurrences = new Map<string, number>();

        while ((match = identifierRegex.exec(source)) !== null) {
            const id = match[1];
            
            // Only track explicit contract semantics
            if (
                id.startsWith('global_') || 
                id.startsWith('system_') || 
                id.startsWith('module_') || 
                id.startsWith('dashboard_') || 
                id.startsWith('cases_') || 
                id.startsWith('assets_') || 
                id.startsWith('navigation_')
            ) {
                occurrences.set(id, (occurrences.get(id) || 0) + 1);
            }
        }
        
        return occurrences;
    }

    /**
     * Consolidates duplicate detections into actionable audit traces.
     */
    static async reportViolations(): Promise<string[]> {
        const occurrences = await this.detectDuplicateSemanticsIdentifiers();
        const violations: string[] = [];

        for (const [id, count] of occurrences.entries()) {
            if (count > 1) {
                violations.push(`Duplicate Identifier Violation: ${id} mapped ${count} times on the active screen.`);
            }
        }
        
        return violations;
    }

    /**
     * Critical execution gate: Aborts CI execution instantly upon semantic duplication.
     */
    static async failCIOnDuplicates(): Promise<void> {
        const violations = await this.reportViolations();
        
        if (violations.length > 0) {
            console.error('\n[HARD CI FAIL] Semantic Identifier Duplication Detected:');
            violations.forEach(v => console.error(v));
            
            // Native hard-crash enforcement
            throw new Error(`HARD CI FAIL: ${violations.length} duplicate identifiers explicitly violate the UI contract.`);
        }
    }
}
