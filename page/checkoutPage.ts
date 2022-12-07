import { Page } from "playwright";
import BasePage from "./baseSaucePage";

export default class CheckoutPage extends BasePage {

    readonly titleClass = ".title";
    readonly quantityClass = ".cart_quantity_label";
    readonly descriptionClass = ".cart_desc_label";
    readonly itemClass = ".cart_item";
    readonly footerClass = ".cart_footer";
    readonly continueButtonId = "#continue-shopping";
    readonly checkoutButtonId = "#checkout";
    readonly itemPriceClass = ".inventory_item_price";
    readonly onesieRemoveId = "#remove-sauce-labs-onesie";

    readonly firstNameId = "#first-name";
    readonly lastNameId = "#last-name";
    readonly postalCodeId = "#postal-code";
    readonly continueCheckoutButtonId = "#continue";

    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await super.navigate(this.cartPage);
    }

    // get methods
    public get titleCheckout() {
        return this.page.locator(this.titleClass);
    }

    public get cartQuantity() {
        return this.page.locator(this.quantityClass);
    }

    public get cartDescription() {
        return this.page.locator(this.descriptionClass);
    }

    public get cartItemList() {
        return this.page.$$(this.itemClass);
    }

    public get footerSection() {
        return this.page.locator(this.footerClass);
    }

    public get continueShopping() {
        return this.page.locator(this.continueButtonId);
    }

    public get checkout() {
        return this.page.locator(this.checkoutButtonId);
    }

    public get itemPriceList() {
        return this.page.$$(this.itemPriceClass);
    }

    public get firstName() {
        return this.page.locator(this.firstNameId);
    }

    public get lastName() {
        return this.page.locator(this.lastNameId);
    }

    public get postalCode() {
        return this.page.locator(this.postalCodeId);
    }

    public get continue() {
        return this.page.locator(this.continueCheckoutButtonId);
    }

    // async methods
    public async clickContinueShopping() {
        await this.continueShopping.click();
    }

    public async removeProduct(productId: string) {
        let productToARemove =  this.page.locator(productId);
        await productToARemove.click();
    }

    public async clickCheckout() {
        await this.checkout.click();
    }

    public async enterFirstName(name: string) {
        await this.firstName?.fill(name);
    }

    public async enterLastName(name: string) {
        await this.lastName?.fill(name);
    }

    public async enterPostalCode(code: string) {
        await this.postalCode?.fill(code);
    }

    public async submitCheckoutInfo(first: string, last: string, code: string) {
        await this.enterFirstName(first);
        await this.enterLastName(last);
        await this.enterPostalCode(code);
    }

    public async clickContinue() {
        await this.continue.click()
    }
}