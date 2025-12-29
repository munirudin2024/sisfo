import { useState } from "react";
import AnalogClock from "../components/widgets/AnalogClock";
import MiniCalendar from "../components/widgets/MiniCalendar";
import FormSerahTerimaAditive from "../components/widgets/FormSerahTerimaAditive";
import FotoWidget from "../components/widgets/FotoWidget";
import SheetWidget from "../components/widgets/SheetWidget";
import DocumentViewer from "../components/widgets/DocumentViewer";
import InventoryStat from "../components/widgets/InventoryStat";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

export default function Home() {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<"overview" | "documents">("overview");

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
      url: "/docs/sop-operasional.pdf",
    },
    {
      id: "3",
      name: "Panduan Penggunaan Sistem",
      type: "pptx" as const,
      url: "/docs/panduan-sistem.pptx",
    },
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
            <div className="widget-container full-width">
              <FormSerahTerimaAditive />
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

          {/* Gallery */}
          <section className="gallery-section">
            <h2>Dokumentasi Lapangan</h2>
            <div className="photo-grid">
              <FotoWidget src="/assets/foto1.jpg" caption="Area Penyimpanan" />
              <FotoWidget src="/assets/foto2.jpg" caption="Zona Pengiriman" />
              <FotoWidget src="/assets/foto3.jpg" caption="Kontrol Kualitas" />
            </div>
          </section>

          {/* Sheets */}
          <section className="sheets-section">
            <h2>Data Real-Time</h2>
            <SheetWidget
              title="Stok Additive"
              sheetUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vTEnjzI7-T4r0EskDCDoPk_yV3eYAfAzreHG2VrfuYcfafaaJmpT7B_Jm-AkWtjof-RApfbpMTleO-G/pub?gid=0&single=true&output=csv"
            />
          </section>
        </div>
      ) : (
        <div className="home-documents">
          <DocumentViewer title="Dokumen Warehouse" documents={warehouseDocuments} />
        </div>
      )}
    </div>
  );
}
