"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import TodoItem from "./components/TodoItem";
import { TODO_TEXT_MAX_LENGTH } from "./constants/todo";
import { useTodos } from "./hooks/useTodos";

type TodoFilter = "all" | "active" | "completed";
type TodoSort = "newest" | "oldest";

const SUCCESS_MESSAGE_DURATION_MS = 3000;

export default function Home() {
    const [todoText, setTodoText] = useState("");
    const [todoFilter, setTodoFilter] = useState<TodoFilter>("all");
    const [todoSort, setTodoSort] = useState<TodoSort>("newest");
    const [todoSearchText, setTodoSearchText] = useState("");
    const [todoSuccessMessage, setTodoSuccessMessage] = useState("");
    const successMessageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    const {
        todos,
        addTodo,
        toggleTodo,
        editTodo,
        deleteTodo,
        clearCompletedTodos,
    } = useTodos();

    useEffect(() => {
        return () => {
            if (successMessageTimerRef.current) {
                clearTimeout(successMessageTimerRef.current);
            }
        };
    }, []);

    const showSuccessMessage = (message: string) => {
        setTodoSuccessMessage(message);

        if (successMessageTimerRef.current) {
            clearTimeout(successMessageTimerRef.current);
        }

        successMessageTimerRef.current = setTimeout(() => {
            setTodoSuccessMessage("");
            successMessageTimerRef.current = null;
        }, SUCCESS_MESSAGE_DURATION_MS);
    };

    const hideSuccessMessage = () => {
        setTodoSuccessMessage("");

        if (successMessageTimerRef.current) {
            clearTimeout(successMessageTimerRef.current);
            successMessageTimerRef.current = null;
        }
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedTodoText = todoText.trim();

        if (!trimmedTodoText || todoText.length > TODO_TEXT_MAX_LENGTH) {
            return;
        }

        addTodo(trimmedTodoText);
        setTodoText("");
        showSuccessMessage(`${trimmedTodoText}を追加しました。`);
    };

    const handleToggleTodo = (
        todoId: string,
        text: string,
        completed: boolean,
    ) => {
        toggleTodo(todoId);
        showSuccessMessage(
            completed
                ? `${text}を未完了に戻しました。`
                : `${text}を完了にしました。`,
        );
    };

    const handleEditTodo = (todoId: string, newText: string) => {
        editTodo(todoId, newText);
        showSuccessMessage(`${newText}を保存しました。`);
    };

    const handleDeleteTodo = (todoId: string, text: string) => {
        deleteTodo(todoId);
        showSuccessMessage(`${text}を削除しました。`);
    };

    const handleClearCompleted = () => {
        const canClearCompleted = window.confirm(
            `${completedTodoCount}件の完了済みTodoを削除しますか？`,
        );

        if (!canClearCompleted) {
            return;
        }

        clearCompletedTodos();
        setTodoFilter("all");
        showSuccessMessage(`${completedTodoCount}件の完了済みTodoを削除しました。`);
    };

    const activeTodoCount = todos.filter((todo) => !todo.completed).length;
    const completedTodoCount = todos.length - activeTodoCount;
    const isTodoTextOnlySpaces = todoText.length > 0 && !todoText.trim();
    const isTodoTextTooLong = todoText.length > TODO_TEXT_MAX_LENGTH;
    const hasTodoTextError = isTodoTextOnlySpaces || isTodoTextTooLong;
    const canSubmitTodo = Boolean(todoText.trim()) && !isTodoTextTooLong;
    const remainingTodoTextLength = TODO_TEXT_MAX_LENGTH - todoText.length;
    const todoTextMessage = (() => {
        if (!todoText) {
            return "Todoを入力してください。";
        }

        if (isTodoTextOnlySpaces) {
            return "空白だけのTodoは追加できません。";
        }

        if (isTodoTextTooLong) {
            return `${TODO_TEXT_MAX_LENGTH}文字以内で入力してください。現在${todoText.length}文字です。`;
        }

        return `入力中: ${todoText}（残り${remainingTodoTextLength}文字）`;
    })();
    const normalizedSearchText = todoSearchText.trim().toLowerCase();

    const filteredTodos = todos.filter((todo) => {
        const matchesSearchText =
            !normalizedSearchText ||
            todo.text.toLowerCase().includes(normalizedSearchText);

        if (todoFilter === "active") {
            return !todo.completed && matchesSearchText;
        }

        if (todoFilter === "completed") {
            return todo.completed && matchesSearchText;
        }

        return matchesSearchText;
    });
    const sortedTodos = [...filteredTodos].sort((firstTodo, secondTodo) => {
        const firstCreatedAt = new Date(firstTodo.createdAt).getTime();
        const secondCreatedAt = new Date(secondTodo.createdAt).getTime();

        if (todoSort === "oldest") {
            return firstCreatedAt - secondCreatedAt;
        }

        return secondCreatedAt - firstCreatedAt;
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
                            aria-describedby="todo-text-message"
                            aria-invalid={hasTodoTextError}
                        />
                        <button type="submit" disabled={!canSubmitTodo}>
                            追加
                        </button>
                    </div>
                </form>
                <p
                    id="todo-text-message"
                    className={hasTodoTextError ? "todo-preview error" : "todo-preview"}
                    aria-live="polite"
                >
                    {todoTextMessage}
                </p>
                {todoSuccessMessage && (
                    <div className="todo-success" role="status">
                        <p>{todoSuccessMessage}</p>
                        <button
                            type="button"
                            onClick={hideSuccessMessage}
                            aria-label="成功メッセージを閉じる"
                        >
                            閉じる
                        </button>
                    </div>
                )}
            </section>

            <section className="todo-list" aria-labelledby="todo-list-title">
                <h2 id="todo-list-title">Todo一覧</h2>
                <label className="todo-search" htmlFor="todo-search">
                    Todoを検索
                    <input
                        id="todo-search"
                        type="search"
                        value={todoSearchText}
                        onChange={(event) => setTodoSearchText(event.target.value)}
                        placeholder="キーワードを入力"
                    />
                </label>
                <div className="todo-controls">
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
                    <label className="todo-sort">
                        並び順
                        <select
                            value={todoSort}
                            onChange={(event) =>
                                setTodoSort(event.target.value as TodoSort)
                            }
                        >
                            <option value="newest">新しい順</option>
                            <option value="oldest">古い順</option>
                        </select>
                    </label>
                </div>
                {sortedTodos.length === 0 ? (
                    <p>
                        {todos.length === 0
                            ? "登録されたTodoはありません。"
                            : "条件に一致するTodoはありません。"}
                    </p>
                ) : (
                    <ul>
                        {sortedTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                text={todo.text}
                                completed={todo.completed}
                                createdAt={todo.createdAt}
                                onToggle={() =>
                                    handleToggleTodo(
                                        todo.id,
                                        todo.text,
                                        todo.completed,
                                    )
                                }
                                onEdit={(newText) =>
                                    handleEditTodo(todo.id, newText)
                                }
                                onDelete={() =>
                                    handleDeleteTodo(todo.id, todo.text)
                                }
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
