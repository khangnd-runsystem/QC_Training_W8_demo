import { expect } from '@playwright/test';

/**
 * Manual Schema Validator - Không sử dụng thư viện AJV
 * Validate API responses bằng cách kiểm tra thủ công từng field
 */
export class ManualValidator {
    /**
     * Kiểm tra type của một giá trị
     */
    private checkType(value: any, expectedType: string | string[]): boolean {
        const types = Array.isArray(expectedType) ? expectedType : [expectedType];
        const actualType = value === null ? 'null' : typeof value;
        
        // Kiểm tra array riêng
        if (types.includes('array') && Array.isArray(value)) {
            return true;
        }
        
        // Kiểm tra number
        if (types.includes('number') && typeof value === 'number') {
            return true;
        }
        
        // Kiểm tra string
        if (types.includes('string') && typeof value === 'string') {
            return true;
        }
        
        // Kiểm tra boolean
        if (types.includes('boolean') && typeof value === 'boolean') {
            return true;
        }
        
        // Kiểm tra null
        if (types.includes('null') && value === null) {
            return true;
        }
        
        // Kiểm tra object
        if (types.includes('object') && typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return true;
        }
        
        return false;
    }

    /**
     * Kiểm tra giá trị có nằm trong enum không
     */
    private checkEnum(value: any, enumValues: any[]): boolean {
        return enumValues.includes(value);
    }

    /**
     * Validate Todo object
     */
    validateTodo(data: any): void {
        const errors: string[] = [];

        // Kiểm tra data phải là object
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            errors.push('Data phải là một object');
            this.throwValidationError('Todo', data, errors);
            return;
        }

        // Kiểm tra required fields
        const requiredFields = ['id', 'user_id', 'title', 'status', 'priority', 'created_at', 'updated_at'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                errors.push(`Thiếu field bắt buộc: ${field}`);
            }
        }

        // Validate từng field
        // id: number
        if ('id' in data && !this.checkType(data.id, 'number')) {
            errors.push(`Field 'id' phải là number, nhận được ${typeof data.id}`);
        }

        // user_id: number
        if ('user_id' in data && !this.checkType(data.user_id, 'number')) {
            errors.push(`Field 'user_id' phải là number, nhận được ${typeof data.user_id}`);
        }

        // title: string, minLength: 1
        if ('title' in data) {
            if (!this.checkType(data.title, 'string')) {
                errors.push(`Field 'title' phải là string, nhận được ${typeof data.title}`);
            } else if (data.title.length < 1) {
                errors.push(`Field 'title' phải có ít nhất 1 ký tự`);
            }
        }

        // description: string hoặc null
        if ('description' in data && !this.checkType(data.description, ['string', 'null'])) {
            errors.push(`Field 'description' phải là string hoặc null, nhận được ${typeof data.description}`);
        }

        // status: enum ['pending', 'in_progress', 'completed']
        if ('status' in data) {
            if (!this.checkType(data.status, 'string')) {
                errors.push(`Field 'status' phải là string, nhận được ${typeof data.status}`);
            } else if (!this.checkEnum(data.status, ['pending', 'in_progress', 'completed'])) {
                errors.push(`Field 'status' phải là một trong ['pending', 'in_progress', 'completed'], nhận được '${data.status}'`);
            }
        }

        // priority: enum ['low', 'medium', 'high']
        if ('priority' in data) {
            if (!this.checkType(data.priority, 'string')) {
                errors.push(`Field 'priority' phải là string, nhận được ${typeof data.priority}`);
            } else if (!this.checkEnum(data.priority, ['low', 'medium', 'high'])) {
                errors.push(`Field 'priority' phải là một trong ['low', 'medium', 'high'], nhận được '${data.priority}'`);
            }
        }

        // due_date: string hoặc null
        if ('due_date' in data && !this.checkType(data.due_date, ['string', 'null'])) {
            errors.push(`Field 'due_date' phải là string hoặc null, nhận được ${typeof data.due_date}`);
        }

        // created_at: string
        if ('created_at' in data && !this.checkType(data.created_at, 'string')) {
            errors.push(`Field 'created_at' phải là string, nhận được ${typeof data.created_at}`);
        }

        // updated_at: string
        if ('updated_at' in data && !this.checkType(data.updated_at, 'string')) {
            errors.push(`Field 'updated_at' phải là string, nhận được ${typeof data.updated_at}`);
        }

        // Kiểm tra additionalProperties = false (không cho phép field thừa)
        const allowedFields = ['id', 'user_id', 'title', 'description', 'status', 'priority', 'due_date', 'created_at', 'updated_at'];
        for (const key in data) {
            if (!allowedFields.includes(key)) {
                errors.push(`Field không được phép: '${key}'`);
            }
        }

        // Throw error nếu có lỗi
        if (errors.length > 0) {
            this.throwValidationError('Todo', data, errors);
        } else {
            console.log('✓ Todo manual validation passed');
        }
    }

    /**
     * Validate TodosResponse
     */
    validateTodosResponse(data: any): void {
        const errors: string[] = [];

        // Kiểm tra data phải là object
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            errors.push('Data phải là một object');
            this.throwValidationError('TodosResponse', data, errors);
            return;
        }

        // Kiểm tra required fields
        if (!('success' in data)) {
            errors.push(`Thiếu field bắt buộc: success`);
        }
        if (!('todos' in data)) {
            errors.push(`Thiếu field bắt buộc: todos`);
        }

        // success: boolean
        if ('success' in data && !this.checkType(data.success, 'boolean')) {
            errors.push(`Field 'success' phải là boolean, nhận được ${typeof data.success}`);
        }

        // todos: array
        if ('todos' in data) {
            if (!Array.isArray(data.todos)) {
                errors.push(`Field 'todos' phải là array, nhận được ${typeof data.todos}`);
            } else {
                // Validate từng todo trong array
                data.todos.forEach((todo: any, index: number) => {
                    try {
                        this.validateTodo(todo);
                    } catch (e: any) {
                        errors.push(`Todo tại index ${index} không hợp lệ: ${e.message}`);
                    }
                });
            }
        }

        // Kiểm tra additionalProperties = false
        const allowedFields = ['success', 'todos'];
        for (const key in data) {
            if (!allowedFields.includes(key)) {
                errors.push(`Field không được phép: '${key}'`);
            }
        }

        // Throw error nếu có lỗi
        if (errors.length > 0) {
            this.throwValidationError('TodosResponse', data, errors);
        } else {
            console.log('✓ TodosResponse manual validation passed');
        }
    }

    /**
     * Validate TodoResponse
     */
    validateTodoResponse(data: any): void {
        const errors: string[] = [];

        // Kiểm tra data phải là object
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            errors.push('Data phải là một object');
            this.throwValidationError('TodoResponse', data, errors);
            return;
        }

        // Kiểm tra required fields
        if (!('success' in data)) {
            errors.push(`Thiếu field bắt buộc: success`);
        }
        if (!('todo' in data)) {
            errors.push(`Thiếu field bắt buộc: todo`);
        }

        // success: boolean
        if ('success' in data && !this.checkType(data.success, 'boolean')) {
            errors.push(`Field 'success' phải là boolean, nhận được ${typeof data.success}`);
        }

        // todo: object
        if ('todo' in data) {
            try {
                this.validateTodo(data.todo);
            } catch (e: any) {
                errors.push(`Field 'todo' không hợp lệ: ${e.message}`);
            }
        }

        // Kiểm tra additionalProperties = false
        const allowedFields = ['success', 'todo'];
        for (const key in data) {
            if (!allowedFields.includes(key)) {
                errors.push(`Field không được phép: '${key}'`);
            }
        }

        // Throw error nếu có lỗi
        if (errors.length > 0) {
            this.throwValidationError('TodoResponse', data, errors);
        } else {
            console.log('✓ TodoResponse manual validation passed');
        }
    }

    /**
     * Validate DeleteResponse
     */
    validateDeleteResponse(data: any): void {
        const errors: string[] = [];

        // Kiểm tra data phải là object
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            errors.push('Data phải là một object');
            this.throwValidationError('DeleteResponse', data, errors);
            return;
        }

        // Kiểm tra required fields
        const requiredFields = ['success', 'message', 'deleted'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                errors.push(`Thiếu field bắt buộc: ${field}`);
            }
        }

        // success: boolean
        if ('success' in data && !this.checkType(data.success, 'boolean')) {
            errors.push(`Field 'success' phải là boolean, nhận được ${typeof data.success}`);
        }

        // message: string
        if ('message' in data && !this.checkType(data.message, 'string')) {
            errors.push(`Field 'message' phải là string, nhận được ${typeof data.message}`);
        }

        // deleted: object với id
        if ('deleted' in data) {
            if (typeof data.deleted !== 'object' || data.deleted === null || Array.isArray(data.deleted)) {
                errors.push(`Field 'deleted' phải là object, nhận được ${typeof data.deleted}`);
            } else {
                // Kiểm tra required field 'id' trong deleted
                if (!('id' in data.deleted)) {
                    errors.push(`Field 'deleted.id' là bắt buộc`);
                }

                // id: number hoặc string
                if ('id' in data.deleted && !this.checkType(data.deleted.id, ['number', 'string'])) {
                    errors.push(`Field 'deleted.id' phải là number hoặc string, nhận được ${typeof data.deleted.id}`);
                }

                // Kiểm tra additionalProperties = false trong deleted object
                const allowedDeletedFields = ['id'];
                for (const key in data.deleted) {
                    if (!allowedDeletedFields.includes(key)) {
                        errors.push(`Field không được phép trong 'deleted': '${key}'`);
                    }
                }
            }
        }

        // Kiểm tra additionalProperties = false
        const allowedFields = ['success', 'message', 'deleted'];
        for (const key in data) {
            if (!allowedFields.includes(key)) {
                errors.push(`Field không được phép: '${key}'`);
            }
        }

        // Throw error nếu có lỗi
        if (errors.length > 0) {
            this.throwValidationError('DeleteResponse', data, errors);
        } else {
            console.log('✓ DeleteResponse manual validation passed');
        }
    }

    /**
     * Validate ResetResponse
     */
    validateResetResponse(data: any): void {
        const errors: string[] = [];

        // Kiểm tra data phải là object
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            errors.push('Data phải là một object');
            this.throwValidationError('ResetResponse', data, errors);
            return;
        }

        // Kiểm tra required fields
        const requiredFields = ['success', 'message'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                errors.push(`Thiếu field bắt buộc: ${field}`);
            }
        }

        // success: boolean
        if ('success' in data && !this.checkType(data.success, 'boolean')) {
            errors.push(`Field 'success' phải là boolean, nhận được ${typeof data.success}`);
        }

        // message: string
        if ('message' in data && !this.checkType(data.message, 'string')) {
            errors.push(`Field 'message' phải là string, nhận được ${typeof data.message}`);
        }

        // Kiểm tra additionalProperties = false
        const allowedFields = ['success', 'message'];
        for (const key in data) {
            if (!allowedFields.includes(key)) {
                errors.push(`Field không được phép: '${key}'`);
            }
        }

        // Throw error nếu có lỗi
        if (errors.length > 0) {
            this.throwValidationError('ResetResponse', data, errors);
        } else {
            console.log('✓ ResetResponse manual validation passed');
        }
    }

    /**
     * Validate ErrorResponse
     */
    validateErrorResponse(data: any): void {
        const errors: string[] = [];

        // Kiểm tra data phải là object
        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            errors.push('Data phải là một object');
            this.throwValidationError('ErrorResponse', data, errors);
            return;
        }

        // Kiểm tra required fields
        if (!('success' in data)) {
            errors.push(`Thiếu field bắt buộc: success`);
        }

        // success: boolean
        if ('success' in data && !this.checkType(data.success, 'boolean')) {
            errors.push(`Field 'success' phải là boolean, nhận được ${typeof data.success}`);
        }

        // error: string (optional)
        if ('error' in data && !this.checkType(data.error, 'string')) {
            errors.push(`Field 'error' phải là string, nhận được ${typeof data.error}`);
        }

        // ErrorResponse cho phép additionalProperties = true, nên không kiểm tra field thừa

        // Throw error nếu có lỗi
        if (errors.length > 0) {
            this.throwValidationError('ErrorResponse', data, errors);
        } else {
            console.log('✓ ErrorResponse manual validation passed');
        }
    }

    /**
     * Throw validation error với format đẹp
     */
    private throwValidationError(schemaName: string, data: any, errors: string[]): void {
        const errorMessages = errors.join('\n');
        
        // Log detailed error for debugging
        console.error('❌ Manual Schema Validation Failed:');
        console.error('Schema:', schemaName);
        console.error('Data:', JSON.stringify(data, null, 2));
        console.error('Errors:', errorMessages);

        // Fail the test with detailed error message
        expect(false, `Manual validation failed for ${schemaName}:\n${errorMessages}`).toBe(true);
    }
}

// Export singleton instance
export const manualValidator = new ManualValidator();
