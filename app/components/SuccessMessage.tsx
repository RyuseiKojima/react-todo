type SuccessMessageProps = {
    message: string;
    onClose: () => void;
};

export default function SuccessMessage({
    message,
    onClose,
}: SuccessMessageProps) {
    return (
        <div className="todo-success" role="status">
            <p>{message}</p>
            <button
                type="button"
                onClick={onClose}
                aria-label="成功メッセージを閉じる"
            >
                閉じる
            </button>
        </div>
    );
}
