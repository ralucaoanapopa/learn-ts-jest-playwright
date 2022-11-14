import { Page } from "playwright";

export default class LoginPage {

    private page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    public get elementEmailTextField() {
        return this.page.locator("input[id='userName']");
    }

    public get elementPasswordTextField() {
        return this.page.locator("input[id='password']");
    }

    public get elementLoginBtn() {
        return this.page.locator("button[id='login']");
    }

    public async enterUserName(username: string){
        const elem = await this.elementEmailTextField;
        await elem?.fill(username);
    }

    public async enterPassword(password: string){
        const elem = await this.elementPasswordTextField;
        await elem?.fill(password);
    }

    public async clickLoginBtn(){
        const elem = await this.elementLoginBtn;
        await elem?.click();
    }

    public async login_form(username: string, password: string) {
        await this.enterUserName(username);
        await this.enterPassword(password);
        await this.clickLoginBtn();
    }   
    
}