import { chromium } from "playwright";

const baseURL = 'https://the-internet.herokuapp.com/';

describe('Launch Browser', () => {

    test('Open web page', async () => {
        const browser = await chromium.launch({headless: false});
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
});