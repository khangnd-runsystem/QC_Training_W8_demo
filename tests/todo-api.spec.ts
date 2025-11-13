import { test } from './base-test';
import { TodoApiPage } from '../pages/todo-api-page';
import { TodoInput, TodoUpdate, TodoPatch } from '../interfaces/todo.interface';
import { BaseTest } from './base-test';

test.describe('Todo API Tests - Schema Validation & CRUD Operations', () => {
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

    // Reset database once at the beginning
    test.describe.serial('Setup', () => {
        test('TC00 - Reset database for initial state', async () => {
            await todoApiPage.resetDatabase();
        });
    });

    test.describe('GET Method Tests', () => {
        test('TC01 - GET all todos returns list successfully', async () => {
            const response = await todoApiPage.getAllTodos();
            await todoApiPage.verifyTodosListReturned(response);
        });

        test('TC02 - GET todo by valid ID returns correct todo', async () => {
            const todosResponse = await todoApiPage.getAllTodos();
            if (todosResponse.todos.length > 0) {
                const validId = todosResponse.todos[0].id;
                const response = await todoApiPage.getTodoById(validId);
                await todoApiPage.verifyTodoMatchesId(response, validId);
            }
        });

        test('TC03 - GET todo by non-existent ID returns 404', async () => {
            await todoApiPage.getTodoByIdNotFound(testData.getTodos.notFoundId);
        });
    });

    test.describe('POST Method Tests', () => {
        test('TC04 - POST create todo with all fields', async () => {
            const newTodo: TodoInput = testData.createTodos.fullTodo;
            const response = await todoApiPage.createTodo(newTodo);
            createdTodoId = response.todo.id;
            
            // Verify todo exists in list
            await todoApiPage.verifyTodoExistsInList(createdTodoId);
        });

        test('TC05 - POST create todo with only required fields', async () => {
            const newTodo: TodoInput = testData.createTodos.minimalTodo;
            await todoApiPage.createTodo(newTodo);
        });

        test('TC06 - POST create todo without required title returns 400', async () => {
            const invalidTodo = testData.createTodos.invalidTodo;
            await todoApiPage.createTodoMissingField(invalidTodo);
        });

        test('TC07 - POST create todo with different priority levels', async () => {
            const priorities: ('low' | 'medium' | 'high')[] = testData.createTodos.priorities;
            
            for (const priority of priorities) {
                const newTodo: TodoInput = {
                    title: `Todo with ${priority} priority`,
                    priority: priority,
                };
                await todoApiPage.createTodo(newTodo);
            }
        });

        test('TC08 - POST create todo with different status values', async () => {
            const statuses: ('pending' | 'in_progress' | 'completed')[] = testData.createTodos.statuses;
            
            for (const status of statuses) {
                const newTodo: TodoInput = {
                    title: `Todo with ${status} status`,
                    status: status,
                };
                await todoApiPage.createTodo(newTodo);
            }
        });
    });

    test.describe('PUT Method Tests', () => {
        test('TC09 - PUT full update existing todo', async () => {
            // Create a new todo first
            const newTodo: TodoInput = testData.updateTodos.fullUpdate.create;
            const createResponse = await todoApiPage.createTodo(newTodo);
            const todoId = createResponse.todo.id;
            
            // Now update it
            const updateData: TodoUpdate = {
                id: todoId,
                ...testData.updateTodos.fullUpdate.update
            };
            await todoApiPage.updateTodo(updateData);
            
            // Verify updated values by getting the todo
            await todoApiPage.getTodoById(todoId);
        });

        test('TC10 - PUT update with minimal required fields', async () => {
            const updateData: TodoUpdate = testData.updateTodos.minimalUpdate;
            await todoApiPage.updateTodo(updateData);
        });

        test('TC11 - PUT update non-existent todo returns 404', async () => {
            const updateData: TodoUpdate = testData.updateTodos.notFoundUpdate;
            await todoApiPage.updateTodoNotFound(updateData);
        });

        test('TC12 - PUT update todo status from pending to completed', async () => {
            const updateData: TodoUpdate = testData.updateTodos.statusUpdate;
            await todoApiPage.updateTodo(updateData);
        });
    });

    test.describe('PATCH Method Tests', () => {
        test('TC13 - PATCH update only todo status', async () => {
            // Create a new todo first
            const newTodo: TodoInput = testData.patchTodos.statusPatch.create;
            const createResponse = await todoApiPage.createTodo(newTodo);
            const todoId = createResponse.todo.id;
            
            // Now patch it
            const patchData: TodoPatch = {
                id: todoId,
                ...testData.patchTodos.statusPatch.patch
            };
            await todoApiPage.patchTodo(patchData);
        });

        test('TC14 - PATCH update only todo priority', async () => {
            const patchData: TodoPatch = testData.patchTodos.priorityPatch;
            await todoApiPage.patchTodo(patchData);
        });

        test('TC15 - PATCH update multiple fields', async () => {
            const patchData: TodoPatch = testData.patchTodos.multipleFieldsPatch;
            await todoApiPage.patchTodo(patchData);
        });

        test('TC16 - PATCH update non-existent todo returns 404', async () => {
            const patchData: TodoPatch = testData.patchTodos.notFoundPatch;
            await todoApiPage.patchTodoNotFound(patchData);
        });

        test('TC17 - PATCH update todo description to null', async () => {
            const patchData: TodoPatch = testData.patchTodos.descriptionNullPatch;
            await todoApiPage.patchTodo(patchData);
        });
    });

    test.describe('DELETE Method Tests', () => {
        test('TC18 - DELETE existing todo successfully', async () => {
            // Create a new todo first
            const newTodo: TodoInput = testData.deleteTodos.todoToDelete;
            const createResponse = await todoApiPage.createTodo(newTodo);
            const todoId = createResponse.todo.id;
            
            // First verify todo exists
            await todoApiPage.getTodoById(todoId);
            
            // Delete the todo
            await todoApiPage.deleteTodo(todoId);
            
            // Verify todo no longer exists
            await todoApiPage.getTodoByIdNotFound(todoId);
        });

        test('TC19 - DELETE non-existent todo returns 404', async () => {
            await todoApiPage.deleteTodoNotFound(testData.deleteTodos.notFoundId);
        });

        test('TC20 - DELETE todo and verify it is removed from list', async () => {
            const todoId = testData.deleteTodos.existingId;
            
            // Verify todo exists in list
            await todoApiPage.verifyTodoExistsInList(todoId);
            
            // Delete the todo
            await todoApiPage.deleteTodo(todoId);
            
            // Verify todo is removed from list
            await todoApiPage.verifyTodoNotExistsInList(todoId);
        });

        test('TC21 - DELETE multiple todos sequentially', async () => {
            const ids = testData.deleteTodos.sequentialIds;
            for (const id of ids) {
                await todoApiPage.deleteTodo(id);
            }
        });
    });

    test.describe('Complete CRUD Workflow Tests', () => {
        test('TC22 - Complete CRUD workflow: Create -> Read -> Update -> Delete', async () => {
            // CREATE
            const newTodo: TodoInput = testData.crudWorkflow.create;
            const createResponse = await todoApiPage.createTodo(newTodo);
            const todoId = createResponse.todo.id;
            
            // READ
            await todoApiPage.getTodoById(todoId);
            await todoApiPage.verifyTodoExistsInList(todoId);
            
            // UPDATE (PUT)
            const updateData: TodoUpdate = {
                id: todoId,
                ...testData.crudWorkflow.update
            };
            await todoApiPage.updateTodo(updateData);
            
            // UPDATE (PATCH)
            const patchData: TodoPatch = {
                id: todoId,
                ...testData.crudWorkflow.patch
            };
            await todoApiPage.patchTodo(patchData);
            
            // DELETE
            await todoApiPage.deleteTodo(todoId);
            await todoApiPage.getTodoByIdNotFound(todoId);
        });

        test('TC23 - Create multiple todos and verify in list', async () => {
            const todos: TodoInput[] = testData.multipleTodos;
            
            const createdIds: number[] = [];
            for (const todo of todos) {
                const response = await todoApiPage.createTodo(todo);
                createdIds.push(response.todo.id);
            }
            
            // Verify all created todos exist in list
            for (const id of createdIds) {
                await todoApiPage.verifyTodoExistsInList(id);
            }
        });
    });

    test.describe('Database Reset Tests', () => {
        test('TC24 - Reset database restores sample data', async () => {
            // Reset database
            const resetResponse = await todoApiPage.resetDatabase();
            
            // Verify sample data is restored by getting todos
            await todoApiPage.getAllTodos();
        });

        test('TC25 - Reset database after creating todos', async () => {
            // Create some todos
            const newTodo: TodoInput = testData.resetTest.todoBeforeReset;
            await todoApiPage.createTodo(newTodo);
            
            // Reset database
            await todoApiPage.resetDatabase();
            
            // Verify original sample data is present
            await todoApiPage.getAllTodos();
        });
    });
});
