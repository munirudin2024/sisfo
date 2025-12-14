import React from "react"; // <-- PENTING: Tambahkan impor React untuk mendukung JSX
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

type PrivateRouteProps = {
  // Biarkan kosong jika Anda menggunakan React.PropsWithChildren
  // atau pertahankan 'children: JSX.Element' jika Anda suka.
};

// Menggunakan React.PropsWithChildren untuk tipe yang lebih standar
export default function PrivateRoute({
  children,
}: React.PropsWithChildren<PrivateRouteProps>) {
  // Ambil state pengguna dari Firebase Hooks
  const [user, loading] = useAuthState(auth);

  // 1. Tampilkan Loading saat otentikasi sedang berjalan
  if (loading) return <p>Loading...</p>;

  // 2. Jika user ditemukan, tampilkan komponen anak (Dashboard/Home/etc)
  // 3. Jika user TIDAK ditemukan, alihkan ke halaman Login
  return user ? children : <Navigate to="/login" replace />;
}
