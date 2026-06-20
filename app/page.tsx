"use client";

import { FormEvent, useState } from "react";

type Todo = {
    id: string;
    text: string;
};

export default function Home() {
    const [todoText, setTodoText] = useState("");
    const [todos, setTodos] = useState<Todo[]>([]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTodoText = todoText.trim();

        if (!trimmedTodoText) {
            return;
        }

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: trimmedTodoText,
        };

        setTodos((currentTodos) => [...currentTodos, newTodo]);
        setTodoText("");
    };

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
                {todos.length === 0 ? (
                    <p>登録されたTodoはありません。</p>
                ) : (
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo.id}>{todo.text}</li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
