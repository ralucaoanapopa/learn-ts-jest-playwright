import { Browser, BrowserContext, chromium, Page } from "playwright";

const drag_drop_URL = 'https://the-internet.herokuapp.com/drag_and_drop';
const element_a_id = '#column-a';
const element_b_id = '#column-b';
const header_a_xpath = 'xpath=//div[@id="column-a"]/header';
const header_b_xpath = 'xpath=//div[@id="column-b"]/header';

const drag_drop_jQuery_URL = 'https://jqueryui.com/droppable/';
const elem_draggable_id = '#draggable';
const elem_droppable_id = '#droppable';
const dropped_xpath = 'xpath=//div[@id="droppable"]/p';

describe('Interact with drag and drop elements', () => {

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

    test('Drag element over another element', async () => {
        await page.goto(drag_drop_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('The Internet');

        const source = await page.$(element_a_id);
        const dest = await page.$(element_b_id);

        if (source && dest) {
            // get x, y coord
            const sourceBound = await source.boundingBox();
            const destBound = await dest.boundingBox();
            if (sourceBound && destBound){
                await page.mouse.move(sourceBound.x, sourceBound.y);
                await page.mouse.down();
                await page.mouse.move(destBound.x, destBound.y);
                await page.mouse.up();

                expect(await page.innerText(header_a_xpath)).toBe('B');
                expect(await page.innerText(header_b_xpath)).toBe('A');
            } else {
                throw new Error("No element");
            }
        }
    });

    test('Drag and drop on jQuery website', async () => {
        await page.goto(drag_drop_jQuery_URL);
        expect(page).not.toBeNull();
        expect(await page.title()).toBe('Droppable | jQuery UI');

        const frame = page.frame({url: "/resources/demos/droppable/default.html"});
        if ( frame != null){
            const source = await frame.$(elem_draggable_id);
            const dest = await frame.$(elem_droppable_id);        

            if (source && dest) {
                // get x, y coord
                const sourceBound = await source.boundingBox();
                const destBound = await dest.boundingBox();
                if (sourceBound && destBound){
                    await page.mouse.move(sourceBound.x, sourceBound.y);
                    await page.mouse.down();
                    await page.mouse.move(destBound.x, destBound.y);
                    await page.mouse.up();

                    expect(await page.innerText(dropped_xpath)).toBe('Dropped!');
                } else {
                    throw new Error("No element");
                }
            }
        }
    });
});