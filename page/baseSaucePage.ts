import { Page } from "playwright";
import * as data from '../data/saucedemo.json';

export default class BasePage {
    public page: Page;
    readonly baseURL = data.baseURL;
    readonly inventoryPage = 'inventory.html';
    readonly cartPage = 'cart.html';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string) {
        await this.page.goto(`${this.baseURL}${path}`);
    }

    public get inventoryURL() {
        return this.baseURL + this.inventoryPage;
    }

    public get cartURL() {
        return this.baseURL + this.cartPage;
    }
}