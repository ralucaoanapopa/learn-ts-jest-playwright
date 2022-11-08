import { Browser, BrowserContext, chromium, Page } from "playwright";

const base_letcode_URL = 'https://letcode.in/';
const frames_letcode_URL = base_letcode_URL + 'frame';

const locator_not_consent = 'text="Do not consent"';
const first_frame_name = 'firstFr';
const firstName_name = "input[name='fname']";
const lastName_name = "input[name='lname']";
const firstName_data = 'Hakuna';
const lastName_data = 'Matata';
const lastName_data_parent = 'Gandalf';
const output_xpath = "xpath=//p[@class='title has-text-info']";
const email_name = "input[name='email']";
const email_data = 'hakuna.matata@test.com';

const frames_demoqa_URL = 'https://demoqa.com/frames';

describe('Interact with iframes', () => {

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

    test('Interact with nested frames on Letcode', async () => {
        await page.goto(frames_letcode_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();

        // dismiss consent to use data
        await page.click(locator_not_consent);

        const frame = page.frame({ name: first_frame_name });
        if(frame != null){
            await frame.fill(firstName_name, firstName_data);
            await frame?.fill(lastName_name, lastName_data);

            expect(await frame.innerText(output_xpath)).toContain(firstName_data + ' ' + lastName_data);

            const frames =  frame.childFrames();
            expect(frames.length).toBe(2);

            await frames[1]?.fill(email_name, email_data);

            const parentFrame = frames[1].parentFrame();
            await parentFrame?.fill(lastName_name, lastName_data_parent);
            expect(await frame.innerText(output_xpath)).toContain(firstName_data + ' ' + lastName_data_parent);

        } else 
            throw new Error("No such frame");
    });

    test('Interact with frames on demoqa', async () => {
        await page.goto(frames_demoqa_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        const frame_one = page.frame({url: /\/sample/});
        if(frame_one != null){
            expect(await frame_one.innerText('h1')).toBe('This is a sample page');
        }
        
    });

});