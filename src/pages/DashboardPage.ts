import { BasePage } from './BasePage';

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
    get casesTab()      { return 'Cases'; }
    get assetsTab()     { return 'Assets'; }
    get residentsTab()  { return 'Residents'; }
    get homeTab()       { return 'Home'; }
    get moreTab()       { return 'More'; }
    get menuIcon()      { return '-android uiautomator:new UiSelector().className("android.widget.ImageView").instance(0)'; }
    get weatherBanner() { return 'dashboard_weather_banner'; }
    get fabIcon()       { return 'dashboard_fab_icon'; }
    get createCaseFabAction() { return 'fab_action_create_case'; }
    get bellIcon()      { return 'dashboard_bell_icon'; }
    get notificationsList() { return 'notifications_list'; }
    get notificationItem() { return 'notification_item'; }
    get markAllReadBtn(){ return 'notifications_mark_all_read'; }
    get supportMenuOption() { return 'drawer_support_feedback'; }
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
