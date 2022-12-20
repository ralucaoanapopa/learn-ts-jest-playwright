import { Browser, BrowserContext, chromium, Page } from "playwright";

const dragDropURL = 'https://the-internet.herokuapp.com/drag_and_drop';
const elementAId = '#column-a';
const elementBId = '#column-b';
const headerAXpath = 'xpath=//div[@id="column-a"]/header';
const headerBXpath = 'xpath=//div[@id="column-b"]/header';

const dragDropjQueryURL = 'https://jqueryui.com/droppable/';
const elemDraggableId = '#draggable';
const elemDroppableId = '#droppable';
const droppedXpath = 'xpath=//div[@id="droppable"]/p';

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
        await page.goto(dragDropURL);
        expect(page).not.toBeNull();
        expect(await page.title()).not.toBeNull();
        expect(await page.title()).toBe('The Internet');

        const source = await page.$(elementAId);
        const dest = await page.$(elementBId);

        if (source && dest) {
            // get x, y coord
            const sourceBound = await source.boundingBox();
            const destBound = await dest.boundingBox();
            if (sourceBound && destBound){
                await page.mouse.move(sourceBound.x, sourceBound.y);
                await page.mouse.down();
                await page.mouse.move(destBound.x, destBound.y);
                await page.mouse.up();

                expect(await page.innerText(headerAXpath)).toBe('B');
                expect(await page.innerText(headerBXpath)).toBe('A');
            } else {
                throw new Error("No element");
            }
        }
    });

    test('Drag and drop on jQuery website', async () => {
        await page.goto(dragDropjQueryURL);
        expect(page).not.toBeNull();
        expect(await page.title()).toBe('Droppable | jQuery UI');

        const frame = page.frame({url: "/resources/demos/droppable/default.html"});
        if ( frame != null){
            const source = await frame.$(elemDraggableId);
            const dest = await frame.$(elemDroppableId);        

            if (source && dest) {
                // get x, y coord
                const sourceBound = await source.boundingBox();
                const destBound = await dest.boundingBox();
                if (sourceBound && destBound){
                    await page.mouse.move(sourceBound.x, sourceBound.y);
                    await page.mouse.down();
                    await page.mouse.move(destBound.x, destBound.y);
                    await page.mouse.up();

                    expect(await page.innerText(droppedXpath)).toBe('Dropped!');
                } else {
                    throw new Error("No element");
                }
            }
        }
    });
});