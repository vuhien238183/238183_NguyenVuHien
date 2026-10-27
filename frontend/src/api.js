const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Loi may chu, vui long thu lai");
  }
  return data;
}

export const getEmployees = (search = "") =>
  request(`/api/employees${search ? `?search=${encodeURIComponent(search)}` : ""}`);

export const createEmployee = (employee) =>
  request("/api/employees", { method: "POST", body: JSON.stringify(employee) });

export const updateEmployee = (id, employee) =>
  request(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(employee) });

export const deleteEmployee = (id) =>
  request(`/api/employees/${id}`, { method: "DELETE" });