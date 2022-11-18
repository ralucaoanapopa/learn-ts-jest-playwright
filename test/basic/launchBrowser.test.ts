import { chromium, firefox, webkit } from "playwright";

const baseURL = 'https://the-internet.herokuapp.com/';

describe('Launch Browsers', () => {

    test('Open web page with Chromium', async () => {
        const browser = await chromium.launch({ headless: false, slowMo: 3000});
        const context = await browser.newContext({
            recordVideo: {
                dir: "videos/"
              }
            });
        const page = await context.newPage();
        await page.goto(baseURL);

        await context.close();
        await browser.close();
    });

    test('Open web page with Chromium: Microsoft Edge channel', async () => {
        const browser = await chromium.launch({ headless: false, channel: "msedge", slowMo: 3000 });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(baseURL);

        await context.close();
        await browser.close();
    });

    test('Open web page with Firefox', async () => {
        const browser = await firefox.launch({ headless: false, slowMo: 3000 });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(baseURL);

        await context.close();
        await browser.close();
    });

    test('Open web page with Webkit', async () => {
        const browser = await webkit.launch({ headless: false, slowMo: 3000 });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(baseURL);

        await context.close();
        await browser.close();
    });
});