import { Browser, BrowserContext, chromium, Page } from "playwright";

const herokuapp_dropdown_URL = 'https://the-internet.herokuapp.com/dropdown';
const dropdown_id = '#dropdown';
const option_1_label = "Option 1";
const option_2_value = "2";

const testpages_basic_form_URL = 'https://testpages.herokuapp.com/styled/basic-html-form-test.html';
const multiple_select_xpath = "xpath=//select[@name='multipleselect[]']";
const option_1_value = 'ms1';

const dropdown_xpath = "xpath=//select[@name='dropdown']";
const option_5_value = 'dd5';

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

        await page.goto(herokuapp_dropdown_URL);

        const dropdown_elem = await page.locator(dropdown_id);
        // select option based on value
        await dropdown_elem.selectOption({value: option_2_value});
        // label
        await dropdown_elem.selectOption({label: option_1_label});
        // index
        await dropdown_elem.selectOption({index: 2});

    });

    test('Handle select multiple values from test pages', async () => {
        await page.goto(testpages_basic_form_URL);
        
        let multiple_select_elem = await page.locator(multiple_select_xpath);

        await multiple_select_elem.selectOption([
            {value: option_1_value}, {index: 3}
        ]);

    });

    test('Count all options from a dropdown',async () => {
        await page.goto(testpages_basic_form_URL);

        const dropdown = await page.$(dropdown_xpath);
        const available_options = await dropdown?.$$('option');

        expect(available_options?.length).toBe(6);

    });

    test('Get value of the selected option via index', async () => {
        await page.goto(testpages_basic_form_URL);

        await page.selectOption(dropdown_xpath, {index: 4});

        const text_option = await page.$eval<string, HTMLSelectElement>(dropdown_xpath, elem => elem.value);
        expect(text_option).toBe(option_5_value);

    });

});