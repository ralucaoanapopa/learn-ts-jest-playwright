import { Page } from "playwright";
import BasePage from "./baseSaucePage";

export default class LoginPage extends BasePage {
    
    readonly usernameInputId = "#user-name";
    readonly passwordInputId = "#password";
    readonly loginBtnId = "#login-button";
    readonly errorMsgXpath = "xpath=//h3[@data-test='error']";

    constructor(page: Page){
        super(page);
    }

    async navigate() {
        await super.navigate("");
    }

    public get usernameInput() {
        return this.page.locator(this.usernameInputId);
    }

    public get passwordInput() {
        return this.page.locator(this.passwordInputId);
    }

    public get loginBtn() {
        return this.page.locator(this.loginBtnId);
    }

    public async enterUsername(username: string) {
        await this.usernameInput?.fill(username);
    }

    public async enterPassword(password: string) {
        await this.passwordInput?.fill(password);
    }

    public async clickLoginBtn () {
        await this.loginBtn.click();
    }

    public async loginForm(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginBtn();
    }

    public get errorMsgLogin() {
        return this.page.locator(this.errorMsgXpath);
    }
}