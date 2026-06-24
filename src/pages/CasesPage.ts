import { BasePage } from './BasePage';

export class CasesPage extends BasePage {
    constructor() {
        super('cases_screen_root');
    }

    get listContainer()  { return 'cases_list_container'; }
    get firstItem()      { return 'cases_list_item_first'; }
    get lastItem()       { return 'cases_list_item_last'; }
    get loadingState()   { return 'cases_state_loading'; }
    get emptyState()     { return 'cases_state_empty'; }
    get errorState()     { return 'cases_state_error'; }
    get refreshBtn()     { return 'cases_refresh_btn'; }

    override async verifyScreen(): Promise<void> {
        await super.verifyScreen();
    }

    async waitForCasesLoaded(): Promise<void> {
        await this.waitForScreenReady();
    }

    async verifyCasesReady(): Promise<void> {
        await this.waitForCasesLoaded();
        await this.verifyScreen();
    }

    async verifyListLoaded(): Promise<void> {
        await this.expectVisible(this.listContainer);
        await this.expectVisible(this.firstItem);
    }

    async verifyEmptyState(): Promise<void> {
        await this.expectVisible(this.emptyState);
    }

    async verifyErrorState(): Promise<void> {
        await this.expectVisible(this.errorState);
    }

    async openFirstCase(): Promise<void> {
        await this.tap(this.firstItem);
    }

    async openCaseById(caseId: string): Promise<void> {
        await this.tap(`cases_list_item_${caseId}`);
    }

    async scrollToLastCase(): Promise<void> {
        await this.scrollUntilVisible(this.lastItem);
    }

    async refreshCases(): Promise<void> {
        await this.tap(this.refreshBtn);
    }
}

export default new CasesPage();
