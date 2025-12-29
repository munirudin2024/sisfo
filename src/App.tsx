// src/App.tsx
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import { getConfig } from "./utils/config";
import Maintenance from "./components/Maintenance";

// Pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WarehousePage from "./pages/warehouse/WarehousePage";
import ReceivingPage from "./pages/receiving/ReceivingPage";
import ShippingPage from "./pages/shipping/ShippingPage";
import InspectionPage from "./pages/inspection/InspectionPage";
import BarcodeRequestPage from "./pages/warehouse/BarcodeRequestPage";
import InfoPage from "./pages/info/InfoPage";
import StorePage from "./pages/store/StorePage";
// Role-specific example pages
import WarehouseManagerPage from "./pages/roles/WarehouseManager";
import ReceivingClerkPage from "./pages/roles/ReceivingClerk";

export default function App() {
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(true);
  const config = getConfig();

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f8fafc",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📦</div>
          <p style={{ fontSize: "1.1rem", color: "#64748b" }}>Memuat Sistem...</p>
        </div>
      </div>
    );
  }

  if (config.maintenanceMode) {
    return <Maintenance />;
  }

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute requiredRoles={["Admin"]}>
              <Routes>
                <Route path="" element={<AdminDashboard />} />
              </Routes>
            </PrivateRoute>
          }
        />

        {/* Warehouse Routes */}
        <Route
          path="/warehouse/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="" element={<WarehousePage />} />
                <Route path="barcode" element={<BarcodeRequestPage />} />
              </Routes>
            </PrivateRoute>
          }
        />

        {/* Receiving Routes */}
        <Route
          path="/receiving/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="" element={<ReceivingPage />} />
              </Routes>
            </PrivateRoute>
          }
        />

        {/* Shipping Routes */}
        <Route
          path="/shipping/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="" element={<ShippingPage />} />
              </Routes>
            </PrivateRoute>
          }
        />

        {/* Inspection Routes */}
        <Route
          path="/inspection/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="" element={<InspectionPage />} />
              </Routes>
            </PrivateRoute>
          }
        />

        {/* Info Routes */}
        <Route
          path="/info/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="" element={<InfoPage />} />
              </Routes>
            </PrivateRoute>
          }
        />

        {/* Store Routes */}
        <Route
          path="/store/*"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="" element={<StorePage />} />
              </Routes>
            </PrivateRoute>
          }
        />

        {/* Role-specific examples */}
        <Route
          path="/role/warehouse-manager"
          element={
            <PrivateRoute requiredRoles={["Warehouse Manager"]}>
              <WarehouseManagerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/role/receiving-clerk"
          element={
            <PrivateRoute requiredRoles={["Receiving Clerk"]}>
              <ReceivingClerkPage />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
