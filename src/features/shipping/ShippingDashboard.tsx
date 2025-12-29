import { useEffect, useMemo, useState } from "react";
import type { ShippingOrder, ShippingItem } from "../../types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { logAudit } from "../../utils/auditHelper";

type Tab = "store" | "supplier" | "all";

function genDoNumber(): string {
  const ts = new Date();
  const y = ts.getFullYear();
  const m = String(ts.getMonth() + 1).padStart(2, "0");
  const d = String(ts.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `DO-${y}${m}${d}-${rand}`;
}

interface OrderFormData {
  destinationType: "STORE" | "SUPPLIER";
  destinationName: string;
  shippingAddress: string;
  originWarehouse: string;
  shippingMethod: "REGULAR" | "EXPRESS" | "TRUCK";
  carrier: string;
  notes?: string;
  items: Array<{ sku: string; quantityRequested: number; notes?: string }>;
}

const initialForm: OrderFormData = {
  destinationType: "STORE",
  destinationName: "",
  shippingAddress: "",
  originWarehouse: "Main Warehouse",
  shippingMethod: "REGULAR",
  carrier: "Internal Fleet",
  notes: "",
  items: [{ sku: "", quantityRequested: 1 }],
};

export default function ShippingDashboard() {
  const [user] = useAuthState(auth);
  const actor = user?.displayName || "Unknown";

  const [activeTab, setActiveTab] = useState<Tab>("store");
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [form, setForm] = useState<OrderFormData>({ ...initialForm });
  const [showForm, setShowForm] = useState(false);

  // Prefill from OnlineStore checkout if exists
  useEffect(() => {
    const raw = window.localStorage.getItem("pendingShippingOrder");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      const prefill: OrderFormData = {
        destinationType: data.destinationType || "STORE",
        destinationName: data.destinationName || "Online Store Customer",
        shippingAddress: data.shippingAddress || "",
        originWarehouse: data.originWarehouse || "Main Warehouse",
        shippingMethod: data.shippingMethod || "REGULAR",
        carrier: data.carrier || "Internal Fleet",
        notes: data.notes || "",
        items: (data.items || []).map((it: any) => ({ sku: it.sku || it.id || "", quantityRequested: it.quantity || 1, notes: it.notes || "" })),
      };
      setForm(prefill);
      setActiveTab(prefill.destinationType === "STORE" ? "store" : "supplier");
      setShowForm(true);
      window.localStorage.removeItem("pendingShippingOrder");
    } catch {}
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    const dt = activeTab === "store" ? "STORE" : "SUPPLIER";
    return orders.filter((o) => o.destinationType === dt);
  }, [orders, activeTab]);

  const addItemRow = () => {
    setForm({ ...form, items: [...form.items, { sku: "", quantityRequested: 1 }] });
  };

  const removeItemRow = (idx: number) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
  };

  const updateItemRow = (idx: number, patch: Partial<{ sku: string; quantityRequested: number; notes?: string }>) => {
    const next = form.items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setForm({ ...form, items: next });
  };

  const handleCreateOrder = async () => {
    const id = crypto.randomUUID();
    const doNumber = genDoNumber();
    const now = new Date();

    const items: ShippingItem[] = form.items.map((it, idx) => ({
      id: `${id}-item-${idx + 1}`,
      productId: it.sku,
      sku: it.sku,
      quantityRequested: it.quantityRequested,
      notes: it.notes,
      hasDiscrepancy: false,
    }));

    const order: ShippingOrder = {
      id,
      doNumber,
      customer: form.destinationName || (form.destinationType === "STORE" ? "Store" : "Supplier"),
      items,
      status: "PENDING",
      departmentId: form.destinationType === "STORE" ? "dept-store" : "dept-supplier",
      createdAt: now,
      destinationType: form.destinationType,
      destinationName: form.destinationName,
      shippingAddress: form.shippingAddress,
      originWarehouse: form.originWarehouse,
      shippingMethod: form.shippingMethod,
      carrier: form.carrier,
      notes: form.notes,
    };

    setOrders((prev) => [order, ...prev]);
    setShowForm(false);
    setForm({ ...initialForm, destinationType: form.destinationType });

    try {
      await logAudit(
        "CREATE_SHIPPING_ORDER",
        actor,
        doNumber,
        JSON.stringify({ destinationType: order.destinationType, items: order.items.length })
      );
    } catch {}
  };

  const updateStatus = async (orderId: string, next: ShippingOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: next, shippingDate: next === "SHIPPED" ? new Date() : o.shippingDate } : o))
    );

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    try {
      await logAudit("UPDATE_SHIPPING_STATUS", actor, order.doNumber, `${order.status} -> ${next}`);
    } catch {}
  };

  const setTracking = async (orderId: string, trackingNumber: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, trackingNumber } : o)));
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    try {
      await logAudit("SET_TRACKING", actor, order.doNumber, trackingNumber);
    } catch {}
  };

  return (
    <div className="shipping-dashboard">
      <div className="page-header">
        <h1>📤 Pengiriman Barang</h1>
        <p>Kelola pengiriman keluar untuk toko dan supplier</p>
      </div>

      <div className="tabs-row">
        <button className={`tab-btn ${activeTab === "store" ? "active" : ""}`} onClick={() => setActiveTab("store")}>
          🏪 Toko
        </button>
        <button className={`tab-btn ${activeTab === "supplier" ? "active" : ""}`} onClick={() => setActiveTab("supplier")}>
          🤝 Supplier
        </button>
        <button className={`tab-btn ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          📚 Semua Order
        </button>
        <div style={{ marginLeft: "auto" }}>
          <button className="btn-small btn-primary" onClick={() => setShowForm((s) => !s)}>
            ➕ Buat DO
          </button>
          <button
            className="btn-small"
            style={{ marginLeft: 8 }}
            onClick={() => {
              const raw = window.localStorage.getItem("pendingShippingOrder");
              if (!raw) return alert("Tidak ada data checkout.");
              try {
                const data = JSON.parse(raw);
                const prefill: OrderFormData = {
                  destinationType: data.destinationType || "STORE",
                  destinationName: data.destinationName || "Online Store Customer",
                  shippingAddress: data.shippingAddress || "",
                  originWarehouse: data.originWarehouse || "Main Warehouse",
                  shippingMethod: data.shippingMethod || "REGULAR",
                  carrier: data.carrier || "Internal Fleet",
                  notes: data.notes || "",
                  items: (data.items || []).map((it: any) => ({ sku: it.sku || it.id || "", quantityRequested: it.quantity || 1 })),
                };
                setForm(prefill);
                setActiveTab(prefill.destinationType === "STORE" ? "store" : "supplier");
                setShowForm(true);
                window.localStorage.removeItem("pendingShippingOrder");
              } catch {
                alert("Gagal memuat data checkout.");
              }
            }}
          >
            ⤴️ Import Checkout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card-widget" style={{ marginTop: 16 }}>
          <h3>Buat Delivery Order</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Tujuan</label>
              <select
                value={form.destinationType}
                onChange={(e) => setForm({ ...form, destinationType: e.target.value as OrderFormData["destinationType"] })}
              >
                <option value="STORE">Store</option>
                <option value="SUPPLIER">Supplier</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nama Tujuan</label>
              <input value={form.destinationName} onChange={(e) => setForm({ ...form, destinationName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Alamat Pengiriman</label>
              <input value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Gudang Asal</label>
              <input value={form.originWarehouse} onChange={(e) => setForm({ ...form, originWarehouse: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Metode</label>
              <select
                value={form.shippingMethod}
                onChange={(e) => setForm({ ...form, shippingMethod: e.target.value as OrderFormData["shippingMethod"] })}
              >
                <option value="REGULAR">REGULAR</option>
                <option value="EXPRESS">EXPRESS</option>
                <option value="TRUCK">TRUCK</option>
              </select>
            </div>
            <div className="form-group">
              <label>Carrier</label>
              <input value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })} />
            </div>
          </div>

          <h4 style={{ marginTop: 12 }}>Item</h4>
          {form.items.map((it, idx) => (
            <div key={idx} className="form-row">
              <input
                placeholder="SKU"
                value={it.sku}
                onChange={(e) => updateItemRow(idx, { sku: e.target.value })}
                style={{ width: 180 }}
              />
              <input
                type="number"
                placeholder="Qty"
                value={it.quantityRequested}
                onChange={(e) => updateItemRow(idx, { quantityRequested: parseInt(e.target.value || "0") })}
                style={{ width: 120, marginLeft: 8 }}
              />
              <input
                placeholder="Catatan"
                value={it.notes || ""}
                onChange={(e) => updateItemRow(idx, { notes: e.target.value })}
                style={{ flex: 1, marginLeft: 8 }}
              />
              <button className="btn-xs" style={{ marginLeft: 8 }} onClick={() => removeItemRow(idx)}>
                🗑️
              </button>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <button className="btn-xs" onClick={addItemRow}>➕ Tambah Item</button>
          </div>

          <div className="form-actions" style={{ marginTop: 12 }}>
            <button className="btn-primary" onClick={handleCreateOrder}>✓ Buat DO</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
          </div>
        </div>
      )}

      <div className="card-widget" style={{ marginTop: 16 }}>
        <h3>Daftar Delivery Order</h3>
        {filteredOrders.length === 0 ? (
          <p style={{ color: "#64748b" }}>Belum ada order untuk tab ini.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>DO</th>
                <th>Tujuan</th>
                <th>Alamat</th>
                <th>Metode</th>
                <th>Carrier</th>
                <th>Status</th>
                <th>Tracking</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.doNumber}</td>
                  <td>{o.destinationName || o.customer} ({o.destinationType})</td>
                  <td>{o.shippingAddress}</td>
                  <td>{o.shippingMethod}</td>
                  <td>{o.carrier}</td>
                  <td>{o.status}</td>
                  <td>
                    <input
                      placeholder="Tracking"
                      value={o.trackingNumber || ""}
                      onChange={(e) => setTracking(o.id, e.target.value)}
                    />
                  </td>
                  <td>
                    <div className="row-actions">
                      {o.status === "PENDING" && (
                        <button className="btn-xs" onClick={() => updateStatus(o.id, "VERIFIED_L1")}>✓ Verify L1</button>
                      )}
                      {o.status === "VERIFIED_L1" && (
                        <button className="btn-xs" onClick={() => updateStatus(o.id, "VERIFIED_L2")}>✓ Verify L2</button>
                      )}
                      {o.status === "VERIFIED_L2" && (
                        <button className="btn-xs btn-primary" onClick={() => updateStatus(o.id, "SHIPPED")}>🚚 Ship</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
