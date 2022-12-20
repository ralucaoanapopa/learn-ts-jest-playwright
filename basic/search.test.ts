import { Browser, BrowserContext, chromium, Page } from "playwright";

const booksDemoqaURL = 'https://demoqa.com/books';
const bookTitleXpath = "xpath=//div[@class='main-header']";
const bookTitleData = 'Book Store';

const rowsClassXpath = "xpath=//div[@class='rt-tr-group']";
const bookTitleClassXpath = "xpath=//span[@class='mr-2']";

let titleList: Array<string> = ['Git Pocket Guide', 'Learning JavaScript Design Patterns', 'Designing Evolvable Web APIs with ASP.NET',
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
        await page.goto(booksDemoqaURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        expect(await page.innerText(bookTitleXpath)).toBe(bookTitleData);
    });

    test('Should check that table has 10 rows',async () => {
        // need waitForSelector because innerText() action has Auto-waiting only for Attached
        // cheat sheet : https://playwright.dev/docs/actionability
        await page.waitForSelector(rowsClassXpath, { timeout: 5000});
        const allRows = await page.$$(rowsClassXpath);
        expect(allRows.length).toBe(10);
    });

    test('Should check all book titles from the list (using for await)', async () => {

        const allBookTitles = await page.$$(bookTitleClassXpath);
        expect(allBookTitles.length).toBe(8);

        let index = 0;
        for await (const title of allBookTitles) {
            expect(await title.innerText()).toBe(titleList[index]);
            index++;
        }
    });

    test('Should check all book titles from the list (using map)', async () => {

        const allBookTitles = await page.$$(bookTitleClassXpath);
        expect(allBookTitles.length).toBe(8);
        // the map returns a Promise of type array => so need to resolve an array of promises
        // => await Promise.all
        // until the map gets completed of all the promises internally
        const bookTitles = await Promise.all(allBookTitles.map( async (title) => {
            return await title.innerText();
        }));

        for (var index = 0; index <= bookTitles.length-1; index++ ){
            expect(bookTitles[index]).toBe(titleList[index]);
        }
    });

});