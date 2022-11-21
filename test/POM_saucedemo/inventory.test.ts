import { Browser, BrowserContext, chromium, Page } from 'playwright';
import LoginPage from '../../page/loginSaucePage';
import InventoryPage from '../../page/inventorySaucePage';
import * as data from '../../data/saucedemo.json';
import * as dotenv from 'dotenv'
dotenv.config()

// get credentials set as env variables
const username: string = (process.env.USER_SAUCE as string);
const password: string = (process.env.PASSWORD_SAUCE as string);

describe('Test inventory page', () => {

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

    test("Shopping cart, products list and filter dropdown are displayed", async () => {
        expect(await inventory.shoppingCart.isVisible()).toBe(true);
        expect(await inventory.productsList.isVisible()).toBe(true);
        expect(await inventory.selectSortFilter.isVisible()).toBe(true);

        expect((await inventory.itemLabelsList).length).toBe(6);

        expect(await inventory.activeFilterOption.innerText()).toBe(data.filterNameAsc);
        let allProductNames = await inventory.itemNamesList;
        expect(await allProductNames[0].innerText()).toBe(data.productBackpack);

    });

    test("Should be able to filter products by Name (Z -> A)", async () => {
        expect(await inventory.activeFilterOption.innerText()).toBe(data.filterNameAsc);
        
        await inventory.clickFilterNameDesc();
        expect(await inventory.activeFilterOption.innerText()).toBe(data.filterNameDesc);
        let allProductNames = await inventory.itemNamesList;
        expect(await allProductNames[0].innerText()).toBe(data.productAllThings);

    });

    test("Should be able to filter products by Price (High to Low)", async () => {
        
        await inventory.clickFilterPriceDesc();
        expect(await inventory.activeFilterOption.innerText()).toBe(data.filterPriceDesc);
        let allProductNames = await inventory.itemNamesList;
        expect(await allProductNames[0].innerText()).toBe(data.productJacket);

    });

    test("Should be able to filter products by by Name (A -> Z)", async () => {
        
        await inventory.clickFilterNameAsc();
        expect(await inventory.activeFilterOption.innerText()).toBe(data.filterNameAsc);
        let allProductNames = await inventory.itemNamesList;
        expect(await allProductNames[0].innerText()).toBe(data.productBackpack);

    });

    test("Should be able to filter products by Price (Low to High)", async () => {
        
        await inventory.clickFilterPriceAsc();
        expect(await inventory.activeFilterOption.innerText()).toBe(data.filterPriceAsc);
        let allProductNames = await inventory.itemNamesList;
        expect(await allProductNames[0].innerText()).toBe(data.productOnesie);

    });

});