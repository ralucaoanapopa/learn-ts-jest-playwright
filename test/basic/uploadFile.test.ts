import { Browser, BrowserContext, chromium, Page } from "playwright";

const upload_demoqa_URL = 'https://demoqa.com/upload-download';
const upload_id = '#uploadFile';
const input_type_file = "input[type='file']";

const upload_herokuapp = 'https://the-internet.herokuapp.com/upload';
const drag_drop_id = '#drag-drop-upload';


describe('Upload files', () => {

    const filePath_a = 'videos/afile.webm';
    const filePath_b = 'videos/bfile.webm';
    
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

        await page.goto(upload_demoqa_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        await page.setInputFiles(upload_id, filePath_a);
    });

    test('Upload file using set input files when use input as selector', async () => {

        await page.goto(upload_demoqa_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        await page.setInputFiles(input_type_file, filePath_b);
    });

    test('Upload file using on function', async () => {

        await page.goto(upload_herokuapp);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('The Internet');

        page.on("filechooser", async(filechooser) => {
            await filechooser.setFiles([filePath_a, filePath_b]);
        });
        await page.click(drag_drop_id, { force: true });
    });

});