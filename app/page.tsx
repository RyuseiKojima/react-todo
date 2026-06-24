"use client";

import { FormEvent, useState } from "react";
import TodoItem from "./components/TodoItem";
import { useTodos } from "./hooks/useTodos";

type TodoFilter = "all" | "active" | "completed";

export default function Home() {
    const [todoText, setTodoText] = useState("");
    const [todoFilter, setTodoFilter] = useState<TodoFilter>("all");
    const {
        todos,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        clearCompletedTodos,
    } = useTodos();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTodoText = todoText.trim();

        if (!trimmedTodoText) {
            return;
        }

        addTodo(trimmedTodoText);
        setTodoText("");
    };

    const handleClearCompleted = () => {
        clearCompletedTodos();
        setTodoFilter("all");
    };

    const activeTodoCount = todos.filter((todo) => !todo.completed).length;
    const completedTodoCount = todos.length - activeTodoCount;

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
                                createdAt={todo.createdAt}
                                onToggle={() => toggleTodo(todo.id)}
                                onEdit={(newText) =>
                                    editTodo(todo.id, newText)
                                }
                                onDelete={() => deleteTodo(todo.id)}
                            />
                        ))}
                    </ul>
                )}
                {todos.length > 0 && (
                    <div className="todo-status">
                        <p aria-live="polite">
                            未完了: {activeTodoCount}件 / 全体: {todos.length}件
                        </p>
                        <button
                            type="button"
                            onClick={handleClearCompleted}
                            disabled={completedTodoCount === 0}
                        >
                            完了済みを削除
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
