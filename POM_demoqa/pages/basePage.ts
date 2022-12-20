import { Page } from "playwright";
import * as data from '../../data/variables.json';

export default class BasePage {
    public page: Page;
    readonly baseURL: string = data.baseURLDemoQA;
    readonly loginPage = 'login';
    readonly profilePage = 'profile';
    readonly booksPage = 'books';

    constructor(page: Page){
        this.page = page;
    }
    
    async navigate(path: string){
        await this.page.goto(`${this.baseURL}${path}`);
    }

    public get loginURL() {
        return this.baseURL + this.loginPage;
    }

    public get profileURL() {
        return this.baseURL + this.profilePage;
    }

    public get booksURL() {
        return this.baseURL + this.booksPage;
    }
}