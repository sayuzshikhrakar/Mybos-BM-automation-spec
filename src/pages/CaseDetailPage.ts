import { BasePage } from './BasePage';

export class CaseDetailPage extends BasePage {
    constructor() {
        super('cases_detail_screen_root');
    }

    get header()  { return 'cases_detail_header'; }
    get content() { return 'cases_detail_content'; }
    get backBtn() { return 'cases_detail_back_btn'; }

    override async verifyScreen(): Promise<void> {
        await super.verifyScreen();
        await this.expectVisible(this.header);
        await this.expectVisible(this.content);
    }

    async verifyCaseDetailLoaded(): Promise<void> {
        await this.waitForScreenReady();
    }

    async verifyContentVisible(): Promise<void> {
        await this.expectVisible(this.content);
    }

    async goBack(): Promise<void> {
        await this.tap(this.backBtn);
    }
}

export default new CaseDetailPage();
