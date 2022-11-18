import { Browser, BrowserContext, chromium, Page } from "playwright";

const input_demoqa_URL = 'https://demoqa.com/text-box';
const fullName_id = '#userName';
const email_id = '#userEmail';
const currentAddress_id = '#currentAddress';
const permanentAddress_id = '#permanentAddress';
const submitBtn_id = '#submit';
const output_id = '#output';
const nameOutput_id = '#name';
const emailOutput_id = '#email';
const currentAddressOutput_xpath = "xpath=//p[@id='currentAddress']";
const permanentAddressOutput_xpath = "xpath=//p[@id='permanentAddress']";

const label_fullName_id = '#userName-label';
const label_email_id = '#userEmail-label';
const label_currentAddress = '#currentAddress-label';
const label_PermanentAddress = '#permanentAddress-label';

const fullName_data = 'Test Playwright';
const email_data = 'letmetest@tools.com';
const currentAddress_data = 'here';
const permanentAddress_data = 'there';

describe('Interact with input fields', () => {

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
        await page.goto(input_demoqa_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');
    });

    test('Enter data on text box page', async() => {

        // check labels:
        expect(await page.innerText(label_fullName_id)).toBe('Full Name');
        expect(await page.innerText(label_email_id)).toBe('Email');
        expect(await page.innerText(label_currentAddress)).toBe('Current Address');
        expect(await page.innerText(label_PermanentAddress)).toBe('Permanent Address');

        // enter data in fields:
        await page.locator(fullName_id).fill(fullName_data);
        await page.locator(email_id).fill(email_data);
        await page.locator(currentAddress_id).type(currentAddress_data);
        await page.locator(permanentAddress_id).fill(permanentAddress_data);

        await page.locator(submitBtn_id).click();

        await page.waitForSelector(output_id);

        expect(await page.innerText(nameOutput_id)).toContain(fullName_data);
        expect(await page.innerText(emailOutput_id)).toContain(email_data);
        expect(await page.innerText(currentAddressOutput_xpath)).toContain(currentAddress_data);
        expect(await page.innerText(permanentAddressOutput_xpath)).toContain(permanentAddress_data);

    });

    test('Enter data and use optional chaining', async () => {
        const name = await page.locator(fullName_id);
        // if name != null
        await name?.fill(fullName_data);

    });

});