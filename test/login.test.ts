import { chromium } from "playwright";
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
    jest.setTimeout(30000);
    
    test('Login with valid credentials', async () => {
        const browser = await chromium.launch({headless: false, slowMo: 400});
        const context = await browser.newContext();
        const page = await context.newPage();

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
        expect(page.url()).toBe(profileURL);

        await browser.close();
    });
});