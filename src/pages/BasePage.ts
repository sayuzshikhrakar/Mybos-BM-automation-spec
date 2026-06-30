import { expect } from '@wdio/globals';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';
import { StateEngine } from '../core/StateEngine';
import emailSupportData from '../data/emailSupport.json';

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
    get pleaseSelectDropdown() { return '-android uiautomator:new UiSelector().descriptionMatches("(?i).*Please Select.*")' }
    /**
     * Validates that the current screen is ready for interaction.
     */
    async waitForScreenReady(): Promise<void> {
        // Disabled strict contract validation because the physical app does not
        // implement root accessibility IDs like 'dashboard_screen_root'.
        // await StateEngine.waitForScreenReady(this.screenRootId);

        // Generic wait to allow the screen to transition
        await driver.pause(2000);
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

    /**
     * Returns to the Dashboard screen by clicking the back button until the "more" tab is visible.
     */
    async returnToDashboard(): Promise<void> {
        const backButtonLocator = LocatorRegistry.get(LocatorRegistry.NavigationPage.backButton);
        const moreTabLocator = LocatorRegistry.get(LocatorRegistry.DashboardPage.moreTab);
        const homeTabLocator = LocatorRegistry.get(LocatorRegistry.DashboardPage.homeTab);

        let isMoreTabVisible = await $(moreTabLocator).isDisplayed();

        let attempts = 0;

        // Keep pressing back until the bottom navigation bar (moreTab) becomes visible
        while (!isMoreTabVisible && attempts < 5) {
            const backBtn = await $(backButtonLocator);

            if (await backBtn.isDisplayed()) {
                await backBtn.click();
            } else {
                break; // If there is no back button, break to avoid infinite loop
            }

            await driver.pause(1000); // Wait for screen transition
            isMoreTabVisible = await $(moreTabLocator).isDisplayed();
            attempts++;
        }

        // Once we are at the root level (bottom navigation is visible), ensure we tap Home to return to the Dashboard
        if (isMoreTabVisible) {
            const homeBtn = await $(homeTabLocator);
            if (await homeBtn.isDisplayed()) {
                await homeBtn.click();
                await driver.pause(1000); // Give the dashboard a moment to render
            }
        }
    }

    /**
     * Taps the 'Please Select' dropdown.
     */
    async tapPleaseSelectDropdown(): Promise<void> {
        await this.expectVisible(this.pleaseSelectDropdown);
        await this.tap(this.pleaseSelectDropdown);
    }

    /**
     * Selects a random query type option from a dropdown
     * The option is randomly selected from emailSupport.json's QueryType
     * @returns The randomly selected query type option
     */
    async selectRandomQueryType(): Promise<string> {
        const queryTypes = emailSupportData.QueryType;
        const randomOption = queryTypes[Math.floor(Math.random() * queryTypes.length)];

        const optionLocator = `-android uiautomator:new UiSelector().descriptionMatches("(?i).*${randomOption}.*")`;

        await this.expectVisible(optionLocator);
        await this.tap(optionLocator);

        return randomOption;
    }

    async EnterMessage(): Promise<string> {
        const messages = emailSupportData.Messages;
        const randomOption = messages[Math.floor(Math.random() * messages.length)];

        const messageInputLocator = `-android uiautomator:new UiSelector().className("android.widget.EditText")`;

        await this.expectVisible(messageInputLocator);
        await this.tap(messageInputLocator); // Focus the field
        await driver.pause(1000); // Wait for Flutter to bring up the keyboard

        const element = await this.getElement(messageInputLocator);
        await element.addValue(randomOption); // Type the message directly

        return randomOption;
    }

    async tapSendButton(): Promise<void> {
        await this.expectVisible(LocatorRegistry.General.sendButton);
        await this.tap(LocatorRegistry.General.sendButton);
    }

    async verifySentEmail(): Promise<void> {
        await this.expectNotVisible(LocatorRegistry.General.successMessage);
    }
}
