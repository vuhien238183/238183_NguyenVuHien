import { useCallback, useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./api";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetail from "./EmployeeDetail";
import ConfirmDialog from "./ConfirmDialog";

const isWorking = (status) => !/ngh[iỉ]/i.test(status || "");

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  const [showForm, setShowForm] = useState(false); // thêm mới
  const [viewing, setViewing] = useState(null); // đang xem
  const [editing, setEditing] = useState(null); // đang sửa
  const [deleting, setDeleting] = useState(null); // chờ xác nhận xóa
  const [deleteBusy, setDeleteBusy] = useState(false);

  const showNotice = useCallback((type, text) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 3000);
  }, []);

  const loadEmployees = useCallback(
    async (keyword) => {
      setLoading(true);
      try {
        const data = await getEmployees(keyword);
        setEmployees(data);
      } catch (err) {
        const text =
          err.message === "Failed to fetch"
            ? "Không kết nối được máy chủ"
            : err.message;
        showNotice("error", text);
      } finally {
        setLoading(false);
      }
    },
    [showNotice]
  );

  // Tự tìm kiếm sau khi ngừng gõ 300ms
  useEffect(() => {
    const timer = setTimeout(() => loadEmployees(search), 300);
    return () => clearTimeout(timer);
  }, [search, loadEmployees]);

  const handleCreate = async (data) => {
    await createEmployee(data); // lỗi sẽ hiện ngay trong biểu mẫu
    setShowForm(false);
    showNotice("success", "Thêm nhân viên thành công");
    await loadEmployees(search);
  };

  const handleUpdate = async (data) => {
    await updateEmployee(editing._id, data);
    setEditing(null);
    showNotice("success", "Cập nhật nhân viên thành công");
    await loadEmployees(search);
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await deleteEmployee(deleting._id);
      setDeleting(null);
      showNotice("success", "Xóa nhân viên thành công");
      await loadEmployees(search);
    } catch (err) {
      setDeleting(null);
      showNotice(
        "error",
        err.message === "Failed to fetch"
          ? "Không kết nối được máy chủ"
          : err.message
      );
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div className="container">
      {notice && (
        <div className={`toast toast-${notice.type}`}>{notice.text}</div>
      )}

      <div className="header">
        <div>
          <h1>Hệ thống quản lý nhân sự</h1>
          <p>Danh sách hồ sơ nhân viên</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Thêm nhân viên
        </button>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            className="search-input"
            type="text"
            placeholder="Tìm theo mã nhân viên hoặc họ tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="state-box">Đang tải dữ liệu...</div>
        ) : employees.length === 0 ? (
          <div className="state-box">Không có nhân viên nào.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ tên</th>
                  <th>Phòng ban</th>
                  <th>Chức vụ</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.fullName}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>
                      <span
                        className={`badge ${
                          isWorking(emp.status) ? "badge-active" : "badge-inactive"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-small"
                          onClick={() => setViewing(emp)}
                        >
                          Xem
                        </button>
                        <button
                          className="btn btn-small btn-primary"
                          onClick={() => setEditing(emp)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-small btn-danger"
                          onClick={() => setDeleting(emp)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <EmployeeForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      {viewing && (
        <EmployeeDetail
          employee={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
        />
      )}

      {editing && (
        <EmployeeForm
          employee={editing}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(null)}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Xác nhận xóa"
          message={`Bạn có chắc muốn xóa nhân viên ${deleting.fullName} (${deleting.employeeId})? Thao tác này không thể hoàn tác.`}
          confirmText="Xóa"
          loading={deleteBusy}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}