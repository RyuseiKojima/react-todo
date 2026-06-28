import { FormEvent, useId, useState } from "react";
import { TODO_TEXT_MAX_LENGTH } from "../constants/todo";

type TodoItemProps = {
    text: string;
    completed: boolean;
    createdAt: string;
    onToggle: () => void;
    onEdit: (newText: string) => void;
    onDelete: () => void;
};

const createdAtFormatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export default function TodoItem({
    text,
    completed,
    createdAt,
    onToggle,
    onEdit,
    onDelete,
}: TodoItemProps) {
    const editMessageId = useId();
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);
    const isEditTextOnlySpaces = editText.length > 0 && !editText.trim();
    const isEditTextTooLong = editText.length > TODO_TEXT_MAX_LENGTH;
    const hasEditTextError = isEditTextOnlySpaces || isEditTextTooLong;
    const canSubmitEditText = Boolean(editText.trim()) && !isEditTextTooLong;
    const editTextMessage = (() => {
        if (!editText) {
            return "Todoを入力してください。";
        }

        if (isEditTextOnlySpaces) {
            return "空白だけのTodoは保存できません。";
        }

        if (isEditTextTooLong) {
            return `${TODO_TEXT_MAX_LENGTH}文字以内で入力してください。現在${editText.length}文字です。`;
        }

        return `編集中: ${editText}（残り${TODO_TEXT_MAX_LENGTH - editText.length}文字）`;
    })();

    const handleEditStart = () => {
        setEditText(text);
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setEditText(text);
        setIsEditing(false);
    };

    const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedEditText = editText.trim();

        if (!trimmedEditText || isEditTextTooLong) {
            return;
        }

        onEdit(trimmedEditText);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <li className={completed ? "completed" : ""}>
                <form className="todo-edit-form" onSubmit={handleEditSubmit}>
                    <div className="todo-edit-field">
                        <input
                            type="text"
                            value={editText}
                            onChange={(event) => setEditText(event.target.value)}
                            aria-label={`${text}を編集`}
                            aria-describedby={editMessageId}
                            aria-invalid={hasEditTextError}
                        />
                        <p
                            id={editMessageId}
                            className={
                                hasEditTextError
                                    ? "todo-edit-message error"
                                    : "todo-edit-message"
                            }
                            aria-live="polite"
                        >
                            {editTextMessage}
                        </p>
                    </div>
                    <div className="todo-edit-actions">
                        <button type="submit" disabled={!canSubmitEditText}>
                            保存
                        </button>
                        <button type="button" onClick={handleEditCancel}>
                            キャンセル
                        </button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className={completed ? "completed" : ""}>
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={onToggle}
                />
                <span className="todo-content">
                    <span className="todo-text">{text}</span>
                    <time dateTime={createdAt}>
                        作成: {createdAtFormatter.format(new Date(createdAt))}
                    </time>
                </span>
            </label>
            <div className="todo-actions">
                <button type="button" onClick={handleEditStart}>
                    編集
                </button>
                <button
                    type="button"
                    className="delete-button"
                    onClick={onDelete}
                    aria-label={`${text}を削除`}
                >
                    削除
                </button>
            </div>
        </li>
    );
}
