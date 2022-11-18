import { Browser, BrowserContext, chromium, Page } from "playwright";

const baseURL = 'https://demoqa.com/';
const browser_windows_demoqa_URL = baseURL + 'browser-windows';
const sample_demoqa_URL = baseURL + 'sample';

const btn_newTab_id = '#tabButton';
const h1_content_id = '#sampleHeading';
const content_sample_page = 'This is a sample page';

const base_letcode_URL = 'https://letcode.in/';
const windows_letcode_URL = base_letcode_URL + 'windows';
const homepage_letcode_URL = base_letcode_URL + 'test';
const signin_letcode_URL = base_letcode_URL + 'signin';
const alert_letcode_URL = base_letcode_URL + 'alert';
const dropdowns_letcode_URL = base_letcode_URL + 'dropdowns';
const btn_home_id = '#home';
const btn_multiple_id = '#multi';
const btn_simple_alert_id = '#accept';

describe('Window handling learning', () => {

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

    test('Single page handling on demoqa', async () => {
        await page.goto(browser_windows_demoqa_URL);

        const [newWindow] = await Promise.all([
            context.waitForEvent("page"),
            await page.click(btn_newTab_id)
        ]);
        await newWindow.waitForLoadState();
        expect(newWindow.url()).toBe(sample_demoqa_URL);

        expect(await newWindow.innerText(h1_content_id)).toBe(content_sample_page);
        await newWindow.close();
    });

    test('Single page handling on Letcode', async () => {
        await page.goto(windows_letcode_URL);

        // dismiss consent to use data
        await page.click('text="Do not consent"');

        const [newWindow] = await Promise.all([
            context.waitForEvent("page"),
            await page.click(btn_home_id)
        ]);
        await newWindow.waitForLoadState();
        expect(newWindow.url()).toBe(homepage_letcode_URL);

        await newWindow.click('text="Log in"');
        expect(newWindow.url()).toBe(signin_letcode_URL);
        await page.bringToFront();
        await page.click('text="Product"');

        await newWindow.close();
    });

    test("Multipage handling on Letcode", async () => {
        await page.goto(windows_letcode_URL);

        const [multipage] = await Promise.all([
            context.waitForEvent("page"),
            await page.click(btn_multiple_id)
        ])
        await multipage.waitForLoadState();
        const allwindows = page.context().pages();

        expect(allwindows.length).toBe(3);
        expect(allwindows[0].url()).toBe(windows_letcode_URL);
        expect(allwindows[1].url()).toBe(alert_letcode_URL);
        expect(allwindows[2].url()).toBe(dropdowns_letcode_URL);

        await allwindows[1].bringToFront();
        allwindows[1].on("dialog", (dialog) => {
            dialog.accept();
        })
        await allwindows[1].click(btn_simple_alert_id);
    });

});