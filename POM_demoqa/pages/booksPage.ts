import { Page } from "playwright";
import BasePage from "./basePage";

export default class BooksPage extends BasePage {

    readonly loginBtn = "button[id='login']";
    readonly logoutBtn = "button[id='submit']";
    readonly usernameValueId = "#userName-value";
    readonly bookHeaderXpath = "xpath=//div[@class='main-header']";
    readonly tableHeadClass = ".rt-thead.-header";
    readonly tableHeaderClass = ".rt-resizable-header-content";
    readonly tableBodyClass = ".rt-tbody";
    readonly tableBodyRowsClass = ".rt-tr-group";
    readonly bookTitlesXpath = "xpath=//span[@class='mr-2']";
    readonly searchInputId = "#searchBox";
    readonly noRowsClass = ".rt-noData";
    
    constructor(page: Page) {
        super(page);
    }

    async navigate(){
        await super.navigate(this.booksPage);
    }

    public get elementLoginBtn() {
        return this.page.locator(this.loginBtn);
    }

    public get elementLogoutBtn() {
        return this.page.locator(this.logoutBtn);
    }

    public get elementUserNameTxt() {
        return this.page.locator(this.usernameValueId);
    }

    public get bookHeader() {
        return this.page.locator(this.bookHeaderXpath);
    }

    public get tableHead() {
        return this.page.locator(this.tableHeadClass);
    }

    public get tableHeaderColumns() {
        return this.page.$$(this.tableHeaderClass);
    }

    public get tableBody() {
        return this.page.locator(this.tableBodyClass);
    }

    public get tableBodyRows() {
        return this.page.$$(this.tableBodyRowsClass);
    }

    public get allBookTitles() {
        return this.page.$$(this.bookTitlesXpath);
    }

    public get searchInputField() {
        return this.page.locator(this.searchInputId);
    }

    public get noRowsTxt() {
        return this.page.locator(this.noRowsClass);
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