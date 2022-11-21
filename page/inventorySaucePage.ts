import { Page } from "playwright";
import BasePage from "./baseSaucePage";


export default class InventoryPage extends BasePage {

    readonly burgerMenuId = "button[id='react-burger-menu-btn']";
    readonly logoutId = "#logout_sidebar_link";
    readonly inventoryListClass = ".inventory_list";
    readonly selectSortClass = ".product_sort_container";
    readonly shoppingCartClass = ".shopping_cart_link";

    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await super.navigate(this.inventoryPage);
    }

    public get burgerMenu() {
        if(this.page.locator(this.burgerMenuId))
            return this.page.locator(this.burgerMenuId);
        else throw new Error("Burger Menu button is not found");
    }

    public async clickBurgerMenu() {
        await this.burgerMenu.click();
    }

    public get logoutLink() {
        return this.page.locator(this.logoutId);
    }

    public async clickLogoutLink() {
        await this.logoutLink.click();
    }

    public async logoutUser() {
        expect(await this.burgerMenu.isVisible()).toBe(true);
        await this.clickBurgerMenu();
        await this.clickLogoutLink();
    }

    public get productsList() {
        return this.page.locator(this.inventoryListClass);
    }

    public get selectSortFilter() {
        return this.page.locator(this.selectSortClass);
    }

    public get shoppingCart() {
        return this.page.locator(this.shoppingCartClass);
    }
}