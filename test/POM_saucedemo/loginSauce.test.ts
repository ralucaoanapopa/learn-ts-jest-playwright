import { Browser, BrowserContext, chromium, Page } from 'playwright';
import LoginPage from '../../page/loginSaucePage';
import InventoryPage from '../../page/inventorySaucePage';
import * as data from '../../data/saucedemo.json';
import * as dotenv from 'dotenv'
dotenv.config()

// get credentials set as env variables
const username: string = (process.env.USER_SAUCE as string);
const password: string = (process.env.PASSWORD_SAUCE as string);

describe('Test login form from Sauce demo', () => {

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
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });

    test("Login with valid credentials", async () => {
        expect(page).not.toBeNull();
        expect(await page.title()).toBe(data.siteTitle);
        await login.loginForm(username, password);

        expect(page.url()).toBe(login.inventoryURL);

        await inventory.logoutUser();

        expect(page.url()).toBe(login.baseURL);

    });

    test("Login with invalid credentials", async () => {
        await login.loginForm(data.invalidData, data.invalidData);

        expect(await login.errorMsgLogin.innerText()).toBe(data.errorMsgInvalidCredentials);
    });

});