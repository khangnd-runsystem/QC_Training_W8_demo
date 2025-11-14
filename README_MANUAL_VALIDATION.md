# Manual Schema Validation - Không sử dụng thư viện AJV

## Tổng quan

Project này cung cấp 2 cách để validate API response schema:

1. **Sử dụng thư viện AJV** (Automatic) - File: `utils/schema-validator.ts`
2. **Validate thủ công** (Manual) - File: `utils/manual-validator.ts` ✨ **MỚI**

## Manual Validator

### Tính năng

Manual Validator kiểm tra schema **hoàn toàn bằng code TypeScript**, không phụ thuộc vào thư viện bên ngoài như AJV.

**Các kiểm tra được thực hiện:**

- ✅ Kiểm tra type của từng field (string, number, boolean, array, object, null)
- ✅ Kiểm tra required fields (các field bắt buộc)
- ✅ Kiểm tra enum values (giá trị hợp lệ)
- ✅ Kiểm tra minLength cho string
- ✅ Kiểm tra additionalProperties (field không được phép)
- ✅ Kiểm tra nested objects và arrays
- ✅ Hỗ trợ union types (ví dụ: string | null)

### Các phương thức

```typescript
import { manualValidator } from '../utils/manual-validator';

// Validate Todo object
manualValidator.validateTodo(data);

// Validate TodosResponse (array of todos)
manualValidator.validateTodosResponse(data);

// Validate TodoResponse (single todo)
manualValidator.validateTodoResponse(data);

// Validate DeleteResponse
manualValidator.validateDeleteResponse(data);

// Validate ResetResponse
manualValidator.validateResetResponse(data);

// Validate ErrorResponse
manualValidator.validateErrorResponse(data);
```

### Cách sử dụng trong Test

#### Cách 1: Sử dụng trực tiếp Manual Validator

```typescript
import { manualValidator } from '../utils/manual-validator';

test('Validate todo manually', async () => {
    const response = await apiContext.get('/api/todos/1');
    const data = await response.json();
    
    // Validate thủ công
    manualValidator.validateTodoResponse(data);
});
```

#### Cách 2: Sử dụng qua TodoApiPage (Recommended)

```typescript
import { TodoApiPage } from '../pages/todo-api-page';

test('Validate todo using page object', async ({ page, apiContext }) => {
    const todoApiPage = new TodoApiPage(page, apiContext);
    
    const response = await todoApiPage.getAllTodos();
    
    // Validate thủ công qua page object
    await todoApiPage.validateTodosResponseSchemaManual(response);
    
    // Validate từng todo
    for (const todo of response.todos) {
        await todoApiPage.validateTodoSchemaManual(todo);
    }
});
```

## So sánh AJV vs Manual Validation

| Tiêu chí | AJV (Automatic) | Manual Validation |
|----------|-----------------|-------------------|
| **Độ chính xác** | ⭐⭐⭐⭐⭐ Rất cao | ⭐⭐⭐⭐ Cao |
| **Performance** | ⭐⭐⭐⭐⭐ Rất nhanh | ⭐⭐⭐⭐ Nhanh |
| **Dễ bảo trì** | ⭐⭐⭐⭐ Dễ | ⭐⭐⭐ Trung bình |
| **Tùy biến** | ⭐⭐⭐ Trung bình | ⭐⭐⭐⭐⭐ Rất linh hoạt |
| **Dependencies** | Cần cài thư viện | ❌ Không cần |
| **Error messages** | Chi tiết | **Rất chi tiết (tiếng Việt)** |
| **Learning curve** | Cần học AJV | Chỉ cần biết TypeScript |

## Cấu trúc validation của Todo Schema

```typescript
{
    type: 'object',
    properties: {
        id: { type: 'number' },                    // Required
        user_id: { type: 'number' },               // Required
        title: { type: 'string', minLength: 1 },   // Required, không được rỗng
        description: { type: ['string', 'null'] }, // Optional, có thể null
        status: {                                  // Required, enum
            type: 'string', 
            enum: ['pending', 'in_progress', 'completed'] 
        },
        priority: {                                // Required, enum
            type: 'string', 
            enum: ['low', 'medium', 'high'] 
        },
        due_date: { type: ['string', 'null'] },   // Optional, có thể null
        created_at: { type: 'string' },           // Required
        updated_at: { type: 'string' },           // Required
    },
    required: ['id', 'user_id', 'title', 'status', 'priority', 'created_at', 'updated_at'],
    additionalProperties: false // Không cho phép field thừa
}
```

## Ví dụ Error Messages

### Lỗi thiếu field bắt buộc

```
❌ Manual Schema Validation Failed:
Schema: Todo
Errors: Thiếu field bắt buộc: title
```

### Lỗi sai type

```
❌ Manual Schema Validation Failed:
Schema: Todo
Errors: Field 'priority' phải là string, nhận được number
```

### Lỗi enum không hợp lệ

```
❌ Manual Schema Validation Failed:
Schema: Todo
Errors: Field 'status' phải là một trong ['pending', 'in_progress', 'completed'], nhận được 'invalid_status'
```

### Lỗi field không được phép

```
❌ Manual Schema Validation Failed:
Schema: Todo
Errors: Field không được phép: 'extra_field'
```

## Chạy Test

### Chạy test với AJV validation (cũ)

```bash
npx playwright test tests/todo-api.spec.ts
```

### Chạy test với Manual validation (mới)

```bash
npx playwright test tests/todo-api-manual-validation.spec.ts
```

### Chạy cả 2 để so sánh

```bash
npx playwright test
```

## Khi nào sử dụng cái nào?

### Sử dụng AJV (schema-validator.ts) khi:

- ✅ Cần validation nhanh và chuẩn JSON Schema
- ✅ Có nhiều schema phức tạp
- ✅ Cần validate theo chuẩn JSON Schema spec
- ✅ Không muốn viết code validation thủ công

### Sử dụng Manual Validation (manual-validator.ts) khi:

- ✅ Muốn hiểu rõ từng bước validation
- ✅ Muốn tùy biến logic validation phức tạp
- ✅ Không muốn cài thư viện bên ngoài
- ✅ Muốn error messages bằng tiếng Việt
- ✅ Đang học về API testing và validation

## API Page Methods

TodoApiPage có sẵn các methods cho cả 2 loại validation:

```typescript
// AJV Validation
await todoApiPage.validateTodoSchema(todo);
await todoApiPage.validateTodosResponseSchema(response);
await todoApiPage.validateTodoResponseSchema(response);
await todoApiPage.validateDeleteResponseSchema(response);

// Manual Validation
await todoApiPage.validateTodoSchemaManual(todo);
await todoApiPage.validateTodosResponseSchemaManual(response);
await todoApiPage.validateTodoResponseSchemaManual(response);
await todoApiPage.validateDeleteResponseSchemaManual(response);
await todoApiPage.validateResetResponseSchemaManual(response);
await todoApiPage.validateErrorResponseSchemaManual(response);
```

## Best Practices

1. **Nhất quán**: Chọn 1 phương pháp và sử dụng xuyên suốt project
2. **Test Coverage**: Viết test cho cả success và error cases
3. **Error Handling**: Manual validation có error messages rõ ràng hơn
4. **Performance**: Với dataset lớn, AJV nhanh hơn một chút
5. **Maintenance**: Manual validation dễ debug hơn khi có lỗi

## Tài liệu tham khảo

- AJV Documentation: https://ajv.js.org/
- JSON Schema Specification: https://json-schema.org/
- Playwright API Testing: https://playwright.dev/docs/api-testing

---

**Tác giả**: QC Training Team  
**Ngày tạo**: 2025  
**Version**: 1.0
