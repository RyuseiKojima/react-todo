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
        completed: false,
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
});
