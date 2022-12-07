import { Browser, BrowserContext, chromium, Page } from 'playwright';
import LoginPage from '../../page/loginSaucePage';
import InventoryPage from '../../page/inventorySaucePage';
import * as data from '../../data/saucedemo.json';
import * as dotenv from 'dotenv'
dotenv.config()

// get credentials set as env variables
const username: string = (process.env.USER_SAUCE as string);
const password: string = (process.env.PASSWORD_SAUCE as string);

describe('Test checkout flow', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    let login: LoginPage;
    let inventory: InventoryPage;

    beforeAll( async () => {
        browser = await chromium.launch({ headless: false, slowMo: 400 });
        context = await browser.newContext();
        page = await context.newPage();

        login = new LoginPage(page);
        inventory = new InventoryPage(page);
        await login.navigate();

        await login.loginForm(username, password);
        expect(page.url()).toBe(login.inventoryURL);
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });

    test("Should be able to add products to shopping cart", async () => {
        await inventory.addProductToShoppingCart(inventory.onesieId);
        await inventory.buttonRemoveProduct(inventory.onesieRemoveId);
        expect(await inventory.shoppingCartBadge.innerText()).toBe("1");

        await inventory.addProductToShoppingCart(inventory.boltTshirtId);
        await inventory.buttonRemoveProduct(inventory.boltTshirtRemoveId);
        expect(await inventory.shoppingCartBadge.innerText()).toBe("2");

        await inventory.addProductToShoppingCart(inventory.backpackId);
        await inventory.buttonRemoveProduct(inventory.backpackRemoveId);
        expect(await inventory.shoppingCartBadge.innerText()).toBe("3");

    });

    test("Should be able to see shopping cart content", async () => {
        await inventory.clickShoppingCart();
    });

});