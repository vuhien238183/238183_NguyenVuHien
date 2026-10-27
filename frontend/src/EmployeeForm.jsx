import { useState } from "react";

const emptyForm = {
  employeeId: "",
  fullName: "",
  gender: "Nam",
  dateOfBirth: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  hireDate: "",
  status: "Đang làm việc",
};

const buildInitial = (employee) => {
  if (!employee) return emptyForm;
  const data = {};
  Object.keys(emptyForm).forEach((key) => {
    data[key] = employee[key] ?? emptyForm[key];
  });
  return data;
};

export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const isEdit = Boolean(employee);
  const [form, setForm] = useState(buildInitial(employee));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const result = {};
    if (!form.employeeId.trim()) result.employeeId = "Vui lòng nhập mã nhân viên";
    if (!form.fullName.trim()) result.fullName = "Vui lòng nhập họ tên";
    if (!form.email.trim()) result.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      result.email = "Email không hợp lệ";
    if (form.phone.trim() && !/^[0-9+\s.-]{8,15}$/.test(form.phone.trim()))
      result.phone = "Số điện thoại không hợp lệ";
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const result = validate();
    setErrors(result);
    if (Object.keys(result).length > 0) return;

    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setServerError(
        err.message === "Failed to fetch"
          ? "Không kết nối được máy chủ"
          : err.message
      );
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={form[name]}
        onChange={handleChange}
        {...props}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isEdit ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {field("employeeId", "Mã nhân viên *", { disabled: isEdit })}
            {field("fullName", "Họ và tên *")}

            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>

            {field("dateOfBirth", "Ngày sinh", { type: "date" })}
            {field("department", "Phòng ban")}
            {field("position", "Chức vụ")}
            {field("email", "Email *", { type: "email" })}
            {field("phone", "Số điện thoại")}
            {field("hireDate", "Ngày vào làm", { type: "date" })}

            <div className="form-group">
              <label htmlFor="status">Trạng thái làm việc</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Nghỉ việc">Nghỉ việc</option>
              </select>
            </div>
          </div>

          {serverError && <div className="form-error">{serverError}</div>}

          <div className="form-actions">
            <button type="button" className="btn" onClick={onCancel} disabled={saving}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}