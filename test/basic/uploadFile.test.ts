import { Browser, BrowserContext, chromium, Page } from "playwright";

const uploadDemoqaURL = 'https://demoqa.com/upload-download';
const uploadId = '#uploadFile';
const inputTypeFile = "input[type='file']";

const uploadHerokuApp = 'https://the-internet.herokuapp.com/upload';
const dragDropId = '#drag-drop-upload';


describe('Upload files', () => {

    const filePathA = 'videos/afile.webm';
    const filePathB = 'videos/bfile.webm';
    
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

    test('Upload file using set input files when input has id', async () => {

        await page.goto(uploadDemoqaURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        await page.setInputFiles(uploadId, filePathA);
    });

    test('Upload file using set input files when use input as selector', async () => {

        await page.goto(uploadDemoqaURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        await page.setInputFiles(inputTypeFile, filePathB);
    });

    test('Upload file using on function', async () => {

        await page.goto(uploadHerokuApp);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('The Internet');

        page.on("filechooser", async(filechooser) => {
            await filechooser.setFiles([filePathA, filePathB]);
        });
        await page.click(dragDropId, { force: true });
    });

});