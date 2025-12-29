import { useState } from "react";
import InventoryStat from "../components/widgets/InventoryStat";
import DocumentViewer from "../components/widgets/DocumentViewer";
import ActivityLog from "../components/widgets/ActivityLog";
import QuickSearch from "../components/widgets/QuickSearch";
import InventoryTable from "../components/widgets/InventoryTable";
import WarehouseMetrics from "../components/widgets/WarehouseMetrics";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const activities = [
    {
      id: "1",
      action: "Stok Diperbarui",
      description: "Additive A terjual 50 unit",
      timestamp: new Date(Date.now() - 5 * 60000),
      icon: "📦",
      severity: "info" as const,
    },
    {
      id: "2",
      action: "Pemesanan Baru",
      description: "Pesanan #2024-001 dari PT. XYZ",
      timestamp: new Date(Date.now() - 30 * 60000),
      icon: "🛒",
      severity: "success" as const,
    },
    {
      id: "3",
      action: "Stok Rendah",
      description: "Additive B mencapai level minimum",
      timestamp: new Date(Date.now() - 2 * 3600000),
      icon: "⚠️",
      severity: "warning" as const,
    },
  ];

  const [products] = useState([
    {
      id: "1",
      name: "Additive A Premium",
      sku: "ADD-A-001",
      quantity: 150,
      minQuantity: 50,
      category: "Additive",
      location: "Rack A-01",
      lastUpdate: new Date(Date.now() - 2 * 3600000),
    },
    {
      id: "2",
      name: "Additive B Standard",
      sku: "ADD-B-002",
      quantity: 25,
      minQuantity: 50,
      category: "Additive",
      location: "Rack B-05",
      lastUpdate: new Date(Date.now() - 1 * 3600000),
    },
    {
      id: "3",
      name: "Additive C Plus",
      sku: "ADD-C-003",
      quantity: 300,
      minQuantity: 100,
      category: "Additive",
      location: "Rack C-10",
      lastUpdate: new Date(Date.now() - 30 * 60000),
    },
    {
      id: "4",
      name: "Catalyst Booster",
      sku: "CAT-BOO-001",
      quantity: 85,
      minQuantity: 50,
      category: "Catalyst",
      location: "Rack D-03",
      lastUpdate: new Date(Date.now() - 1 * 60000),
    },
    {
      id: "5",
      name: "Thermal Stabilizer",
      sku: "THER-STA-001",
      quantity: 120,
      minQuantity: 50,
      category: "Chemical",
      location: "Rack E-07",
      lastUpdate: new Date(),
    },
  ]);

  const documents = [
    {
      id: "1",
      name: "Laporan Stok Q4 2024",
      type: "excel" as const,
      url: "/docs/laporan-stok-q4.xlsx",
    },
    {
      id: "2",
      name: "Presentasi Inventory",
      type: "pptx" as const,
      url: "/docs/inventory-presentation.pptx",
    },
    {
      id: "3",
      name: "SOP Warehouse",
      type: "pdf" as const,
      url: "/docs/sop-warehouse.pdf",
    },
    {
      id: "4",
      name: "Daftar Supplier",
      type: "docx" as const,
      url: "/docs/daftar-supplier.docx",
    },
  ];

  const metrics = [
    {
      id: "1",
      label: "Total Items in Stock",
      value: 680,
      unit: "units",
      icon: "📦",
      benchmark: { value: 680, target: 1000 },
    },
    {
      id: "2",
      label: "Warehouse Utilization",
      value: 68,
      unit: "%",
      icon: "🏢",
      benchmark: { value: 680, target: 1000 },
    },
    {
      id: "3",
      label: "Average Turnover",
      value: 4.2,
      unit: "days",
      icon: "🔄",
      benchmark: { value: 4, target: 5 },
    },
    {
      id: "4",
      label: "Items Low Stock",
      value: 2,
      unit: "SKU",
      icon: "⚠️",
      benchmark: { value: 2, target: 5 },
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Warehouse</h1>
          <p>Selamat datang, {user?.displayName || "User"}</p>
        </div>
        <div className="date-time">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Quick Search */}
        <section className="full-width">
          <QuickSearch products={products} />
        </section>

        {/* Statistics Row */}
        <section className="stats-section full-width">
          <h2>Overview Inventori</h2>
          <div className="stats-grid">
            <InventoryStat
              label="Total SKU"
              value="248"
              icon="📦"
              bgColor="#e3f2fd"
              trend={{ direction: "up", percent: 12 }}
            />
            <InventoryStat
              label="Stok Tersedia"
              value="5,420"
              icon="✅"
              bgColor="#e8f5e9"
              trend={{ direction: "up", percent: 8 }}
            />
            <InventoryStat
              label="Peringatan Stok"
              value="24"
              icon="⚠️"
              bgColor="#fff3e0"
              trend={{ direction: "down", percent: 5 }}
            />
            <InventoryStat
              label="Pesanan Pending"
              value="12"
              icon="🛒"
              bgColor="#fce4ec"
              trend={{ direction: "down", percent: 3 }}
            />
          </div>
        </section>

        {/* Warehouse Metrics */}
        <section className="full-width">
          <WarehouseMetrics metrics={metrics} title="Metrik Kinerja Warehouse" />
        </section>

        {/* Inventory Table */}
        <section className="full-width">
          <InventoryTable products={products} />
        </section>

        {/* Documents Section */}
        <section className="full-width">
          <DocumentViewer title="Dokumen Penting" documents={documents} />
        </section>

        {/* Activity Log */}
        <section className="full-width">
          <ActivityLog activities={activities} />
        </section>

        {/* Quick Actions */}
        <section className="quick-actions full-width">
          <h2>Aksi Cepat</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span>➕</span>
              <span>Tambah Stok</span>
            </button>
            <button className="action-btn">
              <span>📊</span>
              <span>Laporan Stok</span>
            </button>
            <button className="action-btn">
              <span>🤝</span>
              <span>Kelola Supplier</span>
            </button>
            <button className="action-btn">
              <span>🔍</span>
              <span>Cari Produk</span>
            </button>
            <button className="action-btn">
              <span>📤</span>
              <span>Export Data</span>
            </button>
            <button className="action-btn">
              <span>📋</span>
              <span>Buat PO</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}