import { useState, useMemo } from "react";
import { useRoles } from "../../hooks/useRoles";
import { useUsers } from "../../hooks/useUsers";
import { logAudit } from "../../utils/auditHelper";
import type { Role, User } from "../../types";

const PERMISSION_OPTIONS = [
  { action: "create", resource: "user" },
  { action: "read", resource: "user" },
  { action: "update", resource: "user" },
  { action: "delete", resource: "user" },
  { action: "read", resource: "warehouse" },
  { action: "update", resource: "warehouse" },
  { action: "read", resource: "receiving" },
  { action: "update", resource: "receiving" },
];

export default function RoleManagement() {
  const { roles, loading: rolesLoading, addRole, updateRole, removeRole } = useRoles();
  const { users, loading: usersLoading, updateUser } = useUsers();

  const [form, setForm] = useState({ name: "", description: "" });
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [assignSelection, setAssignSelection] = useState<Record<string, boolean>>({});
  const [editingPerms, setEditingPerms] = useState<Role | null>(null);
  const [permChecks, setPermChecks] = useState<Record<string, boolean>>({});

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    try {
      await addRole({ name: form.name, description: form.description, permissions: [], createdAt: new Date(), departmentId: "dept-1" });
      await logAudit("CREATE_ROLE", "admin", form.name, `Created role: ${form.name}`, { 
        targetType: "Role",
        status: 'success'
      });
      setForm({ name: "", description: "" });
    } catch (error) {
      console.error("Error creating role:", error);
      await logAudit("CREATE_ROLE", "admin", form.name, `Failed to create role: ${form.name}`, {
        targetType: "Role",
        status: 'failed',
        errorMessage: String(error)
      });
    }
  };

  const startAssign = (role: Role) => {
    setSelectedRole(role);
    const map: Record<string, boolean> = {};
    users.forEach((u) => {
      map[u.id] = u.roleIds?.includes(role.id) || false;
    });
    setAssignSelection(map);
  };

  const toggleUserAssign = (userId: string) => {
    setAssignSelection((s) => ({ ...s, [userId]: !s[userId] }));
  };

  const startEditPerms = (role: Role) => {
    setEditingPerms(role);
    const checks: Record<string, boolean> = {};
    PERMISSION_OPTIONS.forEach((p) => {
      const key = `${p.action}:${p.resource}`;
      checks[key] = role.permissions.some((rp) => rp.action === p.action && rp.resource === p.resource);
    });
    setPermChecks(checks);
  };

  const togglePerm = (key: string) => {
    setPermChecks((c) => ({ ...c, [key]: !c[key] }));
  };

  const handleRemoveRole = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      try {
        await removeRole(roleId);
        await logAudit("DELETE_ROLE", "admin", role.name, `Deleted role ${role.name}`, {
          targetType: "Role",
          status: 'success'
        });
      } catch (error) {
        console.error("Error deleting role:", error);
        await logAudit("DELETE_ROLE", "admin", role.name, `Failed to delete role ${role.name}`, {
          targetType: "Role",
          status: 'failed',
          errorMessage: String(error)
        });
      }
    }
  };

  const savePerms = async () => {
    if (!editingPerms) return;
    try {
      const newPerms = PERMISSION_OPTIONS
        .map((p, i) => {
          const key = `${p.action}:${p.resource}`;
          if (permChecks[key]) return { id: `p-${i}`, ...p };
          return null;
        })
        .filter((p) => p !== null);
      const oldPerms = editingPerms.permissions || [];
      const oldPermsStr = Array.isArray(oldPerms) ? (oldPerms as any).map((p: any) => `${p.action}:${p.resource}`).join(", ") : "none";
      const newPermsStr = (newPerms as any).map((p: any) => `${p.action}:${p.resource}`).join(", ");
      await updateRole(editingPerms.id, { ...editingPerms, permissions: newPerms as any });
      await logAudit("UPDATE_ROLE_PERMISSIONS", "admin", editingPerms.name, `Updated permissions from [${oldPermsStr}] to [${newPermsStr}]`, {
        targetType: "Role",
        status: 'success'
      });
      setEditingPerms(null);
    } catch (error) {
      console.error("Error updating permissions:", error);
      await logAudit("UPDATE_ROLE_PERMISSIONS", "admin", editingPerms.name, `Failed to update permissions`, {
        targetType: "Role",
        status: 'failed',
        errorMessage: String(error)
      });
    }
  };

  const saveAssignments = async () => {
    if (!selectedRole) return;
    try {
      // For each user, update roleIds
      for (const u of users) {
        const shouldHave = assignSelection[u.id];
        const has = u.roleIds?.includes(selectedRole.id) || false;
        if (shouldHave && !has) {
          const next: User = { ...u, roleIds: [...(u.roleIds || []), selectedRole.id] };
          await updateUser(u.id, next as Partial<User>);
          await logAudit("ASSIGN_ROLE", "admin", u.email, `Assigned role ${selectedRole.name} to user ${u.displayName}`, {
            targetType: "User",
            status: 'success'
          });
        } else if (!shouldHave && has) {
          const nextRoles = (u.roleIds || []).filter((r) => r !== selectedRole.id);
          const next: User = { ...u, roleIds: nextRoles };
          await updateUser(u.id, next as Partial<User>);
          await logAudit("REVOKE_ROLE", "admin", u.email, `Revoked role ${selectedRole.name} from user ${u.displayName}`, {
            targetType: "User",
            status: 'success'
          });
        }
      }
      setSelectedRole(null);
    } catch (error) {
      console.error("Error saving assignments:", error);
      await logAudit("ASSIGN_ROLE", "admin", selectedRole.name, `Failed to save role assignments`, {
        targetType: "User",
        status: 'failed',
        errorMessage: String(error)
      });
    }
  };

  const availableUsers = useMemo(() => users || [], [users]);

  return (
    <div className="role-management card-widget">
      <div className="widget-header">
        <h3>Manajemen Role</h3>
      </div>

      <div className="form-row">
        <form onSubmit={handleCreate} className="form-stack">
          <input placeholder="Nama Role" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary">➕ Buat Role</button>
        </form>
      </div>

      <div className="roles-list">
        {rolesLoading ? (
          <p>Memuat roles...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.description}</td>
                  <td>
                    <button className="btn-xs" onClick={() => startEditPerms(r)}>🔐 Perms</button>
                    <button className="btn-xs" onClick={() => startAssign(r)}>👥 Assign</button>
                    <button className="btn-xs btn-danger" onClick={() => handleRemoveRole(r.id)}>🗑️ Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedRole && (
        <div className="assign-panel card">
          <h4>Assign Role: {selectedRole.name}</h4>
          {usersLoading ? (
            <p>Memuat users...</p>
          ) : (
            <div className="users-assign-list">
              {availableUsers.map((u) => (
                <label key={u.id} style={{ display: "block", margin: "6px 0" }}>
                  <input type="checkbox" checked={!!assignSelection[u.id]} onChange={() => toggleUserAssign(u.id)} /> {u.displayName || u.email}
                </label>
              ))}
              <div style={{ marginTop: 12 }}>
                <button className="btn-primary" onClick={saveAssignments}>Simpan Assign</button>
                <button className="btn-secondary" onClick={() => setSelectedRole(null)} style={{ marginLeft: 8 }}>Batal</button>
              </div>
            </div>
          )}
        </div>
      )}

      {editingPerms && (
        <div className="perm-panel card" style={{ marginTop: 20 }}>
          <h4>Edit Permissions: {editingPerms.name}</h4>
          <div className="perm-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginTop: 12 }}>
            {PERMISSION_OPTIONS.map((p) => {
              const key = `${p.action}:${p.resource}`;
              return (
                <label key={key} style={{ display: "block", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                  <input type="checkbox" checked={!!permChecks[key]} onChange={() => togglePerm(key)} />
                  {" "}<strong>{p.action}</strong> {p.resource}
                </label>
              );
            })}
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button className="btn-primary" onClick={savePerms}>✓ Simpan Permissions</button>
            <button className="btn-secondary" onClick={() => setEditingPerms(null)}>✕ Batal</button>
          </div>
        </div>
      )}
    </div>
  );
}
