type TodoSearchProps = {
    searchText: string;
    onSearchTextChange: (newText: string) => void;
};

export default function TodoSearch({
    searchText,
    onSearchTextChange,
}: TodoSearchProps) {
    return (
        <label className="todo-search" htmlFor="todo-search">
            Todoを検索
            <input
                id="todo-search"
                type="search"
                value={searchText}
                onChange={(event) => onSearchTextChange(event.target.value)}
                placeholder="キーワードを入力"
            />
        </label>
    );
}
