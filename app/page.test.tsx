import {
    fireEvent,
    render,
    screen,
    waitFor,
    within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Home from "./page";
import type { Todo } from "./hooks/useTodos";

const savedTodos: Todo[] = [
    {
        id: "first-todo-id",
        text: "最初のtodo",
        completed: false,
        createdAt: "2026-06-23T01:00:00.000Z",
    },
    {
        id: "second-todo-id",
        text: "次のtodo",
        completed: true,
        createdAt: "2026-06-24T01:00:00.000Z",
    },
];

const getVisibleTodoTexts = () =>
    within(screen.getByRole("list"))
        .getAllByRole("listitem")
        .map((todoItem) => {
            const todoText = todoItem.querySelector(".todo-text");

            return todoText?.textContent;
        });

const getTodoItemByText = (text: string) =>
    within(screen.getByRole("list"))
        .getAllByRole("listitem")
        .find((todoItem) => todoItem.textContent?.includes(text));

describe("Home", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.spyOn(crypto, "randomUUID").mockReturnValue("new-todo-id");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("作成日時でtodoの並び順を切り替える", async () => {
        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        render(<Home />);

        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
        });

        fireEvent.change(screen.getByLabelText("並び順"), {
            target: { value: "oldest" },
        });

        expect(getVisibleTodoTexts()).toEqual(["最初のtodo", "次のtodo"]);
    });

    it("入力したキーワードでtodoを検索する", async () => {
        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        render(<Home />);

        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
        });

        fireEvent.change(screen.getByLabelText("Todoを検索"), {
            target: { value: "最初" },
        });

        expect(getVisibleTodoTexts()).toEqual(["最初のtodo"]);
    });

    it("todoの入力文字数が上限を超えたら追加できない", () => {
        render(<Home />);

        fireEvent.change(screen.getByLabelText("やること"), {
            target: { value: "あ".repeat(41) },
        });

        expect(
            screen.getByText("40文字以内で入力してください。現在41文字です。"),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
        expect(screen.getByLabelText("やること")).toHaveAttribute(
            "aria-invalid",
            "true",
        );
    });

    it("todoを追加したら成功メッセージを表示する", () => {
        render(<Home />);

        fireEvent.change(screen.getByLabelText("やること"), {
            target: { value: "Reactを復習する" },
        });
        fireEvent.click(screen.getByRole("button", { name: "追加" }));

        expect(screen.getByRole("status")).toHaveTextContent(
            "Reactを復習するを追加しました。",
        );
        expect(screen.getByLabelText("やること")).toHaveValue("");
    });

    it("成功メッセージを閉じられる", () => {
        render(<Home />);

        fireEvent.change(screen.getByLabelText("やること"), {
            target: { value: "Reactを復習する" },
        });
        fireEvent.click(screen.getByRole("button", { name: "追加" }));
        fireEvent.click(
            screen.getByRole("button", { name: "成功メッセージを閉じる" }),
        );

        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("todoを完了にしたら成功メッセージを表示する", async () => {
        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        render(<Home />);

        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
        });

        const todoItem = getTodoItemByText("最初のtodo");

        expect(todoItem).toBeDefined();

        fireEvent.click(within(todoItem!).getByRole("checkbox"));

        expect(screen.getByRole("status")).toHaveTextContent(
            "最初のtodoを完了にしました。",
        );
    });

    it("todoを編集したら成功メッセージを表示する", async () => {
        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        render(<Home />);

        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
        });

        const todoItem = getTodoItemByText("最初のtodo");

        expect(todoItem).toBeDefined();

        fireEvent.click(within(todoItem!).getByRole("button", { name: "編集" }));
        fireEvent.change(
            screen.getByRole("textbox", { name: "最初のtodoを編集" }),
            {
                target: { value: "テストを書く" },
            },
        );
        fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(screen.getByRole("status")).toHaveTextContent(
            "テストを書くを保存しました。",
        );
    });

    it("todoを削除したら成功メッセージを表示する", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        render(<Home />);

        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
        });

        const todoItem = getTodoItemByText("最初のtodo");

        expect(todoItem).toBeDefined();

        fireEvent.click(
            within(todoItem!).getByRole("button", { name: "最初のtodoを削除" }),
        );

        expect(screen.getByRole("status")).toHaveTextContent(
            "最初のtodoを削除しました。",
        );
    });

    it("確認でOKを選んだら完了済みtodoを削除する", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(true);
        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        render(<Home />);

        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
        });

        fireEvent.click(screen.getByRole("button", { name: "完了済みを削除" }));

        expect(window.confirm).toHaveBeenCalledWith(
            "1件の完了済みTodoを削除しますか？",
        );
        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["最初のtodo"]);
        });
        expect(screen.getByRole("status")).toHaveTextContent(
            "1件の完了済みTodoを削除しました。",
        );
    });

    it("確認でキャンセルを選んだら完了済みtodoを削除しない", async () => {
        vi.spyOn(window, "confirm").mockReturnValue(false);
        localStorage.setItem("react-todo-items", JSON.stringify(savedTodos));

        render(<Home />);

        await waitFor(() => {
            expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
        });

        fireEvent.click(screen.getByRole("button", { name: "完了済みを削除" }));

        expect(window.confirm).toHaveBeenCalledWith(
            "1件の完了済みTodoを削除しますか？",
        );
        expect(getVisibleTodoTexts()).toEqual(["次のtodo", "最初のtodo"]);
    });
});
