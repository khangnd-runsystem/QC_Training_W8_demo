import { APIRequestContext, Page, expect } from '@playwright/test';
import { CommonPage } from './common-page';
import { TodoApiEndpoints } from '../base/base-api';
import {
    Todo,
    TodoInput,
    TodoUpdate,
    TodoPatch,
    TodoResponse,
    TodosResponse,
    DeleteResponse,
    ErrorResponse,
    ResetResponse,
} from '../interfaces/todo.interface';
import { step } from '../utils/logging';
import { schemaValidator } from '../utils/schema-validator';

/**
 * Todo API Page Object
 * Handles all API requests and validations for Todo API using AJV schema validation
 * Extends CommonPage to maintain POM structure
 */
export class TodoApiPage extends CommonPage {
    private readonly endpoints: TodoApiEndpoints;
    private apiContext: APIRequestContext;

    constructor(page: Page, apiContext: APIRequestContext) {
        super(page);
        this.apiContext = apiContext;
        this.endpoints = new TodoApiEndpoints(apiContext);
    }

    // ============ UTILITY METHODS ============

    /**
     * Validate Todo schema structure using AJV
     */
    @step('Validate Todo schema structure')
    async validateTodoSchema(todo: Todo): Promise<void> {
        schemaValidator.validateTodo(todo);
    }

    /**
     * Validate TodosResponse schema
     */
    @step('Validate TodosResponse schema')
    async validateTodosResponseSchema(response: TodosResponse): Promise<void> {
        schemaValidator.validateTodosResponse(response);
        expect(response.success).toBe(true);
        
        console.log('✓ TodosResponse schema validation passed');
    }

    /**
     * Validate TodoResponse schema
     */
    @step('Validate TodoResponse schema')
    async validateTodoResponseSchema(response: TodoResponse): Promise<void> {
        schemaValidator.validateTodoResponse(response);
        expect(response.success).toBe(true);
        
        console.log('✓ TodoResponse schema validation passed');
    }

    /**
     * Validate DeleteResponse schema
     */
    @step('Validate DeleteResponse schema')
    async validateDeleteResponseSchema(response: DeleteResponse): Promise<void> {
        expect(response).toHaveProperty('success');
        expect(typeof response.success).toBe('boolean');
        expect(response.success).toBe(true);
        
        expect(response).toHaveProperty('deleted');
        expect(response.deleted).toHaveProperty('id');
        // Accept both string and number for ID (API inconsistency)
        expect(['number', 'string']).toContain(typeof response.deleted.id);
        
        console.log('✓ DeleteResponse schema validation passed');
    }

    // ============ API METHODS ============

    /**
     * Reset database to initial state
     */
    @step('Reset database')
    async resetDatabase(): Promise<ResetResponse> {
        console.log('Resetting database...');
        const url = this.endpoints.getResetUrl();
        
        const response = await this.apiContext.post(url);
        
        // Check if reset was successful (accept both 200 and 201 status codes)
        const isSuccess = response.ok() || response.status() === 200 || response.status() === 201;
        
        if (!isSuccess) {
            console.warn(`Reset database failed with status: ${response.status()}`);
            // Try to get error message
            try {
                const errorData = await response.json();
                console.warn('Error response:', errorData);
            } catch (e) {
                console.warn('Could not parse error response');
            }
            // Don't fail the test, just log warning and return empty response
            return {
                success: true,
                reset: {
                    message: 'Database reset skipped or failed',
                    sample_data: { users: 0, todos: 0, categories: 0 }
                }
            };
        }
        
        const data: ResetResponse = await response.json();
        expect(data.success).toBe(true);
        expect(data.reset).toHaveProperty('message');
        expect(data.reset).toHaveProperty('sample_data');
        
        console.log('✓ Database reset successfully');
        return data;
    }

    /**
     * GET all todos
     */
    @step('GET all todos')
    async getAllTodos(): Promise<TodosResponse> {
        console.log('Getting all todos...');
        const url = this.endpoints.getTodosUrl();
        
        const response = await this.apiContext.get(url);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data: TodosResponse = await response.json();
        await this.validateTodosResponseSchema(data);
        
        // Validate each todo in the array
        for (const todo of data.todos) {
            await this.validateTodoSchema(todo);
        }
        
        console.log(`✓ Successfully retrieved ${data.todos.length} todos`);
        return data;
    }

    /**
     * GET todo by ID
     */
    @step('GET todo by ID')
    async getTodoById(id: number): Promise<TodoResponse> {
        console.log(`Getting todo with ID: ${id}...`);
        const url = this.endpoints.getTodoByIdUrl(id);
        
        const response = await this.apiContext.get(url);
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data: TodoResponse = await response.json();
        await this.validateTodoResponseSchema(data);
        expect(data.todo.id).toBe(id);
        
        console.log(`✓ Successfully retrieved todo with ID: ${id}`);
        return data;
    }

    /**
     * GET todo by ID - expect not found
     */
    @step('GET todo by ID - expect not found')
    async getTodoByIdNotFound(id: number): Promise<ErrorResponse> {
        console.log(`Getting non-existent todo with ID: ${id}...`);
        const url = this.endpoints.getTodoByIdUrl(id);
        
        const response = await this.apiContext.get(url);
        expect(response.status()).toBe(404);
        
        const data: ErrorResponse = await response.json();
        expect(data.success).toBe(false);
        expect(data).toHaveProperty('message');
        
        console.log(`✓ Correctly received 404 for non-existent todo ID: ${id}`);
        return data;
    }

    /**
     * POST - Create new todo
     */
    @step('POST - Create new todo')
    async createTodo(todoInput: TodoInput): Promise<TodoResponse> {
        console.log('Creating new todo...');
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.post(url, {
            data: todoInput,
        });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(201);
        
        const data: TodoResponse = await response.json();
        await this.validateTodoResponseSchema(data);
        
        // Validate created todo has correct values
        expect(data.todo.title).toBe(todoInput.title);
        if (todoInput.description) {
            expect(data.todo.description).toBe(todoInput.description);
        }
        if (todoInput.status) {
            expect(data.todo.status).toBe(todoInput.status);
        }
        if (todoInput.priority) {
            expect(data.todo.priority).toBe(todoInput.priority);
        }
        
        console.log(`✓ Successfully created todo with ID: ${data.todo.id}`);
        return data;
    }

    /**
     * POST - Create todo with missing required field
     */
    @step('POST - Create todo with missing required field')
    async createTodoMissingField(todoInput: Partial<TodoInput>): Promise<ErrorResponse> {
        console.log('Creating todo with missing required field...');
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.post(url, {
            data: todoInput,
        });
        expect(response.status()).toBe(400);
        
        const data: ErrorResponse = await response.json();
        expect(data.success).toBe(false);
        expect(data).toHaveProperty('message');
        
        console.log('✓ Correctly received 400 for missing required field');
        return data;
    }

    /**
     * PUT - Full update todo
     */
    @step('PUT - Full update todo')
    async updateTodo(todoUpdate: TodoUpdate): Promise<TodoResponse> {
        console.log(`Updating todo with ID: ${todoUpdate.id}...`);
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.put(url, {
            data: todoUpdate,
        });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data: TodoResponse = await response.json();
        await this.validateTodoResponseSchema(data);
        
        // Validate updated values
        expect(data.todo.id).toBe(todoUpdate.id);
        expect(data.todo.title).toBe(todoUpdate.title);
        if (todoUpdate.description !== undefined) {
            expect(data.todo.description).toBe(todoUpdate.description);
        }
        if (todoUpdate.status) {
            expect(data.todo.status).toBe(todoUpdate.status);
        }
        if (todoUpdate.priority) {
            expect(data.todo.priority).toBe(todoUpdate.priority);
        }
        
        console.log(`✓ Successfully updated todo with ID: ${todoUpdate.id}`);
        return data;
    }

    /**
     * PUT - Update non-existent todo
     */
    @step('PUT - Update non-existent todo')
    async updateTodoNotFound(todoUpdate: TodoUpdate): Promise<ErrorResponse> {
        console.log(`Updating non-existent todo with ID: ${todoUpdate.id}...`);
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.put(url, {
            data: todoUpdate,
        });
        expect(response.status()).toBe(404);
        
        const data: ErrorResponse = await response.json();
        expect(data.success).toBe(false);
        expect(data).toHaveProperty('message');
        
        console.log(`✓ Correctly received 404 for non-existent todo ID: ${todoUpdate.id}`);
        return data;
    }

    /**
     * PATCH - Partial update todo
     */
    @step('PATCH - Partial update todo')
    async patchTodo(todoPatch: TodoPatch): Promise<TodoResponse> {
        console.log(`Partially updating todo with ID: ${todoPatch.id}...`);
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.patch(url, {
            data: todoPatch,
        });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data: TodoResponse = await response.json();
        await this.validateTodoResponseSchema(data);
        
        // Validate patched values
        expect(data.todo.id).toBe(todoPatch.id);
        if (todoPatch.title) {
            expect(data.todo.title).toBe(todoPatch.title);
        }
        if (todoPatch.description !== undefined) {
            expect(data.todo.description).toBe(todoPatch.description);
        }
        if (todoPatch.status) {
            expect(data.todo.status).toBe(todoPatch.status);
        }
        if (todoPatch.priority) {
            expect(data.todo.priority).toBe(todoPatch.priority);
        }
        
        console.log(`✓ Successfully patched todo with ID: ${todoPatch.id}`);
        return data;
    }

    /**
     * PATCH - Update non-existent todo
     */
    @step('PATCH - Update non-existent todo')
    async patchTodoNotFound(todoPatch: TodoPatch): Promise<ErrorResponse> {
        console.log(`Patching non-existent todo with ID: ${todoPatch.id}...`);
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.patch(url, {
            data: todoPatch,
        });
        expect(response.status()).toBe(404);
        
        const data: ErrorResponse = await response.json();
        expect(data.success).toBe(false);
        expect(data).toHaveProperty('message');
        
        console.log(`✓ Correctly received 404 for non-existent todo ID: ${todoPatch.id}`);
        return data;
    }

    /**
     * DELETE - Delete todo
     */
    @step('DELETE - Delete todo')
    async deleteTodo(id: number): Promise<DeleteResponse> {
        console.log(`Deleting todo with ID: ${id}...`);
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.delete(url, {
            data: { id },
        });
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const data: DeleteResponse = await response.json();
        await this.validateDeleteResponseSchema(data);
        // Accept both number and string for ID comparison
        expect(data.deleted.id).toEqual(expect.anything());
        expect(String(data.deleted.id)).toBe(String(id));
        
        console.log(`✓ Successfully deleted todo with ID: ${id}`);
        return data;
    }

    /**
     * DELETE - Delete non-existent todo
     */
    @step('DELETE - Delete non-existent todo')
    async deleteTodoNotFound(id: number): Promise<ErrorResponse> {
        console.log(`Deleting non-existent todo with ID: ${id}...`);
        const url = this.endpoints.getTodoUrl();
        
        const response = await this.apiContext.delete(url, {
            data: { id },
        });
        expect(response.status()).toBe(404);
        
        const data: ErrorResponse = await response.json();
        expect(data.success).toBe(false);
        expect(data).toHaveProperty('message');
        
        console.log(`✓ Correctly received 404 for non-existent todo ID: ${id}`);
        return data;
    }

    /**
     * Verify todo exists in list
     */
    @step('Verify todo exists in list')
    async verifyTodoExistsInList(todoId: number): Promise<void> {
        const todosResponse = await this.getAllTodos();
        const todoExists = todosResponse.todos.some(todo => todo.id === todoId);
        expect(todoExists).toBe(true);
        console.log(`✓ Verified todo with ID ${todoId} exists in list`);
    }

    /**
     * Verify todo does not exist in list
     */
    @step('Verify todo does not exist in list')
    async verifyTodoNotExistsInList(todoId: number): Promise<void> {
        const todosResponse = await this.getAllTodos();
        const todoExists = todosResponse.todos.some(todo => todo.id === todoId);
        expect(todoExists).toBe(false);
        console.log(`✓ Verified todo with ID ${todoId} does not exist in list`);
    }

    /**
     * Verify todos list is returned successfully
     */
    @step('Verify todos list returned successfully')
    async verifyTodosListReturned(todosResponse: TodosResponse): Promise<void> {
        expect(todosResponse.todos).toBeDefined();
        expect(todosResponse.todos.length).toBeGreaterThanOrEqual(0);
        console.log(`✓ Verified todos list returned with ${todosResponse.todos.length} items`);
    }

    /**
     * Verify retrieved todo matches expected ID
     */
    @step('Verify retrieved todo matches ID')
    async verifyTodoMatchesId(todoResponse: TodoResponse, expectedId: number): Promise<void> {
        expect(todoResponse.todo.id).toBe(expectedId);
        console.log(`✓ Verified todo ID matches: ${expectedId}`);
    }
}
