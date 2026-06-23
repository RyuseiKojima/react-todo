"use client";

import { useEffect, useState } from "react";

export type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

const TODO_STORAGE_KEY = "react-todo-items";

const isTodo = (value: unknown): value is Todo => {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const todo = value as Partial<Todo>;

    return (
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
    );
};

export function useTodos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isStorageLoaded, setIsStorageLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

            if (savedTodos) {
                const parsedTodos: unknown = JSON.parse(savedTodos);

                if (Array.isArray(parsedTodos) && parsedTodos.every(isTodo)) {
                    setTodos(parsedTodos);
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
