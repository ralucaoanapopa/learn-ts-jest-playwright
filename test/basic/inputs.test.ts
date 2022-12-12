import { Browser, BrowserContext, chromium, Page } from "playwright";

const inputDemoqaURL = 'https://demoqa.com/text-box';
const fullNameId = '#userName';
const emailId = '#userEmail';
const currentAddressId = '#currentAddress';
const permanentAddressId = '#permanentAddress';
const submitBtnId = '#submit';
const outputId = '#output';
const nameOutputId = '#name';
const emailOutputId = '#email';
const currentAddressOutputXpath = "xpath=//p[@id='currentAddress']";
const permanentAddressOutputXpath = "xpath=//p[@id='permanentAddress']";

const labelFullNameId = '#userName-label';
const labelEmailId = '#userEmail-label';
const labelCurrentAddress = '#currentAddress-label';
const labelPermanentAddress = '#permanentAddress-label';

const fullNameData = 'Test Playwright';
const emailData = 'letmetest@tools.com';
const currentAddressData = 'here';
const permanentAddressData = 'there';

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
        await page.goto(inputDemoqaURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('ToolsQA');
    });

    test('Enter data on text box page', async() => {

        // check labels:
        expect(await page.innerText(labelFullNameId)).toBe('Full Name');
        expect(await page.innerText(labelEmailId)).toBe('Email');
        expect(await page.innerText(labelCurrentAddress)).toBe('Current Address');
        expect(await page.innerText(labelPermanentAddress)).toBe('Permanent Address');

        // enter data in fields:
        await page.locator(fullNameId).fill(fullNameData);
        await page.locator(emailId).fill(emailData);
        await page.locator(currentAddressId).type(currentAddressData);
        await page.locator(permanentAddressId).fill(permanentAddressData);

        await page.locator(submitBtnId).click();

        await page.waitForSelector(outputId);

        expect(await page.innerText(nameOutputId)).toContain(fullNameData);
        expect(await page.innerText(emailOutputId)).toContain(emailData);
        expect(await page.innerText(currentAddressOutputXpath)).toContain(currentAddressData);
        expect(await page.innerText(permanentAddressOutputXpath)).toContain(permanentAddressData);

    });

    test('Enter data and use optional chaining', async () => {
        const name = await page.locator(fullNameId);
        // if name != null
        await name?.fill(fullNameData);

    });

});