import { Page } from "playwright";
import BasePage from "./baseSaucePage";


export default class InventoryPage extends BasePage {

    readonly burgerMenuId = "button[id='react-burger-menu-btn']";
    readonly logoutId = "#logout_sidebar_link";
    readonly inventoryListClass = ".inventory_list";
    readonly selectSortClass = ".product_sort_container";
    readonly shoppingCartClass = ".shopping_cart_link";
    readonly optionZAXpath = "xpath=//option[@value='za']";
    readonly itemLabelsClass = ".inventory_item_label";
    readonly itemNamesClass = '.inventory_item_name';
    readonly activeFilterClass = ".active_option";

    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await super.navigate(this.inventoryPage);
    }

    // get methods
    public get burgerMenu() {
        if(this.page.locator(this.burgerMenuId))
            return this.page.locator(this.burgerMenuId);
        else throw new Error("Burger Menu button is not found");
    }

    public get logoutLink() {
        return this.page.locator(this.logoutId);
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

    public get optionZA() {
        return this.page.locator(this.optionZAXpath);
    }

    public get itemLabelsList() {
        return this.page.$$(this.itemLabelsClass);
    }
    public get itemNamesList() {
        return this.page.$$(this.itemNamesClass);
    }

    public get activeFilterOption() {
        return this.page.locator(this.activeFilterClass);
    }

    // async methods
    public async clickBurgerMenu() {
        await this.burgerMenu.click();
    }

    public async clickLogoutLink() {
        await this.logoutLink.click();
    }

    public async logoutUser() {
        expect(await this.burgerMenu.isVisible()).toBe(true);
        await this.clickBurgerMenu();
        await this.clickLogoutLink();
    }

    public async clickFilterNameDesc() {
        expect(await this.optionZA.isHidden()).toBe(true);
        await this.selectSortFilter.selectOption({ value: 'za'});
    }

    public async clickFilterPriceDesc() {
        await this.selectSortFilter.selectOption({ value: 'hilo'});
    }

    public async clickFilterNameAsc() {
        await this.selectSortFilter.selectOption({ value: 'az'});
    }

    public async clickFilterPriceAsc() {
        await this.selectSortFilter.selectOption({ value: 'lohi'});
    }
}