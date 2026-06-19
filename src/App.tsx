import { useState } from "react";

function App() {
    const [todoText, setTodoText] = useState("");

    return (
        <main className="app">
            <h1>Todoリスト</h1>
            <p>Reactでタスク管理アプリを作っていきましょう。</p>

            <section className="todo-input" aria-labelledby="todo-input-title">
                <h2 id="todo-input-title">新しいTodo</h2>
                <label htmlFor="todo-text">やること</label>
                <input
                    id="todo-text"
                    type="text"
                    value={todoText}
                    onChange={(event) => setTodoText(event.target.value)}
                    placeholder="例: ReactのuseStateを学ぶ"
                />
                <p className="todo-preview">
                    {todoText ? `入力中: ${todoText}` : "Todoを入力してください。"}
                </p>
            </section>
        </main>
    );
}

export default App;
