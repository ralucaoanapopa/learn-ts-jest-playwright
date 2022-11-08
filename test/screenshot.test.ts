import { Browser, BrowserContext, chromium, Page } from "playwright";
import * as fs from 'fs';

const books_demoqa_URL = 'https://demoqa.com/books';
const book_img_xpath = "xpath=//img[@src='/images/bookimage3.jpg']";

describe('Learn how to capture screenshots', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    beforeAll( async () => {
        browser = await chromium.launch({ headless: false, slowMo: 400 });
        context = await browser.newContext();
        page = await context.newPage();

        await page.goto(books_demoqa_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });

    test('Should take screenshot for page', async () => {
        await page.screenshot({ path: 'screenshots/' + Date.now() +'-page.png' });
    });

    test('Should take screenshot for full page', async () => {
        await page.screenshot({ path: 'screenshots/'+ Date.now() +'-fullPage.png', fullPage: true});
    });

    test('Should take screenshot for an element', async () => {
        const book_img = await page.$$(book_img_xpath);
        await book_img[0]?.screenshot({ path: 'screenshots/'+ Date.now() +'-book.png' });
    });

    test('Should capture screenshot into buffer', async () => {
        const buffer = await page.screenshot();
        let base64data = buffer.toString('base64');
        fs.writeFileSync("screenshots/base64_encoded.txt", base64data);
    });
});