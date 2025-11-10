import { Page } from '@playwright/test';

export class Helper {
    static async waitForNetworkIdle(page: Page, timeout = 30000) {
        await page.waitForLoadState('networkidle', { timeout });
    }

    static async takeScreenshot(page: Page, name: string) {
        await page.screenshot({ path: `test-results/screenshots/${name}.png` });
    }

    static generateRandomEmail() {
        return `test${Date.now()}@example.com`;
    }

    static generateRandomPassword(length = 12) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }

    static async waitForElement(page: Page, selector: string, timeout = 10000) {
        await page.waitForSelector(selector, { timeout });
    }
} 