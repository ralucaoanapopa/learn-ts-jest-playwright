import { Page } from "playwright";
import * as data from '../data/saucedemo.json';

export default class BasePage {
    public page: Page;
    readonly baseURL = data.baseURL;
    readonly inventoryPage = 'inventory.html';
    readonly cartPage = 'cart.html';
    readonly checkoutOne = 'checkout-step-one.html';
    readonly checkoutTwo = 'checkout-step-two.html';
    readonly checkoutFinal = 'checkout-complete.html';

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

    public get checkoutStepOneURL() {
        return this.baseURL + this.checkoutOne;
    }

    public get checkoutStepTwoURL() {
        return this.baseURL + this.checkoutTwo;
    }

    public get checkoutFinalURL() {
        return this.baseURL + this.checkoutFinal;
    }
}