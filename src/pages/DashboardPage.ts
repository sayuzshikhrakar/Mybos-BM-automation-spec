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

    // All locators are now centralized in LocatorRegistry.ts

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
        await this.expectVisible(LocatorRegistry.DashboardPage.homeTab);
    }

    /**
     * Navigates to the Cases module utilizing the StateEngine execution wrapper.
     */
    async tapCasesModule(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.casesTab);
    }

    /**
     * Navigates to the Assets module utilizing the StateEngine execution wrapper.
     */
    async tapAssetsModule(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.assetsTab);
    }

    /**
     * Navigates to the Residents module utilizing the StateEngine execution wrapper.
     */
    async tapResidentsModule(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.residentsTab);
    }

    /**
     * Navigates to or opens the global Menu utilizing the StateEngine execution wrapper.
     */
    async tapMenu(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.menuIcon);
    }

    async waitForWeatherBanner(): Promise<void> {
        await this.expectVisible(LocatorRegistry.DashboardPage.weatherBanner);
    }

    async tapFab(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.fabIcon);
    }

    async tapCreateCaseFromFab(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.createCaseFabAction);
    }

    // the locator is not accessible
    async openNotifications(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.bellIcon);
    }

    async verifyNotificationsListOpen(): Promise<void> {
        await this.expectVisible(LocatorRegistry.DashboardPage.notificationsList);
    }

    async markSingleNotificationRead(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.notificationItem);
    }

    async markAllNotificationsRead(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.markAllReadBtn);
    }

    async tapSupportFeedback(): Promise<void> {
        await this.tap(LocatorRegistry.DashboardPage.supportMenuOption);
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
