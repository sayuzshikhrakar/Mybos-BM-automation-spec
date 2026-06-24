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
    get casesTab()      { return 'dashboard_nav_cases'; }
    get assetsTab()     { return 'dashboard_nav_assets'; }
    get residentsTab()  { return 'dashboard_nav_residents'; }
    get menuIcon()      { return 'dashboard_nav_menu'; }

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
        await this.expectVisible(this.casesTab);
        await this.expectVisible(this.assetsTab);
        await this.expectVisible(this.residentsTab);
        await this.expectVisible(this.menuIcon);
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
