/**
 * Todo API Interface Definitions
 * Based on OpenAPI spec from https://material.playwrightvn.com/api/todo-app/swagger.json
 */

export interface Todo {
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

export interface TodoInput {
    title: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
    user_id?: number;
}

export interface TodoUpdate {
    id: number;
    title: string;
    description?: string | null;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string | null;
    user_id?: number;
}

export interface TodoPatch {
    id: number;
    title?: string;
    description?: string;
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    due_date?: string | null;
    user_id?: number;
}

export interface TodoResponse {
    success: boolean;
    todo: Todo;
}

export interface TodosResponse {
    success: boolean;
    todos: Todo[];
}

export interface DeleteResponse {
    success: boolean;
    deleted: {
        id: number | string; // API may return string or number
        message: string;
    };
}

export interface ErrorResponse {
    success: boolean;
    message: string;
}

export interface ResetResponse {
    success: boolean;
    reset: {
        message: string;
        sample_data: {
            users: number;
            todos: number;
            categories: number;
        };
    };
}
