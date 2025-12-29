import { useEffect, useMemo, useState } from "react";
import AnalogClock from "../components/widgets/AnalogClock";
import MiniCalendar from "../components/widgets/MiniCalendar";
import SheetWidget from "../components/widgets/SheetWidget";
import DocumentViewer from "../components/widgets/DocumentViewer";
import InventoryStat from "../components/widgets/InventoryStat";
import ActivityLog from "../components/widgets/ActivityLog";
import QuickSearch from "../components/widgets/QuickSearch";
import WarehouseMetrics from "../components/widgets/WarehouseMetrics";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

export default function Home() {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<"overview" | "documents">("overview");
  const [docQuery, setDocQuery] = useState("");

  // Persist tab between sessions
  useEffect(() => {
    const stored = window.localStorage.getItem("home.activeTab");
    if (stored === "overview" || stored === "documents") {
      setActiveTab(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("home.activeTab", activeTab);
  }, [activeTab]);

  // Sample documents with working preview for PDF
  const warehouseDocuments = [
    {
      id: "1",
      name: "Template Penerimaan Barang",
      type: "excel" as const,
      url: "/docs/template-penerimaan.xlsx",
    },
    {
      id: "2",
      name: "SOP Operasional Warehouse",
      type: "pdf" as const,
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "3",
      name: "Panduan Penggunaan Sistem",
      type: "pptx" as const,
      url: "/docs/panduan-sistem.pptx",
    },
  ];

  const filteredDocuments = useMemo(() => {
    const q = docQuery.trim().toLowerCase();
    if (!q) return warehouseDocuments;
    return warehouseDocuments.filter(
      (d) => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q)
    );
  }, [docQuery]);

  const sampleProducts = [
    { id: "p1", name: "Additive A1", sku: "ADD-A1", quantity: 42, category: "Additive" },
    { id: "p2", name: "Pelumas X", sku: "LUB-X", quantity: 15, category: "Lubricant" },
    { id: "p3", name: "Filter B", sku: "FLT-B", quantity: 120, category: "Filter" },
    { id: "p4", name: "Sparepart C", sku: "SPR-C", quantity: 8, category: "Sparepart" },
  ];

  const recentActivities = [
    {
      id: "a1",
      action: "Penerimaan Barang",
      description: "SKU ADD-A1 diterima sebanyak 20 unit",
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      icon: "📦",
      severity: "success" as const,
    },
    {
      id: "a2",
      action: "Pengiriman Barang",
      description: "SKU FLT-B dikirim ke Store #12",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: "🚚",
      severity: "info" as const,
    },
    {
      id: "a3",
      action: "Penyesuaian Stok",
      description: "Penyesuaian stok Sparepart C",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      icon: "🧮",
      severity: "warning" as const,
    },
  ];

  const metrics = [
    { id: "m1", label: "Perputaran Stok", value: 4.2, unit: "x", icon: "🔄", benchmark: { value: 4.2, target: 5 } },
    { id: "m2", label: "Akurasi Stok", value: "99.2%", icon: "🎯" },
    { id: "m3", label: "Lead Time Rata-rata", value: 2.1, unit: "hari", icon: "⏱️" },
    { id: "m4", label: "Fill Rate", value: "95%", icon: "📈", benchmark: { value: 95, target: 98 } },
  ];

  return (
    <div className="home-page">
      <div className="home-header">
        <div className="header-content">
          <h1>Selamat datang, {user?.displayName || "Pengguna"} 👋</h1>
          <p>Pantau aktivitas warehouse Anda dalam satu dashboard</p>
        </div>
      </div>

      <div className="home-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "documents" ? "active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          📄 Dokumen
        </button>
      </div>

      {activeTab === "overview" ? (
        <div className="home-overview">
          <section className="widgets-grid">
            <div className="widget-container">
              <AnalogClock />
            </div>
            <div className="widget-container">
              <MiniCalendar />
            </div>
          </section>

          {/* Quick Stats */}
          <section className="quick-stats">
            <h2>Statistik Cepat</h2>
            <div className="stats-row">
              <InventoryStat
                label="Stok Optimal"
                value="89%"
                icon="✅"
                bgColor="#e8f5e9"
              />
              <InventoryStat
                label="Perputaran"
                value="4.2x"
                icon="🔄"
                bgColor="#e3f2fd"
              />
              <InventoryStat
                label="Akurasi Data"
                value="99.2%"
                icon="🎯"
                bgColor="#f3e5f5"
              />
            </div>
          </section>

          {/* Metrics */}
          <section className="metrics-section">
            <WarehouseMetrics metrics={metrics} />
          </section>

          {/* Activity Log */}
          <section className="activity-section">
            <ActivityLog activities={recentActivities} />
          </section>

          {/* Sheets */}
          <section className="sheets-section">
            <h2>Data Real-Time</h2>
            <SheetWidget
              title="Stok Additive"
              sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vTEnjzI7-T4r0EskDCDoPk_yV3eYAfAzreHG2VrfuYcfafaaJmpT7B_Jm-AkWtjof-RApfbpMTleO-G/pub?gid=0&single=true&output=csv"
            />
          </section>

          {/* Quick Search */}
          <section className="search-section">
            <h2>Pencarian Cepat Produk</h2>
            <QuickSearch
              products={sampleProducts}
              onSelect={(p) => alert(`Dipilih: ${p.name} / ${p.sku}`)}
            />
          </section>
        </div>
      ) : (
        <div className="home-documents">
          <div className="documents-header">
            <h2>Dokumen Warehouse</h2>
            <input
              type="text"
              placeholder="Filter dokumen... (nama/tipe)"
              value={docQuery}
              onChange={(e) => setDocQuery(e.target.value)}
              className="doc-filter-input"
            />
          </div>
          <DocumentViewer title="Dokumen Warehouse" documents={filteredDocuments} />
        </div>
      )}
    </div>
  );
}
