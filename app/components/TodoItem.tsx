type TodoItemProps = {
    text: string;
    completed: boolean;
    onToggle: () => void;
    onDelete: () => void;
};

export default function TodoItem({
    text,
    completed,
    onToggle,
    onDelete,
}: TodoItemProps) {
    return (
        <li className={completed ? "completed" : ""}>
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={onToggle}
                />
                <span>{text}</span>
            </label>
            <button
                type="button"
                onClick={onDelete}
                aria-label={`${text}を削除`}
            >
                削除
            </button>
        </li>
    );
}
