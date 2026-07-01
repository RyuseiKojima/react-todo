export type TodoFilter = "all" | "active" | "completed";
export type TodoSort = "newest" | "oldest";

type TodoControlsProps = {
    todoFilter: TodoFilter;
    todoSort: TodoSort;
    onTodoFilterChange: (newFilter: TodoFilter) => void;
    onTodoSortChange: (newSort: TodoSort) => void;
};

export default function TodoControls({
    todoFilter,
    todoSort,
    onTodoFilterChange,
    onTodoSortChange,
}: TodoControlsProps) {
    return (
        <div className="todo-controls">
            <div className="todo-filters" aria-label="Todoの表示切り替え">
                <button
                    type="button"
                    className={todoFilter === "all" ? "active" : ""}
                    aria-pressed={todoFilter === "all"}
                    onClick={() => onTodoFilterChange("all")}
                >
                    すべて
                </button>
                <button
                    type="button"
                    className={todoFilter === "active" ? "active" : ""}
                    aria-pressed={todoFilter === "active"}
                    onClick={() => onTodoFilterChange("active")}
                >
                    未完了
                </button>
                <button
                    type="button"
                    className={todoFilter === "completed" ? "active" : ""}
                    aria-pressed={todoFilter === "completed"}
                    onClick={() => onTodoFilterChange("completed")}
                >
                    完了
                </button>
            </div>
            <label className="todo-sort">
                並び順
                <select
                    value={todoSort}
                    onChange={(event) =>
                        onTodoSortChange(event.target.value as TodoSort)
                    }
                >
                    <option value="newest">新しい順</option>
                    <option value="oldest">古い順</option>
                </select>
            </label>
        </div>
    );
}
