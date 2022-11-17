import { Page } from "playwright";
import BasePage from "./basePage";

export default class LoginPage extends BasePage {

    readonly emailInputId = "input[id='userName']";
    readonly passwordInputId = "input[id='password']";
    readonly loginBtn = "button[id='login']";
    readonly errorMsgId = "//p[@id='name']";

    constructor(page: Page) {
        super(page);
    }

    async navigate(){
        await super.navigate(this.loginPage);
    }

    public get elementEmailTextField() {
        return this.page.locator(this.emailInputId);
    }

    // short way of writing same thing:
    elementPasswordTextField = async () => this.page.locator(this.passwordInputId);

    public get elementLoginBtn() {
        return this.page.locator(this.loginBtn);
    }

    public async enterUserName(username: string){
        const elem = this.elementEmailTextField;
        if (elem != null)
            await elem.fill(username);
        else throw new Error('Element input field for username is not found');   
    }

    public async enterPassword(password: string){
        // we need to use `await` because that function returns a Promise.
        const elem = await this.elementPasswordTextField();
        await elem?.fill(password);
    }

    public async clickLoginBtn(){
        const elem = this.elementLoginBtn;
        await elem?.click();
    }

    public async loginForm(username: string, password: string) {
        await this.enterUserName(username);
        await this.enterPassword(password);
        await this.clickLoginBtn();
    }

    public get errorLoginMsg() {
        return this.page.locator(this.errorMsgId);
    }
    
}