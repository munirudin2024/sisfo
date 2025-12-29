import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

// Redesigned Navbar: grouped feature sections and role-aware placeholders
export default function Navbar() {
  const [user] = useAuthState(auth);
  const nav = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut(auth);
    nav("/login");
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Organized menu by feature groups. Role-based visibility should be applied
  // via AuthContext permissions (TODO: implement actual filtering).
  const menuGroups = [
    {
      id: "main",
      label: "Umum",
      items: [
        { path: "/", label: "🏠 Beranda" },
        { path: "/info", label: "ℹ️ Informasi" },
      ],
    },
    {
      id: "management",
      label: "Manajemen",
      items: [
        { path: "/admin", label: "⚙️ Admin" },
        { path: "/users", label: "👥 Pengguna" },
        { path: "/departments", label: "🏢 Departemen" },
      ],
    },
    {
      id: "warehouse",
      label: "Gudang & Inventory",
      items: [
        { path: "/warehouse", label: "📦 Dashboard Gudang" },
        { path: "/warehouse/racks", label: "🗂️ Rak & Palet" },
        { path: "/warehouse/barcode", label: "📱 Barcode" },
        { path: "/warehouse/analytics", label: "📈 Analytics" },
      ],
    },
    {
      id: "operations",
      label: "Operasional",
      items: [
        { path: "/receiving", label: "📥 Penerimaan" },
        { path: "/shipping", label: "📤 Pengiriman" },
        { path: "/inspection", label: "✓ Inspeksi Kebersihan" },
      ],
    },
    {
      id: "store",
      label: "Toko & Supplier",
      items: [
        { path: "/store", label: "🏪 Toko Online" },
        { path: "/suppliers", label: "🚚 Supplier" },
      ],
    },
  ];

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="brand">
            <span className="brand-icon">📦</span>
            <span className="brand-name">SISFO WMS</span>
          </Link>

          <nav className="nav-links groups">
            {menuGroups.map((group) => (
              <div key={group.id} className={`nav-group ${openGroup === group.id ? "open" : ""}`}>
                <button
                  className={`nav-group-toggle ${openGroup === group.id ? "active" : ""}`}
                  onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                >
                  {group.label}
                </button>
                <div className="nav-group-items">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-link ${isActive(item.path) ? "active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          ☰
        </button>

        {user && (
          <div className={`nav-right ${isMenuOpen ? "open" : ""}`}>
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <div className="user-details">
                <p className="user-name">{user.displayName || "User"}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            <div className="nav-actions">
              <Link to="/profile" className="btn-sm">
                ⚙️ Profil
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
