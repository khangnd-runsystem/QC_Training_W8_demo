import { test } from './base-test';
import { TodoApiPage } from '../pages/todo-api-page';
import { TodoInput, TodoUpdate, TodoPatch } from '../interfaces/todo.interface';
import { BaseTest } from './base-test';

/**
 * Todo API Tests - Manual Schema Validation (không sử dụng thư viện AJV)
 * Demo cách sử dụng manual validation để kiểm tra schema
 */
test.describe('Todo API Tests - Manual Schema Validation', () => {
    let todoApiPage: TodoApiPage;
    let createdTodoId: number;
    let testData: any;
    const baseTest = new BaseTest();

    test.beforeAll(() => {
        // Load test data from JSON file
        testData = baseTest.loadDataInfo('todo-test-data.json');
    });

    test.beforeEach(async ({ page, apiContext }) => {
        // Initialize page object
        todoApiPage = new TodoApiPage(page, apiContext);
    });

    test.describe('Manual Validation - GET Method Tests', () => {
        test('TC01 - GET all todos - Manual validation', async () => {
            const response = await todoApiPage.getAllTodos();
            
            // Sử dụng manual validation thay vì AJV
            await todoApiPage.validateTodosResponseSchemaManual(response);
            
            // Validate từng todo trong array
            for (const todo of response.todos) {
                await todoApiPage.validateTodoSchemaManual(todo);
            }
        });

        test('TC02 - GET todo by valid ID - Manual validation', async () => {
            const todosResponse = await todoApiPage.getAllTodos();
            if (todosResponse.todos.length > 0) {
                const validId = todosResponse.todos[0].id;
                
                // GET todo by ID
                const url = `http://localhost:3001/api/todos/${validId}`;
                const response = await todoApiPage['apiContext'].get(url);
                const data = await response.json();
                
                // Sử dụng manual validation
                await todoApiPage.validateTodoResponseSchemaManual(data);
                await todoApiPage.validateTodoSchemaManual(data.todo);
            }
        });

        test('TC03 - GET todo by non-existent ID - Manual error validation', async () => {
            const nonExistentId = 999999;
            const url = `http://localhost:3001/api/todos/${nonExistentId}`;
            
            const response = await todoApiPage['apiContext'].get(url);
            const data = await response.json();
            
            // Sử dụng manual validation cho error response
            await todoApiPage.validateErrorResponseSchemaManual(data);
        });
    });

    test.describe('Manual Validation - POST Method Tests', () => {
        test('TC04 - POST create todo with all fields - Manual validation', async () => {
            const newTodo: TodoInput = {
                title: 'Test Manual Validation',
                description: 'Testing manual schema validation without AJV',
                status: 'pending',
                priority: 'high',
                due_date: '2025-12-31'
            };
            
            const url = 'http://localhost:3001/api/todos';
            const response = await todoApiPage['apiContext'].post(url, {
                data: newTodo,
            });
            
            const data = await response.json();
            createdTodoId = data.todo.id;
            
            // Sử dụng manual validation
            await todoApiPage.validateTodoResponseSchemaManual(data);
            await todoApiPage.validateTodoSchemaManual(data.todo);
        });

        test('TC05 - POST create todo with only required fields - Manual validation', async () => {
            const newTodo: TodoInput = {
                title: 'Minimal Todo - Manual Validation',
            };
            
            const url = 'http://localhost:3001/api/todos';
            const response = await todoApiPage['apiContext'].post(url, {
                data: newTodo,
            });
            
            const data = await response.json();
            
            // Sử dụng manual validation
            await todoApiPage.validateTodoResponseSchemaManual(data);
            await todoApiPage.validateTodoSchemaManual(data.todo);
        });

        test('TC06 - POST create todo without title - Manual error validation', async () => {
            const invalidTodo = {
                description: 'Missing title field',
                priority: 'low'
            };
            
            const url = 'http://localhost:3001/api/todos';
            const response = await todoApiPage['apiContext'].post(url, {
                data: invalidTodo,
            });
            
            const data = await response.json();
            
            // Sử dụng manual validation cho error response
            await todoApiPage.validateErrorResponseSchemaManual(data);
        });
    });

    test.describe('Manual Validation - PUT Method Tests', () => {
        test('TC07 - PUT full update todo - Manual validation', async () => {
            // Create todo first
            const newTodo: TodoInput = {
                title: 'Todo for PUT Test',
                priority: 'low',
            };
            
            const createUrl = 'http://localhost:3001/api/todos';
            const createResponse = await todoApiPage['apiContext'].post(createUrl, {
                data: newTodo,
            });
            const createData = await createResponse.json();
            const todoId = createData.todo.id;
            
            // Update todo
            const updateData: TodoUpdate = {
                id: todoId,
                title: 'Updated Todo - Manual Validation',
                description: 'Updated description',
                status: 'completed',
                priority: 'high',
            };
            
            const updateUrl = 'http://localhost:3001/api/todos';
            const updateResponse = await todoApiPage['apiContext'].put(updateUrl, {
                data: updateData,
            });
            
            const data = await updateResponse.json();
            
            // Sử dụng manual validation
            await todoApiPage.validateTodoResponseSchemaManual(data);
            await todoApiPage.validateTodoSchemaManual(data.todo);
        });
    });

    test.describe('Manual Validation - PATCH Method Tests', () => {
        test('TC08 - PATCH update only status - Manual validation', async () => {
            // Create todo first
            const newTodo: TodoInput = {
                title: 'Todo for PATCH Test',
                status: 'pending',
            };
            
            const createUrl = 'http://localhost:3001/api/todos';
            const createResponse = await todoApiPage['apiContext'].post(createUrl, {
                data: newTodo,
            });
            const createData = await createResponse.json();
            const todoId = createData.todo.id;
            
            // Patch todo
            const patchData: TodoPatch = {
                id: todoId,
                status: 'completed',
            };
            
            const patchUrl = 'http://localhost:3001/api/todos';
            const patchResponse = await todoApiPage['apiContext'].patch(patchUrl, {
                data: patchData,
            });
            
            const data = await patchResponse.json();
            
            // Sử dụng manual validation
            await todoApiPage.validateTodoResponseSchemaManual(data);
            await todoApiPage.validateTodoSchemaManual(data.todo);
        });
    });

    test.describe('Manual Validation - DELETE Method Tests', () => {
        test('TC09 - DELETE existing todo - Manual validation', async () => {
            // Create todo first
            const newTodo: TodoInput = {
                title: 'Todo to Delete - Manual Validation',
            };
            
            const createUrl = 'http://localhost:3001/api/todos';
            const createResponse = await todoApiPage['apiContext'].post(createUrl, {
                data: newTodo,
            });
            const createData = await createResponse.json();
            const todoId = createData.todo.id;
            
            // Delete todo
            const deleteUrl = 'http://localhost:3001/api/todos';
            const deleteResponse = await todoApiPage['apiContext'].delete(deleteUrl, {
                data: { id: todoId },
            });
            
            const data = await deleteResponse.json();
            
            // Sử dụng manual validation
            await todoApiPage.validateDeleteResponseSchemaManual(data);
        });

        test('TC10 - DELETE non-existent todo - Manual error validation', async () => {
            const nonExistentId = 999999;
            
            const deleteUrl = 'http://localhost:3001/api/todos';
            const deleteResponse = await todoApiPage['apiContext'].delete(deleteUrl, {
                data: { id: nonExistentId },
            });
            
            const data = await deleteResponse.json();
            
            // Sử dụng manual validation cho error response
            await todoApiPage.validateErrorResponseSchemaManual(data);
        });
    });

    test.describe('Manual Validation - Reset Database Tests', () => {
        test('TC11 - Reset database - Manual validation', async () => {
            const resetUrl = 'http://localhost:3001/api/reset';
            const response = await todoApiPage['apiContext'].post(resetUrl);
            
            if (response.ok() || response.status() === 200 || response.status() === 201) {
                const data = await response.json();
                
                // Sử dụng manual validation
                await todoApiPage.validateResetResponseSchemaManual(data);
            }
        });
    });
});
