import { Browser, BrowserContext, chromium, Page } from "playwright";

const alerts_demoqa_URL = 'https://demoqa.com/alerts';
const button_one = '#alertButton';
const button_three = '#confirmButton';
const button_four = '#promtButton';

const acceptMessage = "Accept this prompt alert";
const promptResult_id = '#promptResult';

describe('Interact with dialogs / browser alerts', () => {

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

    beforeEach( async () => {
        await page.goto(alerts_demoqa_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');
    });

    test('Accept simple alert', async () => {

        // create a listener in order to accept
        // by default playwright automaticaly dismisses dialogs

        page.once("dialog", (dialog) => {
            dialog.accept();
        });
        // launch the simple alert:
        await page.locator(button_one).click();
    });

    test('Handle confirm/cancel alert', async () => {
        page.once("dialog", (dialog) => {
            dialog.dismiss();
        });
        // launch the confirm alert:
        await page.locator(button_three).click();
    });

    test('Handle prompt alert', async () => {
        page.on("dialog", (dialog) => {
            dialog.accept(acceptMessage);
        });
        // launch the prompt alert:
        await page.locator(button_four).click();

        expect(await page.innerText(promptResult_id)).toContain(acceptMessage);
    });

});