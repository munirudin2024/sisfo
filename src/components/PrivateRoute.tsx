import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

type PrivateRouteProps = {
  requiredRole?: string;
};

export default function PrivateRoute({
  children,
  requiredRole,
}: React.PropsWithChildren<PrivateRouteProps>) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
          <p style={{ color: "#64748b" }}>Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Implement role checking when auth system is complete
  // For now, allow all authenticated users
  if (requiredRole) {
    // Check if user has required role
    // const userRoles = await fetchUserRoles(user.uid);
    // if (!userRoles.includes(requiredRole)) {
    //   return <Navigate to="/" replace />;
    // }
  }

  return children;
}
