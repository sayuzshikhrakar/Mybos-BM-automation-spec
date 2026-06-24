import { expect } from '@wdio/globals';
import { LocatorRegistry } from '../core/LocatorRegistry';
import { StateEngine } from '../core/StateEngine';

/**
 * BasePage.ts
 * Enforces rule: "never interact directly with driver without BasePage"
 * Integrates state engine for every interaction.
 */
export class BasePage {
    protected screenRootId: string;

    constructor(screenRootId: string) {
        this.screenRootId = screenRootId;
    }

    protected get modulePrefix(): string {
        return this.screenRootId.replace('_screen_root', '');
    }

    /**
     * Validates that the current screen is ready for interaction.
     */
    async waitForScreenReady(): Promise<void> {
        await StateEngine.waitForScreenReady(this.screenRootId);
    }

    /**
     * An overridable validation hook for explicit screen assertions.
     */
    async verifyScreen(): Promise<void> {
        await this.waitForScreenReady();
    }

    /**
     * Helper to wait for and retrieve an element strictly via the State Engine.
     */
    protected async getElement(identifier: string): Promise<WebdriverIO.Element> {
        return StateEngine.waitForElementReady(identifier);
    }

    /**
     * Taps an element ensuring state readiness.
     */
    async tap(identifier: string): Promise<void> {
        const element = await this.getElement(identifier);
        await element.click();
    }

    /**
     * Inputs text into an element ensuring state readiness.
     */
    async input(identifier: string, value: string): Promise<void> {
        const element = await this.getElement(identifier);
        await element.clearValue();
        await element.setValue(value);
    }

    /**
     * Handles List Execution Rule (Section 9)
     */
    async waitForListContainer(containerId: string, firstItemId: string): Promise<void> {
        await this.getElement(containerId);
        await this.getElement(firstItemId);
    }

    /**
     * Verifies that the list and its first item have loaded using the module prefix.
     */
    async verifyListLoaded(): Promise<void> {
        await this.getElement(`${this.modulePrefix}_list_container`);
        await this.getElement(`${this.modulePrefix}_list_item_first`);
    }

    /**
     * Waits for the module's explicit empty state.
     */
    async waitForEmptyState(): Promise<void> {
        await this.getElement(`${this.modulePrefix}_state_empty`);
    }

    /**
     * Handles Dropdown Execution Rule (Section 10)
     */
    async selectFromDropdown(triggerId: string, optionId: string): Promise<void> {
        // 1. Tap trigger
        await this.tap(triggerId);

        // 2. Wait for expansion via the contract's explicit state hook
        await this.getElement(`${triggerId}_expanded`);
        
        // 3. Select option
        await this.tap(optionId);
    }

    /**
     * Scrolls down using W3C Action APIs until the target element is visible.
     */
    async scrollUntilVisible(identifier: string, maxScrolls: number = 10): Promise<void> {
        const locator = LocatorRegistry.get(identifier);
        
        for (let i = 0; i < maxScrolls; i++) {
            const el = await $(locator);
            if (await el.isDisplayed()) {
                return;
            }

            // Perform W3C swipe up (scrolls screen down)
            const { width, height } = await driver.getWindowRect();
            const startX = width / 2;
            const startY = height * 0.8;
            const endY = height * 0.2;

            await driver.performActions([{
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: startX, y: startY },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 100 },
                    { type: 'pointerMove', duration: 500, x: startX, y: endY },
                    { type: 'pointerUp', button: 0 }
                ]
            }]);
            
            // Release action before next scroll
            await driver.releaseActions();
            await driver.pause(500); // brief pause to let UI settle after scroll
        }
        
        throw new Error(`scrollUntilVisible: Element ${identifier} not found after ${maxScrolls} scrolls.`);
    }

    /**
     * Asserts that an element is visible on the screen.
     */
    async expectVisible(identifier: string): Promise<void> {
        const el = await this.getElement(identifier);
        await expect(el).toBeDisplayed();
    }

    /**
     * Asserts that an element is NOT visible on the screen.
     */
    async expectNotVisible(identifier: string): Promise<void> {
        const locator = LocatorRegistry.get(identifier);
        const el = await $(locator);
        await expect(el).not.toBeDisplayed();
    }
}
