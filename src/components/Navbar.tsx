// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const nav = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    nav("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          🔥
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </div>

      {user && (
        <div className="nav-right">
          <span className="user-name">selamat datang {user.displayName}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
