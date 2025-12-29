import { useState } from "react";
import type { HandoverDocument } from "../../types";

interface HandoverDocumentProps {
  documents: HandoverDocument[];
  onSign?: (docId: string, userId: string) => void;
}

export default function HandoverDocumentComponent({
  documents,
  onSign,
}: HandoverDocumentProps) {
  const [selectedDoc, setSelectedDoc] = useState<HandoverDocument | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredDocs =
    filterStatus === "all"
      ? documents
      : documents.filter((d) => d.status === filterStatus);

  return (
    <div className="handover-document card-widget">
      <div className="widget-header">
        <h3>Dokumen Serah Terima</h3>
        <button className="btn-small">➕ Dokumen Baru</button>
      </div>

      <div className="status-filter">
        {["all", "DRAFT", "SIGNED", "ARCHIVED"].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filterStatus === status ? "active" : ""}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === "all" ? "Semua" : status}
            <span className="count">
              {status === "all"
                ? documents.length
                : documents.filter((d) => d.status === status).length}
            </span>
          </button>
        ))}
      </div>

      <div className="documents-grid">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="document-card"
            onClick={() => setSelectedDoc(doc)}
          >
            <div className="doc-header">
              <div className="doc-type-badge">
                {doc.type === "RECEIVING" && "📥"}
                {doc.type === "SHIPPING" && "📤"}
                {doc.type === "INSPECTION" && "✓"}
                {doc.type === "OTHER" && "📄"}
              </div>
              <span className={`status-badge status-${doc.status.toLowerCase()}`}>
                {doc.status}
              </span>
            </div>

            <div className="doc-body">
              <h4>{doc.docNumber}</h4>
              <p className="doc-meta">
                <strong>Tipe:</strong> {doc.type}
              </p>
              <p className="doc-meta">
                <strong>Dibuat:</strong>{" "}
                {doc.createdAt.toLocaleDateString("id-ID")}
              </p>

              <div className="signature-status">
                {doc.signatures.length > 0 && (
                  <div>
                    <strong>Tanda Tangan:</strong> {doc.signatures.length}
                  </div>
                )}
              </div>
            </div>

            <div className="card-actions">
              <button
                className="btn-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDoc(doc);
                  setShowSignModal(true);
                }}
              >
                ✍️ Tanda Tangan
              </button>
              <button className="btn-xs">📥 Download</button>
              <button className="btn-xs">🖨️ Cetak</button>
            </div>
          </div>
        ))}
      </div>

      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Dokumen: {selectedDoc.docNumber}</h3>
              <button className="btn-close" onClick={() => setSelectedDoc(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="document-details">
                <div className="detail-section">
                  <h4>Informasi Dokumen</h4>
                  <table className="details-table">
                    <tbody>
                      <tr>
                        <td>Nomor Dokumen</td>
                        <td>{selectedDoc.docNumber}</td>
                      </tr>
                      <tr>
                        <td>Tipe</td>
                        <td>{selectedDoc.type}</td>
                      </tr>
                      <tr>
                        <td>Status</td>
                        <td>
                          <span
                            className={`status-badge status-${selectedDoc.status.toLowerCase()}`}
                          >
                            {selectedDoc.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>Tanggal Dibuat</td>
                        <td>{selectedDoc.createdAt.toLocaleString("id-ID")}</td>
                      </tr>
                      <tr>
                        <td>Departemen</td>
                        <td>{selectedDoc.departmentId}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="detail-section">
                  <h4>Tanda Tangan</h4>
                  {selectedDoc.signatures.length > 0 ? (
                    <table className="signatures-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Waktu</th>
                          <th>IP Address</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDoc.signatures.map((sig, idx) => (
                          <tr key={idx}>
                            <td>{sig.userId}</td>
                            <td>{sig.timestamp.toLocaleString("id-ID")}</td>
                            <td>{sig.ipAddress || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="empty-text">Belum ada tanda tangan</p>
                  )}
                </div>

                {selectedDoc.data && Object.keys(selectedDoc.data).length > 0 && (
                  <div className="detail-section">
                    <h4>Data Tambahan</h4>
                    <pre className="data-preview">
                      {JSON.stringify(selectedDoc.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowSignModal(true)}>
                ✍️ Tanda Tangan
              </button>
              <button className="btn-secondary" onClick={() => setSelectedDoc(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignModal && selectedDoc && (
        <div className="modal-overlay" onClick={() => setShowSignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tanda Tangan Dokumen</h3>
              <button
                className="btn-close"
                onClick={() => setShowSignModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="info-text">
                Anda akan menandatangani dokumen <strong>{selectedDoc.docNumber}</strong>
              </p>

              <div className="signature-warning">
                <p>
                  ⚠️ Dengan menandatangani dokumen ini, Anda menyetujui semua data
                  yang tercantum dan bertanggung jawab atas transaksi ini.
                </p>
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" required />
                  Saya setuju dan bertanggung jawab atas dokumen ini
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => {
                  onSign?.(selectedDoc.id, "current-user");
                  setShowSignModal(false);
                }}
              >
                ✍️ Tanda Tangan Sekarang
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowSignModal(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
