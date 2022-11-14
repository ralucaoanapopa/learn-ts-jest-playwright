import { Browser, BrowserContext, chromium, Page } from "playwright";
import LoginPage from "../../page/loginPage";
import BooksPage from "../../page/booksPage";
import * as data from '../../data/variables.json';
import * as dotenv from 'dotenv'
dotenv.config()

const baseURL = 'https://demoqa.com/';
const loginURL = baseURL + 'login';
const profileURL = baseURL + 'profile';

// get credentials set as env variables
const username: string = (process.env.USERNAME_TS as string);
const password: string = (process.env.PASSWORD_TS as string);

describe('Test login form', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    let login: LoginPage;
    let books: BooksPage;

    beforeAll( async () => {
        browser = await chromium.launch({ headless: false, slowMo: 400 });
        context = await browser.newContext();
        page = await context.newPage();

        await page.goto(loginURL);
        login = new LoginPage(page);
        books = new BooksPage(page);
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });

    test("Login with valid credentials", async () => {
        expect(page.url()).toBe(loginURL);
        await login.login_form(username, password);

        await page.waitForURL(profileURL);
        expect(page.url()).toBe(profileURL);

        const name_returned = books.elementUserNameTxt;

        if(name_returned){
            expect(await name_returned.innerText()).toBe(username);
        } else {
                throw new Error("No username value is returned!");
            }

        expect(await name_returned?.textContent()).toBe(username);

        await page.click("text=Log out");
        expect(page.url()).toBe(loginURL);

    });

    test('Login with invalid password', async () => {
        expect(page.url()).toBe(loginURL);
        await login.login_form(username, data.invalidData);

        expect(await login.errorLoginMsg.innerText()).toBe(data.errorMsgLogin);
    });

    test('Login with invalid username', async () => {
        expect(page.url()).toBe(loginURL);
        await login.login_form(data.invalidData, password);

        expect(await login.errorLoginMsg.innerText()).toBe(data.errorMsgLogin);
    });
});