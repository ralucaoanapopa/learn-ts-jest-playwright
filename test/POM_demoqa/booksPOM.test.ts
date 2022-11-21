import { Browser, BrowserContext, chromium, Page } from "playwright";
import LoginPage from "../../page/loginPage";
import BooksPage from "../../page/booksPage";
import * as data from '../../data/variables.json';
import * as dotenv from 'dotenv'
dotenv.config()

// get credentials set as env variables
const username: string = (process.env.USERNAME_TS as string);
const password: string = (process.env.PASSWORD_TS as string);

describe('Test books page as anonymous and authenticated user', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    let login: LoginPage;
    let books: BooksPage;

    beforeAll( async () => {
        browser = await chromium.launch({ headless: false, slowMo: 400 });
        context = await browser.newContext();
        page = await context.newPage();

        login = new LoginPage(page);
        books = new BooksPage(page);
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });

    beforeEach( async () => {
        await books.navigate();
    });

    test('Anonymous user can see book store list and login button', async () => {
        expect(page.url()).toBe(books.booksURL);
        expect(await books.bookHeader.innerText()).toBe(data.bookStoreHeader);

        expect(await books.elementLoginBtn.isVisible()).toBe(true);

        expect(await books.tableHead.isVisible()).toBe(true);

        let tableColumns = await books.tableHeaderColumns;
        expect(tableColumns.length).toBe(4);

        expect(await tableColumns[0].innerText()).toBe(data.tableColumnOne);
        expect(await tableColumns[1].innerText()).toBe(data.tableColumnTwo);
        expect(await tableColumns[2].innerText()).toBe(data.tableColumnThree);
        expect(await tableColumns[3].innerText()).toBe(data.tableColumnFour);

        expect(await books.tableBody.isVisible()).toBe(true);

        let tableRows = await books.tableBodyRows;
        expect(tableRows.length).toBe(10);
    });

    test('Anonymous user can see all book title from book store table', async () => {
        expect(page.url()).toBe(books.booksURL);

        let allBookTitles = await books.allBookTitles;
        expect(allBookTitles.length).toBe(8);

        let index = 0;
        for await (const title of allBookTitles) {
            expect(await title.innerText()).toBe(data.bookTitles[index]);
            index++;
        }
    });

    test('Anonymous user can navigate to login page from books page', async () => {
        expect(page.url()).toBe(books.booksURL);

        expect(await books.elementLoginBtn.isVisible()).toBe(true);

        await books.clickLoginBtn();
        expect(page.url()).toBe(books.loginURL);
    });

    test('Authenticated user can see book store list, username & logout button', async () => {
        expect(page.url()).toBe(books.booksURL);

        expect(await books.elementLoginBtn.isVisible()).toBe(true);

        await books.clickLoginBtn();
        expect(page.url()).toBe(books.loginURL);
        await login.loginForm(username, password);

        await page.waitForURL(books.booksURL);
        expect(await books.elementUserNameTxt.innerText()).toBe(username);
        expect(await books.elementLogoutBtn.isVisible()).toBe(true);

        expect(await books.tableHead.isVisible()).toBe(true);

        let tableColumns = await books.tableHeaderColumns;
        expect(tableColumns.length).toBe(4);

        expect(await tableColumns[0].innerText()).toBe(data.tableColumnOne);
        expect(await tableColumns[1].innerText()).toBe(data.tableColumnTwo);
        expect(await tableColumns[2].innerText()).toBe(data.tableColumnThree);
        expect(await tableColumns[3].innerText()).toBe(data.tableColumnFour);

        expect(await books.tableBody.isVisible()).toBe(true);

        let allBookTitles = await books.allBookTitles;
        expect(allBookTitles.length).toBe(8);

        let index = 0;
        for await (const title of allBookTitles) {
            expect(await title.innerText()).toBe(data.bookTitles[index]);
            index++;
        }
        
        await books.clickLogoutBtn();
        expect(page.url()).toBe(books.loginURL);
    });

    test('Anonymous user can search books by title', async () => {
        expect(page.url()).toBe(books.booksURL);

        expect(await books.searchInputField.isVisible()).toBe(true);
        await books.fillKeywordSearch(data.keywordMatchTitle);

        let allBookTitles = await books.allBookTitles;
        expect(allBookTitles.length).toBe(4);

        expect(await allBookTitles[0].innerText()).toBe(data.bookTitles[1]);
        expect(await allBookTitles[1].innerText()).toBe(data.bookTitles[3]);
        expect(await allBookTitles[2].innerText()).toBe(data.bookTitles[5]);
        expect(await allBookTitles[3].innerText()).toBe(data.bookTitles[6]);
        
    });

    test('No rows are displayed when keyword does not match title, author or publisher', async () => {
        expect(page.url()).toBe(books.booksURL);

        expect(await books.searchInputField.isVisible()).toBe(true);
        await books.fillKeywordSearch(data.keywordNoMatch);

        expect(await books.noRowsTxt.innerText()).toBe(data.noRowsText);
    });
});