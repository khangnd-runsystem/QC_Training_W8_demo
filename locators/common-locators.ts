import { Page } from '@playwright/test';

export class CommonLocators {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
        this.initializeLocators();
    }

    public setPage(newPage: Page): void {
        if (newPage !== this.page) {
            this.page = newPage;
            this.initializeLocators();
        }
    }

    public getPage(): Page {
        return this.page;
    }

    protected initializeLocators(): void {

    }

}