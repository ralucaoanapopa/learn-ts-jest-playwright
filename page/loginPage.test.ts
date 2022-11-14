import { Page } from "playwright";

export default class LoginPage {

    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public get elementEmailTextField() {
        return this.page.locator("input[id='userName']");
    }

    // short way of writing same thing:
    elementPasswordTextField = async () => this.page.locator("input[id='password']");

    public get elementLoginBtn() {
        return this.page.locator("button[id='login']");
    }

    public async enterUserName(username: string){
        const elem = this.elementEmailTextField;
        await elem?.fill(username);
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

    public async login_form(username: string, password: string) {
        await this.enterUserName(username);
        await this.enterPassword(password);
        await this.clickLoginBtn();
    }

    public get errorLoginMsg() {
        return this.page.locator("//p[@id='name']");
    }
    
}