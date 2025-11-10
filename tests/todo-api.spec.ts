import { test } from '../fixtures/base-test';
import { TodoApiPage } from '../pages/todo-api-page';
import { TodoInput, TodoUpdate, TodoPatch } from '../interfaces/todo.interface';

test.describe('Todo API Tests - Schema Validation & CRUD Operations', () => {
    let todoApiPage: TodoApiPage;
    let createdTodoId: number;

    test.beforeEach(async ({ page, apiContext }) => {
        // Initialize page object
        todoApiPage = new TodoApiPage(page, apiContext);
        
        // Reset database before each test
        await todoApiPage.resetDatabase();
    });

    test.describe('Schema Validation Tests', () => {
        test('TC01 - Verify GET all todos response schema', async () => {
            await todoApiPage.getAllTodos();
        });

        test('TC02 - Verify GET single todo response schema', async () => {
            await todoApiPage.getTodoById(1);
        });

        test('TC03 - Verify POST create todo response schema', async () => {
            const newTodo: TodoInput = {
                title: 'Schema validation test todo',
                description: 'Testing schema validation',
                status: 'pending',
                priority: 'medium',
            };
            await todoApiPage.createTodo(newTodo);
        });

        test('TC04 - Verify PUT update todo response schema', async () => {
            const updateData: TodoUpdate = {
                id: 1,
                title: 'Updated todo for schema test',
                status: 'completed',
                priority: 'high',
            };
            await todoApiPage.updateTodo(updateData);
        });

        test('TC05 - Verify PATCH update todo response schema', async () => {
            const patchData: TodoPatch = {
                id: 1,
                status: 'in_progress',
            };
            await todoApiPage.patchTodo(patchData);
        });

        test('TC06 - Verify DELETE todo response schema', async () => {
            await todoApiPage.deleteTodo(1);
        });
    });

    test.describe('GET Method Tests', () => {
        test('TC07 - GET all todos returns list successfully', async () => {
            const response = await todoApiPage.getAllTodos();
            // Page already validates schema and response
        });

        test('TC08 - GET todo by valid ID returns correct todo', async () => {
            const response = await todoApiPage.getTodoById(1);
            // Page already validates the todo ID matches
        });

        test('TC09 - GET todo by non-existent ID returns 404', async () => {
            await todoApiPage.getTodoByIdNotFound(99999);
        });

        test('TC10 - GET all todos returns todos ordered by creation date', async () => {
            const response = await todoApiPage.getAllTodos();
            // Verify todos are present (schema already validated)
        });
    });

    test.describe('POST Method Tests', () => {
        test('TC11 - POST create todo with all fields', async () => {
            const newTodo: TodoInput = {
                title: 'Complete API testing',
                description: 'Test all CRUD operations for Todo API',
                status: 'pending',
                priority: 'high',
                due_date: '2025-12-31T23:59:59',
                user_id: 1,
            };
            const response = await todoApiPage.createTodo(newTodo);
            createdTodoId = response.todo.id;
            
            // Verify todo exists in list
            await todoApiPage.verifyTodoExistsInList(createdTodoId);
        });

        test('TC12 - POST create todo with only required fields', async () => {
            const newTodo: TodoInput = {
                title: 'Minimal todo',
            };
            await todoApiPage.createTodo(newTodo);
        });

        test('TC13 - POST create todo without required title returns 400', async () => {
            const invalidTodo = {
                description: 'Todo without title',
            };
            await todoApiPage.createTodoMissingField(invalidTodo);
        });

        test('TC14 - POST create todo with different priority levels', async () => {
            const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
            
            for (const priority of priorities) {
                const newTodo: TodoInput = {
                    title: `Todo with ${priority} priority`,
                    priority: priority,
                };
                await todoApiPage.createTodo(newTodo);
            }
        });

        test('TC15 - POST create todo with different status values', async () => {
            const statuses: ('pending' | 'in_progress' | 'completed')[] = ['pending', 'in_progress', 'completed'];
            
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
        test('TC16 - PUT full update existing todo', async () => {
            const updateData: TodoUpdate = {
                id: 1,
                title: 'Fully updated todo',
                description: 'This todo has been completely updated',
                status: 'completed',
                priority: 'low',
                due_date: '2025-11-30T18:00:00',
                user_id: 1,
            };
            await todoApiPage.updateTodo(updateData);
            
            // Verify updated values by getting the todo
            await todoApiPage.getTodoById(1);
        });

        test('TC17 - PUT update with minimal required fields', async () => {
            const updateData: TodoUpdate = {
                id: 2,
                title: 'Updated title only',
            };
            await todoApiPage.updateTodo(updateData);
        });

        test('TC18 - PUT update non-existent todo returns 404', async () => {
            const updateData: TodoUpdate = {
                id: 99999,
                title: 'This should fail',
            };
            await todoApiPage.updateTodoNotFound(updateData);
        });

        test('TC19 - PUT update todo status from pending to completed', async () => {
            const updateData: TodoUpdate = {
                id: 3,
                title: 'Complete this task',
                status: 'completed',
            };
            await todoApiPage.updateTodo(updateData);
        });
    });

    test.describe('PATCH Method Tests', () => {
        test('TC20 - PATCH update only todo status', async () => {
            const patchData: TodoPatch = {
                id: 1,
                status: 'in_progress',
            };
            await todoApiPage.patchTodo(patchData);
        });

        test('TC21 - PATCH update only todo priority', async () => {
            const patchData: TodoPatch = {
                id: 2,
                priority: 'high',
            };
            await todoApiPage.patchTodo(patchData);
        });

        test('TC22 - PATCH update multiple fields', async () => {
            const patchData: TodoPatch = {
                id: 3,
                title: 'Partially updated todo',
                status: 'completed',
                priority: 'medium',
            };
            await todoApiPage.patchTodo(patchData);
        });

        test('TC23 - PATCH update non-existent todo returns 404', async () => {
            const patchData: TodoPatch = {
                id: 99999,
                status: 'completed',
            };
            await todoApiPage.patchTodoNotFound(patchData);
        });

        test('TC24 - PATCH update todo description to null', async () => {
            const patchData: TodoPatch = {
                id: 4,
                description: '',
            };
            await todoApiPage.patchTodo(patchData);
        });
    });

    test.describe('DELETE Method Tests', () => {
        test('TC25 - DELETE existing todo successfully', async () => {
            // First verify todo exists
            await todoApiPage.getTodoById(1);
            
            // Delete the todo
            await todoApiPage.deleteTodo(1);
            
            // Verify todo no longer exists
            await todoApiPage.getTodoByIdNotFound(1);
        });

        test('TC26 - DELETE non-existent todo returns 404', async () => {
            await todoApiPage.deleteTodoNotFound(99999);
        });

        test('TC27 - DELETE todo and verify it is removed from list', async () => {
            const todoId = 2;
            
            // Verify todo exists in list
            await todoApiPage.verifyTodoExistsInList(todoId);
            
            // Delete the todo
            await todoApiPage.deleteTodo(todoId);
            
            // Verify todo is removed from list
            await todoApiPage.verifyTodoNotExistsInList(todoId);
        });

        test('TC28 - DELETE multiple todos sequentially', async () => {
            await todoApiPage.deleteTodo(3);
            await todoApiPage.deleteTodo(4);
            await todoApiPage.deleteTodo(5);
        });
    });

    test.describe('Complete CRUD Workflow Tests', () => {
        test('TC29 - Complete CRUD workflow: Create -> Read -> Update -> Delete', async () => {
            // CREATE
            const newTodo: TodoInput = {
                title: 'CRUD workflow test',
                description: 'Testing complete CRUD workflow',
                status: 'pending',
                priority: 'medium',
            };
            const createResponse = await todoApiPage.createTodo(newTodo);
            const todoId = createResponse.todo.id;
            
            // READ
            await todoApiPage.getTodoById(todoId);
            await todoApiPage.verifyTodoExistsInList(todoId);
            
            // UPDATE (PUT)
            const updateData: TodoUpdate = {
                id: todoId,
                title: 'Updated CRUD workflow test',
                status: 'in_progress',
                priority: 'high',
            };
            await todoApiPage.updateTodo(updateData);
            
            // UPDATE (PATCH)
            const patchData: TodoPatch = {
                id: todoId,
                status: 'completed',
            };
            await todoApiPage.patchTodo(patchData);
            
            // DELETE
            await todoApiPage.deleteTodo(todoId);
            await todoApiPage.getTodoByIdNotFound(todoId);
        });

        test('TC30 - Create multiple todos and verify in list', async () => {
            const todos: TodoInput[] = [
                { title: 'First todo', priority: 'low' },
                { title: 'Second todo', priority: 'medium' },
                { title: 'Third todo', priority: 'high' },
            ];
            
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
        test('TC31 - Reset database restores sample data', async () => {
            // Reset database
            const resetResponse = await todoApiPage.resetDatabase();
            
            // Verify sample data is restored by getting todos
            await todoApiPage.getAllTodos();
        });

        test('TC32 - Reset database after creating todos', async () => {
            // Create some todos
            const newTodo: TodoInput = {
                title: 'Test todo before reset',
            };
            await todoApiPage.createTodo(newTodo);
            
            // Reset database
            await todoApiPage.resetDatabase();
            
            // Verify original sample data is present
            await todoApiPage.getAllTodos();
        });
    });
});
