import { BasePage } from './BasePage';

export class AssetsPage extends BasePage {
    constructor() {
        super('assets_screen_root');
    }

    get listContainer()  { return 'assets_list_container'; }
    get firstItem()      { return 'assets_list_item_first'; }
    get lastItem()       { return 'assets_list_item_last'; }
    get loadingState()   { return 'assets_state_loading'; }
    get emptyState()     { return 'assets_state_empty'; }
    get errorState()     { return 'assets_state_error'; }
    get refreshBtn()     { return 'assets_refresh_btn'; }
    get filterDropdown() { return 'assets_filter_dropdown_trigger'; }
    get searchInput()    { return 'assets_search_input'; }
    get createBtn()      { return 'assets_create_btn'; }
    get createNameInput() { return 'assets_create_name_input'; }
    get createSubmitBtn() { return 'assets_create_submit_btn'; }
    get successToast()   { return 'global_toast_message'; }

    override async verifyScreen(): Promise<void> {
        await super.verifyScreen();
    }

    async waitForAssetsLoaded(): Promise<void> {
        await this.waitForScreenReady();
    }

    async verifyAssetsReady(): Promise<void> {
        await this.waitForAssetsLoaded();
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

    async searchAssets(text: string): Promise<void> {
        await this.input(this.searchInput, text);
    }

    async openFirstAsset(): Promise<void> {
        await this.tap(this.firstItem);
    }

    async openAssetById(assetId: string): Promise<void> {
        await this.tap(`assets_list_item_${assetId}`);
    }

    async filterAssets(filterId: string): Promise<void> {
        await this.selectFromDropdown(this.filterDropdown, `assets_filter_dropdown_option_${filterId}`);
    }

    async scrollToLastAsset(): Promise<void> {
        await this.scrollUntilVisible(this.lastItem);
    }

    async refreshAssets(): Promise<void> {
        await this.tap(this.refreshBtn);
    }

    async initiateCreation(): Promise<void> {
        await this.tap(this.createBtn);
    }

    async createAsset(name: string): Promise<void> {
        await this.input(this.createNameInput, name);
        await this.tap(this.createSubmitBtn);
    }
}

export default new AssetsPage();
