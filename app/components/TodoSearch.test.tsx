import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import TodoSearch from "./TodoSearch";

describe("TodoSearch", () => {
    it("検索キーワードを表示する", () => {
        render(
            <TodoSearch
                searchText="React"
                onSearchTextChange={vi.fn()}
            />,
        );

        expect(screen.getByLabelText("Todoを検索")).toHaveValue("React");
    });

    it("検索キーワードが変わったら変更処理を呼ぶ", () => {
        const handleSearchTextChange = vi.fn();

        render(
            <TodoSearch
                searchText=""
                onSearchTextChange={handleSearchTextChange}
            />,
        );

        fireEvent.change(screen.getByLabelText("Todoを検索"), {
            target: { value: "買い物" },
        });

        expect(handleSearchTextChange).toHaveBeenCalledWith("買い物");
    });
});
