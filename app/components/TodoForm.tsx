import { FormEvent } from "react";

type TodoFormProps = {
    todoText: string;
    todoTextMessage: string;
    hasTodoTextError: boolean;
    canSubmitTodo: boolean;
    onTodoTextChange: (newText: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function TodoForm({
    todoText,
    todoTextMessage,
    hasTodoTextError,
    canSubmitTodo,
    onTodoTextChange,
    onSubmit,
}: TodoFormProps) {
    return (
        <>
            <form onSubmit={onSubmit}>
                <label htmlFor="todo-text">やること</label>
                <div className="todo-form-row">
                    <input
                        id="todo-text"
                        type="text"
                        value={todoText}
                        onChange={(event) => onTodoTextChange(event.target.value)}
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
        </>
    );
}
