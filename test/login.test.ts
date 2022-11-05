import { Browser, BrowserContext, chromium, Page } from "playwright";
import * as dotenv from 'dotenv'
dotenv.config()

const baseURL = 'https://demoqa.com/';
const loginURL = baseURL+'login';
const profileURL = baseURL+'profile';

const username_id = '#userName';
const passwd_id = '#password';
const loginBtn_id = '#login';

// get credentials set as env variables
const username: string = (process.env.USERNAME_TS as string);
const password: string = (process.env.PASSWORD_TS as string);

describe('As registered user can login on Book Store from demoQA', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    beforeAll( async () => {
        browser = await chromium.launch({headless: false, slowMo: 400});
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });
    
    test('Login with valid credentials', async () => {
        
        await page.goto(loginURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        await page.fill(username_id, username);
        await page.fill(passwd_id, password);
        await page.click(loginBtn_id);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        await page.waitForURL(profileURL);
        expect(page.url()).toBe(profileURL);
        await page.click("text=Log out");

    });

    test('Login generated with codegen', async () => {

        await page.goto(baseURL);

        await page.getByRole('heading', { name: 'Book Store Application' }).click();
        await page.waitForURL('https://demoqa.com/books');

        await page.locator('span:has-text("Login")').click();
        await page.waitForURL(loginURL);

        await page.getByPlaceholder('UserName').click();

        await page.getByPlaceholder('UserName').fill(username);

        await page.getByPlaceholder('UserName').press('Tab');

        await page.getByPlaceholder('Password').fill(password);

        await page.getByRole('button', { name: 'Login' }).click();
        await page.waitForURL(profileURL);

        await page.getByText(username).click();

        await page.getByRole('button', { name: 'Log out' }).click();
        await page.waitForURL(loginURL);
    });
});