import { APIRequestContext } from '@playwright/test';

/**
 * Base API Configuration
 * Contains base URL and common API utilities
 */
export abstract class BaseApiEndpoints {
    protected readonly baseUrl: string;
    protected apiContext: APIRequestContext;

    constructor(apiContext: APIRequestContext, baseUrl: string) {
        this.apiContext = apiContext;
        this.baseUrl = baseUrl;
    }

    /**
     * Get full URL for an endpoint
     */
    protected getFullUrl(endpoint: string): string {
        return `${this.baseUrl}${endpoint}`;
    }
}

/**
 * Todo API Endpoints
 * Contains all endpoint configurations for Todo API
 */
export class TodoApiEndpoints extends BaseApiEndpoints {
    // API Endpoints
    private readonly endpoints = {
        todos: '/todos.php',
        todo: '/todo.php',
        reset: '/reset.php',
    };

    constructor(apiContext: APIRequestContext) {
        super(apiContext, 'https://material.playwrightvn.com/api/todo-app/v1');
    }

    /**
     * Get todos endpoint URL (GET all todos)
     */
    getTodosUrl(): string {
        return this.getFullUrl(this.endpoints.todos);
    }

    /**
     * Get todo endpoint URL (POST/PUT/PATCH/DELETE)
     */
    getTodoUrl(): string {
        return this.getFullUrl(this.endpoints.todo);
    }

    /**
     * Get todo by ID URL (GET single todo)
     */
    getTodoByIdUrl(id: number): string {
        return `${this.getTodoUrl()}?id=${id}`;
    }

    /**
     * Get reset endpoint URL (POST reset database)
     */
    getResetUrl(): string {
        return this.getFullUrl(this.endpoints.reset);
    }
}
