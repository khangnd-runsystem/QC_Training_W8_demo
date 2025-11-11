import Ajv from 'ajv';
import addFormats from 'ajv-formats';

/**
 * JSON Schema for Todo object
 */
export const todoSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        user_id: { type: 'number' },
        title: { type: 'string', minLength: 1 },
        description: { type: ['string', 'null'] },
        status: { 
            type: 'string', 
            enum: ['pending', 'in_progress', 'completed'] 
        },
        priority: { 
            type: 'string', 
            enum: ['low', 'medium', 'high'] 
        },
        due_date: { type: ['string', 'null'] },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
    },
    required: ['id', 'user_id', 'title', 'status', 'priority', 'created_at', 'updated_at'],
    additionalProperties: false,
} as const;

/**
 * JSON Schema for TodosResponse
 */
export const todosResponseSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        todos: {
            type: 'array',
            items: todoSchema,
        },
    },
    required: ['success', 'todos'],
    additionalProperties: false,
} as const;

/**
 * JSON Schema for TodoResponse
 */
export const todoResponseSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        todo: todoSchema,
    },
    required: ['success', 'todo'],
    additionalProperties: false,
} as const;

/**
 * JSON Schema for DeleteResponse
 */
export const deleteResponseSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        deleted: {
            type: 'object',
            properties: {
                id: { type: ['number', 'string'] }, // API returns string sometimes
            },
            required: ['id'],
            additionalProperties: false,
        },
    },
    required: ['success', 'message', 'deleted'],
    additionalProperties: false,
} as const;

/**
 * JSON Schema for ResetResponse
 */
export const resetResponseSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
    },
    required: ['success', 'message'],
    additionalProperties: false,
} as const;

/**
 * JSON Schema for ErrorResponse
 */
export const errorResponseSchema = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        error: { type: 'string' },
    },
    required: ['success'],
    additionalProperties: true, // Allow additional error properties
} as const;
