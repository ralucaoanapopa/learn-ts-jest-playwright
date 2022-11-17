import { Page } from "playwright";
import * as data from '../data/variables.json';

export default class BasePage {
    public page: Page;
    static baseURL: string = data.baseURLDemoQA;

    constructor(page: Page){
        this.page = page;
    }
    
    async navigate(path: string){
        await this.page.goto(`${BasePage.baseURL}${path}`);
    }
}