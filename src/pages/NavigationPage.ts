import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
    constructor() {
        super('global_app_shell');
    }

    get appShell()   { return 'global_app_shell'; }
    get bottomNav()  { return 'global_bottom_nav'; }
    get drawer()     { return 'global_drawer'; }

    get tabDashboard() { return 'navigation_tab_dashboard'; }
    get tabCases()     { return 'navigation_tab_cases'; }
    get tabAssets()    { return 'navigation_tab_assets'; }
    get tabResidents() { return 'navigation_tab_residents'; }

    override async verifyScreen(): Promise<void> {
        await super.verifyScreen();
        await this.verifyAppShell();
        await this.verifyBottomNavigation();
    }

    async verifyAppShell(): Promise<void> {
        await this.expectVisible(this.appShell);
    }

    async verifyBottomNavigation(): Promise<void> {
        await this.expectVisible(this.bottomNav);
    }

    async openDashboard(): Promise<void> {
        await this.tap(this.tabDashboard);
    }

    async openCases(): Promise<void> {
        await this.tap(this.tabCases);
    }

    async openAssets(): Promise<void> {
        await this.tap(this.tabAssets);
    }

    async openResidents(): Promise<void> {
        await this.tap(this.tabResidents);
    }

    async assertTabActive(tabId: string): Promise<void> {
        await this.expectVisible(`${tabId}_active`);
    }

    async verifyNavigationStable(): Promise<void> {
        await this.waitForScreenReady();
        await this.verifyBottomNavigation();
    }
}

export default new NavigationPage();
