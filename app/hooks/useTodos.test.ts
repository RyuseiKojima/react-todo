import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Todo, useTodos } from "./useTodos";

const TODO_ID = "00000000-0000-4000-8000-000000000001";
const CREATED_AT = "2026-06-24T03:30:00.000Z";

describe("useTodos", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(crypto, "randomUUID").mockReturnValue(TODO_ID);
        vi.spyOn(Date.prototype, "toISOString").mockReturnValue(CREATED_AT);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("todoを追加する", async () => {
        const { result } = renderHook(() => useTodos());

        await waitFor(() => {
            expect(localStorage.getItem("react-todo-items")).toBe("[]");
        });

        act(() => {
            result.current.addTodo("買い物に行く");
        });

        expect(result.current.todos).toEqual([
            {
                id: TODO_ID,
                text: "買い物に行く",
                completed: false,
                createdAt: CREATED_AT,
            },
        ]);
    });

    it("todoの完了状態を切り替える", async () => {
        const { result } = renderHook(() => useTodos());

        await waitFor(() => {
            expect(localStorage.getItem("react-todo-items")).toBe("[]");
        });

        act(() => {
            result.current.addTodo("買い物に行く");
        });

        act(() => {
            result.current.toggleTodo(TODO_ID);
        });

        expect(result.current.todos[0].completed).toBe(true);
    });

    it("todoの内容を編集する", async () => {
        const { result } = renderHook(() => useTodos());

        await waitFor(() => {
            expect(localStorage.getItem("react-todo-items")).toBe("[]");
        });

        act(() => {
            result.current.addTodo("買い物に行く");
        });

        act(() => {
            result.current.editTodo(TODO_ID, "牛乳を買う");
        });

        expect(result.current.todos[0].text).toBe("牛乳を買う");
    });

    it("todoを削除する", async () => {
        const { result } = renderHook(() => useTodos());

        await waitFor(() => {
            expect(localStorage.getItem("react-todo-items")).toBe("[]");
        });

        act(() => {
            result.current.addTodo("買い物に行く");
        });

        act(() => {
            result.current.deleteTodo(TODO_ID);
        });

        expect(result.current.todos).toEqual([]);
    });

    it("保存済みのtodoをlocalStorageから読み込む", async () => {
        const savedTodos: Todo[] = [
            {
                id: "saved-todo-id",
                text: "保存済みのtodo",
                completed: true,
                createdAt: "2026-06-23T01:00:00.000Z",
            },
        ];

        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        const { result } = renderHook(() => useTodos());

        await waitFor(() => {
            expect(result.current.todos).toEqual(savedTodos);
        });
    });

    it("古い形式のtodoに作成日時を補って読み込む", async () => {
        const oldTodo = {
            id: "old-todo-id",
            text: "以前に保存したtodo",
            completed: false,
        };

        localStorage.setItem("react-todo-items", JSON.stringify([oldTodo]));

        const { result } = renderHook(() => useTodos());

        await waitFor(() => {
            expect(result.current.todos).toEqual([
                {
                    ...oldTodo,
                    createdAt: CREATED_AT,
                },
            ]);
        });
    });
});
