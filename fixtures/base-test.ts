import { test as base, APIRequestContext } from '@playwright/test';

type BaseTestFixtures = {
    apiContext: APIRequestContext;
};

/**
 * Custom test fixture with API request context
 * Usage: import { test, expect } from '../fixtures/base-test';
 */
export const test = base.extend<BaseTestFixtures>({
    apiContext: async ({ playwright }, use) => {
        const context = await playwright.request.newContext({
            baseURL: 'https://material.playwrightvn.com/api/todo-app/v1',
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        await use(context);
        await context.dispose();
    },
});

export { expect } from '@playwright/test';
