import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';
import {
    todoSchema,
    todosResponseSchema,
    todoResponseSchema,
    deleteResponseSchema,
    resetResponseSchema,
    errorResponseSchema,
} from '../schemas/todo.schema';

/**
 * Schema Validator Utility using AJV
 * Provides methods to validate API responses against JSON schemas
 */
export class SchemaValidator {
    private ajv: Ajv;
    private validators: Map<string, ValidateFunction>;

    constructor() {
        // Initialize AJV with strict mode
        this.ajv = new Ajv({
            allErrors: true,
            verbose: true,
            strict: false, // Allow for flexibility with schemas
        });

        // Add format support (date-time, email, etc.)
        addFormats(this.ajv);

        // Compile and cache validators
        this.validators = new Map();
        this.compileSchemas();
    }

    /**
     * Compile all schemas upfront for better performance
     */
    private compileSchemas(): void {
        this.validators.set('todo', this.ajv.compile(todoSchema));
        this.validators.set('todosResponse', this.ajv.compile(todosResponseSchema));
        this.validators.set('todoResponse', this.ajv.compile(todoResponseSchema));
        this.validators.set('deleteResponse', this.ajv.compile(deleteResponseSchema));
        this.validators.set('resetResponse', this.ajv.compile(resetResponseSchema));
        this.validators.set('errorResponse', this.ajv.compile(errorResponseSchema));
    }

    /**
     * Validate data against a schema
     */
    private validate(schemaName: string, data: any): void {
        const validator = this.validators.get(schemaName);
        
        if (!validator) {
            throw new Error(`Schema validator not found: ${schemaName}`);
        }

        const isValid = validator(data);

        if (!isValid) {
            const errors = validator.errors;
            const errorMessages = errors?.map(err => {
                const path = err.instancePath || 'root';
                return `${path}: ${err.message}`;
            }).join('\n');

            // Log detailed error for debugging
            console.error('❌ Schema Validation Failed:');
            console.error('Schema:', schemaName);
            console.error('Data:', JSON.stringify(data, null, 2));
            console.error('Errors:', errorMessages);

            // Fail the test with detailed error message
            expect(isValid, `Schema validation failed for ${schemaName}:\n${errorMessages}`).toBe(true);
        } else {
            console.log(`✓ ${schemaName} schema validation passed`);
        }
    }

    /**
     * Validate Todo object
     */
    validateTodo(data: any): void {
        this.validate('todo', data);
    }

    /**
     * Validate TodosResponse
     */
    validateTodosResponse(data: any): void {
        this.validate('todosResponse', data);
    }

    /**
     * Validate TodoResponse
     */
    validateTodoResponse(data: any): void {
        this.validate('todoResponse', data);
    }

    /**
     * Validate DeleteResponse
     */
    validateDeleteResponse(data: any): void {
        this.validate('deleteResponse', data);
    }

    /**
     * Validate ResetResponse
     */
    validateResetResponse(data: any): void {
        this.validate('resetResponse', data);
    }

    /**
     * Validate ErrorResponse
     */
    validateErrorResponse(data: any): void {
        this.validate('errorResponse', data);
    }

    /**
     * Get AJV instance for advanced usage
     */
    getAjv(): Ajv {
        return this.ajv;
    }
}

// Export singleton instance
export const schemaValidator = new SchemaValidator();
