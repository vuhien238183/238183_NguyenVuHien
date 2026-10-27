export default function ConfirmDialog({
  title,
  message,
  confirmText = "Xác nhận",
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal modal-small">
        <h2>{title}</h2>
        <p className="confirm-message">{message}</p>
        <div className="form-actions">
          <button className="btn" onClick={onCancel} disabled={loading}>
            Hủy
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Đang xóa..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}