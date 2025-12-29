import { useState } from "react";
import type { ReceivingOrder } from "../../types";

interface ReceivingManagementProps {
  orders: ReceivingOrder[];
  currentUserId: string;
}

export default function ReceivingManagement({
  orders,
  currentUserId,
}: ReceivingManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<ReceivingOrder | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("PENDING");

  const filteredOrders = orders.filter((o) => o.status === filterStatus);

  const canVerifyL1 = (order: ReceivingOrder) => order.status === "PENDING";
  const canVerifyL2 = (order: ReceivingOrder) =>
    order.status === "VERIFIED_L1" && order.verifiedBy1 !== currentUserId;

  const handleVerifyL1 = (order: ReceivingOrder) => {
    // TODO: Implement verification L1
    console.log("Verify L1:", order.id);
  };

  const handleVerifyL2 = (order: ReceivingOrder) => {
    // TODO: Implement verification L2
    console.log("Verify L2:", order.id);
  };

  return (
    <div className="receiving-management card-widget">
      <div className="widget-header">
        <h3>Penerimaan Barang</h3>
        <button className="btn-small">➕ PO Baru</button>
      </div>

      <div className="status-tabs">
        {["PENDING", "VERIFIED_L1", "VERIFIED_L2", "COMPLETED"].map((status) => (
          <button
            key={status}
            className={`tab-btn ${filterStatus === status ? "active" : ""}`}
            onClick={() => setFilterStatus(status)}
          >
            {status.replace("_", " ")}
            <span className="tab-count">
              {orders.filter((o) => o.status === status).length}
            </span>
          </button>
        ))}
      </div>

      <div className="receiving-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="receiving-card"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="card-header">
                <div>
                  <h4>{order.poNumber}</h4>
                  <p className="supplier-name">{order.supplier}</p>
                </div>
                <div className="card-status">
                  <span className={`status-badge status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <div className="info-row">
                  <span>Jumlah Item:</span>
                  <strong>{order.items.length}</strong>
                </div>
                <div className="info-row">
                  <span>Tanggal:</span>
                  <strong>{order.receivedDate.toLocaleDateString("id-ID")}</strong>
                </div>
                <div className="verification-status">
                  <div className={`verification-step ${order.verifiedBy1 ? "completed" : ""}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Verifikasi L1</span>
                  </div>
                  <div className={`verification-step ${order.verifiedBy2 ? "completed" : ""}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Verifikasi L2</span>
                  </div>
                </div>
              </div>

              <div className="card-actions">
                {canVerifyL1(order) && (
                  <button
                    className="btn-small btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerifyL1(order);
                    }}
                  >
                    ✓ Verifikasi L1
                  </button>
                )}
                {canVerifyL2(order) && (
                  <button
                    className="btn-small btn-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerifyL2(order);
                    }}
                  >
                    ✓✓ Verifikasi L2
                  </button>
                )}
                <button
                  className="btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrder(order);
                  }}
                >
                  🔍 Detail
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Tidak ada PO dengan status {filterStatus}</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Penerimaan: {selectedOrder.poNumber}</h3>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <table className="details-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Qty Harapan</th>
                    <th>Qty Aktual</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.skuExpected}</td>
                      <td>{item.quantityExpected}</td>
                      <td>{item.quantityActual ?? "-"}</td>
                      <td>
                        {item.hasDiscrepancy ? (
                          <span className="status-badge status-warning">⚠️ Selisih</span>
                        ) : (
                          <span className="status-badge status-success">✓ Sesuai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
