import { Page } from "playwright";
import BasePage from "./basePage";

export default class BooksPage extends BasePage {
    public loginPage = 'login';
    public booksPage = 'books';
    
    constructor(page: Page) {
        super(page);
    }

    async navigate(){
        await super.navigate(this.booksPage);
    }

    public get loginURL() {
        return BooksPage.baseURL + this.loginPage;
    }

    public get booksURL() {
        return BooksPage.baseURL + this.booksPage;
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

    public get bookHeader() {
        return this.page.locator("xpath=//div[@class='main-header']");
    }

    public get tableHead() {
        return this.page.locator(".rt-thead.-header");
    }

    public get tableHeaderColumns() {
        return this.page.$$(".rt-resizable-header-content");
    }

    public get tableBody() {
        return this.page.locator(".rt-tbody");
    }

    public get tableBodyRows() {
        return this.page.$$(".rt-tr-group");
    }

    public get allBookTitles() {
        return this.page.$$("xpath=//span[@class='mr-2']");
    }

    public get searchInputField() {
        return this.page.locator("#searchBox");
    }

    public get noRowsTxt() {
        return this.page.locator(".rt-noData");
    }

    public async clickLoginBtn() {
        const elem = this.elementLoginBtn;
        await elem?.click();
    }

    public async clickLogoutBtn() {
        const elem = this.elementLogoutBtn;
        await elem?.click();
    }

    public async fillKeywordSearch(keyword: string) {
        await this.searchInputField.fill(keyword);
    }

}