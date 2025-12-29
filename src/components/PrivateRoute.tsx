import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../contexts/AuthContext";

type PrivateRouteProps = {
  requiredRoles?: string[]; // array of role names to allow
};

export default function PrivateRoute({
  children,
  requiredRoles,
}: React.PropsWithChildren<PrivateRouteProps>) {
  const [user, loading] = useAuthState(auth);
  const authCtx = (() => {
    try {
      return useAuth();
    } catch (e) {
      return null;
    }
  })();

  if (loading || (authCtx && authCtx.loading)) {
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

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRoles && requiredRoles.length > 0 && authCtx) {
    // allow if user is admin
    if (authCtx.isAdmin) return children;

    // check any required role
    const allowed = requiredRoles.some((r) => authCtx.hasRole(r));
    if (!allowed) return <Navigate to="/" replace />;
  }

  return children;
}
