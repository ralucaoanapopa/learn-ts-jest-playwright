import { Page } from "playwright";

export default class BooksPage {

    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public get elementLoginBtn() {
        return this.page.locator("button[id='login']");
    }

    public get elementLogoutBtn() {
        return this.page.locator("button[id='submit']");
    }

    public get elementUserNameTxt() {
        const usernameValue_id = '#userName-value';
        return this.page.locator(usernameValue_id);
    }

    public async clickLoginBtn() {
        const elem = this.elementLoginBtn;
        await elem?.click();
    }

    public async clickLogoutBtn() {
        const elem = this.elementLogoutBtn;
        await elem?.click();
    }

}