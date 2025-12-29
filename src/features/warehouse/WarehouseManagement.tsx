import { useState } from "react";
import type { Warehouse, Rack, Pallet } from "../../types";

interface WarehouseManagementProps {
  warehouses: Warehouse[];
  racks: Rack[];
  pallets: Pallet[];
}

export default function WarehouseManagement({
  warehouses,
  racks,
  pallets,
}: WarehouseManagementProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(
    warehouses[0]?.id || ""
  );
  const [viewMode, setViewMode] = useState<"racks" | "pallets" | "analytics">(
    "racks"
  );

  const warehouseRacks = racks.filter((r) => r.warehouseId === selectedWarehouse);
  const warehousePallets = pallets.filter((p) =>
    warehouseRacks.some((r) => r.id === p.rackId)
  );

  const totalCapacity = warehouseRacks.reduce((sum, r) => sum + r.capacity, 0);
  const totalLoad = warehouseRacks.reduce((sum, r) => sum + r.currentLoad, 0);
  const utilizationPercent = totalCapacity ? (totalLoad / totalCapacity) * 100 : 0;

  return (
    <div className="warehouse-management card-widget">
      <div className="widget-header">
        <h3>Manajemen Gudang</h3>
        <div className="warehouse-tabs">
          <button
            className={`tab-btn ${viewMode === "racks" ? "active" : ""}`}
            onClick={() => setViewMode("racks")}
          >
            📦 Rak
          </button>
          <button
            className={`tab-btn ${viewMode === "pallets" ? "active" : ""}`}
            onClick={() => setViewMode("pallets")}
          >
            📤 Palet
          </button>
          <button
            className={`tab-btn ${viewMode === "analytics" ? "active" : ""}`}
            onClick={() => setViewMode("analytics")}
          >
            📊 Analitik
          </button>
        </div>
      </div>

      <div className="warehouse-selector">
        <label>Pilih Gudang:</label>
        <select
          value={selectedWarehouse}
          onChange={(e) => setSelectedWarehouse(e.target.value)}
        >
          {warehouses.map((wh) => (
            <option key={wh.id} value={wh.id}>
              {wh.name} ({wh.location})
            </option>
          ))}
        </select>
      </div>

      {viewMode === "racks" && (
        <div className="racks-grid">
          {warehouseRacks.map((rack) => (
            <div key={rack.id} className="rack-card">
              <div className="rack-header">
                <h4>{rack.rackCode}</h4>
                <span className="rack-level">Level {rack.level}</span>
              </div>
              <div className="rack-body">
                <div className="rack-capacity">
                  <span>Kapasitas:</span>
                  <strong>{rack.capacity} unit</strong>
                </div>
                <div className="rack-load">
                  <span>Beban Saat Ini:</span>
                  <strong>{rack.currentLoad} unit</strong>
                </div>
                <div className="rack-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          rack.capacity ? (rack.currentLoad / rack.capacity) * 100 : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {rack.capacity
                      ? Math.round((rack.currentLoad / rack.capacity) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
              <div className="rack-actions">
                <button className="btn-xs">✏️ Edit</button>
                <button className="btn-xs">🔍 Detail</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === "pallets" && (
        <div className="pallets-list">
          <table>
            <thead>
              <tr>
                <th>Kode Palet</th>
                <th>Rak</th>
                <th>Metode</th>
                <th>Produk</th>
                <th>Qty</th>
                <th>Tgl Terima</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {warehousePallets.map((pallet) => {
                const rack = racks.find((r) => r.id === pallet.rackId);
                return (
                  <tr key={pallet.id}>
                    <td className="pallet-code">{pallet.palletCode}</td>
                    <td>{rack?.rackCode}</td>
                    <td>
                      <span className={`badge badge-${pallet.method.toLowerCase()}`}>
                        {pallet.method}
                      </span>
                    </td>
                    <td>{pallet.products.length} item</td>
                    <td>{pallet.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                    <td>{pallet.receivedDate.toLocaleDateString("id-ID")}</td>
                    <td>
                      <span
                        className={`status-badge status-${
                          pallet.expiryDate && pallet.expiryDate < new Date()
                            ? "error"
                            : "success"
                        }`}
                      >
                        {pallet.expiryDate && pallet.expiryDate < new Date()
                          ? "Kadaluarsa"
                          : "Aktif"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "analytics" && (
        <div className="warehouse-analytics">
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>Utilisasi Gudang</h4>
              <div className="big-number">{utilizationPercent.toFixed(1)}%</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${utilizationPercent}%` }}></div>
              </div>
              <p className="analytics-text">
                {totalLoad} dari {totalCapacity} unit
              </p>
            </div>

            <div className="analytics-card">
              <h4>Total Rak</h4>
              <div className="big-number">{warehouseRacks.length}</div>
              <p className="analytics-text">Rak aktif di gudang ini</p>
            </div>

            <div className="analytics-card">
              <h4>Total Palet</h4>
              <div className="big-number">{warehousePallets.length}</div>
              <p className="analytics-text">Palet aktif</p>
            </div>

            <div className="analytics-card">
              <h4>Metode Penyimpanan</h4>
              <div className="method-stats">
                <p>
                  FIFO:{" "}
                  {warehousePallets.filter((p) => p.method === "FIFO").length}
                </p>
                <p>
                  FEFO:{" "}
                  {warehousePallets.filter((p) => p.method === "FEFO").length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
