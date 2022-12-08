import { Browser, BrowserContext, chromium, Page } from 'playwright';
import LoginPage from '../../page/loginSaucePage';
import InventoryPage from '../../page/inventorySaucePage';
import * as data from '../../data/saucedemo.json';
import * as dotenv from 'dotenv'
import CheckoutPage from '../../page/checkoutPage';
dotenv.config()

// get credentials set as env variables
const username: string = (process.env.USER_SAUCE as string);
const password: string = (process.env.PASSWORD_SAUCE as string);

describe('Test checkout flow', () => {

    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

    let login: LoginPage;
    let inventory: InventoryPage;
    let checkout: CheckoutPage;

    beforeAll( async () => {
        browser = await chromium.launch({ headless: false, slowMo: 400 });
        context = await browser.newContext();
        page = await context.newPage();

        login = new LoginPage(page);
        inventory = new InventoryPage(page);
        checkout = new CheckoutPage(page);
        await login.navigate();

        await login.loginForm(username, password);
        expect(page.url()).toBe(login.inventoryURL);
    });

    afterAll( async () => {
        await page.close();
        await context.close();
        await browser.close();
    });

    test("Should be able to add products to shopping cart", async () => {
        await inventory.addProductToShoppingCart(inventory.onesieId);
        await inventory.buttonRemoveProduct(inventory.onesieRemoveId);
        expect(await inventory.shoppingCartBadge.innerText()).toBe("1");

        await inventory.addProductToShoppingCart(inventory.boltTshirtId);
        await inventory.buttonRemoveProduct(inventory.boltTshirtRemoveId);
        expect(await inventory.shoppingCartBadge.innerText()).toBe("2");

        await inventory.addProductToShoppingCart(inventory.backpackId);
        await inventory.buttonRemoveProduct(inventory.backpackRemoveId);
        expect(await inventory.shoppingCartBadge.innerText()).toBe("3");

    });

    test("Should be able to see shopping cart content", async () => {
        await inventory.clickShoppingCart();

        expect(page.url()).toBe(checkout.cartURL);
        expect(await checkout.titleCheckout.innerText()).toBe(data.cartTitle);
        expect(await checkout.cartQuantity.innerText()).toBe(data.cartQuantity);
        expect(await checkout.cartDescription.innerText()).toBe(data.cartDescription);

        expect(await checkout.footerSection.isVisible()).toBe(true);
        expect(await checkout.continueShopping.isVisible()).toBe(true);
        expect(await checkout.continueShopping.innerText()).toBe(data.continueShopping);
        expect(await checkout.checkout.isVisible()).toBe(true);

        expect((await checkout.cartItemList).length).toBe(3);
        let allItems = await checkout.cartItemList;
        expect(await allItems[0].innerText()).toContain(data.productOnesie);
        expect(await allItems[1].innerText()).toContain(data.productBoltTShirt);
        expect(await allItems[2].innerText()).toContain(data.productBackpack);

        expect((await checkout.itemPriceList).length).toBe(3);
        let allItemsPrices = await checkout.itemPriceList;
        expect(await allItemsPrices[0].innerText()).toBe(data.productOnesiePrice);
        expect(await allItemsPrices[1].innerText()).toBe(data.productBoltTShirtPrice);
        expect(await allItemsPrices[2].innerText()).toBe(data.productBackpackPrice);
    });

    test("Should be able to navigate to inventory page", async () => {
        await checkout.clickContinueShopping();

        expect(page.url()).toBe(checkout.inventoryURL);

        await inventory.buttonRemoveProduct(inventory.onesieRemoveId);
        await inventory.buttonRemoveProduct(inventory.boltTshirtRemoveId);
        await inventory.buttonRemoveProduct(inventory.backpackRemoveId);

        await inventory.addProductToShoppingCart(inventory.fleeceJacketId);
        await inventory.buttonRemoveProduct(inventory.fleeceJacketRemoveId);
        expect(await inventory.shoppingCartBadge.innerText()).toBe("4");

    });

    test("Should be able to remove product from cart", async () => {
        await inventory.clickShoppingCart();

        expect(page.url()).toBe(checkout.cartURL);

        expect((await checkout.cartItemList).length).toBe(4);
        let allItems = await checkout.cartItemList;
        expect(await allItems[0].innerText()).toContain(data.productOnesie);
        expect(await allItems[1].innerText()).toContain(data.productBoltTShirt);
        expect(await allItems[2].innerText()).toContain(data.productBackpack);
        expect(await allItems[3].innerText()).toContain(data.productJacket);

        await checkout.removeProduct(checkout.onesieRemoveId);
        expect((await checkout.cartItemList).length).toBe(3);
    });

    test("Should be able to provide information on checkout", async () => {
        await checkout.clickCheckout();

        expect(page.url()).toBe(checkout.checkoutStepOneURL);
        expect(await checkout.titleCheckout.innerText()).toBe(data.checkoutOneTitle);

        await checkout.submitCheckoutInfo(data.firstName, data.lastName, data.postalCode);

        expect(await checkout.continue.getAttribute("value")).toBe(data.continueCheckout);
        
    });

    test("Should be able to see overview on checkout", async () => {
        await checkout.clickContinue();

        expect(page.url()).toBe(checkout.checkoutStepTwoURL);
        expect(await checkout.titleCheckout.innerText()).toBe(data.checkoutTwoTitle);
        expect(await checkout.cartQuantity.innerText()).toBe(data.cartQuantity);
        expect(await checkout.cartDescription.innerText()).toBe(data.cartDescription);

        expect(await checkout.cancel.innerText()).toBe(data.cancelCheckout);
        expect(await checkout.finish.innerText()).toBe(data.finishCheckout);

        expect((await checkout.cartItemList).length).toBe(3);

        let allItemsPrices = await checkout.itemPriceList;
        expect(await allItemsPrices[0].innerText()).toBe(data.productBoltTShirtPrice);
        expect(await allItemsPrices[1].innerText()).toBe(data.productBackpackPrice);
        expect(await allItemsPrices[2].innerText()).toBe(data.productFleeceJacket);
    });

    test("Should be able to see total price and shipping information on checkout", async () => {
        expect(page.url()).toBe(checkout.checkoutStepTwoURL);

        let allSummaryInfo = await checkout.elementsByClass(checkout.summaryInfoClass);
        expect(await (allSummaryInfo[0]).innerText()).toBe(data.paymentInformationLabel);
        expect(await (allSummaryInfo[1]).innerText()).toBe(data.shippingInformationLabel);

        let allSummaryValue = await checkout.elementsByClass(checkout.summaryValueClass);
        expect(await (allSummaryValue[0]).innerText()).toBe(data.paymentInformationValue);
        expect(await (allSummaryValue[1]).innerText()).toBe(data.shippingInformationValue);

        expect(await (await checkout.elementByClass(checkout.summarySubtotalClass)).innerText()).toBe(data.totalItemPrice);
        expect(await (await checkout.elementByClass(checkout.summaryTaxClass)).innerText()).toBe(data.taxPrice);
        expect(await (await checkout.elementByClass(checkout.summaryTotalClass)).innerText()).toBe(data.totalPrice);

    });

    test("Should be able to finish order from checkout", async () => {
        await checkout.clickFinish();

        expect(page.url()).toBe(checkout.checkoutFinalURL);
        expect(await checkout.titleCheckout.innerText()).toBe(data.checkoutFinalTitle);

        expect(await (await checkout.elementByClass(checkout.completeHeaderClass)).innerText()).toBe(data.completeHeader);
        expect(await (await checkout.elementByClass(checkout.completeTextClass)).innerText()).toBe(data.completeText);

        expect(await (await checkout.elementByClass(checkout.finalImageClass)).getAttribute("src")).toBe(data.finalImg);
    });

    test("Should be able to navigate back to inventory after order was sent", async () => {
       await checkout.clickBack();
       
       expect(page.url()).toBe(checkout.inventoryURL);
    });

    test("Should not be able to sent order without any products", async () => {
        await inventory.clickShoppingCart();
        expect(page.url()).toBe(checkout.cartURL);

        await checkout.clickCheckout();
        expect(page.url()).toBe(checkout.checkoutStepOneURL);

        await checkout.submitCheckoutInfo(data.firstName, data.lastName, data.postalCode);

        await checkout.clickContinue();
        expect(page.url()).toBe(checkout.checkoutStepTwoURL);

        await checkout.clickFinish();
        expect(page.url()).toBe(checkout.checkoutFinalURL);

        fail('Should not be able to sent order without any products');
    });

    test("Should not be able to see overview without providing shipping information", async () => {
        await page.goto(checkout.checkoutStepOneURL);
        expect(page.url()).toBe(checkout.checkoutStepOneURL);

        await checkout.clickContinue();
        let elementError = await checkout.elementByClass(checkout.errorValidationClass);
        expect(await elementError.innerText()).toBe(data.errorCheckoutFirstName);

        await checkout.enterFirstName(data.firstName);
        await checkout.clickContinue();
        expect(await elementError.innerText()).toBe(data.errorCheckoutLastName);

        await checkout.enterLastName(data.lastName);
        await checkout.clickContinue();
        expect(await elementError.innerText()).toBe(data.errorCheckoutPostalCode);

        await checkout.enterPostalCode(data.postalCode);
        await checkout.clickContinue();
        expect(page.url()).toBe(checkout.checkoutStepTwoURL);
    });
});