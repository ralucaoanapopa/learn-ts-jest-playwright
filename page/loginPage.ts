import { Page } from "playwright";
import BasePage from "./basePage";

export default class LoginPage extends BasePage {
    public loginPage = 'login';
    public profilePage = 'profile';

    constructor(page: Page) {
        super(page);
    }

    async navigate(){
        await super.navigate(this.loginPage);
    }

    public get loginURL() {
        return LoginPage.baseURL + this.loginPage;
    }

    public get profileURL() {
        return LoginPage.baseURL + this.profilePage;
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
        return this.page.locator("//p[@id='name']");
    }
    
}