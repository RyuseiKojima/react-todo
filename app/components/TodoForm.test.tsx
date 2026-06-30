import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TodoForm from "./TodoForm";

const renderTodoForm = (overrides = {}) => {
    const props = {
        todoText: "",
        todoTextMessage: "Todoを入力してください。",
        hasTodoTextError: false,
        canSubmitTodo: false,
        onTodoTextChange: vi.fn(),
        onSubmit: vi.fn((event) => event.preventDefault()),
        ...overrides,
    };

    render(<TodoForm {...props} />);

    return props;
};

describe("TodoForm", () => {
    it("入力が変わったら変更処理を呼ぶ", () => {
        const { onTodoTextChange } = renderTodoForm();

        fireEvent.change(screen.getByLabelText("やること"), {
            target: { value: "Reactを学ぶ" },
        });

        expect(onTodoTextChange).toHaveBeenCalledWith("Reactを学ぶ");
    });

    it("追加ボタンをクリックしたら送信処理を呼ぶ", () => {
        const { onSubmit } = renderTodoForm({
            todoText: "Reactを学ぶ",
            todoTextMessage: "入力中: Reactを学ぶ（残り33文字）",
            canSubmitTodo: true,
        });

        fireEvent.click(screen.getByRole("button", { name: "追加" }));

        expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("入力エラーを表示する", () => {
        renderTodoForm({
            todoText: "あ".repeat(41),
            todoTextMessage: "40文字以内で入力してください。現在41文字です。",
            hasTodoTextError: true,
        });

        expect(screen.getByText("40文字以内で入力してください。現在41文字です。")).toBeInTheDocument();
        expect(screen.getByLabelText("やること")).toHaveAttribute(
            "aria-invalid",
            "true",
        );
        expect(screen.getByRole("button", { name: "追加" })).toBeDisabled();
    });
});
