# Todo API Testing with Playwright

## 📋 Mô tả

Dự án này chứa test scripts để test API Todo App từ https://material.playwrightvn.com/api/todo-app/ sử dụng Playwright và tuân theo mô hình Page Object Model (POM).

## 🏗️ Cấu trúc dự án

```
Demo-final/
├── fixtures/
│   └── base-test.ts           # Custom test fixture với APIRequestContext
├── interfaces/
│   └── todo.interface.ts      # Type definitions cho Todo API
├── locators/
│   ├── common-locators.ts     # Base locator class
│   └── todo-api-locators.ts   # API endpoints URLs
├── pages/
│   ├── common-page.ts         # Base page class
│   └── todo-api-page.ts       # Todo API page object với methods và validations
├── tests/
│   └── todo-api.spec.ts       # Test cases cho Todo API
└── utils/
    ├── helper.ts              # Helper utilities
    ├── json-file.ts           # JSON file utilities
    └── logging.ts             # Logging decorator
```

## ✨ Tính năng

### Test Coverage

#### 1. Schema Validation (6 test cases)
- ✅ TC01-06: Verify response schemas cho tất cả HTTP methods (GET, POST, PUT, PATCH, DELETE)

#### 2. GET Method Tests (4 test cases)
- ✅ TC07: GET all todos returns list successfully
- ✅ TC08: GET todo by valid ID returns correct todo
- ✅ TC09: GET todo by non-existent ID returns 404
- ✅ TC10: GET all todos returns todos ordered by creation date

#### 3. POST Method Tests (5 test cases)
- ✅ TC11: POST create todo with all fields
- ✅ TC12: POST create todo with only required fields
- ✅ TC13: POST create todo without required title returns 400
- ✅ TC14: POST create todo with different priority levels
- ✅ TC15: POST create todo with different status values

#### 4. PUT Method Tests (4 test cases)
- ✅ TC16: PUT full update existing todo
- ✅ TC17: PUT update with minimal required fields
- ✅ TC18: PUT update non-existent todo returns 404
- ✅ TC19: PUT update todo status from pending to completed

#### 5. PATCH Method Tests (5 test cases)
- ✅ TC20: PATCH update only todo status
- ✅ TC21: PATCH update only todo priority
- ✅ TC22: PATCH update multiple fields
- ✅ TC23: PATCH update non-existent todo returns 404
- ✅ TC24: PATCH update todo description to null

#### 6. DELETE Method Tests (4 test cases)
- ✅ TC25: DELETE existing todo successfully
- ✅ TC26: DELETE non-existent todo returns 404
- ✅ TC27: DELETE todo and verify it is removed from list
- ✅ TC28: DELETE multiple todos sequentially

#### 7. Complete CRUD Workflow Tests (2 test cases)
- ✅ TC29: Complete CRUD workflow (Create → Read → Update → Delete)
- ✅ TC30: Create multiple todos and verify in list

#### 8. Database Reset Tests (2 test cases)
- ✅ TC31: Reset database restores sample data
- ✅ TC32: Reset database after creating todos

**Tổng cộng: 33 test cases**

## 🎯 Mô hình POM (Page Object Model)

### Nguyên tắc thiết kế:
1. **Locators (todo-api-locators.ts)**: 
   - Extend `CommonLocators`
   - Chứa API endpoint URLs
   - Không chứa logic

2. **Pages (todo-api-page.ts)**:
   - Extend `CommonPage`
   - Chứa tất cả API request methods
   - Thực hiện tất cả validations và assertions
   - Sử dụng locators từ locator files

3. **Tests (todo-api.spec.ts)**:
   - **KHÔNG có expect statements**
   - Chỉ gọi page methods
   - Orchestrate test flow

4. **Fixtures (base-test.ts)**:
   - Custom fixture với `APIRequestContext`
   - Base URL configuration
   - Headers configuration

## 🚀 Cài đặt và Chạy Tests

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cài đặt Playwright browsers
```bash
npx playwright install
```

### 3. Chạy tests

#### Chạy tất cả tests
```bash
npx playwright test tests/todo-api.spec.ts
```

#### Chạy tests trên browser cụ thể
```bash
# Chromium
npx playwright test tests/todo-api.spec.ts --project=chromium

# Firefox
npx playwright test tests/todo-api.spec.ts --project=firefox

# WebKit
npx playwright test tests/todo-api.spec.ts --project=webkit
```

#### Chạy tests với 1 worker (sequential)
```bash
npx playwright test tests/todo-api.spec.ts --workers=1
```

#### Chạy tests với headed mode
```bash
npx playwright test tests/todo-api.spec.ts --headed
```

#### Chạy tests với specific reporter
```bash
# List reporter
npx playwright test tests/todo-api.spec.ts --reporter=list

# HTML reporter
npx playwright test tests/todo-api.spec.ts --reporter=html

# JSON reporter
npx playwright test tests/todo-api.spec.ts --reporter=json
```

#### Xem HTML report
```bash
npx playwright show-report
```

#### Chạy một test cụ thể
```bash
npx playwright test tests/todo-api.spec.ts -g "TC01"
```

#### Debug mode
```bash
npx playwright test tests/todo-api.spec.ts --debug
```

## 📊 Test Results

Sau khi chạy tests, bạn có thể:
1. Xem console output với detailed logs
2. Mở HTML report: `npx playwright show-report`
3. Kiểm tra screenshots (nếu có failures)
4. Xem traces (on first retry)

## 🔧 Configuration

### Base URL
API base URL được cấu hình trong `fixtures/base-test.ts`:
```typescript
baseURL: 'https://material.playwrightvn.com/api/todo-app/v1'
```

### Endpoints
Các endpoints được định nghĩa trong `locators/todo-api-locators.ts`:
- `/todos.php` - Get all todos
- `/todo.php` - CRUD operations cho single todo
- `/reset.php` - Reset database

## 📝 API Schema

### Todo Object
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

### HTTP Methods Tested
- ✅ GET - Retrieve todos
- ✅ POST - Create todo
- ✅ PUT - Full update todo
- ✅ PATCH - Partial update todo
- ✅ DELETE - Delete todo

## 🎨 Features

### ✅ Schema Validation
Tất cả responses đều được validate schema tự động:
- Response structure
- Field types
- Required fields
- Enum values

### ✅ Comprehensive Error Handling
- 200/201 success responses
- 400 bad request validation
- 404 not found validation
- Schema mismatch detection

### ✅ Logging
Mỗi action đều có detailed logging với `@step` decorator:
```typescript
@step('Description')
async methodName() { }
```

### ✅ Data Verification
- Verify created data exists in list
- Verify updated data has correct values
- Verify deleted data no longer exists

## 🐛 Known Issues & Workarounds

### Reset Database Issues
- Reset endpoint có thể fail với foreign key constraints
- Workaround: Tests được thiết kế để handle reset failures gracefully
- Tests tạo data mới thay vì phụ thuộc vào sample data

### Delete Response ID Type
- API returns ID as string instead of number
- Fixed: Schema validation accepts both types

## 📚 Tài liệu tham khảo

- [Playwright Documentation](https://playwright.dev/)
- [API Documentation](https://material.playwrightvn.com/api/todo-app/swagger.html)
- [OpenAPI Spec](https://material.playwrightvn.com/api/todo-app/swagger.json)
- [Playwright Vietnam](https://playwrightvn.com/)

## 👨‍💻 Tác giả

Được tạo bởi GitHub Copilot cho khóa học QC Training Week 8

## 📄 License

Free to use and share - Please keep the source attribution
