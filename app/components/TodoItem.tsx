import { FormEvent, useState } from "react";

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
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);

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

        if (!trimmedEditText) {
            return;
        }

        onEdit(trimmedEditText);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <li className={completed ? "completed" : ""}>
                <form className="todo-edit-form" onSubmit={handleEditSubmit}>
                    <input
                        type="text"
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        aria-label={`${text}を編集`}
                    />
                    <button type="submit" disabled={!editText.trim()}>
                        保存
                    </button>
                    <button type="button" onClick={handleEditCancel}>
                        キャンセル
                    </button>
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
