import { Browser, BrowserContext, chromium, Page } from "playwright";
import LoginPage from "../../page/loginPage";
import BooksPage from "../../page/booksPage";
import * as data from '../../data/variables.json';
import * as dotenv from 'dotenv'
dotenv.config()

const baseURL = 'https://demoqa.com/';
const loginURL = baseURL + 'login';
const booksURL = baseURL + 'books';

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
        await page.goto(booksURL);
    });

    test('Anonymous user can see book store list and login button', async () => {
        expect(page.url()).toBe(booksURL);
        expect(await books.book_header.innerText()).toBe(data.book_store_header);

        expect(await books.elementLoginBtn.isVisible()).toBe(true);

        expect(await books.table_head.isVisible()).toBe(true);

        let table_columns = await books.table_header_columns;
        expect(table_columns.length).toBe(4);

        expect(await table_columns[0].innerText()).toBe(data.table_column_one);
        expect(await table_columns[1].innerText()).toBe(data.table_column_two);
        expect(await table_columns[2].innerText()).toBe(data.table_column_three);
        expect(await table_columns[3].innerText()).toBe(data.table_column_four);

        expect(await books.table_body.isVisible()).toBe(true);

        let table_rows = await books.table_body_rows;
        expect(table_rows.length).toBe(10);
    });

    test('Anonymous user can see all book title from book store table', async () => {
        expect(page.url()).toBe(booksURL);

        let all_book_titles = await books.all_book_titles;
        expect(all_book_titles.length).toBe(8);

        let index = 0;
        for await (const title of all_book_titles) {
            expect(await title.innerText()).toBe(data.book_titles[index]);
            index++;
        }
    });

    test('Anonymous user can navigate to login page from books page', async () => {
        expect(page.url()).toBe(booksURL);

        expect(await books.elementLoginBtn.isVisible()).toBe(true);

        await books.clickLoginBtn();
        expect(page.url()).toBe(loginURL);
    });

    test('Authenticated user can see book store list, username & logout button', async () => {
        expect(page.url()).toBe(booksURL);

        expect(await books.elementLoginBtn.isVisible()).toBe(true);

        await books.clickLoginBtn();
        expect(page.url()).toBe(loginURL);
        await login.login_form(username, password);

        await page.waitForURL(booksURL);
        expect(await books.elementUserNameTxt.innerText()).toBe(username);
        expect(await books.elementLogoutBtn.isVisible()).toBe(true);

        expect(await books.table_head.isVisible()).toBe(true);

        let table_columns = await books.table_header_columns;
        expect(table_columns.length).toBe(4);

        expect(await table_columns[0].innerText()).toBe(data.table_column_one);
        expect(await table_columns[1].innerText()).toBe(data.table_column_two);
        expect(await table_columns[2].innerText()).toBe(data.table_column_three);
        expect(await table_columns[3].innerText()).toBe(data.table_column_four);

        expect(await books.table_body.isVisible()).toBe(true);

        let all_book_titles = await books.all_book_titles;
        expect(all_book_titles.length).toBe(8);

        let index = 0;
        for await (const title of all_book_titles) {
            expect(await title.innerText()).toBe(data.book_titles[index]);
            index++;
        }
        
        await books.clickLogoutBtn();
        expect(page.url()).toBe(loginURL);
    });

    test('Anonymous user can search books by title', async () => {
        expect(page.url()).toBe(booksURL);

        expect(await books.searchInputField.isVisible()).toBe(true);
        await books.fillKeywordSearch(data.keyword_match_title);

        let all_book_titles = await books.all_book_titles;
        expect(all_book_titles.length).toBe(4);

        expect(await all_book_titles[0].innerText()).toBe(data.book_titles[1]);
        expect(await all_book_titles[1].innerText()).toBe(data.book_titles[3]);
        expect(await all_book_titles[2].innerText()).toBe(data.book_titles[5]);
        expect(await all_book_titles[3].innerText()).toBe(data.book_titles[6]);
        
    });

    test('No rows are displayed when keyword does not match title, author or publisher', async () => {
        expect(page.url()).toBe(booksURL);

        expect(await books.searchInputField.isVisible()).toBe(true);
        await books.fillKeywordSearch(data.keyword_no_match);

        expect(await books.noRowsTxt.innerText()).toBe(data.no_rows_text);
    });
});