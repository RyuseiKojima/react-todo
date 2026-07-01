import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TodoControls from "./TodoControls";

const renderTodoControls = (overrides = {}) => {
    const props = {
        todoFilter: "all" as const,
        todoSort: "newest" as const,
        onTodoFilterChange: vi.fn(),
        onTodoSortChange: vi.fn(),
        ...overrides,
    };

    render(<TodoControls {...props} />);

    return props;
};

describe("TodoControls", () => {
    it("現在のフィルターを押下状態にする", () => {
        renderTodoControls({
            todoFilter: "active",
        });

        expect(screen.getByRole("button", { name: "未完了" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
    });

    it("フィルターボタンをクリックしたら変更処理を呼ぶ", () => {
        const { onTodoFilterChange } = renderTodoControls();

        fireEvent.click(screen.getByRole("button", { name: "完了" }));

        expect(onTodoFilterChange).toHaveBeenCalledWith("completed");
    });

    it("並び順を変更したら変更処理を呼ぶ", () => {
        const { onTodoSortChange } = renderTodoControls();

        fireEvent.change(screen.getByLabelText("並び順"), {
            target: { value: "oldest" },
        });

        expect(onTodoSortChange).toHaveBeenCalledWith("oldest");
    });
});
