import { Browser, BrowserContext, chromium, Page } from "playwright";

const baseURL = 'https://demoqa.com/';
const browserWindowsDemoqa_URL = baseURL + 'browser-windows';
const sampleDemoqaURL = baseURL + 'sample';

const btnNewTabId = '#tabButton';
const h1ContentId = '#sampleHeading';
const contentSamplePage = 'This is a sample page';

const baseLetcodeURL = 'https://letcode.in/';
const windowsLetcodeURL = baseLetcodeURL + 'windows';
const homepageLetcodeURL = baseLetcodeURL + 'test';
const signinLetcodeURL = baseLetcodeURL + 'signin';
const alertLetcodeURL = baseLetcodeURL + 'alert';
const dropdownsLetcodeURL = baseLetcodeURL + 'dropdowns';
const btnHomeId = '#home';
const btnMultipleId = '#multi';
const btnSimpleAlertId = '#accept';

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
        await page.goto(browserWindowsDemoqa_URL);

        const [newWindow] = await Promise.all([
            context.waitForEvent("page"),
            await page.click(btnNewTabId)
        ]);
        await newWindow.waitForLoadState();
        expect(newWindow.url()).toBe(sampleDemoqaURL);

        expect(await newWindow.innerText(h1ContentId)).toBe(contentSamplePage);
        await newWindow.close();
    });

    test('Single page handling on Letcode', async () => {
        await page.goto(windowsLetcodeURL);

        // dismiss consent to use data
        //await page.click('text="Do not consent"');

        const [newWindow] = await Promise.all([
            context.waitForEvent("page"),
            await page.click(btnHomeId)
        ]);
        await newWindow.waitForLoadState();
        expect(newWindow.url()).toBe(homepageLetcodeURL);

        await newWindow.click('text="Log in"');
        expect(newWindow.url()).toBe(signinLetcodeURL);
        await page.bringToFront();
        await page.click('text="Product"');

        await newWindow.close();
    });

    test("Multipage handling on Letcode", async () => {
        await page.goto(windowsLetcodeURL);

        const [multipage] = await Promise.all([
            context.waitForEvent("page"),
            await page.click(btnMultipleId)
        ])
        await multipage.waitForLoadState();
        const allWindows = page.context().pages();

        expect(allWindows.length).toBe(3);
        expect(allWindows[0].url()).toBe(windowsLetcodeURL);
        expect(allWindows[1].url()).toBe(alertLetcodeURL);
        expect(allWindows[2].url()).toBe(dropdownsLetcodeURL);

        await allWindows[1].bringToFront();
        allWindows[1].on("dialog", (dialog) => {
            dialog.accept();
        })
        await allWindows[1].click(btnSimpleAlertId);
    });

});