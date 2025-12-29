import { useState } from "react";
import type { User, Department, Role } from "../../types";

interface UserManagementProps {
  users: User[];
  departments: Department[];
  roles: Role[];
  onAddUser?: (user: User) => void;
  onEditUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
}

export default function UserManagement({
  users,
  departments,
  roles,
}: UserManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    displayName: "",
    roleId: "",
    departmentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement user creation/update
    console.log("Form submitted:", formData);
    setFormData({
      email: "",
      displayName: "",
      roleId: "",
      departmentId: "",
    });
    setShowForm(false);
  };

  return (
    <div className="user-management card-widget">
      <div className="widget-header">
        <h3>Manajemen Pengguna</h3>
        <button
          className="btn-small"
          onClick={() => {
            setShowForm(!showForm);
          }}
        >
          ➕ Tambah User
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.roleId}
                onChange={(e) =>
                  setFormData({ ...formData, roleId: e.target.value })
                }
                required
              >
                <option value="">Pilih Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Departemen</label>
              <select
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }
                required
              >
                <option value="">Pilih Departemen</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              💾 Simpan
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              ❌ Batal
            </button>
          </div>
        </form>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nama</th>
              <th>Role</th>
              <th>Departemen</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.displayName}</td>
                <td>
                  {user.roleIds
                    .map(
                      (roleId) =>
                        roles.find((r) => r.id === roleId)?.name || roleId
                    )
                    .join(", ")}
                </td>
                <td>
                  {user.departmentIds
                    .map(
                      (deptId) =>
                        departments.find((d) => d.id === deptId)?.name ||
                        deptId
                    )
                    .join(", ")}
                </td>
                <td>
                  <span
                    className={`status-badge status-${
                      user.isActive ? "success" : "error"
                    }`}
                  >
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="action-buttons">
                  <button
                    className="btn-xs"
                  >
                    ✏️
                  </button>
                  <button className="btn-xs btn-danger">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
