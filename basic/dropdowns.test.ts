import { Browser, BrowserContext, chromium, Page } from "playwright";

const herokuAppDropdownURL = 'https://the-internet.herokuapp.com/dropdown';
const dropdownId = '#dropdown';
const option_1_Label = "Option 1";
const option_2_Value = "2";

const testPagesBasicFormURL = 'https://testpages.herokuapp.com/styled/basic-html-form-test.html';
const multipleSelectXpath = "xpath=//select[@name='multipleselect[]']";
const option_1_Value = 'ms1';

const dropdownXpath = "xpath=//select[@name='dropdown']";
const option_5_Value = 'dd5';

describe('Interact with dropdowns', () => {

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

    test('Handle dropdown options from herokuapp', async () => {

        await page.goto(herokuAppDropdownURL);

        const dropdownElem = await page.locator(dropdownId);
        // select option based on value
        await dropdownElem.selectOption({value: option_2_Value});
        // label
        await dropdownElem.selectOption({label: option_1_Label});
        // index
        await dropdownElem.selectOption({index: 2});

    });

    test('Handle select multiple values from test pages', async () => {
        await page.goto(testPagesBasicFormURL);
        
        let multipleSelectElem = await page.locator(multipleSelectXpath);

        await multipleSelectElem.selectOption([
            {value: option_1_Value}, {index: 3}
        ]);

    });

    test('Count all options from a dropdown',async () => {
        await page.goto(testPagesBasicFormURL);

        const dropdown = await page.$(dropdownXpath);
        const availableOptions = await dropdown?.$$('option');

        expect(availableOptions?.length).toBe(6);

    });

    test('Get value of the selected option via index', async () => {
        await page.goto(testPagesBasicFormURL);

        await page.selectOption(dropdownXpath, {index: 4});

        const textOption = await page.$eval<string, HTMLSelectElement>(dropdownXpath, elem => elem.value);
        expect(textOption).toBe(option_5_Value);

    });

});