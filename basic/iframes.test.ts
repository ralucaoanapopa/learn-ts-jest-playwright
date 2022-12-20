import { Browser, BrowserContext, chromium, Page } from "playwright";

const baseLetcodeURL = 'https://letcode.in/';
const framesLetcodeURL = baseLetcodeURL + 'frame';

const locatorNotConsent = 'text="Do not consent"';
const firstFrameName = 'firstFr';
const firstNameInput = "input[name='fname']";
const lastNameInput = "input[name='lname']";
const firstNameData = 'Hakuna';
const lastNameData = 'Matata';
const lastNameDataParent = 'Gandalf';
const outputXpath = "xpath=//p[@class='title has-text-info']";
const emailName = "input[name='email']";
const emailData = 'hakuna.matata@test.com';

const framesDemoqaURL = 'https://demoqa.com/frames';

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
        await page.goto(framesLetcodeURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();

        // dismiss consent to use data
        //await page.click(locatorNotConsent);

        const frame = page.frame({ name: firstFrameName });
        if(frame != null){
            await frame.fill(firstNameInput, firstNameData);
            await frame?.fill(lastNameInput, lastNameData);

            expect(await frame.innerText(outputXpath)).toContain(firstNameData + ' ' + lastNameData);

            const frames =  frame.childFrames();
            expect(frames.length).toBe(2);

            await frames[1]?.fill(emailName, emailData);

            const parentFrame = frames[1].parentFrame();
            await parentFrame?.fill(lastNameInput, lastNameDataParent);
            expect(await frame.innerText(outputXpath)).toContain(firstNameData + ' ' + lastNameDataParent);

        } else 
            throw new Error("No such frame");
    });

    test('Interact with frames on demoqa', async () => {
        await page.goto(framesDemoqaURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');

        const frame_one = page.frame({url: /\/sample/});
        if(frame_one != null){
            expect(await frame_one.innerText('h1')).toBe('This is a sample page');
        }
        
    });

});