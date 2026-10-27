const formatDate = (value) => {
  if (!value) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : value;
};

export default function EmployeeDetail({ employee, onClose, onEdit }) {
  const rows = [
    ["Mã nhân viên", employee.employeeId],
    ["Họ và tên", employee.fullName],
    ["Giới tính", employee.gender || "—"],
    ["Ngày sinh", formatDate(employee.dateOfBirth)],
    ["Phòng ban", employee.department || "—"],
    ["Chức vụ", employee.position || "—"],
    ["Email", employee.email],
    ["Số điện thoại", employee.phone || "—"],
    ["Ngày vào làm", formatDate(employee.hireDate)],
    ["Trạng thái", employee.status || "—"],
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Thông tin nhân viên</h2>

        <dl className="detail-list">
          {rows.map(([label, value]) => (
            <div className="detail-row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="form-actions">
          <button className="btn" onClick={onClose}>
            Đóng
          </button>
          <button className="btn btn-primary" onClick={onEdit}>
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}