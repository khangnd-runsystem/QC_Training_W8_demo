# Todo API Testing with Playwright

## Tổng Quan

Dự án này chứa các test scripts để kiểm thử API Todo App sử dụng Playwright framework với kiến trúc Page Object Model (POM).

**API Base URL:** `https://material.playwrightvn.com/api/todo-app/v1`

**Swagger Documentation:** `https://material.playwrightvn.com/api/todo-app/swagger.html`

## Cấu Trúc Dự Án

```
Demo-final/
├── fixtures/
│   └── base-test.ts              # Custom test fixture với APIRequestContext
├── interfaces/
│   └── todo.interface.ts         # Type definitions cho Todo API
├── locators/
│   ├── common-locators.ts        # Base locators class
│   └── todo-api-locators.ts      # API endpoint URLs
├── pages/
│   ├── common-page.ts            # Base page class
│   ├── todo-api-page.ts          # Todo API page object (chứa tất cả API methods)
│   └── index.ts                  # Export pages
├── tests/
│   └── todo-api.spec.ts          # Test scenarios cho Todo API
└── utils/                        # Utility functions
```

## Kiến Trúc POM cho API Testing

### 1. **Fixtures** (`fixtures/base-test.ts`)
- Tạo custom test fixture với `APIRequestContext`
- Cấu hình base URL và headers mặc định
- Export `test` và `expect` để sử dụng trong test files

### 2. **Interfaces** (`interfaces/todo.interface.ts`)
- Định nghĩa TypeScript types cho:
  - `Todo`: Full todo object
  - `TodoInput`: Data để tạo todo mới
  - `TodoUpdate`: Data để update toàn bộ todo (PUT)
  - `TodoPatch`: Data để update một phần todo (PATCH)
  - Response types: `TodoResponse`, `TodosResponse`, `DeleteResponse`, `ErrorResponse`

### 3. **Locators** (`locators/todo-api-locators.ts`)
- Extends `CommonLocators`
- Lưu trữ các API endpoint URLs
- Cung cấp methods để build URLs với parameters
- **Không chứa UI selectors** (vì đây là API testing)

### 4. **Pages** (`pages/todo-api-page.ts`)
- Extends `CommonPage`
- Chứa tất cả các API methods:
  - GET: `getAllTodos()`, `getTodoById()`
  - POST: `createTodo()`
  - PUT: `updateTodo()`
  - PATCH: `patchTodo()`
  - DELETE: `deleteTodo()`
- **Chứa tất cả assertions và schema validations**
- Sử dụng `TodoApiLocators` để lấy endpoint URLs
- **Không có expect statements trong test files**

### 5. **Tests** (`tests/todo-api.spec.ts`)
- Chỉ gọi các methods từ `TodoApiPage`
- **Không có expect statements**
- Chỉ orchestrate test flow
- Organize tests theo describe blocks

## Các Test Cases

### Schema Validation Tests (TC01-TC06)
- ✅ Verify GET all todos response schema
- ✅ Verify GET single todo response schema  
- ✅ Verify POST create todo response schema
- ✅ Verify PUT update todo response schema
- ✅ Verify PATCH update todo response schema
- ✅ Verify DELETE todo response schema

### GET Method Tests (TC07-TC10)
- ✅ GET all todos returns list successfully
- ✅ GET todo by valid ID returns correct todo
- ✅ GET todo by non-existent ID returns 404
- ✅ GET all todos returns todos ordered by creation date

### POST Method Tests (TC11-TC15)
- ✅ POST create todo with all fields
- ✅ POST create todo with only required fields
- ✅ POST create todo without required title returns 400
- ✅ POST create todo with different priority levels
- ✅ POST create todo with different status values

### PUT Method Tests (TC16-TC19)
- ✅ PUT full update existing todo
- ✅ PUT update with minimal required fields
- ✅ PUT update non-existent todo returns 404
- ✅ PUT update todo status from pending to completed

### PATCH Method Tests (TC20-TC24)
- ✅ PATCH update only todo status
- ✅ PATCH update only todo priority
- ✅ PATCH update multiple fields
- ✅ PATCH update non-existent todo returns 404
- ✅ PATCH update todo description to null

### DELETE Method Tests (TC25-TC28)
- ✅ DELETE existing todo successfully
- ✅ DELETE non-existent todo returns 404
- ✅ DELETE todo and verify it is removed from list
- ✅ DELETE multiple todos sequentially

### Complete CRUD Workflow Tests (TC29-TC30)
- ✅ Complete CRUD workflow: Create -> Read -> Update -> Delete
- ✅ Create multiple todos and verify in list

### Database Reset Tests (TC31-TC32)
- ✅ Reset database restores sample data
- ✅ Reset database after creating todos

## Cài Đặt

```bash
# Cài đặt dependencies
npm install

# Cài đặt Playwright browsers (nếu cần)
npx playwright install
```

## Chạy Tests

```bash
# Chạy tất cả API tests
npx playwright test tests/todo-api.spec.ts

# Chạy với UI mode
npx playwright test tests/todo-api.spec.ts --ui

# Chạy và xem report
npx playwright test tests/todo-api.spec.ts --reporter=html
npx playwright show-report

# Chạy một test cụ thể
npx playwright test tests/todo-api.spec.ts -g "TC01"

# Chạy một describe block cụ thể
npx playwright test tests/todo-api.spec.ts -g "Schema Validation"

# Chạy với debug mode
npx playwright test tests/todo-api.spec.ts --debug
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos.php` | Lấy tất cả todos |
| GET | `/todo.php?id={id}` | Lấy todo theo ID |
| POST | `/todo.php` | Tạo todo mới |
| PUT | `/todo.php` | Update toàn bộ todo |
| PATCH | `/todo.php` | Update một phần todo |
| DELETE | `/todo.php` | Xóa todo |
| POST | `/reset.php` | Reset database về dữ liệu mẫu |

## Todo Schema

```typescript
{
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}
```

## Schema Validations

Mỗi API method trong `TodoApiPage` đều thực hiện:

1. **HTTP Status Code Validation**
   - 200 OK cho thành công
   - 201 Created cho tạo mới
   - 400 Bad Request cho invalid input
   - 404 Not Found cho resource không tồn tại

2. **Response Schema Validation**
   - Kiểm tra tất cả required fields
   - Kiểm tra data types
   - Kiểm tra enum values (status, priority)
   - Kiểm tra structure của response

3. **Data Validation**
   - Verify returned data matches request data
   - Verify IDs are correct
   - Verify timestamps are present

## Ví Dụ Sử Dụng

```typescript
// Test file - chỉ gọi methods, không có expect
test('Create and verify todo', async ({ page, apiContext }) => {
    const todoApiPage = new TodoApiPage(page, apiContext);
    
    // All validations are inside page methods
    const newTodo: TodoInput = {
        title: 'Test todo',
        status: 'pending',
        priority: 'high',
    };
    
    // Page method handles: request, response validation, schema validation
    const response = await todoApiPage.createTodo(newTodo);
    
    // Page method handles: get request, ID validation, schema validation
    await todoApiPage.getTodoById(response.todo.id);
});
```

## Lưu Ý Quan Trọng

1. **Không có expect trong test files** - Tất cả assertions được thực hiện trong `TodoApiPage`

2. **Reset database trước mỗi test** - Sử dụng `resetDatabase()` trong `beforeEach` để đảm bảo consistent state

3. **Schema validation tự động** - Mọi API method đều validate schema response

4. **Error handling** - Test cả success và error cases (404, 400)

5. **POM for API** - Áp dụng POM pattern cho API testing:
   - Locators = Endpoint URLs
   - Page methods = API requests + validations
   - Tests = Orchestrate flow only

## Tác Giả

Created for Playwright Vietnam Training - Week 8

## License

Free to use for learning purposes.
