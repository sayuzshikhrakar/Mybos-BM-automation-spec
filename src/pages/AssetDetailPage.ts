import { BasePage } from './BasePage';

export class AssetDetailPage extends BasePage {
    constructor() {
        super('assets_detail_screen_root');
    }

    get header()  { return 'assets_detail_header'; }
    get content() { return 'assets_detail_content'; }
    get backBtn() { return 'assets_detail_back_btn'; }

    override async verifyScreen(): Promise<void> {
        await super.verifyScreen();
        await this.expectVisible(this.header);
        await this.expectVisible(this.content);
    }

    async verifyAssetDetailLoaded(): Promise<void> {
        await this.waitForScreenReady();
    }

    async verifyContentVisible(): Promise<void> {
        await this.expectVisible(this.content);
    }

    async goBack(): Promise<void> {
        await this.tap(this.backBtn);
    }
}

export default new AssetDetailPage();
