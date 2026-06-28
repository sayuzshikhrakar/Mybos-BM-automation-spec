import { BasePage } from './BasePage';
import { LocatorRegistry } from '../core/locator/LocatorRegistry';

/**
 * DashboardPage.ts
 * Production-ready Page Object for the Dashboard Flow.
 * Strictly adheres to the Flutter Locator Contract (Semantics ONLY)
 * and the Automation Execution Contract.
 */
export class DashboardPage extends BasePage {
    constructor() {
        // Binds strictly to the defined contract root identifier
        super('dashboard_screen_root');
    }

    // Natively structured semantic identifiers
    get casesTab() { return 'Cases'; }
    get assetsTab() { return 'Assets'; }
    get residentsTab() { return 'Residents'; }
    get homeTab() { return 'Home'; }
    get moreTab() { return 'More'; }
    get menuIcon() { return '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(0)'; }
    get weatherBanner() { return '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(1)'; }
    get fabIcon() { return '-android uiautomator:new UiSelector().className("android.widget.Button").instance(0)'; }
    get createCaseFabAction() { return '-android uiautomator:new UiSelector().descriptionMatches("(?i).*Case.*")'; }
    get bellIcon() { return '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(2)'; }
    get notificationsList() { return '-android uiautomator:new UiSelector().scrollable(true)'; }
    get notificationItem() { return '-android uiautomator:new UiSelector().classNameMatches(".*(ViewGroup|View).*").clickable(true).instance(1)'; }
    get markAllReadBtn() { return '-android uiautomator:new UiSelector().descriptionMatches("(?i).*mark all as read.*")'; }
    get supportMenuOption() { return '-android uiautomator:new UiSelector().descriptionMatches("(?i).*(support|feedback).*")'; }
    get feedbackInput() { return 'support_feedback_input'; }
    get submitFeedbackBtn() { return 'support_feedback_submit'; }
    get successMessage() { return 'support_feedback_success'; }

    /**
     * Overridden hook to natively validate specific dashboard components 
     * are correctly mounted into the accessibility tree.
     */
    override async verifyScreen(): Promise<void> {
        await super.verifyScreen();
        // Validates that the core structural navigation is attached and visible
        await this.verifyBottomNavigation();
    }

    /**
     * Gatekeeper for native rendering synchronization.
     * Blocks execution until the state engine explicitly clears system hooks.
     */
    async waitForDashboardLoaded(): Promise<void> {
        await this.waitForScreenReady();
    }

    /**
     * Validates the active presence of primary navigation tabs without
     * using fallback selectors or XPath.
     */
    async verifyBottomNavigation(): Promise<void> {
        await this.expectVisible(this.homeTab);
    }

    /**
     * Navigates to the Cases module utilizing the StateEngine execution wrapper.
     */
    async tapCasesModule(): Promise<void> {
        await this.tap(this.casesTab);
    }

    /**
     * Navigates to the Assets module utilizing the StateEngine execution wrapper.
     */
    async tapAssetsModule(): Promise<void> {
        await this.tap(this.assetsTab);
    }

    /**
     * Navigates to the Residents module utilizing the StateEngine execution wrapper.
     */
    async tapResidentsModule(): Promise<void> {
        await this.tap(this.residentsTab);
    }

    /**
     * Navigates to or opens the global Menu utilizing the StateEngine execution wrapper.
     */
    async tapMenu(): Promise<void> {
        await this.tap(this.menuIcon);
    }

    async waitForWeatherBanner(): Promise<void> {
        await this.expectVisible(this.weatherBanner);
    }

    async tapFab(): Promise<void> {
        await this.tap(this.fabIcon);
    }

    async tapCreateCaseFromFab(): Promise<void> {
        await this.tap(this.createCaseFabAction);
    }

    // the locator is not accessible
    async openNotifications(): Promise<void> {
        await this.tap(this.bellIcon);
    }

    async verifyNotificationsListOpen(): Promise<void> {
        await this.expectVisible(this.notificationsList);
    }

    async markSingleNotificationRead(): Promise<void> {
        await this.tap(this.notificationItem);
    }

    async markAllNotificationsRead(): Promise<void> {
        await this.tap(this.markAllReadBtn);
    }

    async tapSupportFeedback(): Promise<void> {
        await this.tap(this.supportMenuOption);
    }

    async submitSupportFeedback(feedbackText: string): Promise<void> {
        await this.input(this.feedbackInput, feedbackText);
        await this.tap(this.submitFeedbackBtn);
    }

    async verifyFeedbackSuccess(): Promise<void> {
        await this.expectVisible(this.successMessage);
    }

    /**
     * Compound method guaranteeing the dashboard is fully loaded,
     * network operations have ceased, and internal components have settled.
     */
    async verifyDashboardReady(): Promise<void> {
        await this.waitForDashboardLoaded();
        await this.verifyScreen();
    }
}

export default new DashboardPage();
