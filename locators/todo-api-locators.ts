import { Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

/**
 * Todo API Locators
 * Stores API endpoint URLs as "locators" for API testing
 */
export class TodoApiLocators extends CommonLocators {
    // Base URL for API
    public readonly baseUrl: string;

    // API Endpoints
    public readonly endpoints: {
        todos: string;
        todo: string;
        reset: string;
    };

    constructor(page: Page) {
        super(page);
        this.baseUrl = 'https://material.playwrightvn.com/api/todo-app/v1';
        this.endpoints = {
            todos: '/todos.php',
            todo: '/todo.php',
            reset: '/reset.php',
        };
    }

    /**
     * Get full URL for an endpoint
     */
    getEndpointUrl(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`;
    }

    /**
     * Get todos endpoint URL
     */
    getTodosUrl(): string {
        return this.getEndpointUrl(this.endpoints.todos);
    }

    /**
     * Get todo endpoint URL
     */
    getTodoUrl(): string {
        return this.getEndpointUrl(this.endpoints.todo);
    }

    /**
     * Get todo by ID URL
     */
    getTodoByIdUrl(id: number): string {
        return `${this.getTodoUrl()}?id=${id}`;
    }

    /**
     * Get reset endpoint URL
     */
    getResetUrl(): string {
        return this.getEndpointUrl(this.endpoints.reset);
    }

    protected initializeLocators(): void {
        super.initializeLocators();
        // Additional initialization if needed
    }
}
