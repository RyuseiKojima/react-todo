"use client";

import { FormEvent, useEffect, useState } from "react";
import TodoItem from "./components/TodoItem";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

type TodoFilter = "all" | "active" | "completed";

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

export default function Home() {
    const [todoText, setTodoText] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [todoFilter, setTodoFilter] = useState<TodoFilter>("all");
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

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTodoText = todoText.trim();

        if (!trimmedTodoText) {
            return;
        }

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: trimmedTodoText,
            completed: false,
        };

        setTodos((currentTodos) => [...currentTodos, newTodo]);
        setTodoText("");
    };

    const handleToggle = (todoId: string) => {
        setTodos((currentTodos) =>
            currentTodos.map((todo) =>
                todo.id === todoId
                    ? { ...todo, completed: !todo.completed }
                    : todo,
            ),
        );
    };

    const handleDelete = (todoId: string) => {
        setTodos((currentTodos) =>
            currentTodos.filter((todo) => todo.id !== todoId),
        );
    };

    const handleEdit = (todoId: string, newText: string) => {
        setTodos((currentTodos) =>
            currentTodos.map((todo) =>
                todo.id === todoId ? { ...todo, text: newText } : todo,
            ),
        );
    };

    const filteredTodos = todos.filter((todo) => {
        if (todoFilter === "active") {
            return !todo.completed;
        }

        if (todoFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    return (
        <main className="app">
            <h1>Todoリスト</h1>
            <p>Reactでタスク管理アプリを作っていきましょう。</p>

            <section className="todo-input" aria-labelledby="todo-input-title">
                <h2 id="todo-input-title">新しいTodo</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="todo-text">やること</label>
                    <div className="todo-form-row">
                        <input
                            id="todo-text"
                            type="text"
                            value={todoText}
                            onChange={(event) => setTodoText(event.target.value)}
                            placeholder="例: ReactのuseStateを学ぶ"
                        />
                        <button type="submit" disabled={!todoText.trim()}>
                            追加
                        </button>
                    </div>
                </form>
                <p className="todo-preview">
                    {todoText ? `入力中: ${todoText}` : "Todoを入力してください。"}
                </p>
            </section>

            <section className="todo-list" aria-labelledby="todo-list-title">
                <h2 id="todo-list-title">Todo一覧</h2>
                <div className="todo-filters" aria-label="Todoの表示切り替え">
                    <button
                        type="button"
                        className={todoFilter === "all" ? "active" : ""}
                        aria-pressed={todoFilter === "all"}
                        onClick={() => setTodoFilter("all")}
                    >
                        すべて
                    </button>
                    <button
                        type="button"
                        className={todoFilter === "active" ? "active" : ""}
                        aria-pressed={todoFilter === "active"}
                        onClick={() => setTodoFilter("active")}
                    >
                        未完了
                    </button>
                    <button
                        type="button"
                        className={todoFilter === "completed" ? "active" : ""}
                        aria-pressed={todoFilter === "completed"}
                        onClick={() => setTodoFilter("completed")}
                    >
                        完了
                    </button>
                </div>
                {filteredTodos.length === 0 ? (
                    <p>
                        {todos.length === 0
                            ? "登録されたTodoはありません。"
                            : "条件に一致するTodoはありません。"}
                    </p>
                ) : (
                    <ul>
                        {filteredTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                text={todo.text}
                                completed={todo.completed}
                                onToggle={() => handleToggle(todo.id)}
                                onEdit={(newText) =>
                                    handleEdit(todo.id, newText)
                                }
                                onDelete={() => handleDelete(todo.id)}
                            />
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
