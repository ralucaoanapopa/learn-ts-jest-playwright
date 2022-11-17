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

    public get book_header() {
        return this.page.locator("xpath=//div[@class='main-header']");
    }

    public get table_head() {
        return this.page.locator(".rt-thead.-header");
    }

    public get table_header_columns() {
        return this.page.$$(".rt-resizable-header-content");
    }

    public get table_body() {
        return this.page.locator(".rt-tbody");
    }

    public get table_body_rows() {
        return this.page.$$(".rt-tr-group");
    }

    public get all_book_titles() {
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