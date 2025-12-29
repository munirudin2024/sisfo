import { useState } from "react";
import type { Warehouse, InventoryItem } from "../../types";
import { logAudit } from "../../utils/auditHelper";

interface WarehouseManagementProps {
  warehouses?: Warehouse[];
  onAddWarehouse?: (warehouse: Partial<Warehouse>) => void;
}

export default function WarehouseManagement({
  warehouses = [],
  onAddWarehouse,
}: WarehouseManagementProps) {
  const [viewMode, setViewMode] = useState<"warehouses" | "inventory" | "locations" | "alerts">("warehouses");
  const [showAddWarehouse, setShowAddWarehouse] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ name: "", location: "", capacity: 0 });

  // Mock inventory data for demo
  const [inventoryItems] = useState<InventoryItem[]>([
    {
      id: "inv-1",
      skuId: "sku-1",
      skuCode: "ADTV-001",
      skuName: "Additive Premium",
      barcode: "8901234567890",
      poNumber: "PO-2025-001",
      lotNumber: "LOT-001",
      warehouseId: "wh-1",
      warehouseName: "Warehouse A",
      rackId: "rack-1",
      rackCode: "A-01",
      boxId: "box-1",
      palletId: "palet-1",
      palletCode: "PAL-001",
      quantityReceived: 100,
      quantityAvailable: 95,
      quantityReserved: 5,
      quantityOnHold: 0,
      quantityDamaged: 0,
      receivedDate: new Date("2025-01-20"),
      expiryDate: new Date("2026-01-20"),
      lastMovedDate: new Date("2025-01-20"),
      status: "ACTIVE",
      storageMethod: "FEFO",
      isReadyToShip: true,
      shippingPriority: 1,
      createdBy: "admin",
      lastUpdatedBy: "admin",
      createdAt: new Date("2025-01-20"),
      updatedAt: new Date("2025-01-20"),
    },
  ]);

  const handleAddWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWarehouse.name) return;
    
    try {
      await logAudit("CREATE_WAREHOUSE", "admin", newWarehouse.name, 
        `Created new warehouse: ${newWarehouse.name} at ${newWarehouse.location}`, 
        { targetType: "Warehouse", status: 'success' }
      );
      onAddWarehouse?.(newWarehouse);
      setNewWarehouse({ name: "", location: "", capacity: 0 });
      setShowAddWarehouse(false);
    } catch (error) {
      console.error("Error adding warehouse:", error);
    }
  };

  return (
    <div className="warehouse-management card-widget">
      <div className="widget-header">
        <h3>📦 Manajemen Gudang & Inventory WMS</h3>
        <div className="warehouse-tabs">
          <button
            className={`tab-btn ${viewMode === "warehouses" ? "active" : ""}`}
            onClick={() => setViewMode("warehouses")}
          >
            🏭 Gudang
          </button>
          <button
            className={`tab-btn ${viewMode === "inventory" ? "active" : ""}`}
            onClick={() => setViewMode("inventory")}
          >
            📊 Inventory
          </button>
          <button
            className={`tab-btn ${viewMode === "locations" ? "active" : ""}`}
            onClick={() => setViewMode("locations")}
          >
            📍 Lokasi
          </button>
          <button
            className={`tab-btn ${viewMode === "alerts" ? "active" : ""}`}
            onClick={() => setViewMode("alerts")}
          >
            ⚠️ Alerts
          </button>
        </div>
      </div>

      {/* WAREHOUSES VIEW */}
      {viewMode === "warehouses" && (
        <div style={{ padding: "16px" }}>
          <div style={{ marginBottom: "16px" }}>
            <button 
              className="btn-primary" 
              onClick={() => setShowAddWarehouse(!showAddWarehouse)}
            >
              ➕ Tambah Gudang
            </button>
          </div>

          {showAddWarehouse && (
            <form onSubmit={handleAddWarehouse} style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <input
                type="text"
                placeholder="Nama Gudang"
                value={newWarehouse.name}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })}
                required
                style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
              />
              <input
                type="text"
                placeholder="Lokasi"
                value={newWarehouse.location}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, location: e.target.value })}
                required
                style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
              />
              <input
                type="number"
                placeholder="Kapasitas (unit)"
                value={newWarehouse.capacity}
                onChange={(e) => setNewWarehouse({ ...newWarehouse, capacity: parseInt(e.target.value) })}
                required
                style={{ marginBottom: "8px", width: "100%", padding: "8px" }}
              />
              <button type="submit" className="btn-primary" style={{ marginRight: "8px" }}>
                ✓ Simpan
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddWarehouse(false)}>
                ✕ Batal
              </button>
            </form>
          )}

          {warehouses.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8" }}>Belum ada gudang. Tambahkan gudang baru.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {warehouses.map((wh) => (
                <div key={wh.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", backgroundColor: "#f8fafc" }}>
                  <h4 style={{ marginTop: 0 }}>{wh.name}</h4>
                  <p style={{ color: "#64748b", fontSize: "14px" }}>📍 {wh.location}</p>
                  <div style={{ marginTop: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span>Kapasitas:</span>
                      <strong>{wh.capacity} unit</strong>
                    </div>
                    <div style={{ width: "100%", backgroundColor: "#e2e8f0", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                      <div style={{ width: "65%", backgroundColor: "#10b981", height: "100%" }}></div>
                    </div>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>65% terisi</p>
                  </div>
                  <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                    <button className="btn-xs" style={{ flex: 1 }}>🔧 Edit</button>
                    <button className="btn-xs" style={{ flex: 1 }}>📊 Detail</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INVENTORY VIEW */}
      {viewMode === "inventory" && (
        <div style={{ padding: "16px" }}>
          <h3 style={{ marginTop: 0 }}>📊 Inventory Summary</h3>
          <table className="admin-table" style={{ width: "100%", fontSize: "13px" }}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nama Item</th>
                <th>Barcode</th>
                <th>Total</th>
                <th>Available</th>
                <th>Reserved</th>
                <th>Hold</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.skuCode}</strong></td>
                  <td>{item.skuName}</td>
                  <td style={{ fontSize: "11px", color: "#64748b" }}>{item.barcode}</td>
                  <td>{item.quantityReceived}</td>
                  <td style={{ color: "#10b981", fontWeight: "600" }}>{item.quantityAvailable}</td>
                  <td style={{ color: "#f59e0b" }}>{item.quantityReserved}</td>
                  <td style={{ color: "#ef4444" }}>{item.quantityOnHold}</td>
                  <td>
                    <span style={{
                      padding: "2px 6px",
                      backgroundColor: "#e8f5e9",
                      color: "#2e7d32",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.isReadyToShip && (
                      <span style={{
                        padding: "2px 6px",
                        backgroundColor: "#c8e6c9",
                        color: "#1b5e20",
                        borderRadius: "4px",
                        fontSize: "11px"
                      }}>
                        🚚 Ready
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LOCATIONS VIEW */}
      {viewMode === "locations" && (
        <div style={{ padding: "16px" }}>
          <h3 style={{ marginTop: 0 }}>📍 Lokasi Item (Multi-Warehouse)</h3>
          <div style={{ backgroundColor: "#f0f4f8", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
            <p style={{ margin: 0, fontSize: "14px" }}>
              <strong>SKU: ADTV-001</strong> - Additive Premium<br/>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Total: 95 unit | Semua lokasi</span>
            </p>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            {inventoryItems.map((item) => (
              <div key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>📦 Gudang</p>
                    <p style={{ fontWeight: "600", margin: "4px 0 0 0" }}>{item.warehouseName}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>🗂️ Rak &gt; Box &gt; Palet</p>
                    <p style={{ fontWeight: "600", margin: "4px 0 0 0" }}>{item.rackCode} {'>'} {item.boxId || "-"} {'>'} {item.palletCode}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>📊 Qty</p>
                    <p style={{ fontWeight: "600", margin: "4px 0 0 0", color: "#10b981" }}>{item.quantityAvailable} unit</p>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", fontSize: "12px" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Expired:</span> {item.expiryDate.toLocaleDateString("id-ID")}
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Received:</span> {item.receivedDate.toLocaleDateString("id-ID")}
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Method:</span> {item.storageMethod}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALERTS VIEW */}
      {viewMode === "alerts" && (
        <div style={{ padding: "16px" }}>
          <h3 style={{ marginTop: 0 }}>⚠️ Sistem Alerts & Notifications</h3>
          
          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ color: "#ef4444" }}>🔴 Expired Items</h4>
            <p style={{ padding: "12px", backgroundColor: "#fee2e2", borderRadius: "4px", color: "#991b1b", fontSize: "14px" }}>
              Tidak ada item yang sudah expired.
            </p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ color: "#f59e0b" }}>🟡 Expiring Soon (30 hari)</h4>
            <p style={{ padding: "12px", backgroundColor: "#fef3c7", borderRadius: "4px", color: "#92400e", fontSize: "14px" }}>
              ⚠️ ADTV-001 (Additive Premium) - Expired 2026-01-20 (akan expired dalam ~365 hari)
            </p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ color: "#3b82f6" }}>🔵 Ready to Ship (FIFO/FEFO)</h4>
            <div style={{ padding: "12px", backgroundColor: "#dbeafe", borderRadius: "4px", color: "#1e40af" }}>
              <p style={{ margin: "0 0 8px 0", fontWeight: "600" }}>✓ ADTV-001</p>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>Location: Warehouse A &gt; Rak A-01 &gt; Palet PAL-001</li>
                <li>Quantity: 95 unit ready</li>
                <li>Priority: 1 (FEFO - Based on expiry date)</li>
                <li>Method: FEFO</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h4 style={{ color: "#8b5cf6" }}>🟣 On Hold Items</h4>
            <p style={{ padding: "12px", backgroundColor: "#ede9fe", borderRadius: "4px", color: "#5b21b6", fontSize: "14px" }}>
              Tidak ada item on-hold saat ini.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#06b6d4" }}>🔵 Capacity Alerts</h4>
            <p style={{ padding: "12px", backgroundColor: "#cffafe", borderRadius: "4px", color: "#164e63", fontSize: "14px" }}>
              Semua warehouse normal (&lt; 80% capacity)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
