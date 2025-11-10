import { expect, Locator, Page } from '@playwright/test';

import { step } from '../utils/logging';
import { CommonLocators } from '../locators/common-locators';
import { Helper } from '@/utils/helper';

export class CommonPage {

    readonly commonLocators: CommonLocators;
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.commonLocators = new CommonLocators(page);
    }

    // Group: Navigation
    /**
     * Navigate to a URL with optional load state
     * @param url - The URL to navigate to
     * @param loadState - The desired load state to wait for (default: 'domcontentloaded')
     */
    @step((url) => `Navigate to URL: ${url}`)
    async navigate(url: string, loadState: 'load' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded'): Promise<void> {
        console.log(`Navigating to URL: ${url}`);
        await this.page.goto(url);
        await this.page.waitForLoadState(loadState);
    }

    // Group: Interaction
    /**
     * Click on Locator
     * @param locator
     */
    @step((locator) => `Click on locator: ${locator}`)
    async click(locator: Locator, option?: object): Promise<void> {
        await expect.soft(locator.first()).toBeVisible();
        await expect.soft(locator.first()).toBeEnabled();
        if (await locator.first().isEnabled()) {
            const att = await this.getAttribute(locator, 'disabled');
            if (att !== 'disabled') {
                await locator.first().click(option);
                await this.page.waitForLoadState();
            }
        }
    }

    /**
     * Fill input value
     * @param locator
     * @param value
     */
    //@step('Fill input value')
    @step((locator, value) => `Fill input value: Locator=${locator}, Value=${value}`)
    async fill(locator: Locator, value: string, force: boolean = true): Promise<void> {
        await expect.soft(locator).toBeVisible();
        if (await locator.isEditable() && await locator.isEnabled()) {
            await locator.clear();
            await locator.click();
            await locator.fill(value, { force });
        }
    }

    /**
     * Check on checkbox or radio button
     *
     */
    @step((locator) => `Check checkbox/radio button: ${locator}`)
    async check(locator: Locator): Promise<void> {
        await locator.check();
    }

    /**
     * Uncheck on checkbox or radio button
     *
     */
    @step((locator) => `Uncheck checkbox/radio button: ${locator}`)
    async uncheck(locator: Locator): Promise<void> {
        await locator.uncheck();
    }

    /**
     * Click on Text
     * @param text
     */
    @step((text) => `Click on Text: ${text}`)
    async clickByText(text: string): Promise<void> {
        await this.page.getByText(text).click();
    }

    /**
     * Double Click on Locator
     * @param locator
     */
    @step((locator) => `Double Click on Locator: ${locator}`)
    async dblclick(locator: Locator, option?: object): Promise<void> {
        await expect.soft(locator.first()).toBeVisible();
        await expect.soft(locator.first()).toBeEnabled();
        if (await locator.first().isEnabled()) {
            const att = await this.getAttribute(locator, 'disabled');
            if (att !== 'disabled') {
                await locator.first().dblclick(option);
                await this.page.waitForLoadState();
            }
        }
    }

    /**
     * Hover over a Locator
     * @param locator
     */
    @step((locator) => `Hover over Locator: ${locator}`)
    async hover(locator: Locator): Promise<void> {
        await expect.soft(locator).toBeVisible();
        await locator.hover();
    }

    /**
     * Focuses the element, and then uses keyevents
     * @param locator
     * @param key
     */
    @step((locator, key) => `Focus on locator: ${locator} and press key: ${key}`)
    async press(locator: Locator, key: string): Promise<void> {
        await locator.first().press(key);
        await this.page.waitForLoadState();
    }

    /**
     * Fill input value if it is defined in form
     * @param inputLocator
     * @param value
     */
    @step((inputLocator, value) => `Fill input if visible: Locator=${inputLocator}, Value=${value}`)
    async fillInputIfVisible(inputLocator: Locator, value: string): Promise<void> {
        if (value && await this.count(inputLocator) > 0) {
            await this.scrollIntoView(inputLocator);
            await this.fill(inputLocator, value);
        }
    }

    /**
     * Clear input field
     * @param locator
     */
    @step((locator) => `Clear input field: Locator=${locator}`)
    async clearInput(locator: Locator): Promise<void> {
        await locator.fill('');
    }

    /**
     * Select an option from a dropdown by visible text
     * @param locator
     * @param optionText
     */
    @step((locator, optionText) => `Select dropdown option by text: Locator=${locator}, OptionText=${optionText}`)
    async selectOptionByText(locator: Locator, optionText: string): Promise<void> {
        await locator.selectOption({ label: optionText });
    }

    /**
     * Upload a file to a file input field
     * @param locator
     * @param filePath
     */
    @step((locator, filePath) => `Upload a file to a file input field: Locator=${locator}, FilePath=${filePath}`)
    async uploadFile(locator: Locator, filePath: string): Promise<void> {
        await expect.soft(locator).toBeVisible();
        await locator.setInputFiles(filePath);
    }

    // Group: Validation
    /**
     * Check Locator is visible or not
     * @param locator
     * @returns
     */
    @step((locator) => `Check Locator is visible or not: Locator=${locator}`)
    async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }

    /**
     * Check Locator is enabled or not
     * @param locator
     * @returns
     */
    @step((locator) => `Check Locator is enabled or not: Locator=${locator}`)
    async isEnabled(locator: Locator): Promise<boolean> {
        return await locator.isEnabled();
    }

    /**
     * Check Locator is editable or not
     * @param locator
     * @returns
     */
    @step((locator) => `Check Locator is editable or not: Locator=${locator}`)
    async isEditable(locator: Locator): Promise<boolean> {
        return await locator.isEditable();
    }

    /**
     * Verify the current URL matches the expected URL
     * @param expectedURL
     */
    @step('Verify the current URL matches the expected URL')
    async verifyURL(expectedURL: string): Promise<void> {
        await expect(this.page).toHaveURL(expectedURL);
    }

    /**
     * Wait for a specific text to appear in a locator
     * @param locator
     * @param text
     */
    @step((locator, text) => `Wait for text to appear in locator: Locator=${locator}, Text=${text}`)
    async waitForText(locator: Locator, text: string): Promise<void> {
        await expect(locator).toHaveText(text);
    }

    /**
     * Wait Locator with visible state
     * @param locator
     * @returns
     */
    @step((locator) => `Wait Locator with visible state: Locator=${locator}`)
    async waitForVisible(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'visible' });
    }

    /**
     * Wait Locator with attached state
     * @param locator
     * @returns
     */
    @step((locator) => `Wait Locator with attached state: Locator=${locator}`)
    async waitForAttached(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'attached' });
    }

    /**
     * Wait Locator with detached state
     * @param locator
     * @returns
     */
    @step((locator) => `Wait Locator with detached state: Locator=${locator}`)
    async waitForDetached(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'detached', timeout: 40000 });
    }

    /**
     * Wait Locator with hidden state
     * @param locator
     * @returns
     */
    @step((locator) => `Wait Locator with hidden state: Locator=${locator}`)
    async waitForHidden(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'hidden' });
    }

    /**
     * Wait for an element to disappear
     * @param locator
     */
    @step((locator) => `Wait for an element to disappear: Locator=${locator}`)
    async waitForElementToDisappear(locator: Locator): Promise<void> {
        await locator.waitFor({ state: 'hidden' });
    }

    /**
     * Wait for a Locator to be enabled
     * @param locator
     */
    @step((locator) => `Wait for Locator to be enabled: Locator=${locator}`)
    async waitForElementToBeEnabled(locator: Locator): Promise<void> {
        for (let i = 0; i < 10; i++) {
            if (await locator.isEnabled()) return;
            await this.page.waitForTimeout(500); // Wait for 500ms before retrying
        }
        throw new Error('Locator did not become enabled within the expected time');
    }

    /**
     * Retry clicking on a Locator
     * @param locator
     * @param retries - Number of retry attempts (default: 3)
     */
    @step((locator, retries) => `Retry clicking on Locator: Locator=${locator}, Retries=${retries}`)
    async retryClick(locator: Locator, retries: number = 3): Promise<void> {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                await this.click(locator);
                return;
            } catch (error) {
                console.warn(`Retry ${attempt + 1} failed for clicking on Locator. Retrying...`);
                if (attempt === retries - 1) throw error;
            }
        }
    }

    // Group: Utility
    /**
     * Take a screenshot of the current page
     * @param name - The name of the screenshot file
     */
    @step('Take a screenshot of the current page')
    async takeScreenshot(name: string): Promise<void> {
        if (this.page.isClosed()) {
            console.warn(`Cannot take screenshot, the page is already closed.`);
            return;
        }
        await Helper.takeScreenshot(this.page, name);
    }

    /**
     * Get current text of locator
     * @param locator
     * @returns
     */
    @step((locator) => `Get text of locator: Locator=${locator}`)
    async getText(locator: Locator): Promise<string> {
        const text = await locator.textContent();
        return text ?? '';
    }

    /**
     * Get text by label
     * @param label
     * @returns
     */
    @step((label) => `Get text by label: Label=${label}`)
    async getTextByLabel(label: string): Promise<string> {
        const text = await this.page.getByLabel(label).textContent();
        return text ?? '';
    }

    /**
     * Get input value
     * @param locator
     * @returns
     */
    @step((locator) => `Get input value: Locator=${locator}`)
    async getInputValue(locator: string): Promise<string> {
        return await this.page.locator(locator).inputValue();
    }

    /**
     * Check Locator attribute
     * @param locator
     * @param attribute
     * @returns
     */
    @step((locator, attribute) => `Check Locator attribute: Locator=${locator}, Attribute=${attribute}`)
    async getAttribute(locator: Locator, attribute: string): Promise<string> {
        return await locator.first().getAttribute(attribute) ?? '';
    }

    /**
     * Expect Locator to be hidden
     * @param locator
     */
    @step('Expect Locator to be hidden')
    async toBeHidden(locator: Locator): Promise<void> {
        await expect.soft(locator).toBeHidden();
    }

    /**
     * Scroll an element into view with logging
     * @param locator
     */
    @step((locator) => `Scroll an element into view: Locator=${locator}`)
    async scrollIntoView(locator: Locator): Promise<void> {
        await expect.soft(locator).toBeVisible();
        console.log('Scrolling element into view');
        await locator.scrollIntoViewIfNeeded();
    }

    /**
     * Get the count of elements matching the locator with logging
     * @param locator
     * @returns
     */
    @step((locator) => `Get the count of elements matching the locator: Locator=${locator}`)
    async count(locator: Locator): Promise<number> {
        const count = await locator.count();
        console.log(`Counted ${count} elements matching the locator`);
        return count;
    }

    /**
     * Get Text of Locator with logging
     * @param locator
     * @param trim - Whether to trim whitespace (default: true)
     * @returns
     */
    @step((locator, trim) => `Get Text of Locator: Locator=${locator}, Trim=${trim}`)
    async textContent(locator: Locator, trim: boolean = true): Promise<string> {
        await expect.soft(locator).toBeVisible();
        const content = await locator.first().textContent() ?? '';
        const result = trim ? content.trim() : content;
        console.log(`Text content of Locator: ${result}`);
        return result;
    }

    /**
     * Get Inner Text of Locator, if errors, return ''
     * @param locator
     * @returns
     */
    @step((locator) => `Get Inner Text of Locator: Locator=${locator}`)
    async innerText(locator: Locator): Promise<string> {
        return (await locator.first().innerText())?.trim() ?? '';
    }

    /**
     * Check if a Locator contains a specific text
     * @param locator
     * @param text
     * @returns
     */
    @step((locator, text) => `Check if a Locator contains a specific text: Locator=${locator}, Text=${text}`)
    async checkContainsText(locator: Locator, text: string): Promise<boolean> {
        const content = await locator.textContent() ?? '';
        return content?.includes(text) ?? false;
    }
}