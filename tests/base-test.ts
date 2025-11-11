import { JSONHandling } from '../utils/json-file';

import { test as baseTest, APIRequestContext } from '@playwright/test';
// import { LoginPage, InventoryPage,  CartPage, CheckoutPage, MenuPage, NavbarComponent, LoginModal, HomePage, ProductDetailPage, DemoBlazeCartPage, CheckoutModal} from '../pages/index';
import { TodoApiPage } from '../pages/todo-api-page';

//Export
export { expect } from '@playwright/test';

type MyFixtures = {
    // loginPage: LoginPage;
    // inventoryPage: InventoryPage;
    // cartPage: CartPage; 
    // checkoutPage: CheckoutPage;
    // menuPage: MenuPage;
    // // DemoBlaze fixtures
    // navbar: NavbarComponent;
    // loginModal: LoginModal;
    // homePage: HomePage;
    // productDetailPage: ProductDetailPage;
    // demoBlazeCartPage: DemoBlazeCartPage;
    // checkoutModal: CheckoutModal;
    // Todo API fixtures
    apiContext: APIRequestContext;
    todoApiPage: TodoApiPage;
}

export const test = baseTest.extend<MyFixtures>(
    {
    // loginPage: async ({ page }, use) => {
    //     await use(new LoginPage(page));
    // },
    // inventoryPage: async ({ page }, use) => {
    //     await use(new InventoryPage(page));
    // },
    // cartPage: async ({ page }, use) => {
    //     await use(new CartPage(page));
    // },
    // checkoutPage: async ({ page }, use) => {
    //     await use(new CheckoutPage(page));
    // },
    // menuPage: async ({ page }, use) => {
    //     await use(new MenuPage(page));
    // },
    // // DemoBlaze fixtures
    // navbar: async ({ page }, use) => {
    //     await use(new NavbarComponent(page));
    // },
    // loginModal: async ({ page }, use) => {
    //     await use(new LoginModal(page));
    // },
    // homePage: async ({ page }, use) => {
    //     await use(new HomePage(page));
    // },
    // productDetailPage: async ({ page }, use) => {
    //     await use(new ProductDetailPage(page));
    // },
    // demoBlazeCartPage: async ({ page }, use) => {
    //     await use(new DemoBlazeCartPage(page));
    // },
    // checkoutModal: async ({ page }, use) => {
    //     await use(new CheckoutModal(page));
    // },
    // Todo API fixtures
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
    todoApiPage: async ({ page, apiContext }, use) => {
        await use(new TodoApiPage(page, apiContext));
    }

});


export class BaseTest {

    loadDataInfo(filePath: string): any {
        const jh = new JSONHandling();
        const testEnv = process.env.TEST_ENV || 'dev'; // Default to 'dev' if TEST_ENV is not set
        const fullPath = `../data/${testEnv}/${filePath}`; // Corrected path concatenation

        try {
            const dataInfo = jh.readJSONFile(fullPath);
            if (dataInfo) {
                console.log(`Data loaded successfully from file ${fullPath}`);
                return dataInfo;
            } else {
                console.error(`Error: Unable to read data from file ${fullPath}`);
            }
        } catch (error) {
            console.error(`Exception occurred while reading file ${fullPath}:`, error);
        }

        return null;
    }

}
