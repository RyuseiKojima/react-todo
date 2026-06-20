"use client";

import { FormEvent, useState } from "react";

type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

type TodoFilter = "all" | "active" | "completed";

export default function Home() {
    const [todoText, setTodoText] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [todoFilter, setTodoFilter] = useState<TodoFilter>("all");

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
                            <li
                                key={todo.id}
                                className={todo.completed ? "completed" : ""}
                            >
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggle(todo.id)}
                                    />
                                    <span>{todo.text}</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(todo.id)}
                                    aria-label={`${todo.text}を削除`}
                                >
                                    削除
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
