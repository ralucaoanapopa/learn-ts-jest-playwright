import { Browser, BrowserContext, chromium, Page } from "playwright";

const books_demoqa_URL = 'https://demoqa.com/books';
const book_title_xpath = "xpath=//div[@class='main-header']";
const book_title_data = 'Book Store';

const rows_class_xpath = "xpath=//div[@class='rt-tr-group']";
const book_title_class_xpath = "xpath=//span[@class='mr-2']";

let title_list: Array<string> = ['Git Pocket Guide', 'Learning JavaScript Design Patterns', 'Designing Evolvable Web APIs with ASP.NET',
                'Speaking JavaScript', 'You Don\'t Know JS', 'Programming JavaScript Applications',
                'Eloquent JavaScript, Second Edition', 'Understanding ECMAScript 6'];

describe('Find multiple elements: list of books', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    beforeAll( async () => {
        browser = await chromium.launch({ headless: false, slowMo: 400 });
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });

    beforeEach( async () => {
        await page.goto(books_demoqa_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        expect(await page.innerText(book_title_xpath)).toBe(book_title_data);
    });

    test('Should check that table has 10 rows',async () => {
        // need waitForSelector because innerText() action has Auto-waiting only for Attached
        // cheat sheet : https://playwright.dev/docs/actionability
        await page.waitForSelector(rows_class_xpath, { timeout: 5000});
        const all_rows = await page.$$(rows_class_xpath);
        expect(all_rows.length).toBe(10);
    });

    test('Should check all book titles from the list (using for await)', async () => {

        const all_book_titles = await page.$$(book_title_class_xpath);
        expect(all_book_titles.length).toBe(8);

        let index = 0;
        for await (const title of all_book_titles) {
            expect(await title.innerText()).toBe(title_list[index]);
            index++;
        }
    });

    test('Should check all book titles from the list (using map)', async () => {

        const all_book_titles = await page.$$(book_title_class_xpath);
        expect(all_book_titles.length).toBe(8);
        // the map returns a Promise of type array => so need to resolve an array of promises
        // => await Promise.all
        // until the map gets completed of all the promises internally
        const book_titles = await Promise.all(all_book_titles.map( async (title, index) => {
            return await title.innerText();
        }));

        for (var index = 0; index <= book_titles.length-1; index++ ){
            expect(book_titles[index]).toBe(title_list[index]);
        }
    });

});