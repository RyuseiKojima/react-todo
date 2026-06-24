"use client";

import { useEffect, useState } from "react";

export type Todo = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
};

const TODO_STORAGE_KEY = "react-todo-items";

type StoredTodo = Omit<Todo, "createdAt"> & {
    createdAt?: string;
};

const isStoredTodo = (value: unknown): value is StoredTodo => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const todo = value as Partial<StoredTodo>;

    return (
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean" &&
        (todo.createdAt === undefined ||
            (typeof todo.createdAt === "string" &&
                !Number.isNaN(Date.parse(todo.createdAt))))
    );
};

const normalizeTodo = (todo: StoredTodo): Todo => ({
    ...todo,
    createdAt: todo.createdAt ?? new Date().toISOString(),
});

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isStorageLoaded, setIsStorageLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

            if (savedTodos) {
                const parsedTodos: unknown = JSON.parse(savedTodos);

                if (
                    Array.isArray(parsedTodos) &&
                    parsedTodos.every(isStoredTodo)
                ) {
                    setTodos(parsedTodos.map(normalizeTodo));
                }
            }
        } catch {
            localStorage.removeItem(TODO_STORAGE_KEY);
        }

        setIsStorageLoaded(true);
    }, []);

    useEffect(() => {
        if (!isStorageLoaded) {
            return;
        }

        localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
    }, [todos, isStorageLoaded]);

    const addTodo = (text: string) => {
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        setTodos((currentTodos) => [...currentTodos, newTodo]);
    };

    const toggleTodo = (todoId: string) => {
        setTodos((currentTodos) =>
            currentTodos.map((todo) =>
                todo.id === todoId
                    ? { ...todo, completed: !todo.completed }
                    : todo,
            ),
        );
    };

    const editTodo = (todoId: string, newText: string) => {
        setTodos((currentTodos) =>
            currentTodos.map((todo) =>
                todo.id === todoId ? { ...todo, text: newText } : todo,
            ),
        );
    };

    const deleteTodo = (todoId: string) => {
        setTodos((currentTodos) =>
            currentTodos.filter((todo) => todo.id !== todoId),
        );
    };

    const clearCompletedTodos = () => {
        setTodos((currentTodos) =>
            currentTodos.filter((todo) => !todo.completed),
        );
    };

    return {
        todos,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        clearCompletedTodos,
    };
}
