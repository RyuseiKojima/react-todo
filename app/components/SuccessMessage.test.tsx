import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SuccessMessage from "./SuccessMessage";

describe("SuccessMessage", () => {
    it("成功メッセージを表示する", () => {
        render(
            <SuccessMessage
                message="Todoを追加しました。"
                onClose={vi.fn()}
            />,
        );

        expect(screen.getByRole("status")).toHaveTextContent(
            "Todoを追加しました。",
        );
    });

    it("閉じるボタンをクリックしたら閉じる処理を呼ぶ", () => {
        const handleClose = vi.fn();

        render(
            <SuccessMessage
                message="Todoを追加しました。"
                onClose={handleClose}
            />,
        );

        fireEvent.click(
            screen.getByRole("button", { name: "成功メッセージを閉じる" }),
        );

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
