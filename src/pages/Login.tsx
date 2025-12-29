// src/pages/Login.tsx
import { useState } from "react";
import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);

      // Successful login (audio playback removed for cleaner UX)
      nav("/");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="card">
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>Login</h2>
      <form onSubmit={handleLogin} className="form-stack">
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <button type="submit">Masuk</button>
      </form>
    </div>
  );
}
