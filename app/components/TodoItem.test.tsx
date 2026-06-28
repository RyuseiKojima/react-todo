import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TodoItem from "./TodoItem";

const CREATED_AT = "2026-06-24T03:30:00.000Z";

describe("TodoItem", () => {
    it("todoの内容を表示する", () => {
        render(
            <TodoItem
                text="買い物に行く"
                completed={false}
                createdAt={CREATED_AT}
                onToggle={vi.fn()}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />,
        );

        expect(screen.getByText("買い物に行く")).toBeInTheDocument();
        expect(screen.getByText("作成: 2026/6/24 12:30")).toHaveAttribute(
            "datetime",
            CREATED_AT,
        );
    });

    it("チェックボックスをクリックしたら完了状態の切り替え処理を呼ぶ", () => {
        const handleToggle = vi.fn();

        render(
            <TodoItem
                text="買い物に行く"
                completed={false}
                createdAt={CREATED_AT}
                onToggle={handleToggle}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(handleToggle).toHaveBeenCalledTimes(1);
    });

    it("編集して保存したら新しい内容を渡す", () => {
        const handleEdit = vi.fn();

        render(
            <TodoItem
                text="買い物に行く"
                completed={false}
                createdAt={CREATED_AT}
                onToggle={vi.fn()}
                onEdit={handleEdit}
                onDelete={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "編集" }));
        fireEvent.change(screen.getByRole("textbox", { name: "買い物に行くを編集" }), {
            target: { value: "牛乳を買う" },
        });
        fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(handleEdit).toHaveBeenCalledWith("牛乳を買う");
    });

    it("編集内容が上限を超えたら保存できない", () => {
        const handleEdit = vi.fn();

        render(
            <TodoItem
                text="買い物に行く"
                completed={false}
                createdAt={CREATED_AT}
                onToggle={vi.fn()}
                onEdit={handleEdit}
                onDelete={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "編集" }));
        fireEvent.change(screen.getByRole("textbox", { name: "買い物に行くを編集" }), {
            target: { value: "あ".repeat(41) },
        });
        fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(
            screen.getByText("40文字以内で入力してください。現在41文字です。"),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
        expect(handleEdit).not.toHaveBeenCalled();
    });

    it("編集内容が空白だけなら保存できない", () => {
        const handleEdit = vi.fn();

        render(
            <TodoItem
                text="買い物に行く"
                completed={false}
                createdAt={CREATED_AT}
                onToggle={vi.fn()}
                onEdit={handleEdit}
                onDelete={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "編集" }));
        fireEvent.change(screen.getByRole("textbox", { name: "買い物に行くを編集" }), {
            target: { value: "   " },
        });
        fireEvent.click(screen.getByRole("button", { name: "保存" }));

        expect(screen.getByText("空白だけのTodoは保存できません。")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "保存" })).toBeDisabled();
        expect(handleEdit).not.toHaveBeenCalled();
    });

    it("削除ボタンをクリックしたら削除処理を呼ぶ", () => {
        const handleDelete = vi.fn();

        render(
            <TodoItem
                text="買い物に行く"
                completed={false}
                createdAt={CREATED_AT}
                onToggle={vi.fn()}
                onEdit={vi.fn()}
                onDelete={handleDelete}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "買い物に行くを削除" }));

        expect(handleDelete).toHaveBeenCalledTimes(1);
    });
});
